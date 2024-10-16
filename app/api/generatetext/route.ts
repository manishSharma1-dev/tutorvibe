import { ApiError } from "next/dist/server/api-utils"
import { GoogleGenerativeAI } from "@google/generative-ai";
import NodeCache from "node-cache"

const myCache = new NodeCache(); // node cache instance 

interface cachedData {
    actual_response : any;
    pageMetadata  :any;
}

export async function POST(request: Request){
   try {

     const data  = await request.json()
 
     if(!data || data.lenght === 0 ) throw new Error("Invalid Query")
 
         // in this step maybe i willl pass this prompt to the search api and get some respomse form the api  and we called it result 

        const cacheKey = JSON.stringify(data); // key for storing data 

        const cachedData  = myCache.get<cachedData>(cacheKey) //Storing the cache result
        console.log("cached Data : ")

        if(cachedData ){
            console.log("Data found in the cached Result")

            return Response.json(
                {
                    success : true,
                    messgae : "Data found in the Cached result",
                    data  : cachedData.actual_response, 
                    pageMetadata  :cachedData.pageMetadata
                },
                {
                    status : 200
                }
            )
        } else {

            const frontend_data_received =  await Search_web(data)

            if(!frontend_data_received || frontend_data_received.lenght === 0 ) throw new Error("Google console response -failed")
     
            // now in this steps we extract some response from the result that we get
     
            const { pageMetadata } = await extract_web_result(frontend_data_received?.items)
    
            if(!pageMetadata || pageMetadata.length === 0) throw new Error("Context exraction faield")
    
            console.log("Pageimage Data -success")
    
            // now passing the result tot the gpt 
    
            const apikey : any  = process.env.GOOGLE_GENERATIVE_AI_API_KEY
    
            const genAI = await new GoogleGenerativeAI(apikey);
    
            const model = await genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
            const all_data = data
    
            const result = await model.generateContent(all_data);
    
            if(!result){
                throw new ApiError(500,"reponse genration failed")
            }
    
            const actual_response = await result.response.text()

            myCache.set(cacheKey,{actual_response,pageMetadata},3600) //setting cache data here 
    
            return Response.json(
                {
                    success  :true,
                    message  : " gpt reponse fetched -success",
                    data  : actual_response, // gemini response
                    pageMetadata  :pageMetadata // google websearch response
                },
                {
                    status  : 200
                }
            )

        }

   } catch (error) {
     console.error("Text generation -failed",error)
     throw new ApiError(500,`text generation -failed : ${error}`)
   }
        
}


// this step is for the custom search api part 
async function Search_web(text:string) : Promise<any> {
    try {
        console.log("text we recived from the frontend : ",text)

        if(!text && text.length === 0) throw new Error("Text Issue ( invalid text / text not present )")

            const response = await fetch(`https://www.googleapis.com/customsearch/v1?key=${process.env.GOOGLE_SEARCH_API_KEY}&cx=${process.env.GOOGLE_SEARCH_ENGINE_ID}&q=${text}`)
 

            if(!response.ok){
                throw new ApiError(500,"Invalid Response")
            }
    
            const data = await response.json()
    
            console.log("Data -fetched success")
    
            return data 
    
    } catch (error) {
        console.error("Search engine data fteching -failed",error)

        throw new ApiError(
            500,
            `Search engine data fetching failed : ${error}`
        )
    }
}

// this steps is for extracting some info from the result and return some context_text 

async function extract_web_result(data:any) {
    try {
        if(!data || data.length === 0) throw new Error("result_text Issue ( invalid text / text not present )")

            const pageMetadata = await data.map((image : any ,index : any ) => {
                if(!image?.pagemap){
                    return null
                }

                return image?.pagemap
            })

            console.log("Context,pagemetadata data fetched successfully : ")

        return {pageMetadata}

    } catch (error) {
        console.error("Extracting text from reasult -failed",error)
        throw new ApiError(
            500,
            `Extracting text -Failed: ${error}`
        )
    }
}

