"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function BillingSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Billing</CardTitle>
        <CardDescription>Manage your billing information and view your invoices.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          You are currently on the <strong>Free Plan</strong>.
        </p>
        <Button className="mt-4">Upgrade to Pro</Button>
      </CardContent>
    </Card>
  )
}
