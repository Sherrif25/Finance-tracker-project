"use client"

import { Home, CreditCard, Target } from "lucide-react"

interface BottomNavigationProps {
  activeScreen: "dashboard" | "transactions" | "goals"
  onScreenChange: (screen: "dashboard" | "transactions" | "goals") => void
}

export function BottomNavigation({ activeScreen, onScreenChange }: BottomNavigationProps) {
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "transactions", label: "Transactions", icon: CreditCard },
    { id: "goals", label: "Goals", icon: Target },
  ] as const

  return (
    <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-200 shadow-lg">
      <div className="flex justify-around py-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activeScreen === item.id

          return (
            <button
              key={item.id}
              onClick={() => onScreenChange(item.id)}
              className={`flex flex-col items-center py-2 px-4 rounded-lg transition-colors ${
                isActive ? "text-blue-600 bg-blue-50" : "text-gray-600 hover:text-gray-800"
              }`}
            >
              <Icon className={`h-6 w-6 ${isActive ? "text-blue-600" : "text-gray-600"}`} />
              <span className={`text-xs mt-1 ${isActive ? "text-blue-600 font-medium" : "text-gray-600"}`}>
                {item.label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
