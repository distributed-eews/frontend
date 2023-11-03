import { useEffect, useState } from "react";
import { StationChart } from "./station";
import { DATA } from "../data";

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
      {Array(10)
        .fill(null)
        .map((_, idx) => (
          <StationChart
            waveform={data}
            channel={{ channel: "BHZ", enabled: true, station: "JAGI" }}
            key={`station-chart-${idx}`}
          />
        ))}
    </div>
  );
};
