import React from 'react'

export default function page() {
  return (
    <div className='p-1 min-h-screen'>
        <h1 className='font-bold font-[] text-xl pl-12 pt-3 '>Get Best peice of content for your topics.</h1>
        <div className='flex gap-5 justify-between pl-12 pr-12 pt-5'>

            <div className='w-[50%]'>
                <div className=' flex items-center gap-2 bg-black text-white shadow shadow-neutral-400 rounded-lg px-2'>
                    <input type="text" placeholder='Enter text' className=' bg-black px-1 py-[6px] w-[100%] focus:outline-none placeholder:text-white  text-sm ' />
                    <p className='text-xl cursor-pointer text-center'>+</p>
                </div>
                <div className='border border-black mt-1 min-h-[35rem] max-h-screen h-auto rounded-md px-2 '>
                    this is where content will be serverd 
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
