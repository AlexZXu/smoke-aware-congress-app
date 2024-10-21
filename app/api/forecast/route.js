export async function GET(req) {
    const searchParams = req.nextUrl.searchParams
    const zip = searchParams.get('zip')

    const linkPos = `https://maps.googleapis.com/maps/api/geocode/json?address=${zip}&key=${process.env.GOOGLE_API_KEY}`
    console.log(linkPos)
    const resPos = await fetch(linkPos);
    const dataPos = await resPos.json();

    const lat = dataPos.results[0].geometry.location.lat;
    const lng = dataPos.results[0].geometry.location.lng;

    const now = new Date();
    const nextHour = new Date(now);
    nextHour.setHours(now.getHours() + 1);
    nextHour.setMinutes(0);
    nextHour.setSeconds(0);
    
    console.log(nextHour.toISOString())

    const in48Hour = new Date(nextHour);
    in48Hour.setHours(in48Hour.getHours() + 47);
    in48Hour.setMinutes(0);
    in48Hour.setSeconds(0);

    const linkForecast = `https://airquality.googleapis.com/v1/forecast:lookup?key=${process.env.GOOGLE_API_KEY}`
    const resForecast1 = await fetch(linkForecast, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            location: {
                latitude: lat,
                longitude: lng
            },
            period: {
                startTime: nextHour.toISOString(),
                endTime: in48Hour.toISOString()
            },
            extraComputations: [
                "POLLUTANT_CONCENTRATION",
                "LOCAL_AQI"
            ]
        })
    })

    const dataForecast1 = await resForecast1.json();
    const part1 = dataForecast1.hourlyForecasts
    const pageToken = dataForecast1.nextPageToken

    const resForecast2 = await fetch(linkForecast, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            location: {
                latitude: lat,
                longitude: lng
            },
            period: {
                startTime: nextHour.toISOString(),
                endTime: in48Hour.toISOString()
            },
            extraComputations: [
                "POLLUTANT_CONCENTRATION",
                "LOCAL_AQI"
            ],
            pageToken: pageToken
        })
    })

    const dataForecast2 = await resForecast2.json();
    const part2 = dataForecast2.hourlyForecasts

    const forecasts = part1.concat(part2)

    return Response.json({forecast: forecasts})
}