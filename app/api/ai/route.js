import { openai } from "@/app/lib/openai"

export async function GET(req) {
    //get inputted message
    const searchParams = req.nextUrl.searchParams
    const message = searchParams.get('message')

    //set up call to ai
    const call = await openai.chat.completions.create({
        model: "gpt-3.5-turbo", //base model
        messages: [
            {
                role: "user", 
                content: message //post message 
            }
        ],
        temperature: 0.7
    })

    //get text response
    const response = call.choices[0]

    const run = await openai.beta.threads.runs.crea

    
    return Response.json({response: response})
}