import { parse } from 'node-html-parser';
import crypto from "crypto"
import fetch from 'node-fetch'
import https from 'https';

const httpsAgent = new https.Agent({
	secureOptions: crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT
});

export async function fetchDailySummary(year, month, day) {
    let parseYear = '0' + year
    let parseMonth = '0' + month
    let parseDay = '0' + day

    parseYear = parseYear.slice(-2);
    parseMonth = parseMonth.slice(-2);
    parseDay = parseDay.slice(-2);

    const request_link = `https://wrcc.dri.edu/cgi-bin/smoke.pl?mon=${parseMonth}&day=${parseDay}&yea=${parseYear}`
    
    const date = new Date(year, month - 1, day);
    const today = new Date();

    if (date > today) {
        return "In future"
    }

    const res = await fetch(request_link, {
        agent: httpsAgent
    })

    const data = await res.text();
    const html = parse(data);

    const content = html.getElementsByTagName('head')[0].getElementsByTagName('script').at(-1).textContent;
    const indexOf = content.indexOf("fnLeaflet_Pin_Add")

    if (indexOf == -1) {
        return []
    }

    var stringCoord = content.substring(indexOf, content.lastIndexOf("}"));

    stringCoord = stringCoord.replaceAll("\'", "");
    stringCoord = stringCoord.replaceAll("\n", "");
    stringCoord = stringCoord.replaceAll("    ", "");
    stringCoord = stringCoord.replaceAll(" + ", "");
    
    const coord_list = stringCoord.split(");");
    
    const coord_map = new Map();
    const objectList = []

    for (const coord of coord_list) {
        let i = coord.indexOf("(")
        
        if (i == -1) {
            continue
        }
        
        i += 1
        
        let latstring = ""
        while (i < coord.length) {
            if (coord[i] == ',') {
                i += 1
                break
            }
            else {
                latstring += coord[i]
            }

            i += 1
        }
        
        let longstring = ""
        while (i < coord.length) {
            if (coord[i] == ',') {
                i += 1
                break
            }
            else {
                longstring += coord[i]
            }

            i += 1
        }

        const latitude = parseFloat(latstring)
        const longitude = parseFloat(longstring)
        
        const coord_array = [latitude, longitude]
        
        const coord_html = parse(coord)
        const link = coord_html.querySelector('a').getAttribute("href")
        const id = getIdFromLink(link)

        coord_map.set(id, coord_array)
    }
        
    const data_table = html.querySelector('table[cellpadding="0"]')

    const data_table_rows = data_table.querySelectorAll('tr[class="data"]')

    for (const row of data_table_rows) {
        const values = row.querySelectorAll("td")

        const first_link = values[0].querySelector("a")
        
        const station_name = first_link.textContent.trim()
        const station_chart_link = first_link.getAttribute("href")
        const id = getIdFromLink(station_chart_link)
        const smokeObj = {}

        const data = []
        const dataFields = ["", "ConcentrationMean", "ConcentrationMax", "ConcentrationMin", "", "WindAvg", "WindDir", "", "TempMean", "TempMax", "TempMin", "", "HumidityMean", "HumidityMax", "HumidityMin", "", "BaroPress", "", "VoltageMean", "VoltageMax", "VoltageMin", "", "AirFlowMean", "", "LastObv"]
        
        //concentration (takes next 3 cells)
        for (let i = 1; i < 4; i++) {
            const val = dataAtCell(values, i, true)
            data.push(val)
            smokeObj[dataFields[i]] = val
            // data.append(values[i].contents[0].strip())
        }
        
        //wind (takes next 2 cells)
        for (let i = 5; i < 7; i++) {
            const val = dataAtCell(values, i, true)
            data.push(val)
            smokeObj[dataFields[i]] = val
        }

        //air temp (takes next 3 cells)
        for (let i = 8; i < 11; i++) {
            const val = dataAtCell(values, i, true)
            data.push(val)
            smokeObj[dataFields[i]] = val
        }

        //humidity (takes next 3 cells)
        for (let i = 12; i < 15; i++) {
            const val = dataAtCell(values, i, true)
            data.push(val)
            smokeObj[dataFields[i]] = val
        }

        //barometer (takes next cell)
        for (let i = 16; i < 17; i++) {
            const val = dataAtCell(values, i, true)
            data.push(val)
            smokeObj[dataFields[i]] = val
        }
        
        //battery voltage (takes next 3 cells)
        for (let i = 18; i < 21; i++) {
            const val = dataAtCell(values, i, true)
            data.push(val)
            smokeObj[dataFields[i]] = val
        }
    
        //air flow (takes next cell)
        for (let i = 22; i < 23; i++) {
            const val = dataAtCell(values, i, true)
            data.push(val)
            smokeObj[dataFields[i]] = val
        }
        
        //time of last observation (takes next cell)
        for (let i = 24; i < 25; i++) {
            const val = dataAtCell(values, i, false)
            data.push(val)
            smokeObj[dataFields[i]] = val
        }
        
        let qc_report_link = ""
        try {
            qc_report_link = values[26].querySelector("a").getAttribute("href")
        } 
        catch {
            qc_report_link = ""
        }

        const full_row = []

        full_row.push(station_name)
        full_row.push(id)

        smokeObj.name = station_name
        smokeObj.stationId = id

        const coords = coord_map.get(id)
        full_row.push(coords[0])
        full_row.push(coords[1])

        smokeObj.latitude = coords[0]
        smokeObj.longitude = coords[1]

        full_row.push(station_chart_link)
        
        smokeObj.stationChartLink = station_chart_link

        for (const item of data) {
            full_row.push(item)
        }

        full_row.push(qc_report_link)

        smokeObj.qcReportLink = qc_report_link
        objectList.push(smokeObj)
    }
    
    return objectList
}

