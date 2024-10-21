import { fetchDailySummary } from "../../lib/services/fetch-methods"

export async function GET(req) {
    const searchParams = req.nextUrl.searchParams
    const year = searchParams.get('year')
    const month = searchParams.get('month')
    const day = searchParams.get('day')
    

    const data = await fetchDailySummary(year, month, day)
    
    return Response.json({ response: data })
}