
import { OpenAI } from "openai";

export const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    organization: "org-HdxAV4KwS86qPg9AEZs0xSu0",
    project: "proj_tl4D1Y4uKe8guM5OZtPdaucu"
})




//create assistant thread
export async function createThread() {
    const thread = await openai.beta.threads.create();

    //return id of thread
    return thread.id
}

//input id of thread and user text input
export async function threadAddMessage(thread_id, input) {
    //add new message to thread
    const message = await openai.beta.threads.messages.create(
        thread_id,
        {
            role: "user",
            content: input //user input
        }
    )

    //return id of message
    return message.id
}

//run thread (functionally calling the ai to respond to the message)
export async function runThread(thread_id) {
    //run ai on message
    const run = await openai.beta.threads.runs.create(
        thread_id,
        {
            assistant_id: "asst_sYHlt6GDF9ybvywq2xqrIlwj", //assistant id invokes the custom model
        }
    );

    //return id of run
    return run.id
}

//retrieving run (getting the response from the ai)
export async function retrieveRun(threadId, runId) {
    //save variable to catch ai response
    let response = "";

    //while still waiting for response
    while (true) {
        //retrieve current run
        const keepRetrievingRun = await openai.beta.threads.runs.retrieve(
            threadId,
            runId
        );

        //if ai response is completed
        if (keepRetrievingRun.status === "completed") {
            //retrieve the messages added by the assistant to the thread
            const allMessages = await openai.beta.threads.messages.list(
                threadId
            );


            //save assistant message
            response = allMessages.data[0]

            //break
            break;
        } 
        else if (keepRetrievingRun.status === "queued" || keepRetrievingRun.status === "in_progress") {
            //skip if still queued or in progress
        } 
        else {
            //break because some error occured
            response = "Request Failed";
            break;
        }
    }

    //return ai text response
    return response
}

