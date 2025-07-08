"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/app/page"
import {
  MessageSquare,
  Smartphone,
  CheckCircle,
  XCircle,
  ArrowUpCircle,
  ArrowDownCircle,
  Zap,
  AlertTriangle,
} from "lucide-react"

interface ParsedTransaction {
  id: string
  type: "income" | "expense"
  amount: number
  description: string
  category: string
  method: string
  date: string
  confidence: number
  rawMessage: string
  recipient?: string
  sender?: string
  reference?: string
}

// SMS parsing patterns for different Kenyan financial services
const SMS_PATTERNS = {
  mpesa: {
    sent: /(?:confirmed\.?\s*)?(?:you have sent|sent)\s*(?:ksh\.?\s*)?(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)\s*to\s*([^.]+?)(?:\s*on\s*(\d{1,2}\/\d{1,2}\/\d{2,4}))?.*?(?:new\s*(?:m-pesa\s*)?balance\s*is\s*(?:ksh\.?\s*)?(\d{1,3}(?:,\d{3})*(?:\.\d{2})?))?.*?(?:transaction\s*(?:cost|fee)\s*(?:ksh\.?\s*)?(\d{1,3}(?:,\d{3})*(?:\.\d{2})?))?/i,
    received:
      /(?:confirmed\.?\s*)?(?:you have received|received)\s*(?:ksh\.?\s*)?(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)\s*from\s*([^.]+?)(?:\s*on\s*(\d{1,2}\/\d{1,2}\/\d{2,4}))?.*?(?:new\s*(?:m-pesa\s*)?balance\s*is\s*(?:ksh\.?\s*)?(\d{1,3}(?:,\d{3})*(?:\.\d{2})?))?/i,
    withdraw:
      /(?:confirmed\.?\s*)?(?:withdraw|you have withdrawn)\s*(?:ksh\.?\s*)?(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)\s*from\s*([^.]+?)(?:\s*on\s*(\d{1,2}\/\d{1,2}\/\d{2,4}))?.*?(?:new\s*(?:m-pesa\s*)?balance\s*is\s*(?:ksh\.?\s*)?(\d{1,3}(?:,\d{3})*(?:\.\d{2})?))?/i,
    deposit:
      /(?:confirmed\.?\s*)?(?:deposit|you have deposited)\s*(?:ksh\.?\s*)?(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)\s*(?:to|into)\s*([^.]+?)(?:\s*on\s*(\d{1,2}\/\d{1,2}\/\d{2,4}))?.*?(?:new\s*(?:m-pesa\s*)?balance\s*is\s*(?:ksh\.?\s*)?(\d{1,3}(?:,\d{3})*(?:\.\d{2})?))?/i,
    paybill:
      /(?:confirmed\.?\s*)?(?:you have paid|paid)\s*(?:ksh\.?\s*)?(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)\s*to\s*([^.]+?)(?:\s*account\s*([^.]+?))?(?:\s*on\s*(\d{1,2}\/\d{1,2}\/\d{2,4}))?/i,
    buygoods:
      /(?:confirmed\.?\s*)?(?:you have paid|paid)\s*(?:ksh\.?\s*)?(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)\s*for\s*([^.]+?)(?:\s*on\s*(\d{1,2}\/\d{1,2}\/\d{2,4}))?/i,
  },
  bank: {
    debit:
      /(?:acc|account)\s*(?:no\.?\s*)?[x*]*(\d{4,})\s*(?:has been\s*)?debited\s*(?:with\s*)?(?:ksh\.?\s*)?(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)\s*(?:on\s*(\d{1,2}\/\d{1,2}\/\d{2,4}))?.*?(?:balance\s*(?:is\s*)?(?:ksh\.?\s*)?(\d{1,3}(?:,\d{3})*(?:\.\d{2})?))?/i,
    credit:
      /(?:acc|account)\s*(?:no\.?\s*)?[x*]*(\d{4,})\s*(?:has been\s*)?credited\s*(?:with\s*)?(?:ksh\.?\s*)?(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)\s*(?:on\s*(\d{1,2}\/\d{1,2}\/\d{2,4}))?.*?(?:balance\s*(?:is\s*)?(?:ksh\.?\s*)?(\d{1,3}(?:,\d{3})*(?:\.\d{2})?))?/i,
    transfer:
      /(?:transfer|sent)\s*(?:of\s*)?(?:ksh\.?\s*)?(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)\s*(?:to|from)\s*([^.]+?)(?:\s*on\s*(\d{1,2}\/\d{1,2}\/\d{2,4}))?/i,
  },
  airtel: {
    sent: /(?:you have sent|sent)\s*(?:ksh\.?\s*)?(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)\s*to\s*([^.]+?).*?(?:airtel money)/i,
    received:
      /(?:you have received|received)\s*(?:ksh\.?\s*)?(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)\s*from\s*([^.]+?).*?(?:airtel money)/i,
  },
}

