"use client"

import { useState } from "react"
import { DashboardScreen } from "@/components/dashboard-screen"
import { TransactionsScreen } from "@/components/transactions-screen"
import { GoalsScreen } from "@/components/goals-screen"
import { BottomNavigation } from "@/components/bottom-navigation"

export default function PersonalFinanceApp() {
  const [activeScreen, setActiveScreen] = useState<"dashboard" | "transactions" | "goals">("dashboard")

  const renderScreen = () => {
    switch (activeScreen) {
      case "dashboard":
        return <DashboardScreen />
      case "transactions":
        return <TransactionsScreen />
      case "goals":
        return <GoalsScreen />
      default:
        return <DashboardScreen />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pb-20">
      <div className="max-w-md mx-auto bg-white min-h-screen shadow-xl">
        {renderScreen()}
        <BottomNavigation activeScreen={activeScreen} onScreenChange={setActiveScreen} />
      </div>
    </div>
  )
}
