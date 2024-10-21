"use client" 

import PageWrapper from "../PageWrapper"
import Link from "next/link"
import React from "react"
import { writeData } from "../lib/services/file-methods"
import { IoMdDownload, IoMdEye, IoMdClose  } from "react-icons/io"
import { parse } from "csv-parse/sync"
import JSZip from "jszip"
import FileSaver from 'file-saver'

export default function FetchPage() {
    const [startDate, setStartDate] = React.useState("");
    const [endDate, setEndDate] = React.useState("");
    const [fileList, setFileList] = React.useState([]);

    const [concChecked, setConcChecked] = React.useState(false);
    const [windChecked, setWindChecked] = React.useState(false);
    const [tempChecked, setTempChecked] = React.useState(false);
    const [humidityChecked, setHumidityChecked] = React.useState(false);

    const [tablePreviewOpened, setTablePreviewOpened] = React.useState(false);
    const [currPreviewData, setCurrPreviewData] = React.useState([]);
    
    const [zipDownloadUrl, setZipDownloadUrl] = React.useState("");

    const dateRangeFetch = async () => {
        const zip = new JSZip();
    
        setFileList([]);
        const startDateObj = new Date(startDate);
        const endDateObj = new Date(endDate);
        
        let dayCount = 0;
        for (var day = startDateObj; day <= endDateObj; day.setDate(day.getDate() + 1)) {
            dayCount++;
            const res = await writeData(day, {"Concentration(ug/m3)": concChecked, "Wind (m/s)": windChecked, "Temperature (Deg C)": tempChecked, "Humidity (%)": humidityChecked}, zip);
            setFileList(prevFileList => [...prevFileList, res]);
        }

        zip.generateAsync({ type: 'blob' }).then(function (content) {
            const url = URL.createObjectURL(content)
            setZipDownloadUrl(url);
        });

        let gap = 1;
        if (dayCount > 20) {
            gap = Math.floor(dayCount / 20);
        }
    }

    return (
        <PageWrapper currType={"fetch"}>
            <style jsx>
            {`
                .checkmark {
                    position: relative;
                }
                
                .checkmark:checked:after {
                    content: '';
                    position: absolute;
                    left: 5px;
                    top: 1px;
                    width: 5px;
                    height: 10px;
                    border: solid white;
                    border-width: 0 2px 2px 0;
                    transform: rotate(45deg);
                }
            `}
            </style>
            <div className="w-full bg-slate-950 rounded-xl shadow-lg shadow-slate-400/25 flex flex-col items-center p-4 gap-2 justify-center border border-slate-800">
                <div className="text-2xl font-bold text-slate-100">
                    Fetch and Export Data
                </div>

                <div className="flex rounded-lg border border-gray-500 w-full mt-2">
                    <Link href="/fetch" className={`font-semibold w-full p-0.5 text-center rounded-md bg-blue-700`}>Summary</Link>
                    <Link href="/fetch/smoke" className={`bg-transparent font-semibold w-full p-0.5 text-center rounded-md bg-transparent`}>Singular</Link>
                </div>
                
                <div className="w-full border border-gray-500 rounded-lg flex flex-col p-2 mt-2 items-center">
                    <div className="font-semibold">Options</div> 
                    <div className="w-full flex flex-col gap-4 items-center pt-2">
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
                        <div className="flex items-center gap-4">
                            <div className="font-medium text-center text-base text-slate-300">
                                Hourly Additions:
                            </div>
                            <div className="flex gap-5">
                                <div className="flex gap-2 items-center">
                                    <input value={concChecked} onClick={() => {setConcChecked(!concChecked)}} type="checkbox" id="concentration" className="checkmark w-4 h-4 appearance-none bg-slate-700 border border-slate-500 rounded checked:bg-blue-500" />
                                    <label htmlFor="concentration" className="text-slate-100 font-medium text-md">
                                        Concentration
                                    </label>
                                </div>
                                <div className="flex gap-2 items-center">
                                    <input value={windChecked} onClick={() => {setWindChecked(!windChecked)}} type="checkbox" id="wind" className="checkmark w-4 h-4 appearance-none bg-slate-700 border border-slate-500 rounded checked:bg-blue-500" />
                                    <label htmlFor="wind" className="text-slate-100 font-medium text-md">
                                        Wind Speed
                                    </label>
                                </div>
                                <div className="flex gap-2 items-center">
                                    <input value={tempChecked} onClick={() => {setTempChecked(!tempChecked)}} type="checkbox" id="temp" className="checkmark w-4 h-4 appearance-none bg-slate-700 border border-slate-500 rounded checked:bg-blue-500" />
                                    <label htmlFor="temp" className="text-slate-100 font-medium text-md">
                                        Air Temp
                                    </label>
                                </div>
                                <div className="flex gap-2 items-center">
                                    <input value={humidityChecked} onClick={() => {setHumidityChecked(!humidityChecked)}} type="checkbox" id="humidity" className="checkmark w-4 h-4 appearance-none bg-slate-700 border border-slate-500 rounded checked:bg-blue-500" />
                                    <label htmlFor="humidity" className="text-slate-100 font-medium text-md">
                                        Humidity
                                    </label>                                    
                                </div>
                            </div>
                        </div>
                        <button className="text-white bg-sky-600 font-semibold rounded-lg px-8 py-0.5 shadow-md shadow-purple-500/25 w-96" onClick={dateRangeFetch}>
                            Export
                        </button>
                    </div>
                </div>
            </div>
            <div className="w-full bg-slate-950 rounded-xl shadow-lg shadow-slate-400/25 flex flex-col items-center p-4 gap-2 border border-slate-800 h-full max-h-100 min-h-0 relative">
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
                                            console.log(csv)

                                            setCurrPreviewData(csv);
                                            setTablePreviewOpened(true);
                                        }
                                        }><IoMdEye /></button>
                                    <a href={item.url} download={`summary-${item.fileDate}.csv`} className="font-medium text-lg"><IoMdDownload /></a>
                                </div>
                            </div>
                        )
                    })}
                </div>
                {
                    fileList.length > 0 && 
                    <div className="flex gap-4">
                        <a className="text-white bg-violet-700 font-semibold rounded-lg px-8 h-full py-0.5 shadow-md shadow-purple-500/25 flex items-center" href={zipDownloadUrl} download={"summary-download.zip"}>Download Zip</a>
                        <div className="text-slate-600 bg-white bg-gradient-to-tr from-cyan-200 to-pink-200 font-semibold rounded-lg px-8 h-full py-0.5 shadow-md shadow-purple-500/25 flex items-center">Analyze with AI</div>
                    </div>
                }
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