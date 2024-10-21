"use client" 

import PageWrapper from "../../PageWrapper"
import Link from "next/link"
import React from "react"
import { fetchAllStations } from "../../lib/services/fetch-methods"
import { writeSingleSmokeData } from "@/app/lib/services/file-methods"
import { IoMdDownload, IoMdEye, IoMdClose  } from "react-icons/io"
import { parse } from "csv-parse/sync"

//list of all stations fetch-methods file
const stations = fetchAllStations();

export default function FetchPage() {
    const [startDate, setStartDate] = React.useState("");
    const [endDate, setEndDate] = React.useState("");

    const [selectedName, setSelectedName] = React.useState("");
    const [selectedId, setSelectedId] = React.useState("");
    const [selectedVal, setSelectedVal] = React.useState("");
    const [tablePreviewOpened, setTablePreviewOpened] = React.useState(false);
    const [currPreviewData, setCurrPreviewData] = React.useState([]);

    const [fileList, setFileList] = React.useState([]);

    const dateRangeFetch = async () => {
        setFileList([]);
        const startDateObj = new Date(startDate);
        const endDateObj = new Date(endDate);
        
        const smokeObj = {id: selectedId, name: selectedName, lat: stations.find(obj => obj.stationId == selectedId).latitude, lng: stations.find(obj => obj.stationId == selectedId).longitude}

        for (var day = startDateObj; day <= endDateObj; day.setDate(day.getDate() + 1)) {
            const res = await writeSingleSmokeData(smokeObj, day);
            setFileList(prevFileList => [...prevFileList, res]);
        }
    }

    return (
        <PageWrapper currType={"fetch"}>
            <div className="w-full bg-slate-950 rounded-xl shadow-lg shadow-slate-400/25 flex flex-col items-center p-4 gap-2 justify-center border border-slate-800">
                <div className="text-2xl font-bold text-slate-100">
                    Fetch and Export Data
                </div>

                <div className="flex rounded-lg border border-gray-500 w-full mt-2">
                    <Link href="/fetch" className={`font-semibold w-full p-0.5 text-center rounded-md bg-transparent`}>Summary</Link>
                    <Link href="/fetch/smoke" className={`font-semibold w-full p-0.5 text-center rounded-md bg-blue-700`}>Singular</Link>
                </div>

                <div className="w-full border border-gray-500 rounded-lg flex flex-col p-2 mt-2 items-center">
                    <div className="font-semibold">Options</div>
                    <div className="w-full flex flex-col gap-4 items-center pt-2">
                        <div className="flex items-center gap-4">
                            <div className="font-medium text-center text-lg text-slate-200">
                                Select Smoke Monitor: 
                            </div>
                            <div className="flex items-center gap-2">
                                <select value={selectedVal} onChange={(e) => {setSelectedVal(e.target.value); setSelectedName(e.target.value.substring(0, e.target.value.indexOf("////"))); setSelectedId(e.target.value.substring(e.target.value.indexOf("////") + 4));}} className="shadow-md shadow-blue-400/20 font-medium bg-slate-950 border border-gray-400 text-white rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-1.5 px-2 text-purple-50">
                                    <option value="" disabled>Select Smoke Monitor</option>
                                    {
                                        stations.map((value) => 
                                            (<option key={value.stationId} value={value.name + "////" + value.stationId}>{value.name}</option>)
                                        )
                                    }
                                
                                </select>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="font-medium text-center text-base text-slate-300">
                                Date Range: 
                            </div>
                            <div className="flex items-center gap-2">
                                <input type="date" value={startDate} onChange={(e) => {setStartDate(e.target.value)}} className="text-slate-50 w-full placeholder:text-slate-500 bg-slate-950 border border-gray-500 rounded-md p-2 px-3 [&::-webkit-calendar-picker-indicator]:invert [&::calendar-picker-indicator]:invert text-[15px]"/>
                                <div className="text-slate-200">-</div>
                                <input type="date" value={endDate} onChange={(e) => {setEndDate(e.target.value)}} className="text-slate-50 w-full placeholder:text-slate-500 bg-slate-950 border border-gray-500 rounded-md p-2 px-3 [&::-webkit-calendar-picker-indicator]:invert [&::calendar-picker-indicator]:invert text-[15px]"/>
                            </div>
                        </div>
                        <button className="text-white bg-sky-600 font-semibold rounded-lg px-8 py-0.5 shadow-md shadow-purple-500/25 w-96" onClick={dateRangeFetch}>
                            Export
                        </button>
                    </div>
                </div>
            </div>
            <div className="w-full bg-slate-950 rounded-xl shadow-lg shadow-slate-400/25 flex flex-col items-center p-4 gap-2 border border-slate-800 h-full max-h-100 min-h-0">
                <div className="text-lg font-bold">Download Data</div>
                <div className="border border-slate-800 rounded-lg w-full h-full overflow-auto flex flex-col p-4 pt-3 scrollbar-thin scrollbar-track-slate-600 scrollbar-thumb-gray-200 scrollbar-thumb-rounded-full scrollbar-track-rounded-full flex flex-col">
                    {
                        fileList.length == 0 && 
                        <div className="text-slate-400 font-medium text-lg flex justify-center items-center h-full "><span className="-mt-4">Exported Files Will Appear Here</span></div>
                    }
                    {fileList.map((item) => {
                        return (
                            <div key={item.url} className="flex justify-between text-md border-b border-slate-600 items-center p-1">
                                <div><span className="text-slate-300">Day:</span> <span className="font-medium">{item.date}</span></div>
                                <div className="flex gap-3">
                                    <button onClick={
                                        async () => {
                                            let blob = await fetch(item.url).then(r => r.blob());
                                            let text = await blob.text();
                                            let csv = parse(text)

                                            setCurrPreviewData(csv);
                                            setTablePreviewOpened(true);
                                        }
                                        }><IoMdEye /></button>
                                    <a href={item.url} download={`smoke-${item.smokeId}-${item.fileDate}.csv`} className="font-medium text-lg"><IoMdDownload /></a>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
            {
                tablePreviewOpened &&
                <div className="absolute w-[calc(100%-80px)] h-[calc(100%-80px)] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-slate-950 shadow-xl shadow-slate-400/25 border border-slate-800 rounded-lg">
                    <div className="flex flex-col p-5 w-full h-full gap-5">
                        <div onClick={() => {setTablePreviewOpened(false)}} className="text-3xl cursor-pointer self-end">
                            <IoMdClose />
                        </div>
                        <div className="text-center font-bold text-xl text-violet-100">
                            Data Preview
                        </div>
                        <div className="h-fit min-h-0 w-full overflow-auto shadow-lg shadow-blue-400/30 border border-slate-800">
                            <table className="table-fixed border border-collapse text-xs">
                                <tbody className="border">
                                    {
                                        currPreviewData.map((val, id1) => {
                                            return (
                                                <tr key={val[2]} className="border h-8">
                                                    {val.map((el, id2) => {
                                                        if (id2 == 5 || id2 == 23) {
                                                            return (
                                                                <td key={[val[2], id2]} className="border max-w-32 truncate p-1">
                                                                    {
                                                                        id1 >= 2 && <a href={el}>Link</a>
                                                                       
                                                                    }
                                                                    
                                                                </td>
                                                            )
                                                        }
                                                        else {
                                                            return (
                                                                <td key={[val[2], id2]} className="border max-w-32 truncate p-1.5">
                                                                    {el}
                                                                </td>
                                                            )
                                                        }
                                                    })}
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                                
                            </table>
                        </div>
                    </div>
                    

                </div>
            }
            
        </PageWrapper>
    )
}