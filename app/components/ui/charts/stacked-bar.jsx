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
  ResponsiveContainer,
} from "recharts";

export default function StackedBarChart({ data }) {
  if (!data || data.length === 0) {
    return <p>No data available.</p>;
  }
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        width={500}
        height={300}
        data={data}
        margin={{
          top: 20,
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
        <Bar dataKey="male" stackId="a" fill="#57BEBB" />
        <Bar dataKey="female" stackId="a" fill="#B7E325" />
      </BarChart>
    </ResponsiveContainer>
  );
}
