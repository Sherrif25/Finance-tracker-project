"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, Plus, Filter, ArrowUpCircle, ArrowDownCircle } from "lucide-react"

const mockTransactions = [
  {
    id: 1,
    date: "2024-01-15",
    description: "Grocery Shopping",
    category: "Food",
    amount: -8550,
    type: "expense",
    method: "Card",
  },
  {
    id: 2,
    date: "2024-01-14",
    description: "Salary",
    category: "Salary",
    amount: 250000,
    type: "income",
    method: "Bank",
  },
  {
    id: 3,
    date: "2024-01-13",
    description: "Uber Ride",
    category: "Transport",
    amount: -1230,
    type: "expense",
    method: "M-Pesa",
  },
  {
    id: 4,
    date: "2024-01-12",
    description: "Coffee Shop",
    category: "Food",
    amount: -450,
    type: "expense",
    method: "Cash",
  },
  {
    id: 5,
    date: "2024-01-11",
    description: "Freelance Work",
    category: "Income",
    amount: 35000,
    type: "income",
    method: "Bank",
  },
]

export function TransactionsScreen() {
  const [date, setDate] = useState<Date>()
  const [showForm, setShowForm] = useState(false)
  const [filterType, setFilterType] = useState<string>("all")
  const [filterCategory, setFilterCategory] = useState<string>("all")

  const filteredTransactions = mockTransactions.filter((transaction) => {
    if (filterType !== "all" && transaction.type !== filterType) return false
    if (filterCategory !== "all" && transaction.category !== filterCategory) return false
    return true
  })

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Transactions</h1>
        <Button onClick={() => setShowForm(!showForm)} className="bg-blue-500 hover:bg-blue-600" size="sm">
          <Plus className="h-4 w-4 mr-1" />
          Add
        </Button>
      </div>

      {/* Add Transaction Form */}
      {showForm && (
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg">Add New Transaction</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <Input id="amount" type="number" placeholder="0" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input id="description" placeholder="Enter description" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="food">Food</SelectItem>
                    <SelectItem value="transport">Transport</SelectItem>
                    <SelectItem value="rent">Rent</SelectItem>
                    <SelectItem value="salary">Salary</SelectItem>
                    <SelectItem value="entertainment">Entertainment</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Income/Expense" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="income">Income</SelectItem>
                    <SelectItem value="expense">Expense</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Payment Method</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mpesa">M-Pesa</SelectItem>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="bank">Bank</SelectItem>
                  <SelectItem value="card">Card</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <Button className="flex-1 bg-blue-500 hover:bg-blue-600">Add Transaction</Button>
              <Button variant="outline" onClick={() => setShowForm(false)} className="flex-1">
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Filter className="h-4 w-4 text-gray-600" />
            <span className="font-medium text-gray-700">Filters</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger>
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="income">Income</SelectItem>
                <SelectItem value="expense">Expense</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Food">Food</SelectItem>
                <SelectItem value="Transport">Transport</SelectItem>
                <SelectItem value="Rent">Rent</SelectItem>
                <SelectItem value="Salary">Salary</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Transactions List */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg">Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {filteredTransactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${transaction.type === "income" ? "bg-green-100" : "bg-red-100"}`}>
                  {transaction.type === "income" ? (
                    <ArrowUpCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <ArrowDownCircle className="h-4 w-4 text-red-600" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-800">{transaction.description}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className="text-xs">
                      {transaction.category}
                    </Badge>
                    <span className="text-xs text-gray-500">{transaction.method}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-bold ${transaction.type === "income" ? "text-green-600" : "text-red-600"}`}>
                  {transaction.type === "income" ? "+" : ""}KSh {Math.abs(transaction.amount).toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">{transaction.date}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
