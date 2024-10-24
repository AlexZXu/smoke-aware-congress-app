"use client"

import PageWrapper from "../PageWrapper";
import React from "react";
import { FaArrowUp } from "react-icons/fa";

export default function AnalyzePage() {
    const [currMessage, setCurrMessage] = React.useState("");
    const [streamId, setStreamId] = React.useState("");
    const [aiResponse, setAiResponse] = React.useState("");
    const [startDate, setStartDate] = React.useState("");
    const [endDate, setEndDate] = React.useState("");
    const [fileList, setFileList] = React.useState([]);
    const [messagesList, setMessagesList] = React.useState([]);

    React.useEffect(() => {
        const startThread = async () => {
            const res = await fetch("/api/ai/create-thread")
            const data = await res.json()
            setStreamId(data.streamId)

            return data.streamId
        }

        startThread()

        //get variable from session storage & consume
        const retrievedFileList = JSON.parse(sessionStorage.getItem("fileList"))

        sessionStorage.removeItem("fileList");

        const retrievedStartDate = sessionStorage.getItem("startDate")
        sessionStorage.removeItem("startDate")

        const retrievedEndDate = sessionStorage.getItem("endDate")
        sessionStorage.removeItem("endDate")

        const retrievedMessageList = JSON.parse(localStorage.getItem("messageList") || "[]")
        if (retrievedFileList != null) {
            console.log(retrievedFileList)
            setFileList(retrievedFileList)
        }
        if (retrievedStartDate != null) {
            setStartDate(retrievedStartDate)
        }
        if (retrievedEndDate != null) {
            setEndDate(retrievedEndDate)
        }
        if (retrievedMessageList != null) {
            setMessagesList(retrievedMessageList)
        }
    }, [])


    async function messageAi() {
        const resMessage = await fetch(`/api/ai/thread/${streamId}/create-message?message=${currMessage}`)
        const dataMessage = await resMessage.json()
        const messageId = dataMessage.messageId


        //code to augment message with more information for ai
        let augmentMessage = currMessage
        if (startDate != "" && endDate != "") {
            augmentMessage += `focus on ${startDate} to ${endDate}`
        }

        for (const file of fileList) {
            let blob = await fetch(file.url).then(r => r.blob());

            augmentMessage += await blob.text()
        }

        console.log(augmentMessage)

        setMessagesList((messageList) => [...messageList, {
            type: "user",
            id: messageId,
            message: currMessage
        }]);

        setCurrMessage("");

        //sleep for 200ms
        await new Promise(r => setTimeout(r, 500));

        setMessagesList((messageList) => [...messageList, {
            type: "assistant",
            id: "temp",
            message: ""
        }]);

        const resRun = await fetch(`/api/ai/thread/${streamId}/run?message=${messageId}`)
        const dataRun = await resRun.json()
        const runId = dataRun.runId

        const resRetrieve = await fetch(`/api/ai/thread/${streamId}/retrieve?runId=${runId}&messageId=${messageId}`)
        const dataRetrieve = await resRetrieve.json()        
        setAiResponse(dataRetrieve.response);

        await setMessagesList((messageList) => [...messageList.slice(0, -1), {
            type: "assistant", 
            id: dataRetrieve.response.id,
            message: dataRetrieve.response.message
        }])

        const currState = JSON.parse(localStorage.getItem("messageList") || "[]");
        currState.push({
            type: "user",
            id: messageId,
            message: currMessage
        })
        currState.push({
            type: "assistant", 
            id: dataRetrieve.response.id,
            message: dataRetrieve.response.message
        })

        localStorage.setItem("messageList", JSON.stringify(currState))
    }

    function resetMessages() {
        localStorage.clear("messageList");
        setMessagesList([]);
    }

    return (
        <PageWrapper currType={"ai"}>
            <div className="w-full bg-slate-950 rounded-xl shadow shadow-slate-400/35 flex flex-col items-center border border-slate-800 h-full min-h-0">
                <div className="border-b bg-slate-900 border-slate-700 w-full h-12 p-2 px-6 flex items-center justify-between font-bold tracking-wide text-slate-200 text-lg rounded-t-xl">
                    <div>Smoke Aware Assistant</div>
                    <div>
                        <button className="bg-slate-600 px-4 rounded font-normal tracking-normal" onClick={resetMessages}>
                            Reset Messages
                        </button>
                    </div>
                </div>
                <div className={`w-full h-full overflow-auto scrollbar-thin scrollbar-track-slate-600 scrollbar-thumb-gray-200 scrollbar-thumb-rounded-full scrollbar-track-rounded-full p-6 flex flex-col min-h-0 ${messagesList.length == 0 && "justify-center"}`}>
                    {
                        messagesList.map((el) => 
                            <div key={el.id} className={`w-full flex ${el.type == "user" ? "justify-end" : "justify-start"}`}>
                                <div className={`flex flex-col gap-1 w-full ${el.type == "user" ? "items-end" : "items-start"}`}>
                                    <div className="text-slate-400 font-semibold">
                                        {
                                            el.type == "user" ? 
                                            "User" : 
                                            "Assistant"
                                        }
                                    </div>
                                    <div className="border border-slate-700 rounded-md p-2 px-4 bg-slate-800 max-w-[70%]">
                                            {el.message == "" ? 
                                                <div>
                                                    <div className="animate-spin size-6 border-2 border-current border-t-transparent text-gray-400 rounded-full m-auto relative" role="status" aria-label="loading">
                                                        <span className="sr-only">Loading...</span>
                                                    </div>
                                                </div>
                                                :
                                                el.message
                                            }
                                    </div>
                                </div>
                            </div>
                        )
                    }
                    {
                        messagesList.length == 0 && 
                        <div className="text-slate-500 font-bold text-lg text-center">
                            Ask the Assistant something!
                        </div>
                    }
                </div>
            </div>
            <div className="w-full bg-slate-950 rounded-xl shadow shadow-slate-400/35 flex flex-col items-center p-2.5 border border-slate-900 gap-4">
                <div>
                    <div className="flex items-center gap-4">
                        <div className="font-medium text-center text-base text-slate-300">
                            Specify a date range: 
                        </div>
                        <div className="flex items-center gap-2">
                            <input type="date" value={startDate} onChange={(e) => {setStartDate(e.target.value)}} className="text-slate-50 w-full placeholder:text-slate-500 bg-slate-950 shadow-md shadow-slate-200/25 border border-cyan-200 rounded-md p-2 px-3 [&::-webkit-calendar-picker-indicator]:invert [&::calendar-picker-indicator]:invert text-[15px]"/>
                            <div className="text-slate-200">-</div>
                            <input type="date" value={endDate} onChange={(e) => {setEndDate(e.target.value)}} className="text-slate-50 w-full placeholder:text-slate-500 bg-slate-950 shadow-md shadow-slate-200/25 border border-cyan-200 rounded-md p-2 px-3 [&::-webkit-calendar-picker-indicator]:invert [&::calendar-picker-indicator]:invert text-[15px]"/>
                        </div>
                    </div>
                </div>
                {
                    fileList.length > 0 && 
                    <div>
                        <div className="flex items-center gap-4">
                            <div className="font-medium text-center text-base text-slate-300 overflow-auto flex gap-2 items-center">
                                Imported Files: 
                                {
                                    fileList.map((el) => 
                                        <div key={el.url} className="text-xs bg-slate-600 rounded-full px-2 py-1">{el.fileDate}-summary.csv</div>
                                    )
                                }
                            </div>
                        </div>
                    </div>
                }
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