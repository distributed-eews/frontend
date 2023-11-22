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
  packetsCount?: number; // number of packets
  setLoading: () => void;
}

export const EEWSContext = createContext<IEEWSContext>({
  stations: {},
  setLoading: () => {},
  websocketCallbacks: () => {},
});

interface IEEWSData {
  stations: { [index: string]: IStation };
  packetsCount?: number;
  currentMode?: string;
  event?: ISEvent;
}

export const EEWSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const [eewsData, setEewsData] = useState<IEEWSData>({
    stations: {},
  });
  const setPEvent = (data: IPEvent) => {
    setEewsData((old) => {
      const { channel, process_time, station, time } = data;
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
  const setChannelsWaveform = (data: IPacketWaveform)=>{
    const { channel, station, type } = data;
    const old = eewsData
    if (!old.packetsCount) return;
    if (type == "start") {
      setEewsData({...old,stations: clearPacketsStations(old.stations) })
      return
    }
    if (type == "stop") {
      console.log("================================================")
      return;
    }
    try {
      const copyStations = { ...old.stations };
      const currentStations = copyStations[station];
      currentStations["status"] = "ACTIVE";
      const currentChannels = currentStations.channels.find((chan) => chan.code == channel);
      let chan_data = currentChannels!.waveform.data;
      if (chan_data.length >= old.packetsCount) {
        chan_data = chan_data.slice(1, eewsData.packetsCount);
      }
      chan_data.push({ ...data, recvAt: new Date().getTime() });
      currentChannels!["waveform"]["data"] = chan_data;
      if (station == "BKB" && channel == "BHE") {
        console.log(currentChannels?.waveform);
      }
      setEewsData({...old, stations: copyStations})
    } catch (error) {
      console.error(data)
      console.error(old)
      console.error(error);
    }

  }

  const setLoading = () => {
    console.log("Loading...",)
  };

  const setSEvent = (data: any) => {
    console.log(data);
    // setEewsData((old) => ({ ...old, event: { ...data, detectedAt: new Date() } }));
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
        packetsCount: eewsData.packetsCount,
        setLoading: setLoading,
        websocketCallbacks: (message: MessageEvent<any>) => {
          const res = JSON.parse(message.data);
          const topic = res.topic;
          const data = JSON.parse(res.value)
          console.log(data)
          if (topic == "p_arrival") {
            setChannelsWaveform(data);
          } else if (topic == "pick") {
            if(data.type == "p"){
              setPEvent(res.value)
            }else if(data.type == "s"){
              setSEvent(res.value)
            }
          }
        },
      }}
    >
      {children}
    </EEWSContext.Provider>
  );
};
