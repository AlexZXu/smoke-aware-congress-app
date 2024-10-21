import {doc, getDoc} from "firebase/firestore"
import { db } from "@/app/lib/firebase"
import { fetchDailySummary } from "../../lib/services/fetch-methods"
import { fetchDateRange } from "@/app/lib/services/upload"
import { createDoc } from "@/app/lib/services/upload"

export async function GET(req) {
    const searchParams = req.nextUrl.searchParams

    const year = searchParams.get('year')
    const month = searchParams.get('month')
    const day = searchParams.get('day')

    const ye = ('0' + year).slice(-2);
    const mo = ('0' + month).slice(-2);
    const da = ('0' + day).slice(-2);

    const docSnap = await getDoc(doc(db, "day-summaries", `${ye}_${mo}_${da}`))
    let res;

    if (docSnap.exists()) {
        res = docSnap.data().items

        const today = new Date()
        const date = new Date(`${year}-${month}-${day}`)

        if (sameDay(today, date) && docSnap.data().timestamp.hasOwnProperty('seconds')) {
            const hours = (new Date().getTime() - docSnap.data().timestamp.seconds * 1000) / 36e5;
            if (hours > 4) {
                const val = await fetchDailySummary(year, month, day)
                await createDoc(val, ye, mo, da)
            }
        }
    }
    else {
        res = await fetchDailySummary(year, month, day)
        
        if (Array.isArray(res)) {
            await createDoc(res, ye, mo, da)        
        }
    }

    return Response.json({response: res})
}

function sameDay(d1, d2) {
    return (d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate());
}