import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function AdvancedSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Advanced</CardTitle>
        <CardDescription>Manage advanced settings for your account. These actions are permanent.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Here be dragons. Advanced settings can have unintended consequences.
        </p>
      </CardContent>
      <CardFooter className="border-t bg-muted/50 px-6 py-4">
        <Button variant="destructive">Delete Account</Button>
      </CardFooter>
    </Card>
  )
}
