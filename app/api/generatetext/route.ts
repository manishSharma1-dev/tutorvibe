import { ApiError } from "next/dist/server/api-utils"
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request: Request){
   try {

     const data  = await request.json()
 
     if(!data || data.lenght === 0 ) throw new Error("Invalid Query")
 
         // in this step maybe i willl pass this prompt to the search api and get some respomse form the api  and we called it result 
 
        const frontend_data_received =  await Search_web(data)

        if(!frontend_data_received || frontend_data_received.lenght === 0 )throw new Error("Google console response -failed")

        // console.log("Google console result -sucess",frontend_data_received?.items)
 
        // now in this steps we extract some response from the result that we get
 
        const {context_value,pageMetadata} = await extract_web_result(frontend_data_received?.items)

        if(!context_value || context_value.length === 0) throw new Error("Context exraction faield")

        console.log("Context Data -success")
        console.log("LinkArray Data -success")
        console.log("Pageimage Data -success")

        // now passing the result tot the gpt 

        const apikey : any  = process.env.GOOGLE_GENERATIVE_AI_API_KEY

        const genAI = new GoogleGenerativeAI(apikey);

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const all_data = `${data}and ${context_value}`

        const result = await model.generateContent(all_data);

        if(!result){
            throw new ApiError(500,"reponse genration failed")
        }

        const actual_response = await result.response.text()

        return Response.json(
            {
                success  :true,
                message  : " gpt reponse fetched -success",
                data  : actual_response,
                pageMetadata  :pageMetadata
            },
            {
                status  : 200
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

            // const linksArray = data.map((links : any, index  :any ) => {
            //     if(!links?.formattedUrl){
            //         return null
            //     }

            //     return links?.formattedUrl
            // })

            const pageMetadata = data.map((image : any ,index : any ) => {
                if(!image?.pagemap){
                    return null
                }

                return image?.pagemap
            })

            const context_value = data.reduce((acc  :any, result  :any ) => {
                if (result?.snippet) {
                    return acc + ' ' + result.snippet;
                } else {
                    return acc;
                }
            }, '').trim();

            if(context_value.length === 0) throw new ApiError(500,"failed -context extraction")

            console.log("Context data fetched successfully : ")

        return {context_value,pageMetadata}

    } catch (error) {
        console.error("Extracting text from reasult -failed",error)
        throw new ApiError(
            500,
            `Extracting text -Failed: ${error}`
        )
    }
}

