import { createContext, useEffect, useState } from "react";
import { IStation } from "../interfaces/stations";
import { IPacket, IWaveform } from "../interfaces/waveform";
import { IEvent } from "../interfaces/events";
import { IChannel } from "../interfaces/channels";
import { AxiosClient } from "../axios";
import { clearPacketsStations, parseStations } from "../functions/parseStations";

interface IEEWSContext {
  stations: { [index: string]: IStation }; // for control panels, and map markers
  // channels: { [index: string]: IChannel }; // to show waveforms data
  setChannelsWaveform: (station: string, channel: string, packet: IPacket) => void; // update data from websocket connection
  setChannelStatus: (stations: string, channels: string) => void; // enable/disable channels
  event: IEvent | null; // for map markers of earthquakes
  setEvents: (event: any) => void; // set data from websocket connection
}

export const EEWSContext = createContext<IEEWSContext>({
  stations: {},
  setChannelStatus: (waves) => {},
  setChannelsWaveform: (channels) => {},
  event: null,
  setEvents: (waves) => {},
});

export const EEWSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stations, _setStations] = useState<{ [index: string]: IStation }>({});

  const [event, _setEvents] = useState<IEvent | null>({
    depth: 1000,
    latitude: -3,
    longitude: 117,
    magnitude: 9,
    time: new Date(),
  });
  const setChannelStatus = () => {};
  const setChannelsWaveform = (key_station: string, key_channel: string, packet: IPacket) => {
    if(key_station == "start"){
      _setStations(clearPacketsStations(stations))
      return
    }
    if(key_station == "stop"){
      return
    }
    const copyStations = { ...stations };
    const currentStations = copyStations[key_station];
    currentStations['status'] = "ACTIVE";
    const currentChannels = currentStations.channels.find((chan) => chan.code == key_channel);
    let chan_data = currentChannels!.waveform.data;
    if (chan_data.length >= 10) {
      chan_data = chan_data.slice(1, 10);
    }
    chan_data.push(packet);
    currentChannels!['waveform']['data'] = chan_data
    _setStations(copyStations);
  };
  const setEvents = () => {};

  useEffect(() => {
    async function fetchStations() {
      const res = await AxiosClient.get("/api/stations");
      const _stations = parseStations(res);
      _setStations(_stations);
    }
    fetchStations();
  }, []);

  return (
    <EEWSContext.Provider
      value={{
        stations: stations,
        event: event,
        setChannelStatus: setChannelStatus,
        setChannelsWaveform: setChannelsWaveform,
        setEvents: setEvents,
      }}
    >
      {children}
    </EEWSContext.Provider>
  );
};
