"use client"

import PageWrapper from "./PageWrapper"
import Link from "next/link"
import React from "react";
import Image from "next/image";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { IoClose } from "react-icons/io5"

//information about various pollutants
const pollutantInformation = [
  {
    "code": "co",
    "sources": "Typically originates from incomplete combustion of carbon fuels, such as that which occurs in car engines and power plants.",
    "effects": "When inhaled, carbon monoxide can prevent the blood from carrying oxygen. Exposure may cause dizziness, nausea and headaches. Exposure to extreme concentrations can lead to loss of consciousness.",
    "average": "100 ppb"
  },
  {
    "code": "no2",
    "sources": "Main sources are fuel burning processes, such as those used in industry and transportation.",
    "effects": "Exposure may cause increased bronchial reactivity in patients with asthma, lung function decline in patients with Chronic Obstructive Pulmonary Disease (COPD), and increased risk of respiratory infections, especially in young children.",
    "average": "53 ppb"
  },
  {
    "code": "o3",
    "sources": "Ozone is created in a chemical reaction between atmospheric oxygen, nitrogen oxides, carbon monoxide and organic compounds, in the presence of sunlight.",
    "effects": "Ozone can irritate the airways and cause coughing, a burning sensation, wheezing and shortness of breath. Additionally, ozone is one of the major components of photochemical smog.",
    "average": "50 ppb"
  },
  {
    "code": "pm10",
    "sources": "Main sources are combustion processes (e.g. indoor heating, wildfires), mechanical processes (e.g. construction, mineral dust, agriculture) and biological particles (e.g. pollen, bacteria, mold).",
    "effects": "Inhalable particles can penetrate into the lungs. Short term exposure can cause irritation of the airways, coughing, and aggravation of heart and lung diseases, expressed as difficulty breathing, heart attacks and even premature death.",
    "average": "50 ug/m3"
  },
  {
    "code": "pm25",
    "sources": "Main sources are combustion processes (e.g. power plants, indoor heating, car exhausts, wildfires), mechanical processes (e.g. construction, mineral dust) and biological particles (e.g. bacteria, viruses).",
    "effects": "Fine particles can penetrate into the lungs and bloodstream. Short term exposure can cause irritation of the airways, coughing and aggravation of heart and lung diseases, expressed as difficulty breathing, heart attacks and even premature death.",
    "average": "7.8 ug/m3"
  
  },
  {
    "code": "so2",
    "sources": "Main sources are burning processes of sulfur-containing fuel in industry, transportation and power plants.",
    "effects": "Exposure causes irritation of the respiratory tract, coughing and generates local inflammatory reactions. These in turn, may cause aggravation of lung diseases, even with short term exposure.",
    "average": "3 ppb"

  }
]

