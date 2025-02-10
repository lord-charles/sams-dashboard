import React from "react";
import {
  BarChart,
  Bar,
  Rectangle,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function VerticalBarChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        width={500}
        height={300}
        layout="vertical"
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" />
        <YAxis type="category" dataKey="name" fontSize="12" />
        <Tooltip />
        <Legend />

        <Bar
          dataKey="allowances"
          fill="#FDBB2C"
          activeBar={<Rectangle fill="pink" stroke="blue" />}
        />
        <Bar
          dataKey="repairs"
          fill="#B1CF4B"
          activeBar={<Rectangle fill="gold" stroke="purple" />}
        />
        <Bar
          dataKey="learning"
          fill="#BA30FB"
          activeBar={<Rectangle fill="gold" stroke="purple" />}
        />
        <Bar
          dataKey="meals"
          fill="#022CFB"
          activeBar={<Rectangle fill="gold" stroke="purple" />}
        />
        <Bar
          dataKey="books"
          fill="#E56A2A"
          activeBar={<Rectangle fill="gold" stroke="purple" />}
        />
        <Bar
          dataKey="utilities"
          fill="#ACACAC"
          activeBar={<Rectangle fill="gold" stroke="purple" />}
        />
        <Bar
          dataKey="travel"
          fill="#236642"
          activeBar={<Rectangle fill="gold" stroke="purple" />}
        />
        <Bar
          dataKey="recruitment"
          fill="#232E66"
          activeBar={<Rectangle fill="gold" stroke="purple" />}
        />
        <Bar
          dataKey="classroom"
          fill="#663823"
          activeBar={<Rectangle fill="gold" stroke="purple" />}
        />
        <Bar
          dataKey="others"
          fill="#60BABA"
          activeBar={<Rectangle fill="gold" stroke="purple" />}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
