"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Car,
  Home,
  Utensils,
  Gamepad2,
  Heart,
  GraduationCap,
  Shirt,
  Coffee,
  AlertTriangle,
  TrendingUp,
  Plus,
} from "lucide-react"

interface BudgetCategory {
  id: string
  name: string
  icon: React.ComponentType<any>
  targetAmount: number
  spentAmount: number
  color: string
  description: string
}

const budgetCategories: BudgetCategory[] = [
  {
    id: "food",
    name: "Food & Dining",
    icon: Utensils,
    targetAmount: 25000,
    spentAmount: 18500,
    color: "#FF6B6B",
    description: "Groceries, restaurants, takeout",
  },
  {
    id: "transport",
    name: "Transport",
    icon: Car,
    targetAmount: 15000,
    spentAmount: 12800,
    color: "#4ECDC4",
    description: "Fuel, matatu, boda boda, parking",
  },
  {
    id: "rent",
    name: "Rent & Utilities",
    icon: Home,
    targetAmount: 45000,
    spentAmount: 45000,
    color: "#45B7D1",
    description: "Rent, electricity, water, internet",
  },
  {
    id: "entertainment",
    name: "Entertainment",
    icon: Gamepad2,
    targetAmount: 8000,
    spentAmount: 9200,
    color: "#96CEB4",
    description: "Movies, games, subscriptions",
  },
  {
    id: "healthcare",
    name: "Healthcare",
    icon: Heart,
    targetAmount: 10000,
    spentAmount: 3500,
    color: "#FFEAA7",
    description: "Medical, pharmacy, insurance",
  },
  {
    id: "education",
    name: "Education",
    icon: GraduationCap,
    targetAmount: 12000,
    spentAmount: 8000,
    color: "#DDA0DD",
    description: "Courses, books, training",
  },
  {
    id: "shopping",
    name: "Shopping",
    icon: Shirt,
    targetAmount: 20000,
    spentAmount: 16800,
    color: "#FFB6C1",
    description: "Clothes, electronics, personal items",
  },
  {
    id: "coffee",
    name: "Coffee & Snacks",
    icon: Coffee,
    targetAmount: 5000,
    spentAmount: 4200,
    color: "#D2B48C",
    description: "Coffee shops, snacks, treats",
  },
]

