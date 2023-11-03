import Image from "next/image";
import { Inter } from "next/font/google";
import { MapGL } from "@/components/map";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <main className={`flex min-h-screen w-full flex-col items-start ${inter.className}`}>
      <nav className="w-full h-20 bg-pink-300">Navbar</nav>
      <section id="main-section" className="w-full px-8">
        <section id="map-control" className="w-full flex">
          <div id="map" className="border-2 border-black w-3/4 h-[60vh]">
            <MapGL />
          </div>
          <div id="station-control" className="bg-yellow-300 w-1/4">Kontrol stasiun/mode</div>
        </section>
        <div className="w-full min-h-screen bg-red-300">Gelombang di sini</div>
      </section>
    </main>
  );
}
