"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export function PrivacySettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Privacy</CardTitle>
        <CardDescription>Manage your privacy and data settings.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between rounded-lg border p-4">
          <div>
            <Label htmlFor="profile-visibility" className="font-medium">
              Profile Visibility
            </Label>
            <p className="text-sm text-muted-foreground">Allow others to see your profile.</p>
          </div>
          <Switch id="profile-visibility" defaultChecked />
        </div>
        <div className="flex items-center justify-between rounded-lg border p-4">
          <div>
            <Label htmlFor="data-sharing" className="font-medium">
              Data Sharing
            </Label>
            <p className="text-sm text-muted-foreground">Allow us to use your data to improve our services.</p>
          </div>
          <Switch id="data-sharing" defaultChecked />
        </div>
        <div className="flex items-center justify-between rounded-lg border p-4">
          <div>
            <Label htmlFor="ad-personalization" className="font-medium">
              Ad Personalization
            </Label>
            <p className="text-sm text-muted-foreground">Allow personalized ads based on your activity.</p>
          </div>
          <Switch id="ad-personalization" />
        </div>
        <Button>Save Changes</Button>
      </CardContent>
    </Card>
  )
}