export function BudgetDashboard() {
  const [animatingCards, setAnimatingCards] = useState<Set<string>>(new Set())

  const getProgressColor = (percentage: number) => {
    if (percentage < 50) return "bg-green-500"
    if (percentage < 80) return "bg-yellow-500"
    if (percentage < 100) return "bg-red-500"
    return "bg-red-700"
  }

  const getProgressPercentage = (spent: number, target: number) => {
    return Math.min((spent / target) * 100, 100)
  }

  const isOverBudget = (spent: number, target: number) => {
    return spent > target
  }

  const getTotalBudget = () => {
    return budgetCategories.reduce((sum, category) => sum + category.targetAmount, 0)
  }

  const getTotalSpent = () => {
    return budgetCategories.reduce((sum, category) => sum + category.spentAmount, 0)
  }

  const getOverBudgetCategories = () => {
    return budgetCategories.filter((category) => isOverBudget(category.spentAmount, category.targetAmount))
  }

  useEffect(() => {
    // Add pulsing animation to over-budget cards
    const overBudgetIds = getOverBudgetCategories().map((cat) => cat.id)
    setAnimatingCards(new Set(overBudgetIds))
  }, [])

  const BudgetCard = ({ category }: { category: BudgetCategory }) => {
    const percentage = getProgressPercentage(category.spentAmount, category.targetAmount)
    const progressColor = getProgressColor(percentage)
    const isOver = isOverBudget(category.spentAmount, category.targetAmount)
    const Icon = category.icon

    return (
      <Card
        className={`border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] ${
          isOver && animatingCards.has(category.id) ? "animate-pulse" : ""
        }`}
        style={{
          background: isOver
            ? "linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)"
            : "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
        }}
      >
        <CardContent className="p-6">
          {/* Header with Icon and Category Name */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div
                className="p-3 rounded-2xl shadow-sm"
                style={{ backgroundColor: `${category.color}20`, color: category.color }}
              >
                <Icon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800 text-lg">{category.name}</h3>
                <p className="text-xs text-gray-500">{category.description}</p>
              </div>
            </div>
            {isOver && (
              <div className="p-1 bg-red-100 rounded-full">
                <AlertTriangle className="h-4 w-4 text-red-600" />
              </div>
            )}
          </div>

          {/* Budget Amount Display */}
          <div className="flex justify-between items-center mb-3">
            <div>
              <p className="text-sm text-gray-600">Spent</p>
              <p className={`text-xl font-bold ${isOver ? "text-red-600" : "text-gray-800"}`}>
                KSh {category.spentAmount.toLocaleString()}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Budget</p>
              <p className="text-xl font-bold text-gray-800">KSh {category.targetAmount.toLocaleString()}</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Progress</span>
              <Badge
                variant={percentage >= 100 ? "destructive" : percentage >= 80 ? "secondary" : "default"}
                className={`text-xs font-medium ${
                  percentage < 50
                    ? "bg-green-100 text-green-700"
                    : percentage < 80
                      ? "bg-yellow-100 text-yellow-700"
                      : percentage < 100
                        ? "bg-red-100 text-red-700"
                        : "bg-red-200 text-red-800"
                }`}
              >
                {percentage.toFixed(0)}%
              </Badge>
            </div>

            <div className="relative">
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ease-out ${progressColor} ${
                    isOver ? "animate-pulse" : ""
                  }`}
                  style={{
                    width: `${Math.min(percentage, 100)}%`,
                    background: isOver
                      ? "linear-gradient(90deg, #dc2626, #b91c1c, #dc2626)"
                      : percentage >= 80
                        ? "linear-gradient(90deg, #f59e0b, #d97706)"
                        : percentage >= 50
                          ? "linear-gradient(90deg, #eab308, #ca8a04)"
                          : "linear-gradient(90deg, #10b981, #059669)",
                  }}
                />
              </div>
              {/* Overflow indicator */}
              {isOver && (
                <div
                  className="absolute top-0 right-0 h-full bg-red-700 rounded-r-full animate-pulse"
                  style={{ width: "4px" }}
                />
              )}
            </div>
          </div>

          {/* Remaining Budget */}
          <div className="mt-4 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">{isOver ? "Over budget by" : "Remaining"}</p>
              <p className={`text-lg font-semibold ${isOver ? "text-red-600" : "text-green-600"}`}>
                KSh {Math.abs(category.targetAmount - category.spentAmount).toLocaleString()}
              </p>
            </div>
            <Button variant="outline" size="sm" className="bg-transparent border-gray-300 hover:bg-gray-50">
              <Plus className="h-4 w-4 mr-1" />
              Add Expense
            </Button>
          </div>

          {/* Warning Message for Over Budget */}
          {isOver && (
            <Alert className="mt-4 border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-700 text-sm">
                You've exceeded your budget for this category. Consider reviewing your spending.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-800">Budget Tracker</h1>
          <p className="text-gray-600">Monitor your spending across categories</p>
        </div>

        {/* Overall Budget Summary */}
        <Card className="border-0 shadow-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-blue-100 text-sm">Total Budget</p>
                <p className="text-3xl font-bold">KSh {getTotalBudget().toLocaleString()}</p>
              </div>
              <div className="p-3 bg-white/20 rounded-2xl">
                <TrendingUp className="h-8 w-8" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-blue-100 text-sm">Total Spent</p>
                <p className="text-xl font-bold">KSh {getTotalSpent().toLocaleString()}</p>
              </div>
              <div>
                <p className="text-blue-100 text-sm">Remaining</p>
                <p className="text-xl font-bold">KSh {(getTotalBudget() - getTotalSpent()).toLocaleString()}</p>
              </div>
            </div>

            <div className="mt-4">
              <div className="w-full bg-white/20 rounded-full h-2">
                <div
                  className="h-full bg-white rounded-full transition-all duration-1000"
                  style={{
                    width: `${Math.min((getTotalSpent() / getTotalBudget()) * 100, 100)}%`,
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Over Budget Alert */}
        {getOverBudgetCategories().length > 0 && (
          <Alert className="border-red-200 bg-red-50 shadow-lg">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <AlertDescription className="text-red-700">
              <strong>{getOverBudgetCategories().length} categories</strong> are over budget. Review your spending to
              stay on track.
            </AlertDescription>
          </Alert>
        )}

        {/* Budget Category Cards */}
        <div className="space-y-4">
          {budgetCategories.map((category) => (
            <BudgetCard key={category.id} category={category} />
          ))}
        </div>

        {/* Add New Category Button */}
        <Card className="border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors cursor-pointer">
          <CardContent className="p-6 text-center">
            <div className="p-3 bg-gray-100 rounded-2xl w-fit mx-auto mb-3">
              <Plus className="h-6 w-6 text-gray-600" />
            </div>
            <h3 className="font-medium text-gray-700 mb-1">Add New Category</h3>
            <p className="text-sm text-gray-500">Create a custom budget category</p>
          </CardContent>
        </Card>

        {/* Bottom Spacing for Mobile Navigation */}
        <div className="h-20" />
      </div>
    </div>
  )
}
