import { fetchDateRange } from "@/app/lib/services/upload"

export async function GET(req) {
    fetchDateRange("8/27/2024", "8/29/2024")
    
    return Response.json({})
}