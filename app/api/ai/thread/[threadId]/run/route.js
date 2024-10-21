import { runThread } from "@/app/lib/openai"

export async function GET(req, {params}) {
    const streamId = params.threadId
    console.log(streamId)
    const runId = await runThread(streamId);

    return Response.json({runId: runId})
}