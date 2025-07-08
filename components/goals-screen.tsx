"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, Plus, Target, TrendingUp } from "lucide-react"

const mockGoals = [
  {
    id: 1,
    name: "Emergency Fund",
    targetAmount: 5000,
    savedAmount: 2500,
    dueDate: "2024-12-31",
    progress: 50,
  },
  {
    id: 2,
    name: "Summer Vacation",
    targetAmount: 2000,
    savedAmount: 800,
    dueDate: "2024-06-15",
    progress: 40,
  },
  {
    id: 3,
    name: "New Laptop",
    targetAmount: 1200,
    savedAmount: 450,
    dueDate: "2024-04-30",
    progress: 38,
  },
  {
    id: 4,
    name: "Car Down Payment",
    targetAmount: 8000,
    savedAmount: 1200,
    dueDate: "2024-10-01",
    progress: 15,
  },
]

export function GoalsScreen() {
  const [showForm, setShowForm] = useState(false)
  const [dueDate, setDueDate] = useState<Date>()

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Financial Goals</h1>
        <Button onClick={() => setShowForm(!showForm)} className="bg-purple-500 hover:bg-purple-600" size="sm">
          <Plus className="h-4 w-4 mr-1" />
          Add Goal
        </Button>
      </div>

      {/* Add Goal Form */}
      {showForm && (
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg">Create New Goal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="goalName">Goal Name</Label>
              <Input id="goalName" placeholder="e.g., Emergency Fund" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="targetAmount">Target Amount</Label>
                <Input id="targetAmount" type="number" placeholder="0.00" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="savedAmount">Amount Saved</Label>
                <Input id="savedAmount" type="number" placeholder="0.00" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Due Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dueDate ? format(dueDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={dueDate} onSelect={setDueDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex gap-2">
              <Button className="flex-1 bg-purple-500 hover:bg-purple-600">Create Goal</Button>
              <Button variant="outline" onClick={() => setShowForm(false)} className="flex-1">
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Goals Overview */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-gradient-to-r from-purple-400 to-purple-500 text-white border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Active Goals</p>
                <p className="text-2xl font-bold">{mockGoals.length}</p>
              </div>
              <Target className="h-8 w-8 text-purple-100" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-400 to-green-500 text-white border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Total Saved</p>
                <p className="text-2xl font-bold">
                  ${mockGoals.reduce((sum, goal) => sum + goal.savedAmount, 0).toLocaleString()}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-100" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Goals List */}
      <div className="space-y-4">
        {mockGoals.map((goal) => (
          <Card key={goal.id} className="border-0 shadow-lg">
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-800">{goal.name}</h3>
                    <p className="text-sm text-gray-500">Due: {goal.dueDate}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg text-gray-800">{goal.progress}%</p>
                    <p className="text-sm text-gray-500">Complete</p>
                  </div>
                </div>

                <Progress value={goal.progress} className="h-3" />

                <div className="flex justify-between items-center">
                  <div className="text-sm">
                    <span className="font-medium text-gray-700">${goal.savedAmount.toLocaleString()}</span>
                    <span className="text-gray-500"> saved</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-500">of </span>
                    <span className="font-medium text-gray-700">${goal.targetAmount.toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                    Update Progress
                  </Button>
                  <Button size="sm" className="flex-1 bg-purple-500 hover:bg-purple-600">
                    Add Money
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
