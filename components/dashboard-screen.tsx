"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"
import { TrendingUp, TrendingDown, Wallet, Target, ShoppingCart, CreditCard } from "lucide-react"
import { useAuth } from "@/app/page"

// Mock user-specific data (in real app, this would come from API based on user ID)
const getUserData = (userId: string) => {
  const userData: Record<string, any> = {
    "1": {
      income: 425000,
      expenses: 289000,
      balance: 136000,
      spendingData: [
        { name: "Food", value: 35, color: "#FF6B6B" },
        { name: "Transport", value: 20, color: "#4ECDC4" },
        { name: "Rent", value: 30, color: "#45B7D1" },
        { name: "Entertainment", value: 10, color: "#96CEB4" },
        { name: "Other", value: 5, color: "#FFEAA7" },
      ],
      savingsGoals: [
        { name: "Emergency Fund", current: 250000, target: 500000, progress: 50 },
        { name: "Vacation", current: 80000, target: 200000, progress: 40 },
        { name: "New Laptop", current: 45000, target: 120000, progress: 38 },
      ],
    },
  }

  // Return user data or empty data for new users
  return (
    userData[userId] || {
      income: 0,
      expenses: 0,
      balance: 0,
      spendingData: [],
      savingsGoals: [],
    }
  )
}

export function DashboardScreen() {
  const { user } = useAuth()
  const data = getUserData(user?.id || "")

  if (data.income === 0 && data.expenses === 0) {
    return (
      <div className="p-4 space-y-6">
        {/* Welcome Message for New Users */}
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Wallet className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome to FinanceApp!</h2>
          <p className="text-gray-600 mb-6">Start by adding your first transaction or setting up a financial goal.</p>

          <div className="grid grid-cols-1 gap-4 max-w-sm mx-auto">
            <Card className="border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors cursor-pointer">
              <CardContent className="p-6 text-center">
                <CreditCard className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">Add your first transaction</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-dashed border-gray-300 hover:border-purple-400 transition-colors cursor-pointer">
              <CardContent className="p-6 text-center">
                <Target className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">Set up a savings goal</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Hello, {user?.name?.split(" ")[0]}!</h1>
          <p className="text-gray-600">Welcome back to your finances</p>
        </div>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 gap-4">
        <Card className="bg-gradient-to-r from-green-400 to-green-500 text-white border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Total Income</p>
                <p className="text-2xl font-bold">KSh {data.income.toLocaleString()}</p>
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
                  <p className="text-xl font-bold">KSh {data.expenses.toLocaleString()}</p>
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
                  <p className="text-xl font-bold">KSh {data.balance.toLocaleString()}</p>
                </div>
                <Wallet className="h-6 w-6 text-blue-100" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Spending Chart */}
      {data.spendingData.length > 0 && (
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <ShoppingCart className="h-5 w-5" />
              Spending by Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.spendingData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {data.spendingData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {data.spendingData.map((item: any, index: number) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-gray-600">
                    {item.name} ({item.value}%)
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Savings Goals */}
      {data.savingsGoals.length > 0 && (
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <Target className="h-5 w-5" />
              Savings Goals
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.savingsGoals.map((goal: any, index: number) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700">{goal.name}</span>
                  <span className="text-sm text-gray-500">{goal.progress}%</span>
                </div>
                <Progress value={goal.progress} className="h-2" />
                <div className="flex justify-between text-sm text-gray-500">
                  <span>KSh {goal.current.toLocaleString()}</span>
                  <span>KSh {goal.target.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
