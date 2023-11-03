import { Line, XAxis, YAxis, ReferenceLine, ResponsiveContainer } from "recharts";
import dynamic from "next/dynamic";
import moment from "moment";
import { useEffect, useState } from "react";
import { IChannel } from "@/lib/interfaces/channels";
import { IStation } from "@/lib/interfaces/stations";
const LineChart = dynamic(() => import("recharts").then((recharts) => recharts.LineChart), { ssr: false });

export const ChannelChart: React.FC<{ waveform: number[]; channel: IChannel; station: IStation }> = ({
  waveform,
  channel,
  station,
}) => {
  const now = new Date();
  const newdata = waveform.map((value, idx) => {
    return {
      value: value,
      time: now.getTime() + idx * 50,
    };
  });
  const mean = waveform.reduce((a, b) => Math.abs(a) + Math.abs(b)) / waveform.length;
  const max = waveform.reduce((a, b) => Math.max(Math.abs(a), Math.abs(b)), 0);
  return (
    <div className="flex">
      <div className="flex px-2 relative">
        <div className="flex flex-col h-full justify-center">
          <h6>{station.code}</h6>
          <div className="w-full border border-black"></div>
          <h6>{`[${channel.code}]`}</h6>
        </div>
        <div className="absolute -right-1 translate-x-full top-0 z-10 h-full">
          <p>{`amax:${max}`}</p>
          <p>{`mean:${mean}`}</p>
        </div>
      </div>
      <div className="w-full pt-4">
        <ResponsiveContainer width="100%" className="" height={150}>
          <LineChart data={newdata} margin={{ top: 5, left: 0, right: 0, bottom: 0 }}>
            <XAxis
              dataKey="time"
              xAxisId={0}
              axisLine={true}
              tickSize={10}
              interval={Math.round(newdata.length / 5)}
              domain={["auto", "auto"]}
              padding={"gap"}
              tickFormatter={(val) => (val ? new Date(val).toLocaleTimeString() : "")}
            />
            <YAxis
              type="number"
              domain={([dataMin, dataMax]) => {
                const absMax = Math.max(Math.abs(dataMin), Math.abs(dataMax));
                return [-5000, 5000];
              }}
              tick={false}
            />
            <Line type="monotone" dataKey="value" stroke="#8884d8" dot={false} />
            <ReferenceLine
                x={now.getTime() + 10 * 1000}
                stroke="red"
              />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
