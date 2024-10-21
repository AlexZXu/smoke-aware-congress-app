export async function GET(req) {
    const searchParams = req.nextUrl.searchParams
    const zip = searchParams.get('zip')

    const linkPos = `https://maps.googleapis.com/maps/api/geocode/json?address=${zip}&key=${process.env.GOOGLE_API_KEY}`
    console.log(linkPos)
    const resPos = await fetch(linkPos);
    const dataPos = await resPos.json();

    const lat = dataPos.results[0].geometry.location.lat;
    const lng = dataPos.results[0].geometry.location.lng;

    const linkAqi = `https://airquality.googleapis.com/v1/currentConditions:lookup?key=${process.env.GOOGLE_API_KEY}`
    const resAqi = await fetch(linkAqi, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            location: {
                latitude: lat,
                longitude: lng
            },
            extraComputations: [
                "HEALTH_RECOMMENDATIONS",
                "DOMINANT_POLLUTANT_CONCENTRATION",
                "POLLUTANT_CONCENTRATION",
                "LOCAL_AQI",
                "POLLUTANT_ADDITIONAL_INFO"
            ]
        })
    });
    const dataAqi = await resAqi.json();


    return Response.json({current: dataAqi})
}