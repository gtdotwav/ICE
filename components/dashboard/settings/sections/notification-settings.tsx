"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

export function NotificationSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>Manage how you receive notifications.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="flex items-center justify-between space-x-4 rounded-md border p-4">
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">Marketing emails</p>
            <p className="text-sm text-muted-foreground">Receive emails about new products, features, and more.</p>
          </div>
          <Switch defaultChecked />
        </div>
        <div className="flex items-center justify-between space-x-4 rounded-md border p-4">
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">Security emails</p>
            <p className="text-sm text-muted-foreground">Receive emails about your account security.</p>
          </div>
          <Switch defaultChecked disabled />
        </div>
        <div>
          <h3 className="mb-4 text-lg font-medium">Push Notifications</h3>
          <div className="space-y-4">
            <div className="flex flex-row items-start space-x-3 space-y-0">
              <Checkbox id="push-everything" />
              <div className="space-y-1 leading-none">
                <Label htmlFor="push-everything">Everything</Label>
                <p className="text-sm text-muted-foreground">Email digest, mentions & all activity.</p>
              </div>
            </div>
            <div className="flex flex-row items-start space-x-3 space-y-0">
              <Checkbox id="push-mentions" />
              <div className="space-y-1 leading-none">
                <Label htmlFor="push-mentions">Available</Label>
                <p className="text-sm text-muted-foreground">Only mentions and comments.</p>
              </div>
            </div>
            <div className="flex flex-row items-start space-x-3 space-y-0">
              <Checkbox id="push-nothing" />
              <div className="space-y-1 leading-none">
                <Label htmlFor="push-nothing">Ignoring</Label>
                <p className="text-sm text-muted-foreground">Turn off all notifications.</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t bg-muted/50 px-6 py-4">
        <Button>Save Preferences</Button>
      </CardFooter>
    </Card>
  )
}
