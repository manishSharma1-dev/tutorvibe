import Dashboard_Image from "@/public/project-1.png"
import Image from "next/image"

export default function Header() {
  return (
    <div>
     <h1 className="font-bold font-sans pt-10 text-5xl text-center">Get Best Content for Your Topic.</h1>
     <p className="text-center pt-5 text-lg px-56">Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquam excepturi labore voluptatibus vero repellat quidem nesciunt et, cupiditate laudantium, dolorum quo tenetur.</p>
     <div className="flex justify-center item-center gap-10 pt-10 pb-16">
        <button className="btn-classes px-5 py-1 shadow-md shadow-neutral-400 rounded-md text-center">Try for Free</button>
        <button className="btn-classes px-5 py-1 shadow-md shadow-neutral-400 rounded-md text-center">* on Github</button>
     </div>
     <div className="flex justify-center px-36">
      <Image src={Dashboard_Image} alt="Dashboard" className="border border-black " />
     </div>
    </div>
  )
}
