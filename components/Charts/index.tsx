import { useEffect, useState } from "react";
import { ChannelChart } from "./channel";
import { DATA } from "../data";
import RenderIfVisible from "react-render-if-visible";
import stationdata from "../stations.json";

export const StationCharts = () => {
  const [count, setCount] = useState(3000);

  useEffect(() => {
    //Implementing the setInterval method
    const interval = setInterval(() => {
      setCount(count + 20);
    }, 1000);

    //Clearing the interval
    return () => clearInterval(interval);
  }, [count]);
  const data = DATA.slice(count, count + 1000);

  return (
    <div className="max-h-screen w-full border-4 border-black p-4 overflow-auto">
      {stationdata.map((station) => {
        return station.channels.map((channel) => (
          <RenderIfVisible key={`${station.code}-${channel.code}`} defaultHeight={100} visibleOffset={300}>
            <ChannelChart waveform={data} channel={channel} station={station} />
          </RenderIfVisible>
        ));
      })}
    </div>
  );
};
