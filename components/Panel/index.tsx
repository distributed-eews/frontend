import { useEEWS } from "@/lib/hooks/useEEWS";
import { useState } from "react";
import { ControlStations } from "./Station";
import { ControlMode } from "./Mode";
import { ControlPickEvent } from "./PickEvent";
import { ControlStatistics } from "./Statistics";

type PanelTab = "MODE" | "STATIONS" | "PICK/EVENTS" | "STATISTICS";

export const ControlPanel = () => {
  const { stations } = useEEWS();
  const [currentTab, setTab] = useState<PanelTab>("MODE");
  return (
    <div className="w-full border">
      <div className="grid grid-cols-4 gap-0 w-full">
        {["MODE", "STATIONS", "PICK/EVENTS", "STATISTICS"].map((tab, idx) => (
          <div
            key={tab + idx}
            onClick={() => setTab(tab as any)}
            className={`cursor-pointer text-sm px-2 text-center text-white font-semibold py-1 ${currentTab == tab ? "bg-red-800" : "bg-red-600"} hover:bg-red-800`}
          >
            {tab.toLowerCase()}
          </div>
        ))}
      </div>
      <div className="p-4 flex flex-col overflow-auto max-h-[50vh] border-4">
        {currentTab == "STATIONS" && <ControlStations />}
        {currentTab == "MODE" && <ControlMode />}
        {currentTab == "PICK/EVENTS" && <ControlPickEvent/>}
        {currentTab == "STATISTICS" && <ControlStatistics/>}
      </div>
    </div>
  );
};
