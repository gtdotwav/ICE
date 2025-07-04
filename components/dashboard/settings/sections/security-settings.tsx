"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function SecuritySettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Password</CardTitle>
        <CardDescription>Change your password here. After saving, you'll be logged out.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="current-password">Current Password</Label>
          <Input id="current-password" type="password" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="new-password">New Password</Label>
          <Input id="new-password" type="password" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="confirm-password">Confirm New Password</Label>
          <Input id="confirm-password" type="password" />
        </div>
      </CardContent>
      <CardFooter className="border-t bg-muted/50 px-6 py-4">
        <Button>Save Password</Button>
      </CardFooter>
    </Card>
  )
}
