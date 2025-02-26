import Dashboard_Image from "@/public/dashboard_example.png"
import Github_Image from "@/public/github.png"
import Image from "next/image"
import Link from "next/link"

export default function Header() {
  return (
    <div>
     <h1 className="font-semibold font-sans my-8 text-4xl text-center">Tutor vibe</h1>
     <p className="text-center text-sm px-56">Get Best Content for Your Topic..</p>
     <p className="text-center pt-5 text-xs px-56">Tutorvibe is a powerful tool that extracts meaningful <span className="bg-yellow-200">context from web search results.</span> It takes the bits and pieces from search results and puts them together in a way that's easy to understand.</p>

     <div className="flex justify-center item-center gap-8 py-10">
        <button className="btn-classes shadow-md shadow-neutral-400 rounded-md text-center text-xs px-7 py-2 focus:opacity-50 hover:bg-neutral-700">
          <Link href={'/dashboard'}>Try it</Link>
        </button>
        <button className="btn-classes px-5 py-2 shadow-md shadow-neutral-400 rounded-md text-center hover:bg-neutral-700">
          <Link className="flex items-center justify-center gap-1" target="_blank" href={'https://github.com/manishSharma1-dev/tutorvibe'}>
            <Image src={Github_Image} alt="Github_logo" className="object-cover size-4" />
            <span className="text-xs">on Github</span>
          </Link>
        </button>
     </div>

     <div className="flex justify-center px-36">
      <Image src={Dashboard_Image} alt="Dashboard" className="border border-black border-opacity-25 pb-5 mb-5" />
     </div>
    </div>
  )
}
