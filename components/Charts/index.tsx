import { useEffect, useState } from "react";
import { ChannelChart } from "./channel";
import { DATA } from "../data";
import RenderIfVisible from "react-render-if-visible";
import stationdata from "../stations.json";
import { useEEWS } from "@/lib/hooks/useEEWS";
import { IPacket } from "@/lib/interfaces/waveform";

export const StationCharts = () => {
  const [count, setCount] = useState(30);
  const { channels, setChannelsWaveform } = useEEWS();
  useEffect(() => {
    //Implementing the setInterval method
    const interval = setInterval(() => {
      // if(count > 6) return
      const current = new Date().getTime();
      const data = DATA.slice(count * 100, count * 100 + 100);
      const prev = new Date().getTime()
      Object.entries(channels).forEach(([k, v]) => {
        // if(!k.startsWith("B")) return
        const p: IPacket = {
          channel: v.code,
          data: data,
          starttime: current,
          endtime: current + 5000,
          station: v.stationCode,
        };
        console.log("Added packet to ", k)
        setChannelsWaveform(k, p);
      });
      const af = new Date().getTime()
      console.log(prev)
      console.log(af)
      console.log(af-prev)
      setCount(count + 1);
    }, 5000);

    //Clearing the interval
    return () => clearInterval(interval);
  }, [count]);

  return (
    <div className="max-h-screen w-full border-4 border-black p-4 overflow-auto">
      {Object.entries(channels)
        .sort(([a, _], [b, __]) => (a > b ? 1 : -1))
        .map(([_, channel]) => (
          <RenderIfVisible key={`${channel.stationCode}-${channel.code}`} defaultHeight={100} visibleOffset={300}>
            <ChannelChart channel={channel} />
          </RenderIfVisible>
        ))}
    </div>
  );
};
