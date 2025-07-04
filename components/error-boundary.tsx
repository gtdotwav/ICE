"use client"

import React from "react"

interface ErrorBoundaryProps {
  children: React.ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Você pode logar o erro para um serviço de monitoramento aqui
    console.error("Erro capturado pelo ErrorBoundary:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-screen bg-background text-foreground p-4">
          <h2 className="text-2xl font-bold mb-2">Algo deu errado.</h2>
          <p className="text-muted-foreground mb-4">
            Ocorreu um erro inesperado. Por favor, tente recarregar a página.
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Tentar novamente
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
