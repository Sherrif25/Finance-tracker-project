"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useMobileFeatures } from "@/hooks/use-mobile-features"
import { MessageSquare, Smartphone, Clipboard, Zap } from "lucide-react"

export function MobileSMSParser() {
  const [smsText, setSmsText] = useState("")
  const { isNative, hapticFeedback, copyToClipboard, readFromClipboard } = useMobileFeatures()

  const handlePasteFromClipboard = async () => {
    try {
      const clipboardText = await readFromClipboard()
      setSmsText(clipboardText)
      await hapticFeedback()
    } catch (error) {
      console.error("Failed to read from clipboard:", error)
    }
  }

  const handleCopyParsedData = async (data: string) => {
    try {
      await copyToClipboard(data)
      await hapticFeedback()
      // Show toast notification
    } catch (error) {
      console.error("Failed to copy to clipboard:", error)
    }
  }

  return (
    <div className="p-4 space-y-6">
      {/* Mobile-specific features */}
      {isNative && (
        <Alert className="border-blue-200 bg-blue-50">
          <Smartphone className="h-4 w-4" />
          <AlertDescription>
            Mobile features enabled! You can now use clipboard access and haptic feedback.
          </AlertDescription>
        </Alert>
      )}

      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            SMS Parser {isNative && "(Mobile)"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium">SMS Messages</label>
              {isNative && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePasteFromClipboard}
                  className="flex items-center gap-2 bg-transparent"
                >
                  <Clipboard className="h-4 w-4" />
                  Paste
                </Button>
              )}
            </div>
            <Textarea
              value={smsText}
              onChange={(e) => setSmsText(e.target.value)}
              placeholder="Paste your SMS messages here..."
              className="min-h-32"
            />
          </div>

          <Button className="w-full bg-blue-500 hover:bg-blue-600">
            <Zap className="h-4 w-4 mr-2" />
            Parse Messages
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
