import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css"; // Import the Leaflet CSS

export default function MapComponent({ gpsLat, gpsLng }) {
    return (
        <MapContainer center={[gpsLat, gpsLng]} zoom={9} style={{ height: "500px", width: "100%" }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={[gpsLat, gpsLng]}>
                <Popup>
                    Location: Latitude {gpsLat}, Longitude {gpsLng}
                </Popup>
            </Marker>
        </MapContainer>
    );
}
