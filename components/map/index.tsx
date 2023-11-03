import { MAPBOX_TOKEN } from "@/lib/credentials";
import React, { useRef, useCallback } from "react";
import Map, { Source, Layer } from "react-map-gl";
import stationdata from "../stations.json";
import { IStation } from "@/lib/interfaces/stations";
import { Station } from "./marker";
import type { MapRef } from "react-map-gl";
import { getPulseDot } from "./pulse";
import type { FeatureCollection } from "geojson";
const source: FeatureCollection = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [117, -3], // icon position [lng, lat]
      },
      properties: {},
    },
  ],
};

const layer = {
  id: "layer-with-pulsing-dot",
  type: "symbol",
  source: "dot-point",
  layout: {
    "icon-image": "pulsing-dot",
  },
};

export const MapGL: React.FC = () => {
  const [viewState, setViewState] = React.useState({
    longitude: 117,
    latitude: -3,
    zoom: 4.3,
  });

  const data = stationdata as IStation[];
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
      {data.map((val) => (
        <Station key={`marker-station-${val.code}`} {...val} />
      ))}
      {/* <Source id="pulsing-dot" type="image" data={{}} /> */}
      <Source id="dot-point" type="geojson" data={source}>
        <Layer
          id="layer-with-pulsing-dot"
          type="symbol"
          source="dot-point"
          layout={{
            "icon-image": "pulsing-dot",
          }}
        />
      </Source>
    </Map>
  );
};
