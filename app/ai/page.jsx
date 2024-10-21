"use client"

import PageWrapper from "../PageWrapper";
import React from "react";
import { FaArrowUp } from "react-icons/fa";

export default function AnalyzePage() {
    const [currMessage, setCurrMessage] = React.useState("");
    const [streamId, setStreamId] = React.useState("");

    React.useEffect(() => {
        const startThread = async () => {
            const res = await fetch("/api/ai/create-thread")
            const data = await res.json()
            setStreamId(data.streamId)

            return data.streamId
        }

        startThread()
    }, [])


    async function messageAi() {
        const resMessage = await fetch(`/api/ai/thread/${streamId}/create-message?message=${currMessage}`)
        const dataMessage = await resMessage.json()
        const messageId = dataMessage.messageId

        const resRun = await fetch(`/api/ai/thread/${streamId}/run?message=${messageId}`)
        const dataRun = await resRun.json()
        const runId = dataRun.runId

        console.log(messageId)
        console.log(runId)


    }

    return (
        <PageWrapper currType={"ai"}>
            <div className="w-full bg-slate-950 rounded-xl shadow shadow-slate-400/35 flex flex-col items-center p-2.5 border border-slate-900 h-full">
                {streamId}
                
            </div>
            <div className="w-full bg-slate-950 rounded-xl shadow shadow-slate-400/35 flex flex-col items-center p-2.5 border border-slate-900">
                <div className="w-full flex items-center gap-4 pr-1.5">
                    <textarea type="textarea" value={currMessage} onChange={(e) => {setCurrMessage(e.target.value)}} placeholder="Ask something!" rows="2" className="shadow-md shadow-slate-200/25 font-medium bg-slate-950 border border-cyan-200 text-white rounded-lg focus:border-cyan-400 outline-none block p-4 text-lg w-full resize-none"/>
                    <button className="text-white bg-sky-600 font-semibold rounded-lg px-6 py-2 shadow-md shadow-purple-500/25 h-fit flex items-center gap-2" onClick={messageAi}>
                        <FaArrowUp />
                        Enter
                    </button>
                </div>
            </div>
        </PageWrapper>
    )
  
}