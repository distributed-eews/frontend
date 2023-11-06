import { MAPBOX_TOKEN } from "@/lib/credentials";
import React, { useRef, useCallback } from "react";
import Map from "react-map-gl";
import stationdata from "../stations.json";
import { IStation } from "@/lib/interfaces/stations";
import { Station } from "./marker";
import type { MapRef } from "react-map-gl";
import { getPulseDot } from "./pulse";
import type { FeatureCollection } from "geojson";
import { useEEWS } from "@/lib/hooks/useEEWS";
import { EventMarker } from "./event";

export const MapGL: React.FC = () => {
  const [viewState, setViewState] = React.useState({
    longitude: 117,
    latitude: -3,
    zoom: 4.3,
  });
  const { stations, event } = useEEWS();

  const mapRef = useRef<MapRef>(null);
  const onMapLoad = useCallback(() => {
    mapRef.current?.addImage("pulsing-dot", getPulseDot(mapRef.current));
  }, [mapRef]);
  return (
    <Map
      {...viewState}
      minZoom={4}
      maxZoom={5}
      mapboxAccessToken={MAPBOX_TOKEN}
      onMove={(evt) => setViewState(evt.viewState)}
      mapStyle="mapbox://styles/mapbox/satellite-v9"
      ref={mapRef}
      onLoad={onMapLoad}
    >
      {stations.map((val) => (
        <Station key={`marker-station-${val.code}`} {...val} />
      ))}
      <EventMarker />
    </Map>
  );
};
