-- Estrutura de banco de dados para sistema de webhooks

-- Tabela de configurações de webhooks de saída
CREATE TABLE webhook_configs (
    id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    url TEXT NOT NULL,
    secret VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    max_attempts INTEGER DEFAULT 3,
    backoff_multiplier DECIMAL(3,2) DEFAULT 2.0,
    initial_delay INTEGER DEFAULT 5,
    headers JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_webhook_configs_user_id (user_id),
    INDEX idx_webhook_configs_active (is_active)
);

-- Tabela de eventos de webhook
CREATE TABLE webhook_events (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    webhook_config_id VARCHAR(255) NOT NULL,
    event_type VARCHAR(100) NOT NULL,
    
    FOREIGN KEY (webhook_config_id) REFERENCES webhook_configs(id) ON DELETE CASCADE,
    INDEX idx_webhook_events_config (webhook_config_id),
    INDEX idx_webhook_events_type (event_type)
);

-- Tabela de entregas de webhook
CREATE TABLE webhook_deliveries (
    id VARCHAR(255) PRIMARY KEY,
    webhook_config_id VARCHAR(255) NOT NULL,
    event_type VARCHAR(100) NOT NULL,
    payload JSONB NOT NULL,
    status ENUM('pending', 'delivered', 'failed', 'retrying') DEFAULT 'pending',
    attempts INTEGER DEFAULT 0,
    last_attempt_at TIMESTAMP NULL,
    next_retry_at TIMESTAMP NULL,
    response_status INTEGER NULL,
    response_body TEXT NULL,
    error_message TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (webhook_config_id) REFERENCES webhook_configs(id) ON DELETE CASCADE,
    INDEX idx_webhook_deliveries_config (webhook_config_id),
    INDEX idx_webhook_deliveries_status (status),
    INDEX idx_webhook_deliveries_retry (next_retry_at),
    INDEX idx_webhook_deliveries_created (created_at)
);

-- Tabela de configurações de webhooks de entrada
CREATE TABLE incoming_webhook_configs (
    id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    endpoint VARCHAR(255) UNIQUE NOT NULL,
    secret VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    allowed_sources JSONB DEFAULT '[]',
    event_mapping JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_incoming_webhooks_user_id (user_id),
    INDEX idx_incoming_webhooks_endpoint (endpoint),
    INDEX idx_incoming_webhooks_active (is_active)
);

-- Tabela de logs de webhook
CREATE TABLE webhook_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    type ENUM('outgoing', 'incoming') NOT NULL,
    webhook_config_id VARCHAR(255) NOT NULL,
    event_type VARCHAR(100) NOT NULL,
    status ENUM('success', 'error') NOT NULL,
    payload_hash VARCHAR(64), -- Hash do payload para referência
    response JSONB NULL,
    duration INTEGER NOT NULL, -- em millisegundos
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_webhook_logs_config (webhook_config_id),
    INDEX idx_webhook_logs_type_status (type, status),
    INDEX idx_webhook_logs_timestamp (timestamp),
    INDEX idx_webhook_logs_event (event_type)
);

-- Tabela de estatísticas de webhook (para performance)
CREATE TABLE webhook_stats (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    webhook_config_id VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    total_deliveries INTEGER DEFAULT 0,
    successful_deliveries INTEGER DEFAULT 0,
    failed_deliveries INTEGER DEFAULT 0,
    average_response_time INTEGER DEFAULT 0,
    
    UNIQUE KEY unique_webhook_date (webhook_config_id, date),
    INDEX idx_webhook_stats_config (webhook_config_id),
    INDEX idx_webhook_stats_date (date)
);

-- Tabela de fila de webhooks (para sistemas sem Redis)
CREATE TABLE webhook_queue (
    id VARCHAR(255) PRIMARY KEY,
    delivery_id VARCHAR(255) NOT NULL,
    scheduled_at TIMESTAMP NOT NULL,
    status ENUM('pending', 'processing', 'completed') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_webhook_queue_scheduled (scheduled_at),
    INDEX idx_webhook_queue_status (status),
    INDEX idx_webhook_queue_delivery (delivery_id)
);

-- Triggers para atualizar updated_at
DELIMITER //
CREATE TRIGGER webhook_configs_updated_at
    BEFORE UPDATE ON webhook_configs
    FOR EACH ROW
BEGIN
    SET NEW.updated_at = CURRENT_TIMESTAMP;
END//
DELIMITER ;

-- Procedure para limpeza de logs antigos
DELIMITER //
CREATE PROCEDURE CleanupWebhookLogs(IN days_to_keep INTEGER)
BEGIN
    DELETE FROM webhook_logs 
    WHERE timestamp < DATE_SUB(NOW(), INTERVAL days_to_keep DAY);
    
    DELETE FROM webhook_deliveries 
    WHERE created_at < DATE_SUB(NOW(), INTERVAL days_to_keep DAY)
    AND status IN ('delivered', 'failed');
END//
DELIMITER ;