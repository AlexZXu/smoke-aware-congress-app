import { createThread } from "@/app/lib/openai"

export async function GET() {
    const streamId = await createThread();

    return Response.json({streamId: streamId})
}