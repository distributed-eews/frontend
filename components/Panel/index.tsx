import { useEEWS } from "@/lib/hooks/useEEWS";
import { useState } from "react";
import { ControlStations } from "./Station";

type PanelTab = "MODE" | "STATIONS" | "EVENTS" | "STATISTICS";

export const ControlPanel = () => {
  const { stations } = useEEWS();
  const [currentTab, setTab] = useState<PanelTab>("MODE");
  return (
    <div className="w-full border">
      <div className="grid grid-cols-4 gap-0 w-full">
        {["MODE", "STATIONS", "EVENTS", "STATISTICS"].map((tab, idx) => (
          <div
            key={tab + idx}
            onClick={() => setTab(tab as any)}
            className={`cursor-pointer ${currentTab == tab ? "bg-blue-300" : "bg-green-300"}`}
          >
            {tab.toLowerCase()}
          </div>
        ))}
      </div>
      <div className="p-4 flex flex-col overflow-auto max-h-[50vh] border-4">{currentTab == "STATIONS" && <ControlStations />}</div>
    </div>
  );
};
