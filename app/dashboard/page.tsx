"use client"

import { ApiError } from 'next/dist/server/api-utils'
import React, { FormEvent, useState } from 'react'

export default function page() {
    const [data,setData] = useState([])
    const [message,setMessage] = useState()

    async function handleSubmit(e: FormEvent<HTMLFormElement>){
        e.preventDefault(); 

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

        console.log("Reponse from the backend : ", response)

        const result = await response.json()

        console.log('Result : ',result.data)

        setMessage(result)
    }

  return (
    <div className='p-1 min-h-screen'>
        <h1 className='font-bold font-[] text-xl pl-12 pt-3 '>Get Best peice of content for your topics.</h1>
        <div className='flex gap-5 justify-between pl-12 pr-12 pt-5'>

            <div className='w-[50%]'>
                <form onSubmit={handleSubmit}>
                    <div className=' flex items-center gap-2 bg-black text-white shadow shadow-neutral-400 rounded-lg px-2'>
                        <input type="text" placeholder='Enter text' value={data} onChange={(e) =>{
                            const props  : any = e.target.value
                            setData(props)
                        }} className=' bg-black px-1 py-[6px] w-[100%] focus:outline-none placeholder:text-white  text-sm ' />
                        <button type='submit' className='text-xl cursor-pointer text-center'>+</button>
                    </div>
                </form>
                <div className='border border-black mt-1 min-h-[35rem] max-h-screen h-auto rounded-md px-2 '>
                content willl be generated here
                </div>
            </div>

            <div className='w-[50%] h-[100%]'>
                <div className='flex flex-col gap-1'>
                    <div className='min-h-[200px] h-auto border border-black rounded-md px-2 py-[.2rem]'>this i for some blog souce links </div>
                    <div className='border min-h-[392  px] border-black rounded-md px-2 py-[.2rem] '>this is for some yt video links</div>
                </div>
            </div>

        </div>
    </div>
  )
}
