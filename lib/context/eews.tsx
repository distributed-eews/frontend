import { createContext, useEffect, useState } from "react";
import { IStation } from "../interfaces/stations";
import { IPacket, IWaveform } from "../interfaces/waveform";
import { IEvent } from "../interfaces/events";
import { IChannel } from "../interfaces/channels";
import { AxiosClient } from "../axios";

interface IEEWSContext {
  stations: IStation[]; // for control panels, and map markers
  channels: { [index: string]: IChannel }; // to show waveforms data
  setChannelsWaveform: (key: string, packet: IPacket) => void; // update data from websocket connection
  setChannelStatus: (stations: string, channels: string) => void; // enable/disable channels
  event: IEvent | null; // for map markers of earthquakes
  setEvents: (event: any) => void; // set data from websocket connection
}

export const EEWSContext = createContext<IEEWSContext>({
  stations: [],
  channels: {},
  setChannelStatus: (waves) => {},
  setChannelsWaveform: (channels) => {},
  event: null,
  setEvents: (waves) => {},
});

export const EEWSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stations, _setStations] = useState<IStation[]>([]);
  const [channels, _setChannels] = useState<{ [index: string]: IChannel }>({});
  const [event, _setEvents] = useState<IEvent | null>({
    depth: 1000,
    latitude: -3,
    longitude: 117,
    magnitude: 9,
    time: new Date(),
  });
  const setChannelStatus = () => {};
  const setChannelsWaveform = (key: string, packet: IPacket) => {
    const chans = { ...channels };
    let chan_data = chans[key].waveform.data;
    if (chan_data.length >= 10) {
      chan_data = chan_data.slice(1, 10);
    }
    // console.log(chans[key].code);
    chan_data.push(packet);
    chans[key].waveform.data = chan_data;
    // console.log(key, chan_data.length, new Date().getTime());
    _setChannels(chans);
  };
  const setEvents = () => {};

  useEffect(() => {
    async function setStationsAndChannels() {
      const res = await AxiosClient.get("/api/stations");
      const _stations: IStation[] = (res.data as any[]).map((st) => ({
        ...st,
        elevation: Number(st.elevation),
        long: Number(st.long),
        lat: Number(st.lat),
      }));
      _setStations(_stations);
    }
    setStationsAndChannels();
  }, []);

  // update channels if stations changes
  useEffect(() => {
    if (stations.length == 0) return;
    const _channels: Map<string, IChannel> = new Map();
    stations.forEach((st) => {
      st.channels?.forEach((chan) => {
        _channels.set(`${st.code}_${chan.code}`, {
          ...chan,
          stationCode: st.code,
          waveform: {
            data: [],
            arrival: null,
          },
        });
      });
    });
    _setChannels(Object.fromEntries(_channels));
  }, [stations]);

  return (
    <EEWSContext.Provider
      value={{
        stations: stations,
        channels: channels,
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
