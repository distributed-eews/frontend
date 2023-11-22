import Image from "next/image";
import { Inter } from "next/font/google";
import { MapGL } from "@/components/Map";
import { Navbar } from "@/components/Navbar";
import { StationCharts } from "@/components/Charts";
import { useEffect, useState } from "react";
import { useEEWS } from "@/lib/hooks/useEEWS";
import { ControlPanel } from "@/components/Panel";
import { createWSConnection } from "@/lib/connection";
import  { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [connection, setConnection] = useState<WebSocket>();
  const { stations, packetsCount, websocketCallbacks } = useEEWS();
  useEffect(() => {
    if (!connection && Object.entries(stations).length > 0 && !!packetsCount) {
      console.log(stations)
      const websocket = createWSConnection("/ws", websocketCallbacks)
      setConnection(websocket);
    }
  }, [connection, packetsCount, stations, websocketCallbacks]);

  return (
    <main className={`flex min-h-screen w-full flex-col items-start ${inter.className}`}>
      <Navbar />
      <div id="main-section" className="w-full">
        <Toaster />
        <div id="map-control" className="w-full flex">
          <div id="map" className="border-2 border-black w-3/4 h-[60vh]">
            <MapGL />
          </div>
          <div id="station-control" className="bg-indigo-100 w-1/4">
            <ControlPanel />
          </div>
        </div>
        <div className="w-full min-h-screen bg-indigo-100">
          <StationCharts />
        </div>
      </div>
    </main>
  );
}
