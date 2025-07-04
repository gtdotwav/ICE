"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function IntegrationSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Integrations</CardTitle>
        <CardDescription>Connect your account with third-party services.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">No integrations are currently connected.</p>
        <Button variant="outline" className="mt-4 bg-transparent">
          Connect an App
        </Button>
      </CardContent>
    </Card>
  )
}
