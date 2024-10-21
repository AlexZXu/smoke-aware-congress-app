
export async function writeData(day, options, zip) {
    const year = day.getUTCFullYear();
    const month = day.getUTCMonth() + 1;
    const date = day.getUTCDate();

    const dateString = month + "/" + date + "/" + year;
    const fileDateString = month + "-" + date + "-" + year;
    const fetchLink = `/api/day-summaries?year=${year}&month=${month}&day=${date}`
    const res = await fetch(fetchLink)
    const data = await res.json();
    let generalFields = ",,,Position (Deg.),,,Concentration(ug/m3),,,Wind,,Air Temperature (Deg C),,,Humidity (Percent),,,Barometer,Battery Voltage (volts),,,Air Flow (totalizer),,,"
    let specificFields = "Date,Station,Station Id,Latitude,Longitude,Station Chart Link,Mean,Max,Min,Ave Vel.(m/s),V. Dir. (Deg), Mean,Max,Min,Mean,Max,Min,Baro. Pressure (mbars),Mean,Max,Min,Mean,Time of latest ob, Airfire QC Report,"

    let oneEnabled = false;
    const enabled = [];
    for (const prop in options) {
        if (options[prop] == true) {
            if (prop == "Concentration(ug/m3)") {
                enabled.push("ECR");
            }
            if (prop == "Wind (m/s)") {
                enabled.push("MWS");
            }
            if (prop == "Temperature (Deg C)") {
                enabled.push("AVA");
            }
            if (prop == "Humidity (%)") {
                enabled.push("AVR");
            }

            oneEnabled = true;
            generalFields += prop + ",";
            for (let i = 0; i < 23; i++) {
                generalFields += ",";
            }

            for (let i = 0; i <= 23; i++) {
                specificFields += i + ":00,";
            }
        }
    }

    generalFields += "\n";
    specificFields += "\n";

    let csv = generalFields + specificFields;

    for (let dataObj of data.response) {
        let stringLine = "";
        stringLine += dateString + ",";
        stringLine += dataObj.name + ",";
        stringLine += dataObj.stationId + ",";
        stringLine += dataObj.latitude + "," + dataObj.longitude + ",";
        stringLine += dataObj.stationChartLink + ",";
        stringLine += dataObj.ConcentrationMean + "," + dataObj.ConcentrationMax + "," + dataObj.ConcentrationMin + ",";
        stringLine += dataObj.WindAvg + "," + dataObj.WindDir + ",";
        stringLine += dataObj.TempMean + "," + dataObj.TempMax + "," + dataObj.TempMin + ",";
        stringLine += dataObj.HumidityMean + "," + dataObj.HumidityMax + "," + dataObj.HumidityMin + ",";
        stringLine += dataObj.BaroPress + ",";
        stringLine += dataObj.VoltageMean + "," + dataObj.VoltageMax + "," + dataObj.VoltageMin + ",";
        stringLine += dataObj.AirFlowMean + "," + dataObj.LastObv + "," + dataObj.qcReportLink + ",";

        if (oneEnabled == true) {
            const id = dataObj.stationId

            const singleFetchLink = `/api/hourly/${id}?year=${year}&month=${month}&day=${date}`

            const singleRes = await fetch(singleFetchLink)
            const singleData = await singleRes.json()

            //single loop
            for (const prop of enabled) {
                if (singleData.response.hasOwnProperty("error")) {
                    for (let i = 0; i <= 23; i++) {
                        stringLine += "-1,";
                    }
                }
                else {
                    for (let i = 0; i <= 23; i++) {
                        stringLine += singleData.response.data[prop][i] + ",";
                    }
                }
            }
        }

        stringLine += "\n";
        csv += stringLine;
    }


    const file = new File([csv], "file.csv")

    zip.file(`summary-${fileDateString}.csv`, csv);

    const url = URL.createObjectURL(file)
    return {date: dateString, fileDate: fileDateString, url: url};
    // fs.writeFile('output.txt', "hi", (err) => err && console.log(error));
}


export async function writeSingleSmokeData(smokeObj, day) {
    const year = day.getUTCFullYear();
    const month = day.getUTCMonth() + 1;
    const date = day.getUTCDate();

    const dateString = month + "/" + date + "/" + year;
    const fileDateString = month + "-" + date + "-" + year;

    const fetchLink = `/api/hourly/${smokeObj.id}?year=${year}&month=${month}&day=${date}`

    const res = await fetch(fetchLink)
    const data = await res.json();

    //two headers at top of file (commas create padding)
    let header1 = "Name: " + smokeObj.name + "," + "Id: " + smokeObj.id + ",,,,,,,,,,,\n";
    let header2 = "Latitude: " + smokeObj.lat + "," + "Longitude: " + smokeObj.lng + ",,,,,,,,,,,\n";

    let csv = "";
    csv += header1;
    csv += header2;
    if (data.response.hasOwnProperty("error")) {
        csv += "No data available for this specific smoke and date,,,,,,,,,,,,\n"
    }
    else {
        let fields = "Date,Hour,Wind Speed,Battery Voltage, Ave. Air Flow, Baro. Pressure, Internal Air Temp., Wind Dir., Ave. Humidity, Ave. Air Temp, Concentration, Internal Humidity,\n"

        csv += fields;
        const elements = ["MWS", "BAT", "AAF", "ATM", "GAT", "MWD", "AVR", "AVA", "ECR", "GRH"]

        let row = "";
        for (let i = 0; i <= 23; i++) {
            row += dateString + ",";
            row += i + ":00,"
            
            
            for (const field of elements) {
                row += data.response.data[field][i] + ",";
            }

            row += "\n";
        }
        csv += row;
    }

    const file = new File([csv], "file.csv")
    const url = URL.createObjectURL(file)
    return {date: dateString, fileDate: fileDateString, url: url, smokeId: smokeObj.id};
}

