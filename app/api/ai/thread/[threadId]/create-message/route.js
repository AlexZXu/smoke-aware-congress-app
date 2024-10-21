import { threadAddMessage } from "@/app/lib/openai"

export async function GET(req, {params}) {
    const streamId = params.threadId
    const searchParams = req.nextUrl.searchParams

    const input = searchParams.get('message')

    const messageId = await threadAddMessage(streamId, input)

    return Response.json({messageId: messageId})
}