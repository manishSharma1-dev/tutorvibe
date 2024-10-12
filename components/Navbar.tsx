import { MessageSquareQuoteIcon } from "lucide-react"
import Link from "next/link"

export default function Navbar () {
  return (
    <div className="pl-10 pr-10 my-6">
      <div className="p-1 ">
        <div className="flex items-center justify-between px-3 py-1">
          <div className="flex items-center gap-1 font-semibold text-sm">
            <p><MessageSquareQuoteIcon size={16}/></p>
            <p className="">Tutorvibe</p>
          </div>

          <ul className="flex items-center gap-8 text-sm">
            <li>About</li>
            <li className="cursor-pointer hover:bg-yellow-200 p-1 rounded hover:underline underline-offset-4"><Link href={'/dashboard'}>let's start</Link></li>
          </ul>
        </div>
      </div>
    </div>
  )
}
