"use client";

import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Card, CardContent } from "@/components/ui/card";

// Workaround for Leaflet marker icon issue in Next.js
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon.src,
  iconRetinaUrl: markerIcon2x.src,
  shadowUrl: markerShadow.src,
});

interface StateData {
  id: string;
  name: string;
  schools: number;
  learners: number;
  teachers: number;
  coordinates: [number, number];
}

const southSudanData: StateData[] = [
  {
    id: "SS-CE",
    name: "Central Equatoria",
    schools: 250,
    learners: 50000,
    teachers: 2000,
    coordinates: [4.85, 31.6],
  },
  {
    id: "SS-EE",
    name: "Eastern Equatoria",
    schools: 200,
    learners: 40000,
    teachers: 1800,
    coordinates: [4.067, 33.133],
  },
  {
    id: "SS-JG",
    name: "Jonglei",
    schools: 180,
    learners: 35000,
    teachers: 1600,
    coordinates: [8.217, 32.35],
  },
  {
    id: "SS-LK",
    name: "Lakes",
    schools: 150,
    learners: 30000,
    teachers: 1400,
    coordinates: [6.8, 30.5],
  },
  {
    id: "SS-BN",
    name: "Northern Bahr el Ghazal",
    schools: 160,
    learners: 32000,
    teachers: 1500,
    coordinates: [8.77, 27.3],
  },
  {
    id: "SS-UY",
    name: "Unity",
    schools: 140,
    learners: 28000,
    teachers: 1300,
    coordinates: [9.33, 29.783],
  },
  {
    id: "SS-NU",
    name: "Upper Nile",
    schools: 170,
    learners: 34000,
    teachers: 1550,
    coordinates: [9.883, 32.717],
  },
  {
    id: "SS-WR",
    name: "Warrap",
    schools: 130,
    learners: 26000,
    teachers: 1200,
    coordinates: [8.183, 28.4],
  },
  {
    id: "SS-BW",
    name: "Western Bahr el Ghazal",
    schools: 120,
    learners: 24000,
    teachers: 1100,
    coordinates: [8.767, 25.283],
  },
  {
    id: "SS-EW",
    name: "Western Equatoria",
    schools: 190,
    learners: 38000,
    teachers: 1700,
    coordinates: [5.35, 28.3],
  },
];

export default function SouthSudanMap() {
  const [selectedState, setSelectedState] = useState<StateData | null>(null);

  return (
    <div className="z-0 relative top-10">
      <h2 className="text-4xl font-bold text-center mb-10 text-primary">
        South Sudan Education Map
      </h2>
      <Card className="mx-4">
        <CardContent className="p-6">
          <div style={{ height: "500px", width: "100%" }}>
            <MapContainer
              center={[7.863, 29.694]} // Approximate center of South Sudan
              zoom={6}
              style={{ height: "100%", width: "100%", zIndex: 0 }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {southSudanData.map((state) => (
                <Marker
                  key={state.id}
                  position={state.coordinates}
                  eventHandlers={{
                    click: () => setSelectedState(state),
                  }}
                >
                  <Popup>
                    <strong>{state.name}</strong>
                    <br />
                    Schools: {state.schools}
                    <br />
                    Learners: {state.learners.toLocaleString()}
                    <br />
                    Teachers: {state.teachers.toLocaleString()}
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </CardContent>
      </Card>
      <div className="mt-8 text-center text-sm text-muted-foreground">
        <p>Click on a marker to see detailed information about each state.</p>
      </div>
    </div>
  );
}
