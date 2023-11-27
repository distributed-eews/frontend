import { createContext, useCallback, useEffect, useState } from "react";
import { IStation } from "../interfaces/stations";
import { IPacketWaveform, IWaveform } from "../interfaces/waveform";
import { ISEvent, IPEvent } from "../interfaces/events";
import { IChannel } from "../interfaces/channels";
import { AxiosClient } from "../axios";
import { clearPacketsStations, parseStations } from "../functions/parseStations";
import { useRouter } from "next/router";

interface IEEWSContext {
  stations: { [index: string]: IStation }; // for control panels, and map markers
  // channels: { [index: string]: IChannel }; // to show waveforms data
  websocketCallbacks: (message: MessageEvent<any>) => void; // set channel, set pick, and set event
  event?: ISEvent; // for map markers of earthquakes
  packetsCount: number; // number of packets
  setLoading: () => void;
  setMinutes?: (m: number) => void;
}

export const EEWSContext = createContext<IEEWSContext>({
  stations: {},
  setLoading: () => {},
  websocketCallbacks: () => {},
  packetsCount : 50
});

interface IEEWSData {
  stations: { [index: string]: IStation };
  // packetsCount: number;
  currentMode?: string;
  event?: ISEvent;
}

export const EEWSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const [eewsData, setEewsData] = useState<IEEWSData>({
    stations: {},
  });
  const [packetsCount, setPacketsCount] = useState(50)
  const setPEvent = (data: IPEvent) => {
    const { p_arr, p_arr_time, station_code, s_arr } = data;
    if (p_arr && s_arr) {
      const copyStations = { ...eewsData.stations };
      copyStations[station_code].channels.forEach((chan) => {
        chan["waveform"]["pick"] = {
          arrival: new Date(p_arr_time).getTime(),
          arrivalDetected: new Date().getTime(),
        };
      });
      console.log("channel pick: ", copyStations[station_code]);
      setEewsData({ ...eewsData, stations: copyStations });
    }
  };

  const setChannelsWaveform = (data: IPacketWaveform) => {
    const { channel, station, type } = data;
    const old = eewsData;
    if (type == "start") {
      setEewsData({ ...old, stations: clearPacketsStations(old.stations) });
      return;
    }
    if (type == "stop") {
      console.log("================================================");
      return;
    }
    try {
      const copyStations = { ...old.stations };
      const currentStations = copyStations[station];
      currentStations["status"] = "ACTIVE";
      const currentChannels = currentStations.channels.find((chan) => chan.code == channel);
      let chan_data = currentChannels!.waveform.data;
      if (chan_data.length >= packetsCount) {
        chan_data = chan_data.slice(1, packetsCount);
      }
      chan_data.push({ ...data, recvAt: new Date().getTime() });
      currentChannels!["waveform"]["data"] = chan_data;
      if (station == "BKB" && channel == "BHE") {
        console.log(currentChannels?.waveform);
      }
      setEewsData({ ...old, stations: copyStations });
    } catch (error) {
      console.error(data);
      console.error(old);
      console.error(error);
    }
  };

  const setLoading = () => {
    console.log("Loading...");
  };

  const setParams = (data: ISEvent) => {
    console.log(data);
    setEewsData({
      ...eewsData,
      event: data,
    });
  };

  useEffect(() => {
    async function fetchStations() {
      const res = await AxiosClient.get("/api/stations");
      const stations = parseStations(res);
      setEewsData((old) => ({ ...old, stations: stations }));
    }
    fetchStations();
  }, []);

  const setMinutes = (m: number) =>{
    setPacketsCount(m * 10)
  }

  return (
    <EEWSContext.Provider
      value={{
        stations: eewsData.stations,
        event: eewsData.event,
        packetsCount: packetsCount,
        setLoading: setLoading,
        setMinutes: setMinutes,
        websocketCallbacks: (message: MessageEvent<any>) => {
          const res = JSON.parse(message.data);
          const topic = res.topic;
          const data = JSON.parse(res.value);
          // console.log(data);
          if (topic == "p_arrival") {
            setChannelsWaveform(data);
          } else if (topic == "pick") {
            if (data.type == "ps") {
              setPEvent({
                ...res.value,
              });
            } else if (data.type == "params") {
              setParams({
                ...res.value,
                detectedAt: new Date(),
              });
            }
          }
        },
      }}
    >
      {children}
    </EEWSContext.Provider>
  );
};