function parseSMSMessage(message: string): ParsedTransaction | null {
  const cleanMessage = message.toLowerCase().trim()
  const currentDate = new Date().toISOString().split("T")[0]

  // M-Pesa patterns
  if (cleanMessage.includes("mpesa") || cleanMessage.includes("m-pesa")) {
    // Check for sent money
    let match = cleanMessage.match(SMS_PATTERNS.mpesa.sent)
    if (match) {
      const amount = Number.parseFloat(match[1].replace(/,/g, ""))
      const recipient = match[2]?.trim()
      return {
        id: Date.now().toString(),
        type: "expense",
        amount: amount,
        description: `M-Pesa sent to ${recipient}`,
        category: "Transfer",
        method: "M-Pesa",
        date: currentDate,
        confidence: 0.9,
        rawMessage: message,
        recipient,
      }
    }

    // Check for received money
    match = cleanMessage.match(SMS_PATTERNS.mpesa.received)
    if (match) {
      const amount = Number.parseFloat(match[1].replace(/,/g, ""))
      const sender = match[2]?.trim()
      return {
        id: Date.now().toString(),
        type: "income",
        amount: amount,
        description: `M-Pesa received from ${sender}`,
        category: "Transfer",
        method: "M-Pesa",
        date: currentDate,
        confidence: 0.9,
        rawMessage: message,
        sender,
      }
    }

    // Check for withdrawal
    match = cleanMessage.match(SMS_PATTERNS.mpesa.withdraw)
    if (match) {
      const amount = Number.parseFloat(match[1].replace(/,/g, ""))
      const agent = match[2]?.trim()
      return {
        id: Date.now().toString(),
        type: "expense",
        amount: amount,
        description: `Cash withdrawal from ${agent}`,
        category: "Cash",
        method: "M-Pesa",
        date: currentDate,
        confidence: 0.85,
        rawMessage: message,
      }
    }

    // Check for paybill
    match = cleanMessage.match(SMS_PATTERNS.mpesa.paybill)
    if (match) {
      const amount = Number.parseFloat(match[1].replace(/,/g, ""))
      const business = match[2]?.trim()
      return {
        id: Date.now().toString(),
        type: "expense",
        amount: amount,
        description: `Payment to ${business}`,
        category: "Bills",
        method: "M-Pesa",
        date: currentDate,
        confidence: 0.8,
        rawMessage: message,
      }
    }

    // Check for buy goods
    match = cleanMessage.match(SMS_PATTERNS.mpesa.buygoods)
    if (match) {
      const amount = Number.parseFloat(match[1].replace(/,/g, ""))
      const merchant = match[2]?.trim()
      return {
        id: Date.now().toString(),
        type: "expense",
        amount: amount,
        description: `Purchase from ${merchant}`,
        category: "Shopping",
        method: "M-Pesa",
        date: currentDate,
        confidence: 0.8,
        rawMessage: message,
      }
    }
  }

  // Bank patterns
  if (cleanMessage.includes("account") || cleanMessage.includes("acc")) {
    // Check for debit
    let match = cleanMessage.match(SMS_PATTERNS.bank.debit)
    if (match) {
      const amount = Number.parseFloat(match[2].replace(/,/g, ""))
      return {
        id: Date.now().toString(),
        type: "expense",
        amount: amount,
        description: "Bank account debit",
        category: "Bank Transfer",
        method: "Bank",
        date: currentDate,
        confidence: 0.85,
        rawMessage: message,
      }
    }

    // Check for credit
    match = cleanMessage.match(SMS_PATTERNS.bank.credit)
    if (match) {
      const amount = Number.parseFloat(match[2].replace(/,/g, ""))
      return {
        id: Date.now().toString(),
        type: "income",
        amount: amount,
        description: "Bank account credit",
        category: "Bank Transfer",
        method: "Bank",
        date: currentDate,
        confidence: 0.85,
        rawMessage: message,
      }
    }
  }

  // Airtel Money patterns
  if (cleanMessage.includes("airtel money")) {
    let match = cleanMessage.match(SMS_PATTERNS.airtel.sent)
    if (match) {
      const amount = Number.parseFloat(match[1].replace(/,/g, ""))
      const recipient = match[2]?.trim()
      return {
        id: Date.now().toString(),
        type: "expense",
        amount: amount,
        description: `Airtel Money sent to ${recipient}`,
        category: "Transfer",
        method: "Airtel Money",
        date: currentDate,
        confidence: 0.8,
        rawMessage: message,
        recipient,
      }
    }

    match = cleanMessage.match(SMS_PATTERNS.airtel.received)
    if (match) {
      const amount = Number.parseFloat(match[1].replace(/,/g, ""))
      const sender = match[2]?.trim()
      return {
        id: Date.now().toString(),
        type: "income",
        amount: amount,
        description: `Airtel Money received from ${sender}`,
        category: "Transfer",
        method: "Airtel Money",
        date: currentDate,
        confidence: 0.8,
        rawMessage: message,
        sender,
      }
    }
  }

  return null
}

