'use client'

import { MapContainer, TileLayer, useMap, Marker, Popup } from 'react-leaflet'
import React from 'react'
import "leaflet/dist/leaflet.css"
import L from "leaflet"
import { useRouter } from 'next/navigation'

const icon = L.icon({ iconUrl: "/images/marker-icon-red.png", iconSize: [18, 30] , iconAnchor: [9, 30]});

export default function LeafletMap({data, loaded, zoom, pinType, center}) {
    const mapRef = React.useRef(null)
    const router = useRouter();

    return (
        <MapContainer center={center} zoom={zoom} ref={mapRef} scrollWheelZoom={true} className="w-full h-full shadow-xl shadow-cyan-200/20 rounded-lg">
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {
                (loaded && Array.isArray(data)) && data.map((item) => {
                    return (
                        <Marker position={[item.latitude, item.longitude]} icon={icon} key={item.stationId}>
                            <Popup className="text-white">
                                {
                                   pinType == "basic" ?  
                                   <div className="text-slate-950 font-bold">
                                        {item.name}
                                    </div>
                                    :
                                    <div className="flex flex-col">
                                        <div className="text-slate-950 font-bold">
                                            {item.name}
                                        </div>
                                        <div className="text-gray-700">
                                            id: {item.stationId}
                                        </div>
                                        <button className="bg-blue-600 font-semibold rounded-lg px-6 py-0.5 mt-2 text-center text-white" onClick={() => router.push(`/smoke/${item.stationId}`)}>
                                            View Hourly
                                        </button>
                                    </div>
                                }
                                
                            </Popup>
                        </Marker>
                    )
                })
                    
            }
        </MapContainer>
    )
}