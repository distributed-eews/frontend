import { IStation } from "@/lib/interfaces/stations";
import React from "react";
import { Marker } from "react-map-gl";
import { useRef, useMemo, useCallback } from "react";
import mapboxgl from "mapbox-gl";

export const Station: React.FC<IStation> = ({ code, elevation, lat, long, name, channels }) => {
  const markerRef = useRef<mapboxgl.Marker>(null);

  const popup = useMemo(() => {
    return new mapboxgl.Popup().setHTML(
      `
      <table>
        <tr>
          <td>Kode</td>
          <td>: ${code}</td>
        </tr>
        <tr>
          <td>Nama</td>
          <td>: ${name}</td>
        </tr>
        <tr>
          <td>Lat</td>
          <td>: ${lat}</td>
        </tr>
        <tr>
          <td>Long</td>
          <td>: ${long}</td>
        </tr>
        <tr>
          <td>Elevation</td>
          <td>: ${elevation}</td>
        </tr>
        <tr>
          <td>Channel</td>
          <td>: ${channels!.map((c) => c.code).join(", ")}</td>
        </tr>
      </table>
      <div>`
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
