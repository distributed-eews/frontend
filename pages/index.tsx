import Image from "next/image";
import { Inter } from "next/font/google";
import { MapGL } from "@/components/Map";
import { Navbar } from "@/components/Navbar";
import { StationCharts } from "@/components/Charts";
import { useEffect } from "react";
import { onWaveformMessage } from "@/lib/functions/onWaveformMessage";
import { useEEWS } from "@/lib/hooks/useEEWS";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const {} = useEEWS()
  useEffect(() => {
    const socket = new WebSocket(`ws://localhost:8080/ws`);
    socket.onmessage = onWaveformMessage();
  }, []);

  return (
    <main className={`flex min-h-screen w-full flex-col items-start ${inter.className}`}>
      <Navbar />
      <div id="main-section" className="w-full">
        <div id="map-control" className="w-full flex">
          <div id="map" className="border-2 border-black w-3/4 h-[60vh]">
            <MapGL />
          </div>
          <div id="station-control" className="bg-yellow-300 w-1/4">
            Kontrol stasiun/mode
          </div>
        </div>
        <div className="w-full min-h-screen bg-red-300">
          <StationCharts />
        </div>
      </div>
    </main>
  );
}
