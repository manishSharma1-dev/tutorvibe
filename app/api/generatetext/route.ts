import { ApiError } from "next/dist/server/api-utils"

export async function POST(request: Request){
   try {
     const { query }  = await request.json()

     console.log("query we have recieved",query)
 
     if(!query && query.lenght === 0 ) throw new Error("Invalid Query")
 
         // in this step maybe i willl pass this query to the search api and get some respomse form the api  and we called it result 
 
         const data : undefined = await Search_web(query)
         console.log("Data : ",data)

         return Response.json(
            {
                sucess : true,
                message  : `Data fetched Successfully : ${data}`
            },
            {
                status : 200
            }
         )

 
        //  // now in this steps we extract some response from the result that we get
 
        //  const context = await extract_web_result(result)
         
        //  // Now when i have the context text , as well as the query, then i will now pass it to function to generate some actual reponse from the api 
 
        //  const actual_result = await responsefrom_the_gpt(result,context)
 
        //  // now return this actual text to the frontend 
 
        //  return new NextResponse(actual_result)
   } catch (error) {
     console.error("Text generation -failed",error)
     throw new ApiError(500,`text generation -failed : ${error}`)
   }
        
}

// interface web_result{
//     text : string;
//     source : string[];
// }

// this step is for the custom search api part 
async function Search_web(text:string) : Promise<any> {
    try {
        console.log("text we recived from the frontend : ",text)
        if(!text && text.length === 0) throw new Error("Text Issue ( invalid text / text not present )")
            console.log("GSCJ : ", process.env.GOOGLE_SEARCH_API_KEY)
            console.log("search engine : ", process.env.GOOGLE_SEARCH_ENGINE_ID)
            // :omuauf_lfve
            const response = await fetch(`https://www.googleapis.com/customsearch/v1?key=${process.env.GOOGLE_SEARCH_API_KEY}&cx=${process.env.GOOGLE_SEARCH_ENGINE_ID}&q=${text}`)
 
            console.log("wat the repsonse is : ",response)

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

// async function extract_web_result(result_text:any) {
//     try {
//         if(!result_text && result_text.length > 0) throw new Error("result_text Issue ( invalid text / text not present )")

//             // will handle here text extraction part , i dont knoe how i will because no respone yet , but will handle it soon for now let return some response from here o that i can continue ... 

//             const context_result : string = "Here will be the extracted  text part ";
//             return context_result


//     } catch (error) {
//         console.error("Extracting text from reasult -failed",error)
//         throw new ApiError(
//             500,
//             `Extracting text -Failed: ${error}`
//         )
//     }
// }

// async function responsefrom_the_gpt(result:any,context : any) {
//     try {
//         if(!result && !context) throw new ApiError(400,"text -issue, Not present")
    
//         if (result.lenght < 0 && context.lenght < 0 ) throw new ApiError(400,"text -issue, Invalid tezt")
    
//             // here i will vercel sdk for genrating streaming response from the gpt 
    
//             //some function will be there by gpt which will require some text and generate some respose for us 

//             const gpt_generate_response = (text : any,context : any) => {
//                 let gpt_res : string  = `some response will be there ${text} and ${context}`
//                 return gpt_res
//             }

//             const response = gpt_generate_response(result,context)

//             return response

//     } catch (error) {
        
//     }
// }