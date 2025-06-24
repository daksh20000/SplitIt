import { Users } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const GropuList = ({groups}) => {

  if (!groups || groups?.length===0) {
    return (
      <div className='text-center py-6 space-y-2'>
        <p className='text-muted-foreground'>No groups yet</p>
        <p className='text-muted-foreground text-sm' >Create a group to start tracking shared expenses</p>
      </div>
    )
  }
  return (
    <div className='space-y-6'>
      {
        groups.map(g=>{
          const balance = g.balance||0
          const hasBalance = balance!==0
          
          return(
            <Link href={`/groups/${g.id}`} key={g.id} className='flex items-start justify-between hover:bg-muted p-2 rounded-md transition-colors'>
              <div className="flex items-center gap-4">
                <div className='bg-primary/10 p-2 rounded-md'><Users className='h-5 w-5 text-primary'/></div>
                <div>
                  <p className='font-medium'>{g.name}</p>
                  <p className='text-xs text-muted-foreground'>{g.members?.length}</p>
                </div>
              </div>
              {
                hasBalance&&(
                  <span className={`text-sm font-medium ${balance>0?"text-green-500":"text-red-500"}`}>
                    {balance>0?"+":""}{balance.toFixed(2)}
                  </span>
                )
              }
            </Link>
          )
        })
      }
    </div>
  )
}

export default GropuList
