import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import {zodResolver} from "@hookform/resolvers/zod"
import { z } from 'zod'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useConvexMutation, useConvexQuery } from '@/hooks/useConvexQuery'
import { api } from '../../../../../convex/_generated/api'
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import { User, UserPlus, X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Popover } from '@/components/ui/popover'
import { PopoverContent, PopoverTrigger } from '@radix-ui/react-popover'
import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from '@/components/ui/command'
import { toast } from 'sonner'

const CreateGroupModal = ({isOpen, onClose, onSuccess}) => {
    
    const [selectedMembers, setSelectedMembers] = useState([
    ])
    const [searchQuery, setSearchQuery] = useState("")
    const [commandOpen, setCommandOpen] = useState(false)

    
    const {data:currentUser,isLoading:currentUserLoading,error:currentUserError} =useConvexQuery(api.users.getCurrentUser)  
    const {data:searchResults,isLoading:isSearching,error:userError} =useConvexQuery(api.users.searchUsers,{query:searchQuery})  

    const createGroup= useConvexMutation(api.contacts.createGroup)

    const groupSchema = z.object({
        name:z.string().min(1, "Group name is required"),
        description:z.string().optional()

    })

    const {
        register,
        handleSubmit,
        formState:{errors, isSubmitting,},
        reset
    } = useForm({
        resolver: zodResolver(groupSchema),
        defaultValues:{
            name:"",
            description:""
        }
    })

    const onSubmit= async (data)=>{
        try {
            const memberIds = selectedMembers.map(m=>m.id) 
            console.log("Creating group with:", {
                name: data.name,
                description: data.description,
                members: memberIds
                });
            const groupId = await createGroup.mutate({
                name:data.name,
                description:data.description,
                members:memberIds
            })
            console.log(memberIds)
            toast.success("Group created successfully!")
            handleClose()
            if(onSuccess)onSuccess(groupId)
            
        } catch (error) {
            toast.error("Failed to create group" + error.message)
        }
        finally{
            

        }
    }

    const handleClose = ()=>{ 
        reset()
        setSelectedMembers([])
        onClose()
    }
    const addMember = (user)=>{
        if(!selectedMembers.some((u)=>(u.id ==user.id))){
            setSelectedMembers([...selectedMembers, user])
            
        }
        setCommandOpen(false)
        
    }
    const removeMember = (memId)=>{
        const removedMemberArray= selectedMembers.filter(m=>m.id!=memId)
        setSelectedMembers(removedMemberArray)
        
    }
    console.log(selectedMembers)
  return (
    <div>
      <Dialog open={isOpen} onOpenChange={handleClose} >
        <DialogContent>
            <DialogHeader>
                <DialogTitle>
                    Create New Group
                </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)}  className='space-y-4 '>
                <div className='space-y-2'>
                    <Label htmlFor="name">Group Name</Label>
                    <Input id="name" placeholder="Enter group name" {...register('name')}/>
                    {errors.name && 
                    (<p className='text-sm text-red-500'>
                        {errors.name.message}
                    </p>
                    )}
                </div>
                <div className='space-y-2'>
                    <Label htmlFor="description">Description (optional)</Label>
                    <Textarea id="description" placeholder="Enter group description" {...register('description')}/>
                </div>
                <div className='space-y-2'>
                    <Label>Members</Label>
                    <div className='flex flex-wrap gap-2 items-center mb-2 '>
                        {currentUser && 
                        <Badge variant="secondary" className="px-3 py-1">
                            <Avatar className='h-6 w-6 mr-2 '>
                                <AvatarImage src={currentUser?.imageUrl} className='rounded-full'/>
                                <AvatarFallback>
                                    <User className='bg-muted-foreground/20 p-1 rounded-full'/>
                                </AvatarFallback>
                            </Avatar>
                            <span>{currentUser.name} (you)</span>
                        </Badge>
                        }
                        {selectedMembers?.map(member=>(
                            <Badge variant="secondary" className="px-3 py-1" key={member.id}>
                                <Avatar className='h-6 w-6 mr-2 '>
                                    <AvatarImage src={member?.imageUrl} className='rounded-full'/>
                                    <AvatarFallback>
                                        <User className='bg-muted-foreground/20 p-1 rounded-full'/>
                                    </AvatarFallback>
                                </Avatar>
                                <span>{member.name}</span>
                                <button
                                type='button'
                                onClick={()=>{removeMember(member.id)}}
                                className=''
                                >   
                                <X className='h-4 text-muted-foreground cursor-pointer'/>
                                </button>
                            </Badge>
                        ))}
                        <Popover open={commandOpen} onOpenChange={setCommandOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="h-8 gap-1 text-xs"
                                >
                                    <UserPlus className='h-3.5 w-3.5'/>
                                    Add members
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className='p-0 ' align='start' side='bottom'>
                                <Command >
                                    <CommandInput placeholder="Type a name or email..." value={searchQuery}  onValueChange={setSearchQuery} />
                                    <CommandList>
                                        <CommandEmpty>{searchQuery.length < 2
                                        ? <p className='py-3 px-4 text-sm text-center text-muted-foreground'>Type at least 2 characters to search</p>
                                        : isSearching
                                        ?<p className='py-3 px-4 text-sm text-center text-muted-foreground'>Searching...</p>
                                        :<p className='py-3 px-4 text-sm text-center text-muted-foreground'>No users found</p>
                                        
                                        }
                                        </CommandEmpty>
                                        <CommandGroup heading="Users">
                                            {searchResults?.map((user)=>(
                                                <CommandItem
                                                 key={user.id} 
                                                 value={user.name + user.email} 
                                                 onSelect={()=>{addMember(user)}}
                                                 className="cursor-pointer">
                                                    <div className='flex items-center gap-2'>
                                                        <Avatar className='h-6 w-6  '>
                                                            <AvatarImage src={user.imageUrl} className='rounded-full'/>
                                                            <AvatarFallback>
                                                                <User/>
                                                            </AvatarFallback>
                                                        </Avatar>    
                                                        <div className='flex flex-col'>
                                                            <span className='text-sm'>{user.name}</span>
                                                            <span className='text-xs text-muted-foreground'>{user.email}</span>
                                                        </div>           
                                                    </div>
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                    </div>
                    {
                        selectedMembers.length==0 &&
                        <p className='text-sm text-amber-600'>Add atleast one another person to the group</p>
                    }
                </div>
                <DialogFooter>
                    <Button type="button" variant="outline" onClick={handleClose}>
                        cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting||selectedMembers.length==0 } className="cursor-pointer">
                        {isSubmitting?"submitting":"Create Group"}
                    </Button>
                </DialogFooter>
            </form>
            
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default CreateGroupModal
