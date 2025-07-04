"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function ProfileSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>This is how others will see you on the site.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src="/placeholder-user.jpg" alt="User profile picture" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div className="flex gap-2">
            <Button>Change</Button>
            <Button variant="outline">Remove</Button>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" defaultValue="John Doe" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" defaultValue="john.doe@example.com" />
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t bg-muted/50 px-6 py-4">
        <Button>Save</Button>
      </CardFooter>
    </Card>
  )
}
