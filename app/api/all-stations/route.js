import { fetchAllStations } from "../../lib/services/fetch-methods"

export async function GET(req) {
    const data = await fetchAllStations()
    return Response.json({ response: data })
}