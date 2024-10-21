"use client"

import PageWrapper from "@/app/PageWrapper";
import React, { Fragment } from "react";
import { fetchItemFromStations } from "@/app/lib/services/fetch-methods";
import dynamic from "next/dynamic";
import useSWR from "swr";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Label } from "recharts";
import { useParams, useSearchParams } from "next/navigation";
const LeafletMap = dynamic(() => import('../../LeafletMap'), {
    ssr: false,
});

// const { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } = dynamic(() => require("recharts"), { ssr: false })
// const {LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip} = import("recharts")

const days = []

for (var i = 1; i <= 31; i++) {
  days.push(i);
}

const months = ["January","February","March","April","May","June","July", "August","September","October","November","December"];
const monthMap = {"January": 1, "February": 2, "March": 3, "April": 4, "May": 5, "June": 6, "July": 7, "August": 8, "September": 9, "October": 10, "November": 11, "December": 12}

const years = []

for (var i = 2024; i >= 2010; i--) {
  years.push(i);
}

const today = new Date();

const todayDay = today.getDate();
const todayMonth = months[today.getMonth()];
const todayYear = today.getFullYear();

const sampleData = [{date: 1, ECR: 12}, {date: 2, ECR: 20}, {date: 3, ECR: 30}, {date: 4, ECR: 52}, {date: 5, ECR: 4}]

const fetcher = (...args) => fetch(...args).then(res => res.json())

const error = console.error;
console.error = (...args) => {
  if (/defaultProps/.test(args[0])) return;
  error(...args);
};

