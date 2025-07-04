"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Terminal } from "lucide-react"

export function AdvancedSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Advanced</CardTitle>
        <CardDescription>Manage advanced settings for your account.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">API Keys</h3>
          <div className="flex items-center space-x-2">
            <Input readOnly value="sk_live_************************1234" />
            <Button variant="outline">Copy</Button>
            <Button variant="secondary">Regenerate</Button>
          </div>
        </div>
        <Separator />
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Export Data</h3>
          <p className="text-sm text-muted-foreground">Export all your account data as a JSON file.</p>
          <Button variant="outline">Export Data</Button>
        </div>
        <Separator />
        <div className="space-y-4">
          <Alert variant="destructive">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Danger Zone</AlertTitle>
            <AlertDescription>
              <div className="flex items-center justify-between mt-2">
                <div>
                  <p className="font-medium">Delete Account</p>
                  <p className="text-sm">
                    Permanently delete your account and all associated data. This action cannot be undone.
                  </p>
                </div>
                <Button variant="destructive">Delete Account</Button>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      </CardContent>
    </Card>
  )
}
