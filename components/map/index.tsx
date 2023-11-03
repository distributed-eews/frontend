import { MAPBOX_TOKEN } from "@/lib/credentials";
import React from "react";
import Map from "react-map-gl";
import stationdata from "../stations.json";
import { IStation } from "@/lib/interfaces/stations";
import { Station } from "./marker";

export const MapGL: React.FC = () => {
  const [viewState, setViewState] = React.useState({
    longitude: 117,
    latitude: -3,
    zoom: 4.3,
  });

  const data = stationdata as IStation[];

  return (
    <Map
      {...viewState}
      minZoom={4}
      maxZoom={5}
      mapboxAccessToken={MAPBOX_TOKEN}
      onMove={(evt) => setViewState(evt.viewState)}
      mapStyle="mapbox://styles/mapbox/satellite-v9"
    >
      {data.map((val) => (
        <Station key={`marker-station-${val.code}`} {...val} />
      ))}
    </Map>
  );
};
