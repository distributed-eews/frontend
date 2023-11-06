import { useEEWS } from "@/lib/hooks/useEEWS";
import { FeatureCollection } from "geojson";
import { Source, Layer, Marker } from "react-map-gl";
import React from "react";
import { useRef, useMemo, useCallback } from "react";
import mapboxgl from "mapbox-gl";

export const EventMarker: React.FC = () => {
  const { event } = useEEWS();
  const markerRef = useRef<mapboxgl.Marker>(null);

  const togglePopup = useCallback(() => {
    markerRef.current?.togglePopup();
  }, []);
  const popup = useMemo(() => {
    if (!event) return;
    return new mapboxgl.Popup().setHTML(
      `
      <table>
        <tr>
            <td>Tanggal</td>
            <td>: ${new Date(event.time).toLocaleDateString()}</td>
        </tr>
        <tr>
            <td>Time</td>
            <td>: ${new Date(event.time).toLocaleTimeString()}</td>
        </tr>
        <tr>
            <td>Magnitudo</td>
            <td>: ${event.magnitude}</td>
        </tr>
        <tr>
            <td>Lat</td>
            <td>: ${event.latitude}</td>
        </tr>
        <tr>
            <td>Long</td>
            <td>: ${event.longitude}</td>
        </tr>
        <tr>
            <td>Depth</td>
            <td>: ${event.depth}</td>
        </tr>
      </table>`
    );
  }, [event]);
  if (!event) return <div></div>;

  return (
    <div>
      <Marker
        anchor="bottom"
        scale={0.7}
        ref={markerRef}
        popup={popup}
        onClick={togglePopup}
        latitude={Number(event.latitude)}
        longitude={Number(event.longitude)}
        color="rgba(255, 100, 100, 1)"
      ></Marker>
      <Source
        id="dot-point"
        type="geojson"
        data={{
          type: "FeatureCollection",
          features: [
            {
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: [event.longitude, event.latitude], // icon position [lng, lat]
              },
              properties: {},
            },
          ],
        }}
      >
        <Layer
          id="layer-with-pulsing-dot"
          type="symbol"
          source="dot-point"
          layout={{
            "icon-image": "pulsing-dot",
          }}
        />
      </Source>
    </div>
  );
};
