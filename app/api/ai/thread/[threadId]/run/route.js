import { runThread } from "@/app/lib/openai"

export async function GET(req, {params}) {
    const streamId = params.threadId
    console.log(streamId)
    const runId = await runThread(streamId);
    console.log(runId)
    return Response.json({runId: runId})
}