export function SMSParserScreen() {
  const { user } = useAuth()
  const [smsText, setSmsText] = useState("")
  const [parsedTransactions, setParsedTransactions] = useState<ParsedTransaction[]>([])
  const [selectedTransactions, setSelectedTransactions] = useState<Set<string>>(new Set())
  const [isProcessing, setIsProcessing] = useState(false)

  const handleParseSMS = () => {
    setIsProcessing(true)

    // Split multiple messages by common delimiters
    const messages = smsText.split(/\n\n|\n---|\n===/).filter((msg) => msg.trim().length > 0)
    const parsed: ParsedTransaction[] = []

    messages.forEach((message, index) => {
      const transaction = parseSMSMessage(message.trim())
      if (transaction) {
        transaction.id = `${Date.now()}-${index}`
        parsed.push(transaction)
      }
    })

    setParsedTransactions(parsed)
    setSelectedTransactions(new Set(parsed.map((t) => t.id)))
    setIsProcessing(false)
  }

  const handleToggleTransaction = (transactionId: string) => {
    const newSelected = new Set(selectedTransactions)
    if (newSelected.has(transactionId)) {
      newSelected.delete(transactionId)
    } else {
      newSelected.add(transactionId)
    }
    setSelectedTransactions(newSelected)
  }

  const handleAddSelectedTransactions = () => {
    const selectedTxns = parsedTransactions.filter((t) => selectedTransactions.has(t.id))
    // In a real app, this would save to the database
    console.log("Adding transactions:", selectedTxns)

    // Clear the form
    setSmsText("")
    setParsedTransactions([])
    setSelectedTransactions(new Set())

    // Show success message (you could add a toast notification here)
    alert(`Successfully added ${selectedTxns.length} transactions!`)
  }

  const sampleMessages = [
    "Confirmed. You have sent Ksh1,200.00 to JOHN DOE 254712345678 on 15/1/24 at 2:30 PM. New M-PESA balance is Ksh15,800.50. Transaction cost Ksh11.00. Transaction ID: QA12B3C4D5",
    "Confirmed. You have received Ksh5,000.00 from MARY WANJIKU 254701234567 on 15/1/24 at 10:15 AM. New M-PESA balance is Ksh17,000.50. Transaction ID: QB34C5D6E7",
    "Account No. ****1234 has been debited with KSh2,500.00 on 15/01/2024. Available balance is KSh45,200.75. Ref: TXN789456123",
  ]

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">SMS Parser</h1>
          <p className="text-gray-600">Import transactions from SMS messages</p>
        </div>
        <div className="p-2 bg-blue-100 rounded-lg">
          <MessageSquare className="h-6 w-6 text-blue-600" />
        </div>
      </div>

      {/* Instructions */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Smartphone className="h-5 w-5 text-blue-600 mt-1" />
            <div>
              <h3 className="font-medium text-gray-800 mb-2">How to use SMS Parser</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Copy SMS messages from M-Pesa, banks, or Airtel Money</li>
                <li>• Paste multiple messages (separate with blank lines)</li>
                <li>• Review and select transactions to import</li>
                <li>• Supports Kenyan financial services automatically</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SMS Input */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Paste SMS Messages
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="smsText">SMS Messages</Label>
            <Textarea
              id="smsText"
              value={smsText}
              onChange={(e) => setSmsText(e.target.value)}
              placeholder="Paste your SMS messages here... (separate multiple messages with blank lines)"
              className="min-h-32 resize-none"
            />
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleParseSMS}
              disabled={!smsText.trim() || isProcessing}
              className="bg-blue-500 hover:bg-blue-600"
            >
              {isProcessing ? "Processing..." : "Parse Messages"}
            </Button>

            <Button
              variant="outline"
              onClick={() => setSmsText(sampleMessages.join("\n\n"))}
              className="bg-transparent"
            >
              Try Sample
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Parsed Results */}
      {parsedTransactions.length > 0 && (
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Parsed Transactions ({parsedTransactions.length})</span>
              <Button
                onClick={handleAddSelectedTransactions}
                disabled={selectedTransactions.size === 0}
                className="bg-green-500 hover:bg-green-600"
                size="sm"
              >
                Add Selected ({selectedTransactions.size})
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {parsedTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className={`p-4 rounded-lg border-2 transition-colors cursor-pointer ${
                  selectedTransactions.has(transaction.id) ? "border-blue-300 bg-blue-50" : "border-gray-200 bg-gray-50"
                }`}
                onClick={() => handleToggleTransaction(transaction.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-full ${transaction.type === "income" ? "bg-green-100" : "bg-red-100"}`}
                    >
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
                        <Badge variant="outline" className="text-xs">
                          {transaction.method}
                        </Badge>
                        <div className="flex items-center gap-1">
                          {transaction.confidence >= 0.8 ? (
                            <CheckCircle className="h-3 w-3 text-green-500" />
                          ) : (
                            <AlertTriangle className="h-3 w-3 text-yellow-500" />
                          )}
                          <span className="text-xs text-gray-500">
                            {Math.round(transaction.confidence * 100)}% confidence
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className={`font-bold ${transaction.type === "income" ? "text-green-600" : "text-red-600"}`}>
                      {transaction.type === "income" ? "+" : "-"}KSh {transaction.amount.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">{transaction.date}</p>
                  </div>
                </div>

                {/* Raw message preview */}
                <details className="mt-3">
                  <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-700">
                    View original message
                  </summary>
                  <div className="mt-2 p-2 bg-gray-100 rounded text-xs text-gray-600 font-mono">
                    {transaction.rawMessage}
                  </div>
                </details>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* No results message */}
      {smsText && parsedTransactions.length === 0 && !isProcessing && (
        <Alert>
          <XCircle className="h-4 w-4" />
          <AlertDescription>
            No transactions could be parsed from the provided messages. Make sure you're using SMS messages from
            supported services (M-Pesa, banks, Airtel Money).
          </AlertDescription>
        </Alert>
      )}

      {/* Supported Services */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg">Supported Services</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium text-gray-800">Mobile Money</h4>
              <div className="space-y-1">
                <Badge variant="outline" className="mr-2">
                  M-Pesa
                </Badge>
                <Badge variant="outline" className="mr-2">
                  Airtel Money
                </Badge>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-gray-800">Banks</h4>
              <div className="space-y-1">
                <Badge variant="outline" className="mr-2">
                  KCB
                </Badge>
                <Badge variant="outline" className="mr-2">
                  Equity
                </Badge>
                <Badge variant="outline" className="mr-2">
                  Co-op Bank
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