export default function SmokeDetails({params}) {
    const { stationId } = params;
    const searchParams = useSearchParams();
    const day = searchParams.get('day')
    const month = searchParams.get('month')
    const year = searchParams.get('year')
    console.log(day, month, year)
    const item = fetchItemFromStations(stationId)

    const [currYear, setCurrYear] = React.useState(year == null ? todayYear : year);
    const [currMonth, setCurrMonth] = React.useState(month == null ? todayMonth : months[month - 1]);
    const [currDay, setCurrDay] = React.useState(day == null ? todayDay : day);
    const [currAttr1, setCurrAttr1] = React.useState("ECR");
    const [currAttr2, setCurrAttr2] = React.useState("MWS");
    const [currShowAmount, setCurrShowAmount] = React.useState(2);
    const [currView, setCurrView] = React.useState("graph");

    const [editedYear, setEditedYear] = React.useState(currYear);
    const [editedMonth, setEditedMonth] = React.useState(currMonth);
    const [editedDay, setEditedDay] = React.useState(currDay);
    const [flattenedData, setFlattenedData] = React.useState([])
    const [noDataForDate, setNoDataForDate] = React.useState(false);

    const [attrList, setAttrList] = React.useState([]);
    const [unitMap, setUnitMap] = React.useState({})
    const { data, error, isLoading } = useSWR(`/api/hourly/${stationId}?year=${currYear}&month=${monthMap[currMonth]}&day=${currDay}`, fetcher)

    React.useEffect(() => {
        if (!isLoading) {

            const flatData = [];
            let index = 0;

            if (data.response.hasOwnProperty("error")) {
                setNoDataForDate(true);
                return;
            }
            
            setNoDataForDate(false);
            const typeList = Object.getOwnPropertyNames(data.response.elements)
            
            const newAttrList = [];
            const newUnitMap = data.response.units;
            for (const type of typeList) {
                const longDef = data.response.elements[type];
                const abbr = type;

                const newS = longDef + " (" + abbr + ")";
                
                newAttrList.push(newS);
            }

            setAttrList(newAttrList);
            setUnitMap(newUnitMap);

            while (index < 24) {
                const dataPoint = {};
                dataPoint.hour = index;
                for (const type of typeList) {
                    dataPoint[type] = data.response.data[type][index] != null ? Number(data.response.data[type][index]) : null;
                }

                flatData.push(dataPoint);
                index++;
            }

            setFlattenedData(flatData);
        }

    }, [data, isLoading])

    function onDateSubmit() {
        setCurrYear(editedYear)
        setCurrMonth(editedMonth)
        setCurrDay(editedDay)
      }
    
    return (
    <PageWrapper currType="smoke">
        <div className="flex w-full min-h-[100px] gap-2">
            <div className="w-96">
                {item != undefined && 
                    <LeafletMap className="z-0" data={[item]} loaded={true} zoom={5} pinType="non-basic" center={[item.latitude, item.longitude]}  />
                }
            </div>
            <div className="w-full bg-slate-950 rounded-xl shadow-lg shadow-slate-400/25 border border-slate-800 flex justify-between items-center">
                <div className="flex flex-col p-4">
                    <div className="text-lg text-slate-100 font-semibold flex gap-2"><span className="text-slate-300">Name: </span>{item.name}</div>
                    <div className="text-slate-100 font-semibold flex items-center flex gap-2"><span className="text-slate-300">Id: </span>{item.stationId}</div>
                </div>
                <div className="flex flex-col gap-1.5 p-4 border-l border-slate-500 h-full justify-center items-center">
                    <div className="flex gap-1 items-center">
                        <h2 className="text-lg font-bold mr-1 text-slate-100">
                            Date:
                        </h2> 
                        <select value={editedMonth} onChange={(e) => {setEditedMonth(e.target.value)}} className="shadow-md shadow-slate-200/25 font-medium bg-slate-950 border border-cyan-200 text-white rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-1.5 px-2">
                        {
                            months.map((value) => 
                            <option key={value}>{value}</option>
                            )
                        }
                        </select>
                        <select value={editedDay} onChange={(e) => {setEditedDay(e.target.value)}} className="shadow-md shadow-slate-200/25 font-medium bg-slate-950 border border-cyan-200 text-white rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-1.5 px-2">
                        {
                            days.map((value) => 
                            <option key={value}>{value}</option>
                            )
                        }
                        </select>
                        <select value={editedYear} onChange={(e) => {setEditedYear(e.target.value)}} className="shadow-md shadow-slate-200/25 font-medium bg-slate-950 border border-cyan-200 text-white rounded-lg ocus:ring-blue-500 focus:border-blue-500 block p-1.5 px-2">
                        {
                            years.map((value) => 
                            <option key={value}>{value}</option>
                            )
                        }
                        </select>
                    </div>
                    {
                        (editedYear != currYear || editedMonth != currMonth || editedDay != currDay) && (
                            <div className="flex gap-2">
                                <Fragment>
                                    <button onClick={onDateSubmit} className="text-white bg-blue-700 font-semibold rounded-lg text-sm px-6 py-0.5 w-full">
                                        Update
                                    </button>
                                    <button onClick={() => {setEditedYear(currYear); setEditedMonth(currMonth); setEditedDay(currDay);}} className="text-white bg-slate-700 rounded-lg text-sm px-6 py-0.5 w-full">
                                        Reset
                                    </button>
                                </Fragment>
                            </div>
                        )
                    }

                </div>
            </div>
        </div>
        
        <div className="w-full h-full bg-slate-950 rounded-xl shadow shadow-slate-400/35 flex flex-col items-center p-2.5 border border-slate-900 min-h-0">
            <div className="flex gap-8 mb-2 justify-between w-full p-2">
                <button className="text-white bg-violet-700 font-semibold rounded-lg px-8 py-1.5 h-full py-0.5 shadow-md shadow-purple-500/25 text-nowrap">
                    Fetch Hourly
                </button>
                <div className="flex gap-8 border border-slate-500 rounded-lg p-1 px-5 items-center">
                    <div className="flex gap-4">
                        <div className="font-semibold text-gray-200">
                            # of Graphs:
                        </div>
                        <div className="flex rounded-lg border border-gray-500">
                            <button className={`bg-transparent font-semibold rounded-md w-12 ${currShowAmount == 2 ? "bg-violet-500" : "bg-transparent"}`} onClick={() => setCurrShowAmount(2)}>2</button>
                            <button className={`bg-transparent font-semibold rounded-md w-12 ${currShowAmount == 1 ? "bg-violet-500" : "bg-transparent"}`} onClick={() => setCurrShowAmount(1)}>1</button>
                        </div>
                    </div>


                    <div className="flex gap-4">
                        <div className="font-semibold text-gray-200">
                            View:
                        </div>
                        <div className="flex rounded-md border border-gray-500">
                            <button className={`bg-transparent font-semibold rounded-md w-20 ${currView == "graph" ? "bg-violet-500" : "bg-transparent"}`} onClick={() => setCurrView("graph")}>Graph</button>
                            <button className={`bg-transparent font-semibold rounded-md w-20 ${currView == "table" ? "bg-violet-500" : "bg-transparent"}`} onClick={() => setCurrView("table")}>Table</button>
                        </div>
                    </div>
                </div>
            </div>
            
            {
                isLoading ? 
                <div className="h-full w-full flex min-h-0 p-2 border-slate-500 border rounded-lg items-center justify-center">
                    <div className="animate-spin size-10 border-4 border-current border-t-transparent text-gray-400 rounded-full m-auto relative bottom-4" role="status" aria-label="loading">
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>
                :
                <>
                    {
                        noDataForDate == false ? 
                        <div className={`h-full w-full flex min-h-0 ${currShowAmount == 2 ? "p-2" : "p-5 px-8"} pt-3 gap-4 border-slate-500 border rounded-lg`}>
                            <div className="h-full w-full flex flex-col items-center justify-center gap-3">
                                <select value={currAttr1} onChange={(e) => {setCurrAttr1(e.target.value)}} className="shadow-md capitalize shadow-blue-400/30 font-medium bg-slate-950 border border-cyan-200 text-white rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-1.5 px-2 w-fit">
                                    {
                                        attrList.map((value) => 
                                            <option key={value} value={value.slice(value.indexOf("(") + 1, -1)} className="capitalize">{value}</option>
                                        )
                                    }
                                </select>
                                {
                                    currView == "graph" ? 
                                    <div className="w-full h-full min-h-0">
                                    {
                                        flattenedData.length > 0 && 
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart key={currAttr1} data={flattenedData}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                                                <XAxis dataKey="hour" stroke="#f1f5f9" interval={1}>
                                                    <Label 
                                                        value="Hour"
                                                        dy={12}
                                                        fill="#a1a1aa"
                                                    />
                                                </XAxis>
                                                <YAxis type="number" stroke="#f1f5f9" domain={[0, dataMax => (Math.ceil(dataMax * 1.1))]}>
                                                    <Label
                                                        value={unitMap[currAttr1]}
                                                        position="insideLeft"
                                                        angle={-90}
                                                        style={{ textAnchor: 'middle' }}
                                                        dx={2}
                                                        fill="#a1a1aa"
                                                    />
                                                </YAxis>
                                                <Line type="monotone" dataKey={currAttr1} stroke="#a78bfa" />
                                                <Tooltip />
                                            </LineChart>
                                        </ResponsiveContainer>
                                        
                                    }
                                    </div>
                                    :
                                    <div className="border w-full h-full min-h-0 overflow-auto scrollbar-thin scrollbar-track-slate-600 scrollbar-thumb-gray-200 scrollbar-thumb-rounded-full scrollbar-track-rounded-full border-slate-500 border rounded-lg">
                                        <table className="w-full table-fixed border-collapse">
                                            <thead className="w-full bg-gray-800">
                                                <tr>
                                                    <th className="border border-slate-500 p-2">
                                                        Hour of Day
                                                    </th>
                                                    <th className="border border-slate-500 p-2">
                                                        {data.response.elements[currAttr1]}
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    flattenedData.map((value) => (
                                                        <tr className="border-b border-slate-500" key={value.hour}>
                                                            <td className="text-center text-slate-100 p-0.5">
                                                                {value.hour}:00
                                                            </td>
                                                            <td className="text-center text-purple-300 p-0.5">
                                                                {value[currAttr1]}
                                                            </td>
                                                        </tr>
                                                        )
                                                    )
                                                }
                                                
                                            </tbody>
                                        </table>
                                    </div>
                                }
                                
                            </div>
                            {
                                currShowAmount == 2 &&
                                <div className="h-full w-full flex flex-col items-center justify-center gap-3 border-l-2 pl-4 border-slate-800">
                                    <select value={currAttr2} onChange={(e) => {setCurrAttr2(e.target.value)}} className="shadow-md shadow-blue-400/30 font-medium bg-slate-950 border border-cyan-200 text-white rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-1.5 px-2 w-fit">
                                        {
                                            attrList.map((value) => 
                                                <option key={value} value={value.slice(value.indexOf("(") + 1, -1)} className="capitalize">{value}</option>
                                            )
                                        }
                                    </select>
                                    {
                                        currView == "graph" ? 
                                        <div className="w-full h-full min-h-0">
                                            {
                                                flattenedData.length > 0 && 
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <LineChart key={currAttr2} data={flattenedData}>
                                                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                                                        <Line type="monotone" dataKey={currAttr2} stroke="#a78bfa" />
                                                        <XAxis dataKey="hour" stroke="#f1f5f9" interval={1}>
                                                            <Label 
                                                                value="Hour"
                                                                dy={12}
                                                                fill="#a1a1aa"
                                                            />
                                                        </XAxis>                                        
                                                        <YAxis type="number" stroke="#f1f5f9" domain={[0, dataMax => (Math.ceil(dataMax * 1.1))]}>
                                                            <Label
                                                                value={unitMap[currAttr2]}
                                                                position="insideLeft"
                                                                angle={-90}
                                                                style={{ textAnchor: 'middle' }}
                                                                dx={5}
                                                                fill="#a1a1aa"
                                                            />
                                                        </YAxis>

                                                        <Tooltip />
                                                    </LineChart>
                                                </ResponsiveContainer>
                                                
                                            }
                                        </div>
                                        :
                                        <div className="border w-full h-full min-h-0 overflow-auto scrollbar-thin scrollbar-track-slate-600 scrollbar-thumb-gray-200 scrollbar-thumb-rounded-full scrollbar-track-rounded-full border-slate-500 border rounded-lg">
                                            <table className="w-full table-fixed border-collapse">
                                                <thead className="w-full bg-gray-800">
                                                    <tr>
                                                        <th className="border border-slate-500 p-2">
                                                            Hour of Day
                                                        </th>
                                                        <th className="border border-slate-500 p-2">
                                                            {data.response.elements[currAttr2]}
                                                        </th>
                                                    </tr>  
                                                </thead>
                                                <tbody>
                                                    {
                                                        flattenedData.map((value) => (
                                                            <tr className="border-b border-slate-500" key={value.hour}>
                                                                <td className="text-center text-slate-100 p-0.5">
                                                                    {value.hour}:00
                                                                </td>
                                                                <td className="text-center text-purple-300 p-0.5">
                                                                    {value[currAttr2]}
                                                                </td>
                                                            </tr>
                                                            )
                                                        )
                                                    }
                                                    
                                                </tbody>
                                            </table>
                                        </div>
                                    }
                                    
                                </div>
                            
                            }
                        </div>      
                        :
                        <div className="h-full w-full flex min-h-0 p-2 border-slate-500 border rounded-lg items-center justify-center">
                            <div className="-mt-10 text-lg font-semibold">
                                No data for this date!
                            </div>
                        </div>
                    }
                </>
            }
            
                      

        </div>
        
    </PageWrapper>
    )
}
