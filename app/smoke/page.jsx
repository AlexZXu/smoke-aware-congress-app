"use client"

import PageWrapper from "../PageWrapper";
import dynamic from 'next/dynamic'
import useSWR from "swr";
import React from "react";
import { fetchAllStations } from "../lib/services/fetch-methods";
import Link from 'next/link'

const LeafletMap = dynamic(() => import('../LeafletMap'), {
    ssr: false,
});

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

const stations = fetchAllStations();

export default function SmokeOverview() {
    const [selectedName, setSelectedName] = React.useState("");
    const [selectedId, setSelectedId] = React.useState("");
    const [selectedVal, setSelectedVal] = React.useState("");

        
    const [currYear, setCurrYear] = React.useState(todayYear);
    const [currMonth, setCurrMonth] = React.useState(todayMonth);
    const [currDay, setCurrDay] = React.useState(todayDay);

    return (
        <PageWrapper currType="smoke">
            <div className="w-full bg-slate-950 rounded-xl shadow-lg shadow-slate-400/25 flex flex-col items-center p-4 gap-2 justify-center border border-slate-800">
                <h2 className="font-bold text-xl">
                    View Detailed Smoke Monitor Data
                </h2> 
                <div className="flex items-center gap-1.5 pb-2 px-20 border-b border-slate-500">
                    <h2 className="text-base font-bold mr-2.5 text-slate-100">
                        Set Date:
                    </h2> 
                    <select value={currMonth} onChange={(e) => {setCurrMonth(e.target.value)}} className="shadow-md shadow-slate-200/25 font-medium bg-slate-950 border border-cyan-200 text-white rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-1.5 px-2 text-[15px]">
                    {
                        months.map((value) => 
                        <option key={value}>{value}</option>
                        )
                    }
                    </select>
                    <select value={currDay} onChange={(e) => {setCurrDay(e.target.value)}} className="shadow-md shadow-slate-200/25 font-medium bg-slate-950 border border-cyan-200 text-white rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-1.5 px-2 text-[15px]">
                    {
                        days.map((value) => 
                        <option key={value}>{value}</option>
                        )
                    }
                    </select>
                    <select value={currYear} onChange={(e) => {setCurrYear(e.target.value)}} className="shadow-md shadow-slate-200/25 font-medium bg-slate-950 border border-cyan-200 text-white rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-1.5 px-2 text-[15px]">
                    {
                        years.map((value) => 
                        <option key={value}>{value}</option>
                        )
                    }
                    </select>
                </div>
                
                <div className="flex items-center gap-4">
                    <select value={selectedVal} onChange={(e) => {setSelectedVal(e.target.value); setSelectedName(e.target.value.substring(0, e.target.value.indexOf("////"))); setSelectedId(e.target.value.substring(e.target.value.indexOf("////") + 4));}} className="shadow-md shadow-blue-400/50 font-medium bg-slate-950 border border-cyan-200 text-white rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-1.5 px-2 text-purple-50">
                        <option value="" disabled>Select Smoke Monitor</option>
                        {
                            stations.map((value) => 
                                (<option key={value.stationId} value={value.name + "////" + value.stationId}>{value.name}</option>)
                            )
                        }
                    </select>
                    {
                        selectedId != "" &&
                        <Link className="text-white bg-blue-700 font-semibold rounded-full px-12 h-full flex items-center" href={`/smoke/${selectedId}?day=${currDay}&month=${monthMap[currMonth]}&year=${currYear}`}>
                            View
                        </Link>
                    }
                    
                </div>
            </div>

            <div className="w-full bg-slate-950 shadow-lg shadow-slate-400/25 flex flex-col items-center justify-center px-4 py-4 border border-slate-800 h-full gap-2 -mt-1 rounded-xl">
                <h2 className="font-bold text-xl text-gray-100">
                    Select Monitor by Map
                </h2>
                 <div className={`w-full h-full`}>
                    <LeafletMap className="z-0" data={stations} loaded={true} zoom={4} pinType="non-basic" center={[39.0902, -95.723]} />
                </div>
            </div>

            
    
        </PageWrapper>
    )
}