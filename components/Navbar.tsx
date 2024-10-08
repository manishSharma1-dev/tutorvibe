import logo from "@/public/github_profile.png"
import Image from "next/image"

export default function Navbar () {
  return (
    <div className="pl-10 pr-10 my-6">
      <div className="p-1 border-black border-2 rounded-2xl">
        <div className="flex items-center justify-between px-3 py-1">
          <Image src={logo} alt="Logo" className="w-8 aspect-auto rounded-[50%] border-2 border-orange-500" />
          <ul className="flex items-center gap-8 text-sm">
            <li>About</li>
            <li>let's start</li>
            <li className="bg-black shadow-md shadow-zinc-400 drop-shadow-lg rounded-md text-white px-2 py-1">Sign In</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
