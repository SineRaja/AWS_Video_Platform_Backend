import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

export default function LikeChart({ videoList }) {
  const data = videoList.map((video) => ({
    name: video.title,
    likes: video.likes.length
  }));

  return (
    <BarChart
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
      <XAxis
        dataKey="name"
        // Customize the appearance of X-axis labels
        tick={{ fontSize: 12 }} // You can change the fontSize to your preferred value
      />
      <YAxis />
      <Tooltip />
      <Bar dataKey="likes" fill="#8884d8" />
    </BarChart>
  );
}
