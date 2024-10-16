"use client"

import Markdown from '@/components/Markdown'
import { ApiError } from 'next/dist/server/api-utils'
import React, { FormEvent, useState } from 'react'
import { Skeleton } from "@/components/ui/skeleton"
import { Send } from 'lucide-react'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'

export default function page() {
    const [data,setData] = useState([])
    const [message,setMessage] = useState('')
    const [isLoading,setisLoading] = useState(false)
    const [sourceLink,setSourceLinks] = useState([])

    async function handleSubmit(e: FormEvent<HTMLFormElement>){
       try {
            e.preventDefault(); 
            setisLoading(true)
    
            const response = await fetch('http://localhost:3000/api/generatetext', {
                method : 'POST',
                headers : {
                    'Content-Type': 'application/json'
                },
                body : JSON.stringify(data)
            })
    
            if(!response.ok){
                throw new ApiError(
                    500,
                    "reponse doen't received"
                )
            }
    
            const result = await response.json()
    
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
    <div className='p-1 min-h-screen gridlinesdesign'>
        <h1 className='font-[20px]font-[] text-xl pl-12 pt-3 '>Get Best peice of content for your <span className='bg-yellow-200 p-1'>topics</span>.</h1>
        <div className='flex gap-5 justify-between pl-12 pr-12 pt-5'>

            <div className='w-[50%]'>
                <form onSubmit={handleSubmit}>
                    <div className=' flex  items-center gap-2 bg-black text-white shadow shadow-neutral-400 rounded-lg px-2'>
                        <input type="text" placeholder='Enter text' value={data} onChange={(e) =>{
                            const props  : any = e.target.value
                            setData(props)
                        }} className=' bg-black pt-2  pb-2 pl-3 pr-3 w-[100%] focus:outline-none placeholder:text-white  text-sm ' />
                        <button type='submit' className='pl-3 pr-3 text-xl cursor-pointer text-center focus:outline-none'>{isLoading === true ? <Loader2 size={14} className='animate-spin' /> : <Send size={14} />}</button>
                    </div>
                </form>
                <div className='border overflow-y-auto scrollbar-hide border-black mt-1 min-h-[40rem] max-h-screen h-auto rounded-md px-2 '>
                    <div className='pt-4 pl-3 pr-3 pb-2'>
                        {isLoading === true?<SkeletonCard /> : <Markdown text={message} />}
                    </div>
                </div>
            </div>

            <div className='w-[50%] h-[100%]'>
                <div className='flex flex-col gap-1'>
                    <div className='min-h-[42.5rem] max-h-screen overflow-y-auto overflow-x-hidden h-auto border border-black rounded-md pt-4 pl-5 pr-20 pb-2'>
                        <p className='underline underline-offset-4 bg-yellow-200 text-lg inline p-2'>Some useful resources ...</p>
                         {isLoading === true ? ( <div className='mt-4'><SkeletonCard /></div>) : ( <div className='flex flex-wrap flex-col mt-5 gap-4'> {Array.isArray(sourceLink) &&  sourceLink.map((metadata : any , index : any) => ( 
                            <div key={index}>

                                {Array.isArray(metadata?.metatags) && metadata.metatags.map((link  :any,index : any ) => (

                                        <div key={index}>
                                            <div className='flex gap-6'>
                                                { link["og:image"] && link["og:title"] ?  <Link href={`${link["og:url"]}`}> <img src={link["og:image"]} alt={link["og:title"]} width={140} height={130} className='rounded-md max-h-[80px] max-w-[90px] shadow shadow-neutral-300 object-cover' ></img> </Link> : '' }

                                                {link["og:image"] && link["og:title"] ? <p><Link href={`${link["og:url"]}`}>{reducetext(link["og:title"],70)}</Link></p> : ''}
                                            </div>
                                        </div>

                                ))}
                                
                            </div>
                         ))} </div> ) }
                    </div>
                </div>
            </div>

        </div>
    </div>
  )
}

{/* <> <div className='bg-black text-white shadow shadow-neutral-300 w-50 h-20 rounded-md flex justify-center items-center text-sm'><p>Image not present.</p></div></> */}
