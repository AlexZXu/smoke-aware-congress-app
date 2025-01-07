'use client'

import Image from "next/image";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { IoClose } from "react-icons/io5"
import SimpleBar from "simplebar-react";
import { fetchDailySummary } from "../lib/services/fetch-methods";
import useSWR from "swr";
import React from 'react'
import dynamic from 'next/dynamic'
import { Switch } from "@mui/material";
import Toggle from "../Toggle";
import PageWrapper from "../PageWrapper";
import Link from "next/link";

const LeafletMap = dynamic(() => import('../LeafletMap'), {
  ssr: false,
});

const fetcher = (...args) => fetch(...args).then(res => res.json())

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

console.log(todayDay, todayMonth, todayYear)
export default function Summary() {
  const [isActive, setIsActive] = React.useState(false)
  const [datePanelActive, setDatePanelActive] = React.useState(true)
  const [showId, setShowId] = React.useState(false)
  const [showBarometer, setShowBarometer] = React.useState(false)
  const [showBatteryVoltage, setShowBatteryVoltage] = React.useState(false)
  const [showAirFlow, setShowAirFlow] = React.useState(false)
  const [showLastObv, setShowLastObv] = React.useState(false)
  
  const [currName, setCurrName] = React.useState("");
  const [currId, setCurrId] = React.useState("");
  const [currLatitude, setCurrLatitude] = React.useState("");
  const [currLongitude, setCurrLongitude] = React.useState("");
  const [detailOpen, setDetailOpen] = React.useState(false);

  const [currYear, setCurrYear] = React.useState(todayYear);
  const [currMonth, setCurrMonth] = React.useState(todayMonth);
  const [currDay, setCurrDay] = React.useState(todayDay);

  const [editedYear, setEditedYear] = React.useState(currYear);
  const [editedMonth, setEditedMonth] = React.useState(currMonth);
  const [editedDay, setEditedDay] = React.useState(currDay);

  const [aboutOpen, setAboutOpen] = React.useState(false);
  const [aboutField, setAboutField] = React.useState("");
  const [aboutDetail, setAboutDetail] = React.useState("");
  const [aboutSubDetail, setAboutSubDetail] = React.useState("");

  const { data, error, isLoading } = useSWR(`/api/day-summaries?year=${currYear}&month=${monthMap[currMonth]}&day=${currDay}`, fetcher)

  function onDateSubmit() {
    setCurrYear(editedYear)
    setCurrMonth(editedMonth)
    setCurrDay(editedDay)
  }

  return (
    <PageWrapper currType="summary">
      <div className={`w-full ${isActive ? "h-2/5" : "h-1/6"} shrink-0 relative px-10`}>
        <LeafletMap className="z-0" data={data?.response} loaded={!isLoading} zoom={3} pinType="non-basic" center={[39.0902, -95.723]} />
        <div className="absolute top-2 right-14 text-black z-[500]">
          <button className="bg-white rounded shadow px-4" onClick={(() => {setIsActive(!isActive)})}>
            {
              isActive ?
              "Collapse" :
              "Expand"
            }
          </button>
        </div>
      </div>
      {
        datePanelActive ? 
        <div className="w-full bg-slate-950 rounded-xl shadow shadow-slate-400/35 flex flex-col items-center p-2.5 border border-slate-900">
          <div className="flex mt-0.5 gap-2 items-center">
            <h2 className="text-lg font-semibold text-slate-50 mr-1">
              Daily Summary For
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
            <select value={editedYear} onChange={(e) => {setEditedYear(e.target.value)}} className="shadow-md shadow-slate-200/25 font-medium bg-slate-950 border border-cyan-200 text-white rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-1.5 px-2">
              {
                years.map((value) => 
                  <option key={value}>{value}</option>
                )
              }
            </select>
            
          </div>
          <div className="flex gap-3 mt-2">
            <button onClick={onDateSubmit} className="text-white bg-blue-700 font-semibold rounded-lg text-sm px-6 py-0.5">
              Update
            </button>
            {
              (editedYear != currYear || editedMonth != currMonth || editedDay != currDay) &&
              <button onClick={() => {setEditedYear(currYear); setEditedMonth(currMonth); setEditedDay(currDay);}} className="text-white bg-slate-700 rounded-lg text-sm px-6 py-0.5">
                Reset
              </button>
            }
            <button onClick={() => {setDatePanelActive(false)}} className="text-white bg-slate-700 rounded-lg text-sm px-6 py-0.5">
              Hide Panel
            </button>
          </div>
        </div>
        :
        <div className="w-full bg-slate-950 rounded-xl shadow shadow-slate-400/35 flex flex-col items-center p-2">
          <button onClick={() => {setDatePanelActive(true)}} className="text-white bg-slate-700 rounded-lg text-sm px-6 py-0.5">
            Show Panel
          </button>
        </div>
      }
      
      <div className="w-full bg-slate-950 p-5 rounded-xl shadow-lg shadow-slate-400/35 screen text-slate-100 min-h-0 flex flex-col h-full justify-center items-center gap-1.5 border border-slate-800">
        <div className="flex gap-5 mb-2 justify-between w-full">
          <Link href="/fetch" className="text-white bg-violet-700 font-semibold rounded-lg px-8 h-full py-0.5 shadow-md shadow-purple-500/25 flex items-center">
            Fetch
          </Link>
          <div className="flex gap-5 border border-slate-500 rounded-lg p-1 px-5">
            <div className="font-semibold text-gray-200">
              Toggle Fields:
            </div>
            <label className="inline-flex items-center cursor-pointer">
              <span className="mr-2 text-sm font-medium text-gray-900 dark:text-gray-300">Id</span>
              <input type="checkbox" value="" className="sr-only peer" onChange={() => {setShowId(!showId)}}/>
              <div className="relative w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>

            <label className="inline-flex items-center cursor-pointer">
              <span className="mr-2 text-sm font-medium text-gray-900 dark:text-gray-300">Barometer</span>
              <input type="checkbox" value="" className="sr-only peer" onChange={() => {setShowBarometer(!showBarometer)}}/>
              <div className="relative w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
{/* 
            <label className="inline-flex items-center cursor-pointer">
              <span className="mr-2 text-sm font-medium text-gray-900 dark:text-gray-300">Battery Voltage</span>
              <input type="checkbox" value="" className="sr-only peer" onChange={() => {setShowBatteryVoltage(!showBatteryVoltage)}}/>
              <div className="relative w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label> */}

            <label className="inline-flex items-center cursor-pointer">
              <span className="mr-2 text-sm font-medium text-gray-900 dark:text-gray-300">Airflow</span>
              <input type="checkbox" value="" className="sr-only peer" onChange={() => {setShowAirFlow(!showAirFlow)}}/>
              <div className="relative w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>

            <label className="inline-flex items-center cursor-pointer">
              <span className="mr-2 text-sm font-medium text-gray-900 dark:text-gray-300">Last Observation</span>
              <input type="checkbox" value="" className="sr-only peer" onChange={() => {setShowLastObv(!showLastObv)}}/>
              <div className="relative w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>

          </div>
          
        </div>
        

        <div className={`max-w-full overflow-auto scrollbar-thin scrollbar-track-slate-600 scrollbar-thumb-gray-200 scrollbar-thumb-rounded-full scrollbar-track-rounded-full h-full w-full border-slate-500 border rounded-lg ${isLoading && "flex"}`}>
          { 
          isLoading ?
          <div className="animate-spin size-10 border-4 border-current border-t-transparent text-gray-400 rounded-full m-auto relative bottom-4" role="status" aria-label="loading">
            <span className="sr-only">Loading...</span>
          </div>

          :

          <table cellSpacing="0" className="border border-collapse border-slate-200 table-fixed rounded w-full m-auto">
            <colgroup>
              <col field="name"/>
              <col field="hourly" />
              <col field="id" className={`${showId ? "visible" : "collapse"}`} />
              <col field="location" span="2" />
              <col field="concentration" span="3" />
              <col field="wind" span="2" />
              <col field="airtemp" span="3" />
              <col field="humidity" span="3" />
              <col field="barometer" className={`${showBarometer ? "visible" : "collapse"}`}/>
              <col field="battery" span="3" className={`${showBatteryVoltage ? "visible" : "collapse"}`} />
              <col field="airflow" className={`${showAirFlow ? "visible" : "collapse"}`}/>
              <col field="lastob" className={`${showLastObv ? "visible" : "collapse"}`}/>
              <col field="qcreport" />
            </colgroup>
            <thead className="w-full">
              <tr>
                <th field="name" className="border w-52">
                </th>
                <th field="hourly" className="border w-[106px]">
                </th>
                <th field="id" className="border w-14">
                </th>
                <th field="location" colSpan={2} className="border text-sm p-2 w-40">
                  <button className="text-xs mr-1" onClick={() => {
                    setAboutOpen(true);
                    setAboutField("Location");
                    setAboutDetail("Location is broken up into standard latitude and longitude.");
                    setAboutSubDetail("");
                  }}><IoMdInformationCircleOutline /></button>
                  Location
                </th>
                <th field="concentration" colSpan={3} className="border text-sm p-2 w-48">
                  <button className="text-xs mr-1" onClick={() => {
                    setAboutOpen(true);
                    setAboutField("Concentration");
                    setAboutDetail("Concentration tracks PM2.5 pollution, which is pollutants that are 2.5 micrometers or less in diameter.")
                    setAboutSubDetail("Wildfire smoke has heavily amounts of PM2.5 pollution, which is especially dangerous because of its smaller size that can get inside the body.")
                  }}><IoMdInformationCircleOutline /></button>
                  Concentration <span className="text-zinc-300 text-sm">(µg/m3)</span>
                </th>
                <th field="wind" colSpan={2} className="border text-sm p-2 w-28">
                  <button className="text-xs mr-1" onClick={() => {
                    setAboutOpen(true);
                    setAboutField("Wind");
                    setAboutDetail("Wind tracks the average velocity of the wind and the direction of the wind.");
                    setAboutSubDetail("Wind impacts the concentration of smoke and where the smoke will travel.");
                  }}><IoMdInformationCircleOutline /></button>
                  Wind
                </th>
                <th field="airtemp" colSpan={3} className="border text-sm p-2 w-40">
                  <button className="text-xs mr-1" onClick={() => {
                    setAboutOpen(true);
                    setAboutField("Air Temperature");
                    setAboutDetail("Air temperature is tracked in degrees C.");
                    setAboutSubDetail("Air temperature often has an impact on the formation of wildfires.");
                  }}><IoMdInformationCircleOutline /></button>
                  Air Temp <span className="text-zinc-300 text-sm">(Deg. C.)</span>
                </th>
                <th field="humidity" colSpan={3} className="border text-sm p-2 w-36">
                  <button className="text-xs mr-1" onClick={() => {
                    setAboutOpen(true);
                    setAboutField("Humidity");
                    setAboutDetail("Low humidity usually makes it easier for wildfires to start.");
                    setAboutSubDetail("When relative humidity drops, fine fuels like grass and pine needles become drier much quicker and fire behavior increases.");
                  }}><IoMdInformationCircleOutline /></button>
                  Humidity <span className="text-zinc-300 text-sm">(%)</span>
                </th>
                <th field="barometer" className="border text-sm p-2 w-28">
                  <button className="text-xs mr-1" onClick={() => {
                    setAboutOpen(true);
                    setAboutField("Barometer");
                    setAboutDetail("Barometer measures the atmospheric pressure in millibars.");
                    setAboutSubDetail("Air pressure affects the movement of smoke and weather patterns that can create fires.");
                  }}><IoMdInformationCircleOutline /></button>
                  Barometer
                </th>
                <th field="battery" colSpan={3} className="border text-sm p-2 w-36">
                  <button className="text-xs mr-1" onClick={() => {
                    setAboutOpen(true);
                    setAboutField("Battery Voltage");
                    setAboutDetail("Battery voltage measures the voltage in the monitor battery.")
                    setAboutSubDetail("");
                  }}><IoMdInformationCircleOutline /></button>
                  Battery Voltage
                </th>
                <th field="airflow" className="border text-sm p-2 w-24">
                  <button className="text-xs mr-1" onClick={() => {
                    setAboutOpen(true);
                    setAboutField("Air Flow");
                    setAboutDetail("Air flow measures the amount of air flowing through the monitor.");
                    setAboutSubDetail("Air flow has impacts on wind speed and direction, which impacts the spread of wildfires and smoke. Greater air flow also brings more oxygen supply fueling fires more.")
                  }}><IoMdInformationCircleOutline /></button>
                  Air Flow
                </th>
                <th field="lastob" className="border text-sm p-2 w-24">
                  <button className="text-xs mr-1" onClick={() => {
                    setAboutOpen(true);
                    setAboutField("Last Observation");
                    setAboutDetail("Last observation shows the last time the smoke monitor measured the data.")
                    setAboutSubDetail("");
                  }}><IoMdInformationCircleOutline /></button>
                  Last Ob
                </th>
                <th field="qcreport" className="border text-sm p-2 w-28" onClick={() => {
                  setAboutOpen(true);
                  setAboutField("QC Report");
                  setAboutDetail("The QC report is the WRCC smoke monitor's raw data and other details.")
                  setAboutSubDetail("Click the link to open the QC report for this smoke monitor");
                }}>
                  <button className="text-xs mr-1" ><IoMdInformationCircleOutline /></button>
                  QC Report
                </th>
              </tr>
              <tr>
                <th field="name" className="border text-sm px-2">
                  <button className="text-xs mr-1" onClick={() => {
                    setAboutOpen(true);
                    setAboutField("Station Name");
                    setAboutDetail("Each smoke monitor is given a unique station name.");
                    setAboutSubDetail("");
                  }}><IoMdInformationCircleOutline /></button>
                  Station Name
                </th>
                <th field="hourly" className="border text-sm px-2">
                  Hourly Data
                </th>
                <th field="id" className="border text-sm px-2">
                  <button className="text-xs mr-1" onClick={() => {
                    setAboutOpen(true);
                    setAboutField("Station Id");
                    setAboutDetail("Each smoke monitor is given a unique identification code, ID. ")
                  }}><IoMdInformationCircleOutline /></button>
                  Id
                </th>
                <th field="location" className="border text-xs px-2">
                  Latitude
                </th>
                <th field="location" className="border text-xs px-2">
                  Longitude
                </th>
                <th field="concentration" className="border text-xs px-2">
                  Mean
                </th>
                <th field="concentration" className="border text-xs px-2">
                  Max
                </th>
                <th field="concentration" className="border text-xs px-2">
                  Min
                </th>
                <th field="wind" className="border text-xs px-2">
                  Ave. V
                </th>
                <th field="wind" className="border text-xs px-2">
                  Dir.
                </th>
                <th field="airtemp" className="border text-xs px-2">
                  Mean
                </th>
                <th field="airtemp" className="border text-xs px-2">
                  Max
                </th>
                <th field="airtemp" className="border text-xs px-2">
                  Min
                </th>
                <th field="humidity" className="border text-xs px-2">
                  Mean
                </th>
                <th field="humidity" className="border text-xs px-2">
                  Max
                </th>
                <th field="humidity" className="border text-xs px-2">
                  Min
                </th>
                <th field="barometer" className="border text-xs px-2">
                  Press. <span className="text-zinc-300 text-xs">(mbars)</span>
                </th>
                <th field="battery" className="border text-xs px-2">
                  Mean
                </th>
                <th field="battery" className="border text-xs px-2">
                  Max
                </th>
                <th field="battery" className="border text-xs px-2">
                  Min
                </th>
                <th field="airflow" className="border text-xs px-2">
                  Mean
                </th>
                <th field="lastob" className="border text-xs px-2">
                  Time
                </th>
                <th field="qcreport" className="border text-xs px-2">
                  View
                </th>
              </tr>
            </thead>
            {
              (Array.isArray(data.response) && data.response.length > 0) && 
              <tbody className="w-full h-full">
                {
                  data.response.map((item) => (
                    <tr className="border-b border-slate-400/75 text-slate-200" key={item.stationId}>
                      <td field="name" className="text-xs text-center py-0.5 px-1">
                        {item.name}
                      </td>
                      <td className="text-xs text-center py-0.5 px-1">
                        <button className="text-slate-100 bg-sky-600 shadow-md shadow-blue-800/60 font-semibold rounded-lg text-xs px-5 h-full" onClick={() => {setCurrName(item.name); setCurrId(item.stationId); setDetailOpen(true); setCurrLatitude(item.latitude); setCurrLongitude(item.longitude)}}>
                          View
                        </button>
                      </td>
                      <td field="id" className="text-sm text-center text-gray-400 p-0.5">
                        {item.stationId}
                      </td>
                      <td field="location" className="text-sm text-center p-0.5">
                        {item.latitude.toFixed(3)}°
                      </td>
                      <td field="location" className="text-sm text-center p-0.5">
                        {item.longitude.toFixed(3)}°
                      </td>
                      <td field="concentration" className="text-sm text-purple-200 text-center p-0.5">
                        {item.ConcentrationMean}
                      </td>
                      <td field="concentration" className="text-sm text-center p-0.5">
                        {item.ConcentrationMax}
                      </td>
                      <td field="concentration" className="text-sm text-center p-0.5">
                        {item.ConcentrationMin}
                      </td>
                      <td field="wind" className="text-purple-200 text-sm text-center p-0.5">
                        {item.WindAvg}
                      </td>
                      <td field="wind" className="text-sm text-center p-0.5">
                        {item.WindDir != 0 ? `${item.WindDir}°` : ""}
                      </td>
                      <td field="airtemp" className="text-purple-200 text-sm text-center p-0.5">
                        {item.TempMean}
                      </td>
                      <td field="airtemp" className="text-sm text-center p-0.5">
                        {item.TempMax}
                      </td>
                      <td field="airtemp" className="text-sm text-center p-0.5">
                        {item.TempMin}
                      </td>
                      <td field="humidity" className="text-purple-200 text-sm text-center p-0.5">
                        {item.HumidityMean}
                      </td>
                      <td field="humidity" className="text-sm text-center p-0.5">
                        {item.HumidityMax}
                      </td>
                      <td field="humidity" className="text-sm text-center p-0.5">
                        {item.HumidityMin}
                      </td>
                      <td field="barometer" className="text-sm text-center p-0.5">
                        {item.BaroPress}
                      </td>
                      <td field="battery" className="text-purple-200 text-sm text-center p-0.5">
                        {item.VoltageMean}
                      </td>
                      <td field="battery" className="text-sm text-center p-0.5">
                        {item.VoltageMax}
                      </td>
                      <td field="battery" className="text-sm text-center p-0.5">
                        {item.VoltageMin}
                      </td>
                      <td field="airflow" className="text-sm text-center p-0.5">
                        {item.AirFlowMean}
                      </td>
                      <td field="lastob" className="text-sm text-center p-0.5">
                        {item.LastObv}
                      </td>
                      <td field="qcreport" className="text-sm text-blue-400 underline text-center p-0.5">
                        {
                          item.qcReportLink != "" &&
                          <a href={item.qcReportLink} target="_blank">
                            Link
                          </a>
                        }
                      </td>
                    </tr>
                    
                  ))
                }
                
              </tbody>
            }

            {
              (Array.isArray(data.response) && data.response.length == 0) &&
              <tr>
                <td colSpan={10} className="p-4 pl-6 font-bold text-purple-200">
                  No stations detecting significant wildfire smoke or no data for this day! Please check other dates.
                </td>
              </tr>
            }

            {
              (data.response == "In future") && 
              <tr>
                <td className="p-4 pl-6 font-bold text-purple-200">
                  Date in the Future!
                </td>
              </tr>
            }

          </table>
          }
        </div>
      </div>
      {
        detailOpen &&
        <div className="absolute z-[500] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-950 p-7 shadow-xl shadow-gray-900 border border-slate-800 rounded-xl">
          <div className="flex flex-col items-center gap">
            <h2 className="slate-50 text-lg">
              See <span className="font-bold">hourly data</span> for <span className="text-purple-200 font-semibold">{currName}</span>
            </h2>
            <div className="flex flex-col items-center">
              <div className="text-gray-100">
                Id: <span className="text-gray-300">{currId}</span>
              </div>
              <div className="text-gray-100">
                Position: <span className="text-gray-300">({currLatitude.toFixed(3)}, {currLongitude.toFixed(3)})</span>
              </div>
            </div>
            <div className="mt-2.5">
              <Link className="text-white bg-blue-600 font-semibold rounded-lg px-6 py-1 shadow-lg shadow-sky-700/50" href={`/smoke/${currId}`}>
                View Hourly
              </Link>
            </div>
          </div>
          <div className="absolute top-2 right-2 cursor-pointer text-xl" onClick={() => {setDetailOpen(false)}}>
            <IoClose />
          </div>
        </div>
      }
      {
        aboutOpen &&
        <div className="absolute z-[500] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-950 p-7 pt-4 shadow-xl shadow-gray-900 border border-slate-800 rounded-xl max-w-70">
          <div className="flex flex-col gap-2 items-center">
            <div onClick={() => {setAboutOpen(false)}} className="text-2xl cursor-pointer self-end">
                <IoClose />
            </div>
            <div className="text-2xl font-bold">About {aboutField}</div>
            <div className="font-semibold text-slate-100 text-center">{aboutDetail}</div>
            <div className="text-slate-300 text-center text-sm">{aboutSubDetail}</div>
          </div>
          
        </div>
      }
      </PageWrapper>
  );
}
