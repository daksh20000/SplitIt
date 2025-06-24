"use client"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import React from 'react'
import { Bar, BarChart, CartesianGrid, Legend, Rectangle, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

const ExpenseSummary = ({monthlySpending, totalSpent}) => {
    const monthNames =  [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ]

    const chartData = monthlySpending?.map((item)=>{
        const date= new Date(item.month)
        return {
            name:monthNames[date.getMonth()],
            amount:item.total
        }
    }) ||[]

    const currentYear = new Date().getFullYear()
    const currentMonth = new Date().getMonth()
  return (
    <Card>
        <CardHeader>
            <CardTitle>Expense Summary</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="grid grid-cols-2 gap-4">
            <div className="bg-muted rounded-lg p-4">
                <p className="text-sm text-muted-foreground">Total this month</p>
                <h3 className="text-2xl font-bold mt-1">
                ${monthlySpending?.[currentMonth]?.total.toFixed(2) || "0.00"}
                </h3>
            </div>
            <div className="bg-muted rounded-lg p-4">
                <p className="text-sm text-muted-foreground">Total this year</p>
                <h3 className="text-2xl font-bold mt-1">
                ${totalSpent?.toFixed(2) || "0.00"}
                </h3>
            </div>
            </div>
            <div className='h-64 mt-4'>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                    data={chartData}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                    >
                        <CartesianGrid strokeDasharray="3 3"  vertical={false}/>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip
                        />
                        <Bar dataKey="amount" fill="#36d7b7"  />
                    </BarChart>
                </ResponsiveContainer>
            </div>
            <p className="text-xs text-muted-foreground text-center mt-2">
                Monthly spending for {currentYear}
            </p>
        </CardContent>
        <CardFooter></CardFooter>
    </Card>
  )
}

export default ExpenseSummary