function getIdFromLink(link) {
    return link.substring(link.indexOf("?id") + 3, link.indexOf("+"))
}

function dataAtCell(values, i, tryParse) {
    let val = values[i].textContent.trim()
    if (val != "" && tryParse == true) {
        val = parseFloat(val)
    }

    return val
}

export function fetchAllStations() {
    const stationList = [
        {'name': 'Smoke #13', 'stationId': 'sm13', 'latitude': 39.7143, 'longitude': -105.1239}, 
        {'name': 'Smoke RMK 112 (Smoke #11)', 'stationId': 'sm11', 'latitude': 48.3086, 'longitude': -120.6567}, 
        {'name': 'Smoke RMK 104 (Smoke #15)', 'stationId': 'sm15', 'latitude': 39.7144, 'longitude': -105.124}, 
        {'name': 'Smoke RMK 114 (Smoke #19)', 'stationId': 'sm19', 'latitude': 39.7144, 'longitude': -105.1239}, 
        {'name': 'Smoke RMK 105 (Smoke #17)', 'stationId': 'sm17', 'latitude': 43.1921, 'longitude': -122.1367}, 
        {'name': 'Smoke #25', 'stationId': 'sm25', 'latitude': 36.7912, 'longitude': -118.6709}, 
        {'name': 'Smoke RMK 117 (Smoke #22)', 'stationId': 'sm22', 'latitude': 39.7144, 'longitude': -105.1239}, 
        {'name': 'Smoke RMK 119 (Smoke #24)', 'stationId': 'sm24', 'latitude': 39.7143, 'longitude': -105.1239}, 
        {'name': 'Smoke RMK 118 (Smoke #23)', 'stationId': 'sm23', 'latitude': 44.4088, 'longitude': -116.022}, 
        {'name': 'Smoke RMK 116 (Smoke #21)', 'stationId': 'sm21', 'latitude': 39.7143, 'longitude': -105.1241}, 
        {'name': 'Smoke RMK 113 (Smoke #16)', 'stationId': 'sm16', 'latitude': 39.7144, 'longitude': -105.1239}, 
        {'name': 'Smoke RMK 115 (Smoke #20)', 'stationId': 'sm20', 'latitude': 44.1709, 'longitude': -114.927}, 
        {'name': 'Smoke RMK 107 (Smoke #67)', 'stationId': 'sm67', 'latitude': 39.7144, 'longitude': -105.1239}, 
        {'name': 'Smoke RMK 122 (Smoke #69)', 'stationId': 'sm69', 'latitude': 39.7144, 'longitude': -105.124}, 
        {'name': 'Smoke RMK 121 (Smoke #68)', 'stationId': 'sm68', 'latitude': 47.8999, 'longitude': -120.1411}, 
        {'name': 'Smoke RMK 106 (Smoke #66)', 'stationId': 'sm66', 'latitude': 39.7144, 'longitude': -105.124}, 
        {'name': 'Smoke E-BAM 52', 'stationId': 'sm52', 'latitude': 46.9268, 'longitude': -114.0961}, 
        {'name': 'FWS Smoke #1', 'stationId': 'smf1', 'latitude': 39.7144, 'longitude': -105.124}, 
        {'name': 'Smoke USFS R9-60', 'stationId': 's960', 'latitude': 36.6465, 'longitude': -90.7808}, 
        {'name': 'Smoke #86', 'stationId': 'sm86', 'latitude': 46.9268, 'longitude': -114.0961}, 
        {'name': 'Smoke USFS R1-52', 'stationId': 's152', 'latitude': 46.9269, 'longitude': -114.0961}, 
        {'name': 'Smoke USFS R9-16', 'stationId': 's916', 'latitude': 36.7627, 'longitude': -90.4102}, 
        {'name': 'Smoke USFS R1-53', 'stationId': 's153', 'latitude': 46.7815, 'longitude': -114.0108}, 
        {'name': 'Smoke USFS R1-39', 'stationId': 's139', 'latitude': 46.7847, 'longitude': -113.7152}, 
        {'name': 'Smoke USFS R9-15', 'stationId': 's915', 'latitude': 43.8159, 'longitude': -71.6664}, 
        {'name': 'Smoke USFS R9-17', 'stationId': 's917', 'latitude': 43.8159, 'longitude': -71.6664}, 
        {'name': 'Smoke USFS R3-86', 'stationId': 's386', 'latitude': 35.687, 'longitude': -105.8956}, 
        {'name': 'Smoke USFS R2-65', 'stationId': 's265', 'latitude': 44.4972, 'longitude': -115.9198}, 
        {'name': 'Smoke USFS R3-28', 'stationId': 's328', 'latitude': 35.6716, 'longitude': -105.9555}, 
        {'name': 'Smoke RMK 109 (Smoke #84)', 'stationId': 's284', 'latitude': 45.4073, 'longitude': -113.9975}, 
        {'name': 'Smoke USFS R2-78', 'stationId': 's278', 'latitude': 39.7143, 'longitude': -105.124}, 
        {'name': 'Smoke USFS R2-69', 'stationId': 's269', 'latitude': 38.9793, 'longitude': -105.353}, 
        {'name': 'Smoke USFS R5-39', 'stationId': 's539', 'latitude': 36.8298, 'longitude': -119.6851}, 
        {'name': 'Smoke USFS R5-49', 'stationId': 's549', 'latitude': 1.0, 'longitude': -9999}, 
        {'name': 'Smoke E-BAM 65', 'stationId': 'sm65', 'latitude': 46.9269, 'longitude': -114.096}, 
        {'name': 'Smoke RMK 110 (Smoke #215)', 'stationId': 's215', 'latitude': 39.7144, 'longitude': -105.1239}, 
        {'name': 'Smoke RMK 125 (Smoke #216)', 'stationId': 's216', 'latitude': 43.3039, 'longitude': -123.1403}, 
        {'name': 'Smoke RMK 126 (Smoke #217)', 'stationId': 's217', 'latitude': 39.7143, 'longitude': -105.1239}, 
        {'name': 'Smoke #1 North Carolina', 'stationId': 'smn1', 'latitude': 35.32, 'longitude': -82.4}, 
        {'name': 'Smoke #2 North Carolina', 'stationId': 'smn2', 'latitude': 35.35, 'longitude': -77.67}, 
        {'name': 'Smoke #3 North Carolina', 'stationId': 'smn3', 'latitude': 35.35, 'longitude': -77.67}, 
        {'name': 'Smoke NPS Yosemite 01', 'stationId': 'smy1', 'latitude': 37.5399, 'longitude': -119.6582}, 
        {'name': 'Smoke RMK 412 (EBAM #840)', 'stationId': 'e840', 'latitude': 39.7144, 'longitude': -105.1239}, 
        {'name': 'Smoke RMK 415 (EBAM #925)', 'stationId': 'e925', 'latitude': 39.7137, 'longitude': -105.1229}, 
        {'name': 'Smoke RMK 413 (EBAM #866)', 'stationId': 'e866', 'latitude': 39.7143, 'longitude': -105.1239}, 
        {'name': 'Smoke RMK 407 (EBAM #231)', 'stationId': 'e231', 'latitude': 39.7144, 'longitude': -105.1239}, 
        {'name': 'Smoke USFS R1-306', 'stationId': '1306', 'latitude': 46.7354, 'longitude': -113.9307}, 
        {'name': 'Smoke USFS R1-307', 'stationId': '1307', 'latitude': 46.7847, 'longitude': -113.7153}, 
        {'name': 'Smoke USFS R2-264', 'stationId': '2264', 'latitude': 40.742, 'longitude': -105.5085}, 
        {'name': 'Smoke USFS R2-265', 'stationId': '2265', 'latitude': 39.7144, 'longitude': -105.124}, 
        {'name': 'Smoke USFS R8-33', 'stationId': 's833', 'latitude': 35.3937, 'longitude': -82.7743}, 
        {'name': 'Smoke RMK 129 (Smoke #R2-922)', 'stationId': '2922', 'latitude': 39.7144, 'longitude': -105.1239}, 
        {'name': 'Smoke RMK 130 (Smoke #R2-923)', 'stationId': '2923', 'latitude': 46.7227, 'longitude': -120.6843}, 
        {'name': 'Smoke RMK 131 (Smoke #R2-924)', 'stationId': '2924', 'latitude': 39.7144, 'longitude': -105.124}, 
        {'name': 'Smoke USFS R8-34', 'stationId': 's834', 'latitude': 35.6118, 'longitude': -82.569}, 
        {'name': 'RSF Smoke Monitor #1', 'stationId': 'smrs', 'latitude': 42.194, 'longitude': -122.7085}, 
        {'name': 'Smoke USFS 3015', 'stationId': 's315', 'latitude': 46.5868, 'longitude': -112.0485}, 
        {'name': 'Smoke USFS R9-3017', 'stationId': 's317', 'latitude': 36.9524, 'longitude': -91.1638}, 
        {'name': 'Smoke USFS R9-3018', 'stationId': 's318', 'latitude': 36.6466, 'longitude': -90.7802}, 
        {'name': 'Lolo NF Smoke Monitor #1', 'stationId': 'sml1', 'latitude': 47.1955, 'longitude': -114.8941}, 
        {'name': 'Lolo NF Smoke Monitor #2', 'stationId': 'sml2', 'latitude': 46.9268, 'longitude': -114.0963}, 
        {'name': 'Smoke USFS 3016', 'stationId': 's316', 'latitude': 46.7535, 'longitude': -114.0835}, 
        {'name': 'Smoke USFS R8-35', 'stationId': 's835', 'latitude': 37.5269, 'longitude': -79.6804}, 
        {'name': 'Smoke USFS R8-56', 'stationId': 's856', 'latitude': 37.4547, 'longitude': -79.6021}, 
        {'name': 'Smoke USFS R8-55', 'stationId': 's855', 'latitude': 37.3851, 'longitude': -79.7302}, 
        {'name': 'Smoke RMK 408 (EBAM #418)', 'stationId': 'e418', 'latitude': 39.7144, 'longitude': -105.124}, 
        {'name': 'Smoke RMK 101143 (E-BAM 591)', 'stationId': 'e591', 'latitude': 39.7138, 'longitude': -105.1228}, 
        {'name': 'Smoke RMK 414 (EBAM #882)', 'stationId': 'e882', 'latitude': 39.7138, 'longitude': -105.1228}, 
        {'name': 'Smoke E-BAM 969', 'stationId': 'e969', 'latitude': 47.1751, 'longitude': -114.0796}, 
        {'name': 'Smoke RMK 409 (EBAM #592)', 'stationId': 'e592', 'latitude': 39.7144, 'longitude': -105.124}, 
        {'name': 'Smoke RMK 108 (Smoke #456)', 'stationId': 's456', 'latitude': 45.5341, 'longitude': -121.57},
        {'name': 'Smoke RMK 124 (Smoke #210)', 'stationId': 's210', 'latitude': 39.7144, 'longitude': -105.124}, 
        {'name': 'Smoke QD Test', 'stationId': 'sqdt', 'latitude': 39.389, 'longitude': -105.2734}, 
        {'name': 'Smoke RMK 411 (EBAM #794)', 'stationId': 'e794', 'latitude': 39.7144, 'longitude': -105.124}, 
        {'name': 'Smoke RMK 111 (Smoke #455)', 'stationId': 's455', 'latitude': 46.0229, 'longitude': -121.3012}, 
        {'name': 'Smoke RMK 127', 'stationId': 's454', 'latitude': 40.6233, 'longitude': -111.2282}, 
        {'name': 'Smoke RMK 128', 'stationId': 's457', 'latitude': 43.4608, 'longitude': -121.6967}, 
        {'name': 'Smoke RMK 123 (Smoke #209)', 'stationId': 's209', 'latitude': 39.7144, 'longitude': -105.1239}, 
        {'name': 'Smoke RMK 410 (EBAM #787)', 'stationId': 'e787', 'latitude': 39.7143, 'longitude': -105.1239}, 
        {'name': 'Smoke BLM NV-Wid #1 PM2.5', 'stationId': 'snv1', 'latitude': 40.6594, 'longitude': -119.3693}, 
        {'name': 'Smoke BLM NV-Wid #2 PM10 ', 'stationId': 'snv2', 'latitude': 40.6594, 'longitude': -119.3693}, 
        {'name': 'AQB Smoke EBAMS T-2', 'stationId': 'eat2', 'latitude': 33.546, 'longitude': -105.5833}, 
        {'name': 'AQB Smoke EBAMS T-1', 'stationId': 'eat1', 'latitude': 33.3504, 'longitude': -105.6761}, 
        {'name': 'CARB EBAMS 1', 'stationId': 'sce1', 'latitude': 38.6966, 'longitude': -122.0188}, 
        {'name': 'CARB EBAMS 2', 'stationId': 'sce2', 'latitude': 39.3964, 'longitude': -121.1439}, 
        {'name': 'AQB Smoke EBAMS T-3', 'stationId': 'eat3', 'latitude': 33.2986, 'longitude': -105.6602}, 
        {'name': 'Smoke RMK 400 (EBAM #487)', 'stationId': 'e487', 'latitude': 44.0758, 'longitude': -115.5984}, 
        {'name': 'Smoke RMK 401 (EBAM #488)', 'stationId': 'e488', 'latitude': 39.7143, 'longitude': -105.1239}, 
        {'name': 'Smoke RMK 402 (EBAM #493)', 'stationId': 'e493', 'latitude': 38.7826, 'longitude': -104.6908}, 
        {'name': 'Smoke RMK 404 (EBAM #513)', 'stationId': 'e513', 'latitude': 39.7144, 'longitude': -105.124}, 
        {'name': 'Smoke RMK 405 (EBAM #947)', 'stationId': 'e947', 'latitude': 39.7143, 'longitude': -105.1239}, 
        {'name': 'Smoke RMK 100 (Smoke #659)', 'stationId': 's659', 'latitude': 44.1787, 'longitude': -122.119}, 
        {'name': 'Smoke RMK 102 (Smoke #661)', 'stationId': 's661', 'latitude': 44.1373, 'longitude': -118.9728}, 
        {'name': 'Smoke RMK 103 (Smoke #662)', 'stationId': 's662', 'latitude': 45.9995, 'longitude': -121.5416}, 
        {'name': 'Smoke RMK 406 (EBAM #949)', 'stationId': 'e949', 'latitude': 39.7144, 'longitude': -105.124}, 
        {'name': 'Smoke RMK 101 (Smoke #660)', 'stationId': 's660', 'latitude': 39.7144, 'longitude': -105.1239}, 
        {'name': 'Smoke RMK 403 (EBAM #494)', 'stationId': 'e494', 'latitude': 39.7143, 'longitude': -105.1239}, 
        {'name': 'Smoke #01', 'stationId': 'se01', 'latitude': 39.665, 'longitude': -105.3398}, 
        {'name': 'Smoke USFS R8-96', 'stationId': 's896', 'latitude': 35.5047, 'longitude': -82.5963}
    ]

    return stationList
}

export function fetchItemFromStations(id) {
    const stationList = fetchAllStations();

    for (const item of stationList) {
        if (item.stationId == id) {
            return item;
        }
    }

    return {};

}