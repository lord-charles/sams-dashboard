"use client";
import React from "react";
import {
  BarChart,
  Bar,
  Rectangle,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

// Override console.error
// This is a hack to suppress the warning about missing defaultProps in recharts library as of version 2.12
// @link https://github.com/recharts/recharts/issues/3615
const error = console.error;
console.error = (...args) => {
  if (/defaultProps/.test(args[0])) return;
  error(...args);
};

// Suppress Recharts Warnings

export default function ToolChart({ data, labels }) {
  const getRandomColor = () => {
    const maxDarkness = 100;
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 3; i++) {
      const component = Math.floor(Math.random() * maxDarkness);
      color += component.toString(16).padStart(2, "0");
    }
    return color;
  };
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
        {labels?.map((item, index) => {
          return (
            <Bar
              dataKey={item}
              key={index}
              fill={getRandomColor()}
              activeBar={<Rectangle fill="#432D3B" stroke="blue" />}
            />
          );
        })}
      </BarChart>
    </ResponsiveContainer>
  );
}
