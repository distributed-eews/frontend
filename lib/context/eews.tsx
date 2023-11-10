import { createContext, useCallback, useEffect, useState } from "react";
import { IStation } from "../interfaces/stations";
import { IPacket, IWaveform } from "../interfaces/waveform";
import { IEvent } from "../interfaces/events";
import { IChannel } from "../interfaces/channels";
import { AxiosClient } from "../axios";
import { clearPacketsStations, parseStations } from "../functions/parseStations";
import { WSType, createWSConnection, setConnectionListener } from "../connection";
import { useRouter } from "next/router";
import toast from "react-hot-toast";

interface IEEWSContext {
  stations: { [index: string]: IStation }; // for control panels, and map markers
  // channels: { [index: string]: IChannel }; // to show waveforms data
  setChannelsWaveform: (station: string, channel: string, packet: IPacket) => void; // update data from websocket connection
  setChannelPick: (stations: string, channels: string, time: string) => void; // enable/disable channels
  event?: IEvent; // for map markers of earthquakes
  setEvents: (event: any) => void; // set data from websocket connection
  packetsCount?: number; // number of packets
  setLoading : ()=>void
}

export const EEWSContext = createContext<IEEWSContext>({
  stations: {},
  setChannelPick: (waves) => {},
  setChannelsWaveform: (channels) => {},
  setEvents: (waves) => {},
  setLoading: () => {},
});

interface IEEWSData {
  stations: { [index: string]: IStation };
  packetsCount?: number;
  currentMode?: string;
  event?: IEvent;
}

export const EEWSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const [eewsData, setEewsData] = useState<IEEWSData>({
    stations: {},
  });
  const [toastId, setToastId] = useState("")
  const setChannelPick = (station: string, channel: string, time: string) => {
    setEewsData((old) => {
      const copyStations = { ...old.stations };
      const currChannel = copyStations[station].channels.find((chan) => chan.code == channel) as IChannel;
      currChannel["waveform"]["pick"] = {
        arrival: new Date(time).getTime(),
        arrivalDetected: new Date().getTime(),
      };
      console.log("channel pick: ", currChannel);
      return { ...old, stations: copyStations };
    });
  };
  const setChannelsWaveform = (key_station: string, key_channel: string, packet: IPacket) => {
    setEewsData((old) => {
      if (!old.packetsCount) return old;
      if (key_station == "start") {
        toast.dismiss(toastId)
        return {
          ...old,
          stations: clearPacketsStations(old.stations),
        };
      }
      if (key_station == "stop") {
        return old;
      }
      const copyStations = { ...old.stations };
      const currentStations = copyStations[key_station];
      currentStations["status"] = "ACTIVE";
      const currentChannels = currentStations.channels.find((chan) => chan.code == key_channel);
      let chan_data = currentChannels!.waveform.data;
      if (chan_data.length >= old.packetsCount) {
        chan_data = chan_data.slice(1, eewsData.packetsCount);
      }
      chan_data.push({ ...packet, recvAt: new Date().getTime() });
      currentChannels!["waveform"]["data"] = chan_data;
      if (key_station == "BKB" && key_channel == "BHE") {
        console.log(currentChannels?.waveform);
      }
      return { ...old, stations: copyStations };
    });
  };

  const setLoading = ()=>{
    setToastId(toast.loading("Please wait..."));
  }

  const setEvents = (data: any) => {
    console.log(data);
    setEewsData((old) => ({ ...old, event: { ...data, detectedAt: new Date() } }));
  };

  useEffect(() => {
    async function fetchStations() {
      const res = await AxiosClient.get("/api/stations");
      const stations = parseStations(res);
      setEewsData((old) => ({ ...old, stations: stations }));
    }
    fetchStations();
  }, []);

  useEffect(() => {
    setEewsData((old) => ({ ...old, packetsCount: Number(router.query.packets ?? 10) }));
  }, [router]);

  return (
    <EEWSContext.Provider
      value={{
        stations: eewsData.stations,
        event: eewsData.event,
        setChannelPick: setChannelPick,
        setChannelsWaveform: setChannelsWaveform,
        setEvents: setEvents,
        packetsCount: eewsData.packetsCount,
        setLoading: setLoading
      }}
    >
      {children}
    </EEWSContext.Provider>
  );
};
