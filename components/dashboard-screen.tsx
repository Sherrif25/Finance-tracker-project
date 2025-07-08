"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"
import { TrendingUp, TrendingDown, Wallet, Target, ShoppingCart } from "lucide-react"

const spendingData = [
  { name: "Food", value: 35, color: "#FF6B6B" },
  { name: "Transport", value: 20, color: "#4ECDC4" },
  { name: "Rent", value: 30, color: "#45B7D1" },
  { name: "Entertainment", value: 10, color: "#96CEB4" },
  { name: "Other", value: 5, color: "#FFEAA7" },
]

const savingsGoals = [
  { name: "Emergency Fund", current: 2500, target: 5000, progress: 50 },
  { name: "Vacation", current: 800, target: 2000, progress: 40 },
  { name: "New Laptop", current: 450, target: 1200, progress: 38 },
]

export function DashboardScreen() {
  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Hello, Sarah!</h1>
          <p className="text-gray-600">Welcome back to your finances</p>
        </div>
        <Avatar className="h-12 w-12">
          <AvatarImage src="/placeholder-user.jpg" />
          <AvatarFallback className="bg-blue-100 text-blue-600">SJ</AvatarFallback>
        </Avatar>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 gap-4">
        <Card className="bg-gradient-to-r from-green-400 to-green-500 text-white border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Total Income</p>
                <p className="text-2xl font-bold">$4,250</p>
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
                  <p className="text-xl font-bold">$2,890</p>
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
                  <p className="text-xl font-bold">$1,360</p>
                </div>
                <Wallet className="h-6 w-6 text-blue-100" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Spending Chart */}
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
                  data={spendingData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {spendingData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {spendingData.map((item, index) => (
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

      {/* Savings Goals */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-800">
            <Target className="h-5 w-5" />
            Savings Goals
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {savingsGoals.map((goal, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-700">{goal.name}</span>
                <span className="text-sm text-gray-500">{goal.progress}%</span>
              </div>
              <Progress value={goal.progress} className="h-2" />
              <div className="flex justify-between text-sm text-gray-500">
                <span>${goal.current.toLocaleString()}</span>
                <span>${goal.target.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
