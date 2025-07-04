"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export function BillingSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Billing</CardTitle>
        <CardDescription>Manage your subscription and payment details.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4 rounded-lg border p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-medium">Pro Plan</h3>
              <p className="text-sm text-muted-foreground">Next payment on July 31, 2025</p>
            </div>
            <Button variant="outline">Manage Plan</Button>
          </div>
          <Separator />
          <div>
            <h4 className="font-medium mb-2">Payment Method</h4>
            <div className="flex items-center space-x-2">
              <p className="text-sm">Visa ending in 1234</p>
              <Button variant="link" className="h-auto p-0">
                Update
              </Button>
            </div>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-medium">Billing History</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Invoice</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>June 30, 2025</TableCell>
                <TableCell>$29.00</TableCell>
                <TableCell>
                  <Badge>Paid</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm">
                    Download
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>May 31, 2025</TableCell>
                <TableCell>$29.00</TableCell>
                <TableCell>
                  <Badge>Paid</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm">
                    Download
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
