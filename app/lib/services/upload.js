import fs from "fs"
import { parse } from "csv-parse";
import { db } from '../firebase';
import { collection, doc, setDoc, Timestamp } from "firebase/firestore";
import { jsx } from "react/jsx-runtime";

// export function fetch(year, month, day) {
//     var stor = []
//     fs.createReadStream(`\app\\lib\\sample_data\\smoke_summary_${year}_${month}_${day}.csv`)
//         .pipe(parse({ delimiter: ","}))
//         .on("data", function (row) {
//             stor.push(row)
//         })
//         .on("error", function (error) {
//             console.log(error.message);
//         })
//         .on("end", function () {
//             handleComplete(stor, year, month, day);
            
//             () => process.exit()
//      });

//      console.log(stor)
// }

// export function fetchDateRange (startDate, endDate) {
//     let dateOne = new Date(startDate);
//     let dateTwo = new Date(endDate);
//     for(var i = dateOne; i<= dateTwo; i.setDate(i.getDate()+1)){
//         const ye = ('0' + i.getFullYear()).slice(-2);
//         const mo = ('0' + (i.getMonth() + 1)).slice(-2);
//         const da = ('0' + i.getDate()).slice(-2);

//         fetch(ye, mo, da);
//     }
// }

export async function createDoc(list, year, month, day) {
    const docRef = await setDoc(doc(db, "day-summaries", `${year}_${month}_${day}`), {
        timestamp: Timestamp.fromDate(new Date()),
        items: list
    })
}

// async function handleComplete(stor, year, month, day) {
//     const list = []
//     for (let i = 2; i < stor.length; i++) {
//         const row = stor[i];
//         const smokeObj = {};
//         let index = 0;

//         //date
//         smokeObj.date = (row[index] != "-9999" ? row[index] : "");
        
//         //name
//         index++;
//         smokeObj.name = (row[index] != "-9999" ? row[index] : "")
        
//         //position
//         index++;
//         smokeObj.latitude = (row[index] != "-9999" ? parseFloat(row[index]) : "");
//         index++;
//         smokeObj.longitude = (row[index] != "-9999" ? parseFloat(row[index]) : "");

//         //id
//         index++;
//         const link = (row[index] != "-9999" ? row[index] : "");
//         smokeObj.stationId = getIdFromLink(link);

//         smokeObj.stationChartLink = link;

//         const dataFields = ["ConcentrationMean", "ConcentrationMax", "ConcentrationMin", "WindAvg", "WindDir", "TempMean", "TempMax", "TempMin", "HumidityMean", "HumidityMax", "HumidityMin", "BaroPress", "VoltageMean", "VoltageMax", "VoltageMin", "AirFlowMean", "LastObv", "qcReportLink"]
//         const isNumber = [true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, false, false]
//         for (let j = 5; j < dataFields.length + 5; j++) {
//             if (isNumber[j - 5]) {
//                 smokeObj[dataFields[j - 5]] = (row[j] != "-9999" ? parseFloat(row[j]) : "")
//             }
//             else {
//                 smokeObj[dataFields[j - 5]] = (row[j] != "-9999" ? row[j] : "")
//             }
//         }

//         list.push(smokeObj)
//     }

    
//     const docRef = await setDoc(doc(db, "day-summaries", `${year}_${month}_${day}`), {
//         items: list
//     })

// }


// function getIdFromLink(link) {
//     return link.substring(link.indexOf("?id") + 3, link.indexOf("+"))
// }
