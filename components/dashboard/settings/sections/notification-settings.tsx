"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

export function NotificationSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>Manage how you receive notifications.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-medium">Email Notifications</h3>
          <p className="text-sm text-muted-foreground">Choose which emails you want to receive.</p>
        </div>
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <Checkbox id="newsletter" defaultChecked />
            <div className="grid gap-1.5 leading-none">
              <Label htmlFor="newsletter" className="font-medium">
                Newsletter
              </Label>
              <p className="text-sm text-muted-foreground">Receive our weekly newsletter with updates and tips.</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <Checkbox id="product-updates" defaultChecked />
            <div className="grid gap-1.5 leading-none">
              <Label htmlFor="product-updates" className="font-medium">
                Product Updates
              </Label>
              <p className="text-sm text-muted-foreground">Get notified about new features and improvements.</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <Checkbox id="security-alerts" />
            <div className="grid gap-1.5 leading-none">
              <Label htmlFor="security-alerts" className="font-medium">
                Security Alerts
              </Label>
              <p className="text-sm text-muted-foreground">Receive alerts for suspicious activity on your account.</p>
            </div>
          </div>
        </div>
        <Separator />
        <Button>Save Preferences</Button>
      </CardContent>
    </Card>
  )
}
