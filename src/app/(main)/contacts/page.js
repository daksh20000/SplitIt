"use client"
import { useQuery } from 'convex/react'
import React, { useEffect, useState } from 'react'
import { api } from '../../../../convex/_generated/api'
import { useConvexQuery } from '@/hooks/useConvexQuery'
import { BarLoader } from 'react-spinners'
import { Button } from '@/components/ui/button'
import { Plus, User, Users } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import CreateGroupModal from './_components/CreateGroupModal'
import { useRouter, useSearchParams } from 'next/navigation'

const page = () => {
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false)
  const {data, isLoading,error,} = useConvexQuery(api.contacts.getAllContacts)

  const router= useRouter()
  const searchParams = useSearchParams()

  useEffect(()=>{
    const createGroupParam = searchParams.get("createGroup")
    if (createGroupParam === "true") {
      setIsGroupModalOpen(true)
      const url = new URL(window.location.href)
      url.searchParams.delete("createGroup")
      router.replace(url.pathname+url.search)
    }

  },[searchParams,router])

  
  if (isLoading) {
    return(
    <div className='container mx-auto py-12'>
      <BarLoader width={"100%"} color='#36d7b7'/>
    </div>
    
  )
  }
  const{groups, users}= data || {groups:[], users:[]}
  return (

    <div className='mx-auto py-5 px-6'>
      <div className="flex items-center justify-between mb-6">
        <h1 className='text-3xl gradient-title sm:text-4xl md:text-5xl'>Contacts</h1>
        <Button 
          
          onClick={()=>{
          setIsGroupModalOpen(true)
        }}>
          <Plus className='h-4 w-4 mr-2'/>
          Create Group
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="">
          <h2 className='flex items-center mb-4 text-xl font-bold'>
            <User className='mr-2 h-5 w-5'/>
            People
          </h2>
          {users.length==0
          ?(
          <Card>
            <CardContent className="py-6 text-center text-muted-foreground">
                No contacts yet. add an expense with someone to see them here.
            </CardContent>
          </Card>
          )       
          :(
          <div className="flex flex-col gap-4">
            {users.map(({id, email, imageUrl, name})=>(
              <Link key={id} href={`/person/${id}`}>
                <Card className="hover:bg-green-100/40 cursor-pointer transition-colors">
                  <CardContent className="py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Avatar className=''>
                          <AvatarImage src={imageUrl} className='h-10 w-10 rounded-full' />
                          <AvatarFallback>
                            {(name|| email)?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className='font-medium'>{name}</p>
                          <p className='text-sm text-muted-foreground'>{email}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          )
          }
        </div>
        <div className="">
          <h2 className='flex items-center mb-4 text-xl font-bold'>
            <Users className='mr-2 h-5 w-5'/>
            Groups
          </h2>
          {groups.length==0
          ?(
          <Card>
            <CardContent className="py-6 text-center text-muted-foreground">
                No groups yet. Create a group to start tracking shared expenses.
            </CardContent>
          </Card>
          )       
          :(
          <div className="flex flex-col gap-4">
            {groups.map(({id, description, memberCount, name})=>(
              <Link key={id} href={`/groups/${id}`}>
                <Card className="hover:bg-green-100/40 cursor-pointer transition-colors">
                  <CardContent className="py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Users className='bg-muted p-2 h-10 w-10 rounded-md text-primary'/>
                        <div>
                          <p className='font-medium'>{name}</p>
                          <p className='text-sm text-muted-foreground'>{memberCount} members</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          )
          }
        </div>
      </div>
      <CreateGroupModal isOpen={isGroupModalOpen} onClose={()=>{setIsGroupModalOpen(false)}} onSuccess={(groupId)=>{router.push(groupId)}} />
    </div>
  )
}

export default page
