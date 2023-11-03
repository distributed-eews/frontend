import { useEffect, useState } from "react";
import { StationChart } from "./station";
import { DATA } from "../data";
import RenderIfVisible from 'react-render-if-visible'

export const StationCharts = () => {
  const [count, setCount] = useState(3000);

  useEffect(() => {
    //Implementing the setInterval method
    const interval = setInterval(() => {
      console.log("setInterval", count);
      setCount(count + 20);
    }, 1000);

    //Clearing the interval
    return () => clearInterval(interval);
  }, [count]);
  const data = DATA.slice(count, count + 1000);

  return (
    <div className="max-h-screen w-full border-4 border-black p-4 overflow-auto">
      {Array(100)
        .fill(null)
        .map((_, idx) => (
          <RenderIfVisible key={`station-chart-${idx}`} defaultHeight={100} visibleOffset={300} >
            <StationChart waveform={data} channel={{ channel: `idx-${idx}`, enabled: true, station: "JAGI" }} />
          </RenderIfVisible>
        ))}
    </div>
  );
};
