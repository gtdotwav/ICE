"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Slack, Zap, GitBranch } from "lucide-react"

export function IntegrationSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Integrations</CardTitle>
        <CardDescription>Connect IceFunnel to your favorite tools.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between rounded-lg border p-4">
          <div className="flex items-center space-x-4">
            <Slack className="h-8 w-8" />
            <div>
              <p className="font-medium">Slack</p>
              <p className="text-sm text-muted-foreground">Get notifications in your Slack channels.</p>
            </div>
          </div>
          <Button variant="outline">Connect</Button>
        </div>
        <div className="flex items-center justify-between rounded-lg border p-4">
          <div className="flex items-center space-x-4">
            <Zap className="h-8 w-8" />
            <div>
              <p className="font-medium">Zapier</p>
              <p className="text-sm text-muted-foreground">Automate workflows with thousands of apps.</p>
            </div>
          </div>
          <Switch defaultChecked />
        </div>
        <div className="flex items-center justify-between rounded-lg border p-4">
          <div className="flex items-center space-x-4">
            <GitBranch className="h-8 w-8" />
            <div>
              <p className="font-medium">GitHub</p>
              <p className="text-sm text-muted-foreground">Sync your funnels with a Git repository.</p>
            </div>
          </div>
          <Button variant="outline">Connect</Button>
        </div>
      </CardContent>
    </Card>
  )
}
