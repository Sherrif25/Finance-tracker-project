"use client"

import { useState, createContext, useContext } from "react"
import { AuthScreen } from "@/components/auth-screen"
import { DashboardScreen } from "@/components/dashboard-screen"
import { TransactionsScreen } from "@/components/transactions-screen"
import { GoalsScreen } from "@/components/goals-screen"
import { Navigation } from "@/components/navigation"
import { SMSParserScreen } from "@/components/sms-parser-screen"
import { BudgetDashboard } from "@/components/budget-dashboard"

// Types
interface User {
  id: string
  email: string
  name: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  register: (email: string, password: string, name: string) => Promise<boolean>
  logout: () => void
}

// Auth Context
const AuthContext = createContext<AuthContextType | null>(null)

// Mock user data storage (in real app, this would be a database)
const mockUsers: Array<User & { password: string }> = [
  { id: "1", email: "sarah@example.com", password: "password123", name: "Sarah Johnson" },
]

export default function PersonalFinanceApp() {
  const [user, setUser] = useState<User | null>(null)
  const [activeScreen, setActiveScreen] = useState<"dashboard" | "transactions" | "goals" | "sms-parser" | "budget">(
    "budget",
  )

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const foundUser = mockUsers.find((u) => u.email === email && u.password === password)
    if (foundUser) {
      setUser({ id: foundUser.id, email: foundUser.email, name: foundUser.name })
      return true
    }
    return false
  }

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Check if user already exists
    if (mockUsers.find((u) => u.email === email)) {
      return false
    }

    const newUser = {
      id: Date.now().toString(),
      email,
      password,
      name,
    }

    mockUsers.push(newUser)
    setUser({ id: newUser.id, email: newUser.email, name: newUser.name })
    return true
  }

  const logout = () => {
    setUser(null)
    setActiveScreen("budget")
  }

  const authValue: AuthContextType = {
    user,
    login,
    register,
    logout,
  }

  const renderScreen = () => {
    if (!user) return null

    switch (activeScreen) {
      case "dashboard":
        return <DashboardScreen />
      case "transactions":
        return <TransactionsScreen />
      case "goals":
        return <GoalsScreen />
      case "sms-parser":
        return <SMSParserScreen />
      case "budget":
        return <BudgetDashboard />
      default:
        return <BudgetDashboard />
    }
  }

  return (
    <AuthContext.Provider value={authValue}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-md mx-auto bg-white min-h-screen shadow-xl">
          {!user ? (
            <AuthScreen />
          ) : (
            <>
              <Navigation activeScreen={activeScreen} onScreenChange={setActiveScreen} />
              <div className="pt-16">{renderScreen()}</div>
            </>
          )}
        </div>
      </div>
    </AuthContext.Provider>
  )
}

// Hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
