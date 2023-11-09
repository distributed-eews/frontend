import { Line, XAxis, YAxis, ReferenceLine, ResponsiveContainer } from "recharts";
import dynamic from "next/dynamic";
import { IChannel } from "@/lib/interfaces/channels";
import { setWaveformTimeFromChannel } from "@/lib/functions/setWaveformTimeFromChannel";
import { getWaveformStats } from "@/lib/functions/getWaveformStats";
const LineChart = dynamic(() => import("recharts").then((recharts) => recharts.LineChart), { ssr: false });

export const ChannelChart: React.FC<{ channel: IChannel }> = ({ channel }) => {
  const waveforms = setWaveformTimeFromChannel(channel);
  const [mean, max] = getWaveformStats(waveforms);
  const arr = channel.waveform.pick?.arrival;
  const nearest = arr ? waveforms.find((w) => w.time > arr) : null;
  return (
    <div className="flex pr-10">
      <div className="flex px-2 relative">
        <div className="flex flex-col h-full justify-center">
          <h6>{channel.stationCode}</h6>
          <div className="w-full border border-black"></div>
          <h6>{`[${channel.code}]`}</h6>
        </div>
        <div className="absolute -right-1 translate-x-full top-0 z-10 h-full">
          <p>{`amax:${max}`}</p>
          <p>{`mean:${mean}`}</p>
          <p>{`Arrival:${arr && new Date(arr).toLocaleTimeString()}`}</p>
          {nearest && <p>{`nearest: ${new Date(nearest.time).toLocaleTimeString()}`}</p>}
        </div>
      </div>
      <div className="w-full pt-4">
        <ResponsiveContainer width="100%" className="" height={150}>
          <LineChart data={waveforms} margin={{ top: 5, left: 0, right: 0, bottom: 0 }}>
            <XAxis
              dataKey="time"
              xAxisId={0}
              axisLine={true}
              tickSize={10}
              interval={Math.floor(waveforms.length / 4) - 10}
              domain={["auto", "auto"]}
              padding={"gap"}
              tickFormatter={(val) =>
                val
                  ? new Date(val).toLocaleTimeString("en-US", {
                      hourCycle: "h24",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })
                  : ""
              }
            />
            <YAxis
              type="number"
              domain={([dataMin, dataMax]) => {
                const absMax = Math.max(Math.abs(dataMin), Math.abs(dataMax));
                return [-absMax, absMax];
              }}
              ticks={[0]}
            />
            <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} dot={false} />
            <ReferenceLine y={0} stroke="#888888" />
            {nearest && <ReferenceLine stroke="red" strokeWidth={2} x={nearest.time} />}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
