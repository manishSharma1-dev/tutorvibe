import Dashboard_Image from "@/public/project-1.png"
import Image from "next/image"
import Link from "next/link"
import { Star} from "lucide-react"

export default function Header() {
  return (
    <div>
     <h1 className="font-bold font-sans pt-10 text-5xl text-center">Tutor vibe</h1>
     <div className="flex justify-center mt-7">
       <p className=" text-sm font-semibold shadow shadow-neutral-400 pl-3 pr-3 pt-1 pb-1 rounded-md">Using Gemini for Text Genenation.</p>
     </div>
     <p className="text-center pt-5 text-lg px-56">Get Best Content for Your Topic..</p>
     <p className="text-center pt-5 text-lg px-56">Tutorvibe is a powerful tool that extracts meaningful <span className="bg-yellow-200">context from web search results.</span> It takes the bits and pieces from search results and puts them together in a way that's easy to understand.</p>
     <div className="flex justify-center item-center gap-10 pt-10 pb-16">
        <button className="btn-classes pl-4 pr-4 py-1 shadow-md shadow-neutral-400 rounded-md text-center focus:opacity-50"><Link href={'/dashboard'}>Try it</Link></button>
        <button className="btn-classes px-5 py-1 shadow-md shadow-neutral-400 rounded-md text-center"><Link className="flex items-center justify-center gap-1" href={'https://github.com/manishSharma1-dev'}><Star size={10} />on Github</Link></button>
     </div>
     <div className="flex justify-center px-36">
      <Image src={Dashboard_Image} alt="Dashboard" className="border border-black " />
     </div>
    </div>
  )
}
