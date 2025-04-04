"use client";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
export const Charts = ({
  data: { sales },
}: {
  data: { sales: { month: string; totalSales: number }[] };
}) => {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={sales}>
        <XAxis
          dataKey="month"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value}`}
        />
        <Bar dataKey="totalSales" fill="currentColor" className="fill-gray-800" radius={[8, 8, 4, 4]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default Charts;
