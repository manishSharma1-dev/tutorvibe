import { ApiError } from "next/dist/server/api-utils"
import { NextResponse } from "next/server"

async function POST(req:Request) {
  try {

    const { query } = await req.json()

    if(!query && query.lenght < 0 ){
        throw new ApiError(500,"query issue, query not found / quey invalid")
    }

    const response = await fetch('/api/yt-search')
    const data = await response.json()

    return new NextResponse(data)
     
  } catch (error) {
    console.error("Failed to fetch -yt result",error)
    throw new ApiError(
        500,
        `Failed fetching -yt result: ${error}`
    )
  }
}