"use client"

import { useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useMobileFeatures } from "@/hooks/use-mobile-features"
import { TrendingUp, TrendingDown, Wallet, Bell } from "lucide-react"

export function MobileDashboard() {
  const { isNative, scheduleNotification, hapticFeedback } = useMobileFeatures()

  useEffect(() => {
    // Request notification permissions on mobile
    if (isNative) {
      requestNotificationPermissions()
    }
  }, [isNative])

  const requestNotificationPermissions = async () => {
    try {
      // This would be handled by Capacitor's LocalNotifications plugin
      console.log("Requesting notification permissions...")
    } catch (error) {
      console.error("Failed to request notification permissions:", error)
    }
  }

  const handleQuickAction = async (action: string) => {
    await hapticFeedback()

    switch (action) {
      case "add-transaction":
        // Navigate to add transaction
        break
      case "set-reminder":
        await scheduleNotification(
          "Budget Reminder",
          "Don't forget to track your expenses today!",
          new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
        )
        break
    }
  }

  return (
    <div className="p-4 space-y-6 pb-20">
      {/* Mobile-optimized financial cards */}
      <div className="grid grid-cols-1 gap-4">
        <Card className="bg-gradient-to-r from-green-400 to-green-500 text-white border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Total Income</p>
                <p className="text-2xl font-bold">KSh 425,000</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-100" />
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-gradient-to-r from-red-400 to-red-500 text-white border-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-100 text-sm">Expenses</p>
                  <p className="text-xl font-bold">KSh 289,000</p>
                </div>
                <TrendingDown className="h-6 w-6 text-red-100" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-blue-400 to-blue-500 text-white border-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Balance</p>
                  <p className="text-xl font-bold">KSh 136,000</p>
                </div>
                <Wallet className="h-6 w-6 text-blue-100" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Mobile quick actions */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-4">
          <h3 className="font-semibold text-gray-800 mb-3">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              onClick={() => handleQuickAction("add-transaction")}
              className="h-12 bg-transparent"
            >
              Add Transaction
            </Button>
            <Button
              variant="outline"
              onClick={() => handleQuickAction("set-reminder")}
              className="h-12 bg-transparent flex items-center gap-2"
            >
              <Bell className="h-4 w-4" />
              Set Reminder
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
