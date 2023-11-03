import { IStation } from "@/lib/interfaces/stations";
import React from "react";
import { Marker } from "react-map-gl";
import { useRef, useMemo, useCallback } from "react";
import mapboxgl from "mapbox-gl";

export const Station: React.FC<IStation> = ({ code, elevation, lat, long, name, channels }) => {
  const markerRef = useRef<mapboxgl.Marker>(null);

  const popup = useMemo(() => {
    return new mapboxgl.Popup().setHTML(
      `<div>
        <p>Kode: ${code}</p>
        <p>Nama: ${name}</p>
        <p>Lat:${lat}</p>
        <p>Long:${long}</p>
        <p>Elevation:${elevation}</p>
        <p>Channel: ${channels!.map(c=>c.code).join(", ")}</p>
        </div>`
    );
  }, []);

  const togglePopup = useCallback(() => {
    markerRef.current?.togglePopup();
  }, []);

  return (
    <Marker
      anchor="center"
      scale={0.7}
      ref={markerRef}
      popup={popup}
      onClick={togglePopup}
      latitude={Number(lat)}
      longitude={Number(long)}
    ></Marker>
  );
};
