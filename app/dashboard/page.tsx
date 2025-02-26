"use client"

import Markdown from '@/components/Markdown'
import { ApiError } from 'next/dist/server/api-utils'
import React, { FormEvent, useState } from 'react'
import { Skeleton } from "@/components/ui/skeleton"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Send,Loader2,LucideCopyPlus } from 'lucide-react'
import Link from 'next/link'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"

export default function page() {
    const [data,setData] = useState('')
    const [message,setMessage] = useState('')
    const [isLoading,setisLoading] = useState(false)
    const [sourceLink,setSourceLinks] = useState([])
    const [showImage,setShowImage] = useState(false)
    const [showquestion,setShowQuestion] = useState(false)
    const [question,setQuestion] = useState('') // for showing the question that i searched

    async function handleSubmit(e: FormEvent<HTMLFormElement>){
       try {
            e.preventDefault(); 
            setisLoading(true)
            setShowQuestion(true)
            setQuestion(data)
    
            const response = await fetch('/api/generatetext', {
                method : 'POST',
                headers : {
                    'Content-Type': 'application/json'
                },
                body : JSON.stringify(data)
            })

            setData('')
    
            if(!response.ok){
                throw new ApiError(
                    500,
                    "reponse doen't received"
                )
            }
    
            const result = await response.json()

            console.log(`result Data: `,result)
    
            setMessage(result?.data)
            setSourceLinks(result?.pageMetadata)

       } catch (error) {
          console.error("Failed in -frontend to generate reponse",error)
       } finally { 
          setisLoading(false)
       }
    }

    function SkeletonCard() {
    return (
        <div className="flex flex-col space-y-3">
            <Skeleton className="h-[30px] w-[550px] rounded" />
            <div className="space-y-2">
                <Skeleton className="h-4 w-[550px]" />
                <Skeleton className="h-4 w-[550px]" />
            </div>
        </div>
      )
    }

    function reducetext(text : string,max_length  :number){
        if(text.length <= max_length){
            return text
        }

        return text.slice(0, max_length) + "...";
    }

  return (
    <div className='flex justify-center bg-black'>
        <div className=' text-white min-h-screen w-[50%]'>
             {/* search bar  */}
            <div className='py-2'>
                <p className='text-center py-2 text-sm text-neutral-600'>Ask Your Academic Doubts 📒!</p>
                <div className='bg-neutral-900 py-2 px-6 rounded-full '>
                    <form onSubmit={handleSubmit}>
                        <div className='flex gap-2'>
                            <Select>
                                <SelectTrigger className="w-[100px] h-7 text-xs border-none focus:outline-none">
                                    <SelectValue placeholder="Default" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                    <SelectLabel />
                                    <SelectItem value="default">Default</SelectItem>
                                    <SelectItem value="highschool">High School</SelectItem>
                                    <SelectItem value="graduate">Graduate</SelectItem>
                                    <SelectItem value="research">Research</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            <div className='flex w-full items-center gap-3'>
                                <input 
                                type="text" 
                                placeholder='Ask ?' 
                                value={data}
                                onChange={(e) => setData(e.target.value)}
                                className='text-xs text-white w-full bg-neutral-900 focus:outline-none' 
                                />
                                <button type='submit' className='px-2 cursor-pointer text-center focus:outline-none'>{isLoading === true ? <Loader2 size={14} className='opacity-60 size-4 cursor-pointer animate-spin' /> : <Send size={14} className='size-4 cursor-pointer' />}</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            <div className='overflow-y-auto scrollbar-hide h-auto max-h-screen'>
            {showquestion ? 
            <div className='py-2'>
                <div className='px-2 py-1'> 
                    <p className='text-sm bg-neutral-800 px-6 py-1 rounded'>{question}</p>
                </div>

                <div className='px-3 py-1'>
                    {showImage ? 
                    <div className='flex flex-col gap-1'>
                        <LucideCopyPlus className='size-3 cursor-pointer' onClick={() => setShowImage(!showImage)}/>
                        <ScrollArea className="w-full whitespace-nowrap rounded-md">
                            <div className="flex w-max space-x-4 p-4">
                                {sourceLink.map((metadata : any,idx : number) => (
                                <figure key={idx} className="shrink-0">
                                    {metadata.metatags.map((link : any,index : number) => (
                                    <div key={index} className='flex flex-col gap-1'>
                                        <div className="overflow-hidden rounded-md">
                                        
                                        { link["og:image"] && link["og:title"] ?
                                        <Link href={`${link["og:url"]}`}>
                                            <img src={link["og:image"]} alt={link["og:title"]} 
                                             height={40} 
                                            className='rounded-md shadow w-24 min-w-20 max-w-32 max-h-12 shadow-neutral-300 aspect-[3/4]  object-cover' />
                                        </Link> : '' }

                                        </div>
                                        <figcaption className="text-[9px] text-white text-muted-foreground">
                                            <p className="opacity-85 text-foreground">
                                            {
                                            link["og:image"] && link["og:title"] ?
                                                <span className='text-white'>
                                                    <Link href={`${link["og:url"]}`}>
                                                        {reducetext(link["og:title"],30)}
                                                    </Link>
                                                </span> : ''}
                                        </p>
                                        </figcaption>
                                    </div>
                                    ))} 

                                </figure>
                                ))}
                            </div>
                            <ScrollBar orientation="horizontal" />
                        </ScrollArea>
                    </div> : <LucideCopyPlus className='size-3 cursor-pointer' onClick={() => setShowImage(!showImage)}/> }
                </div>

                <div className='text-xs'>
                    <div className='pt-4 pl-3 pr-3 pb-2'>
                    <Markdown text={message} />
                    </div>
                </div>
            </div> : "" }
            </div>

        </div>
    </div>
  )
}