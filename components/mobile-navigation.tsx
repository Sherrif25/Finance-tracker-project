"use client"

import { Button } from "@/components/ui/button"
import { useMobileFeatures } from "@/hooks/use-mobile-features"
import { Home, CreditCard, Target, MessageSquare, Wifi, WifiOff } from "lucide-react"

interface MobileNavigationProps {
  activeScreen: string
  onScreenChange: (screen: string) => void
}

export function MobileNavigation({ activeScreen, onScreenChange }: MobileNavigationProps) {
  const { isNative, networkStatus, hapticFeedback } = useMobileFeatures()

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "transactions", label: "Transactions", icon: CreditCard },
    { id: "goals", label: "Goals", icon: Target },
    { id: "sms-parser", label: "SMS", icon: MessageSquare },
  ]

  const handleNavigation = async (screenId: string) => {
    await hapticFeedback()
    onScreenChange(screenId)
  }

  return (
    <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-200 shadow-lg">
      {/* Network status indicator for mobile */}
      {isNative && (
        <div className="flex items-center justify-center py-1 bg-gray-50">
          <div className="flex items-center gap-1 text-xs text-gray-600">
            {networkStatus?.connected ? (
              <>
                <Wifi className="h-3 w-3 text-green-500" />
                <span>Online</span>
              </>
            ) : (
              <>
                <WifiOff className="h-3 w-3 text-red-500" />
                <span>Offline</span>
              </>
            )}
          </div>
        </div>
      )}

      <div className="flex justify-around py-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activeScreen === item.id

          return (
            <Button
              key={item.id}
              variant="ghost"
              onClick={() => handleNavigation(item.id)}
              className={`flex flex-col items-center py-2 px-4 h-auto ${
                isActive ? "text-blue-600 bg-blue-50" : "text-gray-600"
              }`}
            >
              <Icon className={`h-5 w-5 ${isActive ? "text-blue-600" : "text-gray-600"}`} />
              <span className={`text-xs mt-1 ${isActive ? "text-blue-600 font-medium" : "text-gray-600"}`}>
                {item.label}
              </span>
            </Button>
          )
        })}
      </div>
    </div>
  )
}
