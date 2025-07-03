"use client"
import { useConvexQuery } from '@/hooks/useConvexQuery'
import React, { useEffect } from 'react'
import { api } from '../../../../convex/_generated/api'
import { BarLoader } from 'react-spinners'
import { Button } from '@/components/ui/button'
import { ChevronRight, PlusCircle, PlusIcon, Users } from 'lucide-react'
import Link from 'next/link'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import BalanceSummary from "./_components/balance-summary"
import ExpenseSummary from "./_components/expense-summary"
import GroupList from "./_components/group-list"

const Page = () => {
  const{data:balances, isLoading:balancesLoading} = useConvexQuery(api.dashboard.getUserBalances)
  const{data:totalSpent, isLoading:totalSpentLoading} = useConvexQuery(api.dashboard.getTotalSpent)
  const{data:groups, isLoading:groupsLoading} = useConvexQuery(api.dashboard.getUserGroups)
  const{data:monthlySpending, isLoading:monthlySpendingLoading} = useConvexQuery(api.dashboard.getMonthlySpending)

  

  const isLoading = balancesLoading || totalSpentLoading||groupsLoading||monthlySpendingLoading

  if (isLoading) {
    return(
      <div className='w-full py-12 flex justify-center'>
        <BarLoader width={"100%"} color='#36d7b7'/>  
      </div>
    )
  }
  return (
    <div className=' container mx-auto px-6 py-4 space-y-6'>
      <div className='flex justify-between items-center mb-4  '>
        <h1 className='gradient-title text-3xl  sm:text-5xl'>Dashboard</h1>
        <Button asChild>
          <Link href="/expenses/new" >
            <PlusCircle className='mr-0 sm:mr-2'/>
            <span className='hidden sm:inline-flex'>Add Expenses</span>
          </Link>
        </Button>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4   '>
        <Card className="">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {balances.totalBalance>0
              ?
              (
                <span className='text-green-600'>+${balances?.totalBalance.toFixed(2)}</span>
              )
              :balances.totalBalance<0
                ?
                (
                  <span className='text-red-600'>-${Math.abs(balances?.totalBalance).toFixed(2)}</span>
                )
                :
                (
                  <span className=''>$0.00</span>
                )
              }
            </div>
            <div className='text-xs mt-1'>
              {balances.totalBalance>0
              ?
              (
                <span className='text-muted-foreground'>You are owed money</span>
              )
              :balances.totalBalance<0
                ?
                (
                  <span className='text-muted-foreground'>You owe money</span>
                )
                :
                (
                  <span className='text-muted-foreground'>All settled up!!</span>
                )
              }
            </div>
          </CardContent>
        </Card>
        <Card className="">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">You are owed </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-green-600'>
              ${balances?.youAreOwed.toFixed(2)}
            </div>
            <p className='text-muted-foreground text-xs mt-1'>
              from {balances?.oweDetails?.youAreOwedBy?.length || 0} {balances?.oweDetails?.youAreOwedBy?.length>1 ? "people":"person"}
            </p>

          </CardContent>
        </Card>
        <Card className="">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">You owe </CardTitle>
          </CardHeader>
          <CardContent>
            {balances?.oweDetails?.youOwe.length>0 ?
            (
              <>
                <div className='text-2xl font-bold text-red-600'>
                  ${balances?.youOwe.toFixed(2)}
                </div>
                <p className='text-muted-foreground text-xs mt-1'>
                  to {balances?.oweDetails?.youOwe?.length || 0} {balances?.oweDetails?.youOwe?.length>1 ? "people":"person"}
                </p>
              </>
            )
            :
            (
              <>
                <div className='text-2xl font-bold'>
                  $0.00
                </div>
                <p className='text-muted-foreground text-xs mt-1'>
                  You don&apos;t owe anyone
                </p>
              </>
            )
            }
          </CardContent>
        </Card>
      </div>
      {/* Main dashboard content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className='space-y-6 lg:col-span-2'>
          <ExpenseSummary monthlySpending={monthlySpending} totalSpent={totalSpent}/> 

        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Balance details */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle>Balance Details</CardTitle>
                <Button variant="link" asChild className="p-0">
                  <Link href="/contacts">
                    View all
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <BalanceSummary balances={balances} />
            </CardContent>
          </Card>

          {/* Groups */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle>Your Groups</CardTitle>
                <Button variant="link" asChild className="p-0">
                  <Link href="/contacts">
                    View all
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <GroupList groups={groups} />
            </CardContent>
            <CardFooter>
              <Button variant="outline" asChild className="w-full">
                <Link href="/contacts?createGroup=true">
                  <Users className="mr-2 h-4 w-4" />
                  Create new group
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Page
