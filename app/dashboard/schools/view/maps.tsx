"use client"

import { useEffect, useState } from "react"
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import "leaflet/dist/leaflet.css"

function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap()

  useEffect(() => {
    map.setView(center, map.getZoom())
  }, [center, map])

  return null
}

interface LocationMapProps {
  gpsLat: number
  gpsLng: number
  schoolName?: string
}

export default function LocationMap({ gpsLat, gpsLng, schoolName = "School Location" }: LocationMapProps) {
  const position: [number, number] = [gpsLat, gpsLng]
  const [mapKey, setMapKey] = useState(Date.now()) // Used to force re-render when props change

  // Update map when coordinates change
  useEffect(() => {
    setMapKey(Date.now())
  }, [gpsLat, gpsLng])

  return (
    <MapContainer
      key={mapKey}
      center={position}
      zoom={13}
      style={{ height: "400px", width: "100%", borderRadius: "0.375rem" }}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={position}>
        <Popup>
          <div className="text-center">
            <strong>{schoolName}</strong>
            <div className="text-sm mt-1">
              Latitude: {gpsLat.toFixed(6)}
              <br />
              Longitude: {gpsLng.toFixed(6)}
            </div>
          </div>
        </Popup>
      </Marker>
      <MapUpdater center={position} />
    </MapContainer>
  )
}
