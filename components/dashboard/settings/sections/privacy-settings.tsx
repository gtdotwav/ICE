"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export function PrivacySettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Privacy</CardTitle>
        <CardDescription>Manage your privacy settings and data sharing options.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between rounded-lg border p-4">
          <div className="space-y-0.5">
            <Label htmlFor="profile-visibility" className="text-base">
              Profile Visibility
            </Label>
            <p className="text-sm text-muted-foreground">Make your profile public or private.</p>
          </div>
          <Switch id="profile-visibility" defaultChecked />
        </div>
        <div className="flex items-center justify-between rounded-lg border p-4">
          <div className="space-y-0.5">
            <Label htmlFor="search-indexing" className="text-base">
              Search Engine Indexing
            </Label>
            <p className="text-sm text-muted-foreground">Allow search engines to index your profile.</p>
          </div>
          <Switch id="search-indexing" />
        </div>
        <div className="flex items-center justify-between rounded-lg border p-4">
          <div className="space-y-0.5">
            <Label htmlFor="data-sharing" className="text-base">
              Data Sharing with Partners
            </Label>
            <p className="text-sm text-muted-foreground">Allow us to share your data with trusted partners.</p>
          </div>
          <Switch id="data-sharing" />
        </div>
      </CardContent>
      <CardFooter className="border-t bg-muted/50 px-6 py-4">
        <Button>Save Preferences</Button>
      </CardFooter>
    </Card>
  )
}
