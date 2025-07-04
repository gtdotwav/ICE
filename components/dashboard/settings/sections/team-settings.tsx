"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function TeamSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Team Management</CardTitle>
        <CardDescription>Manage your team members and their roles.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">You have not invited any team members yet.</p>
        <Button className="mt-4">Invite a Member</Button>
      </CardContent>
    </Card>
  )
}
