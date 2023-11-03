import { MAPBOX_TOKEN } from "@/lib/credentials";
import React from "react";
import Map from "react-map-gl";

export const MapGL: React.FC = () => {
  const [viewState, setViewState] = React.useState({
    longitude: 117,
    latitude: -3,
    zoom: 4.3,
  });

  return (
    <Map
      {...viewState}
      minZoom={4}
      maxZoom={5}
      mapboxAccessToken={MAPBOX_TOKEN}
      onMove={evt => setViewState(evt.viewState)}
      mapStyle="mapbox://styles/mapbox/satellite-v9"
    />
  );
};
