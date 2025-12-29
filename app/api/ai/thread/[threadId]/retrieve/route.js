import { retrieveRun } from "@/app/lib/openai";
export async function GET(req, {params}) {
    const searchParams = req.nextUrl.searchParams

    const streamId = params.threadId
    const runId = searchParams.get('runId')

    const response = await retrieveRun(streamId, runId);
    
    console.log(response)

    let currMessage = response.content[0].text.value

    let index = currMessage.indexOf('【');
    if (index !== -1) {
        currMessage = currMessage.substring(0, index) + '.';
    }
    
    console.log(currMessage)

    return Response.json({response: {
        id: response.id,
        message: currMessage
    }})   
}