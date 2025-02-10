"use client";
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";

const data = [
  {
    name: "19-02-2024",
    male: 4000,
    female: -2400,
  },
  {
    name: "18-02-2024",
    male: 3000,
    female: -1398,
  },
  {
    name: "17-02-2024",
    male: 2000,
    female: -9800,
  },
  {
    name: "16-02-2024",
    male: 2780,
    female: -3908,
  },
  {
    name: "15-02-2024",
    male: 1890,
    female: -4800,
  },
  {
    name: "14-02-2024",
    male: 2390,
    female: -3800,
  },
  {
    name: "13-02-2024",
    male: 3490,
    female: -4300,
  },
];

export default function NegativeChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        width={500}
        height={300}
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <ReferenceLine y={0} stroke="#000" />
        <Bar dataKey="female" fill="#8884d8" />
        <Bar dataKey="male" fill="#82ca9d" />
      </BarChart>
    </ResponsiveContainer>
  );
}
