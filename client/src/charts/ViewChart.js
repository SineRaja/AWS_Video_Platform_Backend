import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from "recharts";

export default function ViewChart({ videoList }) {
  // Create data from the videoList prop
  const data = videoList.map((video) => ({
    name: video.title, // Use the video title as the X-axis label
    views: video.views // Use the views as the Y-axis value
  }));

  return (
    <AreaChart
      width={1000}
      height={300}
      data={data}
      margin={{
        top: 10,
        right: 30,
        left: 0,
        bottom: 0
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" tick={{ fontSize: 12 }} />
      <YAxis />
      <Tooltip />
      <Area type="monotone" dataKey="views" stroke="#8884d8" fill="#8884d8" />
    </AreaChart>
  );
}
