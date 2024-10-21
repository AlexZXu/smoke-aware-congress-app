import crypto from "crypto"
import fetch from 'node-fetch'
import https from 'https';

const httpsAgent = new https.Agent({
	secureOptions: crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT
});

export async function GET(req, {params}) {
    console.log(params)
    const id = params.stationId
    const searchParams = req.nextUrl.searchParams
    const year = searchParams.get("year");
    const month = searchParams.get("month");
    const day = searchParams.get("day");

    console.log(year, month, day);

    const request_link = `https://wrcc.dri.edu/wea_server/getData?stn=${id}&sD=${year}-${month}-${day}&eD=${year}-${month}-${day}-23-59&units=M`

    const res = await fetch(request_link, {
        agent: httpsAgent
    })

    const data = await res.json()
    return Response.json({response: data})
}