export default function Home() {
  //setting variables
  const [zip, setZip] = React.useState("");
  const [currZip, setCurrZip] = React.useState("");
  const [aqi, setAqi] = React.useState(0);
  const [color, setColor] = React.useState("#ffffff");
  const [forecastData, setForecastData] = React.useState([]);
  const [forecastField, setForecastField] = React.useState("aqi");

  //variables for tooltip box
  const [aboutOpen, setAboutOpen] = React.useState(false);
  const [aboutField, setAboutField] = React.useState("");
  const [aboutFullName, setAboutFullName] = React.useState("");
  const [aboutSources, setAboutSources] = React.useState("");
  const [aboutEffects, setAboutEffects] = React.useState("");
  const [aboutAverage, setAboutAverage] = React.useState("");

  //pollutants default state
  const [pollutants, setPollutants] = React.useState([
    {


      "code": "co",
      "displayName": "CO",
      "fullName": "Carbon monoxide",
      "concentration": {
        "value": 0,
        "units": "PARTS_PER_BILLION"
      },
      "additionalInfo": {
        "sources": "Typically originates from incomplete combustion of carbon fuels, such as that which occurs in car engines and power plants.",
        "effects": "When inhaled, carbon monoxide can prevent the blood from carrying oxygen. Exposure may cause dizziness, nausea and headaches. Exposure to extreme concentrations can lead to loss of consciousness."
      }
    },
    {
      "code": "no2",
      "displayName": "NO2",
      "fullName": "Nitrogen dioxide",
      "concentration": {
        "value": 0,
        "units": "PARTS_PER_BILLION"
      },
      "additionalInfo": {
        "sources": "Main sources are fuel burning processes, such as those used in industry and transportation.",
        "effects": "Exposure may cause increased bronchial reactivity in patients with asthma, lung function decline in patients with Chronic Obstructive Pulmonary Disease (COPD), and increased risk of respiratory infections, especially in young children."
      }
    },
    {
      "code": "o3",
      "displayName": "O3",
      "fullName": "Ozone",
      "concentration": {
        "value": 0,
        "units": "PARTS_PER_BILLION"
      },
      "additionalInfo": {
        "sources": "Ozone is created in a chemical reaction between atmospheric oxygen, nitrogen oxides, carbon monoxide and organic compounds, in the presence of sunlight.",
        "effects": "Ozone can irritate the airways and cause coughing, a burning sensation, wheezing and shortness of breath. Additionally, ozone is one of the major components of photochemical smog."
      }
    },
    {
      "code": "pm10",
      "displayName": "PM10",
      "fullName": "Inhalable particulate matter",
      "concentration": {
        "value": 0,
        "units": "ug/m3"
      },
      "additionalInfo": {
        "sources": "Main sources are combustion processes (e.g. indoor heating, wildfires), mechanical processes (e.g. construction, mineral dust, agriculture) and biological particles (e.g. pollen, bacteria, mold).",
        "effects": "Inhalable particles can penetrate into the lungs. Short term exposure can cause irritation of the airways, coughing, and aggravation of heart and lung diseases, expressed as difficulty breathing, heart attacks and even premature death."
      }
    },
    {
      "code": "pm25",
      "displayName": "PM2.5",
      "fullName": "Fine particulate matter",
      "concentration": {
        "value": 0,
        "units": "ug/m3"
      },
      "additionalInfo": {
        "sources": "Main sources are combustion processes (e.g. power plants, indoor heating, car exhausts, wildfires), mechanical processes (e.g. construction, mineral dust) and biological particles (e.g. bacteria, viruses).",
        "effects": "Fine particles can penetrate into the lungs and bloodstream. Short term exposure can cause irritation of the airways, coughing and aggravation of heart and lung diseases, expressed as difficulty breathing, heart attacks and even premature death."
      }
    },
    {
      "code": "so2",
      "displayName": "SO2",
      "fullName": "Sulfur dioxide",
      "concentration": {
        "value": 0,
        "units": "PARTS_PER_BILLION"
      },
      "additionalInfo": {
        "sources": "Main sources are burning processes of sulfur-containing fuel in industry, transportation and power plants.",
        "effects": "Exposure causes irritation of the respiratory tract, coughing and generates local inflammatory reactions. These in turn, may cause aggravation of lung diseases, even with short term exposure."
      }
    }
  ]);



  async function getData() {
    //fetch current air quality data
    const res = await fetch(`/api/current-aqi?zip=${zip}`)
    const data = await res.json();
    
    //current results
    const result = data.current;
    const aqi = result.indexes[1].aqi;

    //set values
    setCurrZip(zip);
    setAqi(aqi);
    setColor(determineColor(aqi));
    setPollutants(result.pollutants)


    //fetch forecast
    const forecastRes = await fetch(`/api/forecast?zip=${zip}`)
    const forecastData = await forecastRes.json();

    const forecastResult = forecastData.forecast;
    
    const parsedData = []
    
    //for each data point in forecast result create a more convenient accessible object
    for (const dataPoint of forecastResult) {
      const pointObj = {
        dateTime: new Date(dataPoint.dateTime), //date
        aqi: dataPoint.indexes[1].aqi, //current aqi using US index
        data: {
          aqi: {
            value: dataPoint.indexes[1].aqi
          },
          co: {
            value: dataPoint.pollutants[0].concentration.value,
            units: dataPoint.pollutants[0].concentration.units,
            displayName: dataPoint.pollutants[0].displayName,
          },
          no2: {
            value: dataPoint.pollutants[1].concentration.value,
            units: dataPoint.pollutants[1].concentration.units,
            displayName: dataPoint.pollutants[1].displayName,
          },
          o3: {
            value: dataPoint.pollutants[2].concentration.value,
            units: dataPoint.pollutants[2].concentration.units,
            displayName: dataPoint.pollutants[2].displayName,
          },
          pm10: {
            value: dataPoint.pollutants[3].concentration.value,
            units: dataPoint.pollutants[3].concentration.units,
            displayName: dataPoint.pollutants[3].displayName,
          },
          pm25: {
            value: dataPoint.pollutants[4].concentration.value,
            units: dataPoint.pollutants[4].concentration.units,
            displayName: dataPoint.pollutants[4].displayName,
          },
          so2: {
            value: dataPoint.pollutants[5].concentration.value,
            units: dataPoint.pollutants[5].concentration.units,
            displayName: dataPoint.pollutants[5].displayName,
          },
        }
      };

      parsedData.push(pointObj);
    }

    //update forecast data
    setForecastData(parsedData)
  }

  /*
  good 0-50 #00E400
  moderate 51-100 	#FFFF00
  unhealthy for various groups #FF7E00
  unhealthy     #FF0000	
  very unhealthy   #8F3F97
  hazardous     #7E0023
  */
  function determineColor(currAqi) {
    console.log(currAqi)
    if (currAqi <= 50) {
      return "#00E400";
    }
    else if (currAqi <= 100) {
      return "#FFFF00";
    }
    else if (currAqi <= 150) {
      return "#FF7E00";
    }
    else if (currAqi <= 200) {
      return "#FF0000";
    }
    else if (currAqi <= 300) {
      return "#8F3F97";
    }
    else if (currAqi > 300) {
      return "#7E0023";
    }
  }

    return (
      <PageWrapper currType="around">
        <div className="font-bold text-4xl">
          Welcome to Smoke Aware!
        </div>
        <div className="text-lg -mt-1 font-medium text-slate-200">
          Find information about air quality in your area, access data across the country, and analyze with AI.
        </div>
        <hr className="border-1 w-full border-slate-500" />
        <div className="w-full flex flex-col items-center gap-2 h-full min-h-0">
          <div className="w-full bg-slate-950 rounded-xl shadow shadow-slate-400/35 flex flex-col items-center p-3 border border-slate-900 gap-2">
            <div className="text-slate-50 font-bold text-xl">
              Find information about your ZIP
            </div>
            <div className="flex gap-5">
              <input placeholder="ZIP" value={zip} className="bg-slate-950 border border-gray-600 p-2 px-3 rounded-lg w-80" onChange={(e) => {setZip(e.target.value)}}/>
              <button className="text-white bg-blue-700 font-semibold rounded-lg px-6 h-full" onClick={getData}>
                Submit
              </button>
            </div>
          </div>

          <div className="w-full bg-slate-950 rounded-xl shadow shadow-slate-400/35 flex flex-col items-center border border-slate-900 h-full min-h-0">
            <div className="border-b w-full p-3 text-center border-slate-500 font-medium text-slate-200 relative">
              {
                currZip == "" ?
                "Enter a ZIP for results." :
                "Showing results for " + currZip
              }
              <div className="absolute flex right-3 top-3 gap-2 items-center">
                Attribution to:
                <div className="w-20 h-4">
                  <Image src="/images/google_on_non_white_hdpi.png" alt="google-logo" width={65} height={20} />
                </div>
              </div>
            </div>
            <div className="flex w-full h-full flex-col items-center gap-6 p-4 min-h-0 overflow-auto scrollbar-thin scrollbar-track-slate-600 scrollbar-thumb-gray-300 scrollbar-thumb-rounded-full scrollbar-track-rounded-full">
              <div className="flex gap-8 h-20 ml-14">
                <div className="flex flex-col">
                  <div className="text-xl text-center text-slate-200">
                    AQI
                  </div>
                  <div className={`text-5xl text-center font-medium}`} style={{color: color}}>
                    {aqi}
                  </div>
                </div>
                <div className="border border-slate-500">
                </div>
                <div className="grid grid-rows-3 grid-cols-2 gap-x-6 grid-flow-col text-slate-200 py-1">
                  <div className="flex text-sm items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#00E400]"></div>
                    <div className="text-white font-bold">0-50</div>
                    <div>Good</div>
                  </div>

                  <div className="flex text-sm items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#FFFF00]"></div>
                    <div className="text-white font-bold">51-100</div>
                    <div>Moderate</div>
                  </div>

                  <div className="flex text-sm items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#FF7E00]"></div>
                    <div className="text-white font-bold">101-150</div>
                    <div>Unhealthy for Sensitive Groups</div>
                  </div>

                  <div className="flex text-sm items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#FF0000]"></div>
                    <div className="text-white font-bold">151-200</div>
                    <div>Unhealthy</div>
                  </div>

                  <div className="flex text-sm items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#8F3F97]"></div>
                    <div className="text-white font-bold">201-300</div>
                    <div>Very Unhealthy</div>
                  </div>

                  <div className="flex text-sm items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#7E0023]"></div>
                    <div className="text-white font-bold">300+</div>
                    <div>Hazardous</div>
                  </div>
                </div>
              </div>

              <div className="w-full flex flex-col items-center gap-3">
                <div className="text-lg font-semibold text-slate-100">
                  Pollutants
                </div>
                <div className="w-full flex justify-center gap-5 flex-wrap">
                  {
                    pollutants.map((val) => (
                      <div className="border border-slate-300 shadow-lg shadow-rose-400/30 rounded-lg flex flex-col px-5 py-2 items-center min-w-44" key={val.code}>
                        <div className="flex gap-1 ml-4">
                          <div className="font-bold">{val.displayName}</div>
                          <button className="text-xs mr-1" onClick={() => {
                            setAboutOpen(true);
                            setAboutField(val.displayName);
                            setAboutFullName(val.fullName);
                            setAboutSources(pollutantInformation.find((e) => e.code == val.code).sources);
                            setAboutEffects(pollutantInformation.find((e) => e.code == val.code).effects);
                            setAboutAverage(pollutantInformation.find((e) => e.code == val.code).average)
                          }}><IoMdInformationCircleOutline /></button>
                        </div>
                        
                        <div className="text-sm text-slate-100 -mt-0.5 mb-0.25">{val.fullName}</div>
                        <div className="font-bold">{val.concentration.value} <span>{val.concentration.units == "PARTS_PER_BILLION" ? "ppb" : "ug/m3"}</span></div>
                      </div>
                    ))
                  }
                  
                </div>
              </div>

              <div className="flex flex-col items-center gap-4">
                <div className="text-lg font-semibold text-slate-100 text-center">
                  Forecast <span className="text-slate-300">(next 48 hours)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="font-semibold text-lg">
                    Select Field: 
                  </div>
                  <select value={forecastField} onChange={(e) => {setForecastField(e.target.value)}} className="shadow-md shadow-blue-400/20 font-medium bg-slate-950 border border-gray-400 text-white rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-1.5 px-2 text-purple-50">
                    <option value="" disabled>Select Field</option>
                    <option value="aqi">AQI</option>
                    <option value="co">CO</option>
                    <option value="no2">NO2</option>
                    <option value="o3">O3</option>
                    <option value="pm10">PM10</option>
                    <option value="pm25">PM2.5</option>
                    <option value="so2">SO2</option>
                  </select>
                </div>
                <div>
                  <table className="w-full table-fixed border-collapse border border-slate-500 rounded-lg">
                    <thead className="w-full bg-gray-800">
                      <tr>
                        <th className="border border-slate-500 p-2">
                            Hour of Day
                        </th>
                        <th className="border border-slate-500 p-2">
                          {(forecastField == "aqi" || forecastField == "") ? forecastField.toUpperCase() : pollutants.find((item) => item.code == forecastField).displayName} {
                            (forecastField != "aqi" && forecastField != "") && "(" + (pollutants.find((item) => item.code == forecastField).concentration.units == "PARTS_PER_BILLION" ? "ppb" : "ug/m3") + ")"
                          }
                        </th>
                      </tr>
                      
                    </thead>
                    <tbody>
                          {
                            forecastData.map((dataPoint, index) => (
                              <tr className="border border-slate-500" key={index}>
                                <td className="text-center border border-slate-500 text-slate-100 p-0.5 text-slate-300">
                                  {dataPoint.dateTime.toLocaleTimeString('en-US', {
                                    month: 'numeric',
                                    day: 'numeric',
                                    hour: 'numeric',
                                    hour12: true
                                  })}
                                </td>
                                <td className="text-center border border-slate-500 text-purple-300 p-0.5" style={forecastField == "aqi" ? {color: determineColor(dataPoint.data[forecastField].value)} : {}}>
                                  {forecastField != "" && dataPoint.data[forecastField].value}
                                </td>
                              </tr>   
                            ))
                          }
                         
                      </tbody>
                  </table>
                </div>
              </div>

             
            </div>

          </div>
        </div>
        {
          aboutOpen &&
          <div className="absolute z-[500] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-950 p-7 pt-4 shadow-xl shadow-gray-900 border border-slate-800 rounded-xl max-w-70">
            <div className="flex flex-col gap-2 items-center">
              <div onClick={() => {setAboutOpen(false)}} className="text-2xl cursor-pointer self-end">
                  <IoClose />
              </div>
              <div className="text-2xl font-bold">About {aboutField}</div>
              <div className="text-slate-100 text-lg font-bold -mt-1">{aboutFullName}</div>
              <div className="text-slate-200 font-medium text-center text-sm"><span className="text-slate-100 font-bold">Sources:</span> {aboutSources}</div>
              <div className="text-slate-200 font-medium text-center text-sm"><span className="text-slate-100 font-bold">Effects:</span> {aboutEffects}</div>
              <div className="text-slate-100 text-center font-bold">The global average is {aboutAverage}</div>
            </div>
            
          </div>
        }
      </PageWrapper>
    )
}
