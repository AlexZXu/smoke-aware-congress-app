
import { OpenAI } from "openai";

export const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    organization: "org-HdxAV4KwS86qPg9AEZs0xSu0",
    project: "proj_tl4D1Y4uKe8guM5OZtPdaucu"
})

export async function createThread() {
    const thread = await openai.beta.threads.create();

    return thread.id
}


export async function threadAddMessage(thread_id, input) {
    const message = await openai.beta.threads.messages.create(
        thread_id,
        {
            role: "user",
            content: input
        }
    )

    return message.id
}


export async function runThread(thread_id) {
    const run = await openai.beta.threads.runs.create(
        thread_id,
        {
            assistant_id: "asst_sYHlt6GDF9ybvywq2xqrIlwj",
        }
    );

    return run.id
}


export async function retrieveRun(threadId, runId, messageId) {
    while (true) {
        const keepRetrievingRun = await openai.beta.threads.runs.retrieve(
            (thread_id = threadId),
            (run_id = runId)
        );

        if (keepRetrievingRun.status === "completed") {
            // Retrieve the messages added by the assistant to the thread
            const allMessages = await openai.beta.threads.messages.retrieve(
                threadId,
                messageId
            );

            // Display assistant message
            console.log("Assistant: ", allMessages.data[0].content[0].text.value, "\n");

            break;
        } 
        else if (keepRetrievingRun.status === "queued" || keepRetrievingRun.status === "in_progress") {
            // Pass
        } 
        else {
            break;
        }
    }
}
