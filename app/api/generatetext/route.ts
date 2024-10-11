import { ApiError } from "next/dist/server/api-utils"
import {  convertToCoreMessages,streamText } from "ai";
import { createGoogleGenerativeAI, google } from "@ai-sdk/google";


export async function POST(request: Request){
   try {
     const { query }  = await request.json()

     console.log("query we have recieved",query)
 
     if(!query || query.lenght === 0 ) throw new Error("Invalid Query")
 
         // in this step maybe i willl pass this query to the search api and get some respomse form the api  and we called it result 
 
         const data =  await Search_web(query)

         if(!data || data.lenght === 0 )throw new Error("Google console response -failed")

         console.log("Google console result -sucess")
        //  return Response.json(
        //     {
        //         sucess : true,
        //         message  : `Data fetched Successfully : ${data}`
        //     },
        //     {
        //         status : 200
        //     }
        //  )

 
         // now in this steps we extract some response from the result that we get
 
         const context = await extract_web_result(data?.items)

         if(!context || context.length === 0) throw new Error("Context exraction faield")

          console.log("Context Data -success")

        //  return Response.json(
        //     {
        //         sucess : true,
        //         message  : `Context fetched Successfully : ${context}`
        //     },
        //     {
        //         status : 200
        //     }
        //  )
         
         // Now when i have the context text , as well as the query, then i will now pass it to function to generate some actual reponse from the api 

 
         const actual_result : any  = await responsefrom_the_gpt(data,context)

         if(!actual_result || actual_result.length === 0) {
            throw new ApiError(400,"Gemini reponse -failed")
         }

         console.log("acttual_result",actual_result)

        return Response.json(
            {
                sucess : true,
                message  : "Gpt Response - success",
                data : actual_result
            },
            {
                status : 200
            }
        ) 

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

            const context_value = data.reduce((acc  :any, result  :any ) => {
                if (result?.snippet) {
                    return acc + ' ' + result.snippet;
                } else if (result?.title) {
                    return acc + ' ' + result.title;
                }
                return acc;
            }, '').trim();

            if(context_value.length === 0) throw new ApiError(500,"failed -context extraction")

            console.log("Context data fetched successfully : ")

        return context_value

    } catch (error) {
        console.error("Extracting text from reasult -failed",error)
        throw new ApiError(
            500,
            `Extracting text -Failed: ${error}`
        )
    }
}

async function responsefrom_the_gpt(data:any,context : any) {
    try {

        if(!data && !context) throw new ApiError(400,"text -issue, Not present")
    
        if (data.length === 0 && context.length === 0 ) throw new ApiError(400,"text -issue, Invalid tezt")

        const apikey : any = process.env.GOOGLE_GENERATIVE_AI_API_KEY

        const genai = createGoogleGenerativeAI(apikey)

        const model = google("gemini-1.5-flash") //gemini-1.5-pro-latest

        console.log("model choose successfully") 

        const alldata : any = `${data} ${context}`

        const messages : any = [
           {role : "user", content:alldata}
        ]

        const response = await streamText({
            model : model,
            messages : messages
        })

        if (!response) {
            throw new ApiError(500, "Response does not generate by the backend Gemini API");
        }

        // for await (const textPart of response.textStream) {
        //     console.log("DAtA GENERATED BY THE GEMINI API : ",textPart);
        // }
        
        return response.textStream

        
    } catch (error) {
        console.error("GPt Reposne generation -failed",error)

        return new ApiError(
            500,
            `GPT -respose generation -failed : ${error}`
        )
    }
}