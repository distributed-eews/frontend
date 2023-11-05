import { createContext, useState } from "react";
import { IStation } from "../interfaces/stations";
import { IWaveform } from "../interfaces/waveform";
import { IEvent } from "../interfaces/events";
import { IChannel } from "../interfaces/channels";

interface IEEWSContext {
  stations: IStation[]; // for control panels, and map markers
  setStations: (stations: any[]) => void; // set station from api
  channels: IChannel[]; // to show waveforms data
  setChannelsWaveform: (stations: any[]) => void; // update data from websocket connection
  setChannelStatus: (stations: string, channels: string) => void; // enable/disable channels
  event: IEvent | null; // for map markers of earthquakes
  setEvents: (event: any) => void; // set data from websocket connection
}

export const EEWSContext = createContext<IEEWSContext>({
  stations: [],
  setStations: (stations) => {},
  channels: [],
  setChannelStatus: (waves) => {},
  setChannelsWaveform: (channels) => {},
  event: null,
  setEvents: (waves) => {},
});

export const EEWSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stations, _setStations] = useState<IStation[]>([]);
  const [channels, _setChannels] = useState<IChannel[]>([]);
  const [event, _setEvents] = useState<IEvent | null>(null);
  const setChannelStatus = () => {};
  const setChannelsWaveform = () => {};
  const setStations = () => {};
  const setEvents = () => {};

  return (
    <EEWSContext.Provider
      value={{
        stations: stations,
        channels: channels,
        event: event,
        setChannelStatus: setChannelStatus,
        setChannelsWaveform: setChannelsWaveform,
        setEvents: setEvents,
        setStations: setStations,
      }}
    >
      {children}
    </EEWSContext.Provider>
  );
};
