import { IPacket } from "../interfaces/waveform";

export const onWaveformMessage = (setChannelsWaveform: (key: string, packet: IPacket) => void) => {
  return (ev: MessageEvent<any>) => {
    const res = JSON.parse(ev.data);
    var parsedPacket = JSON.parse(res.value);
    const key = `${parsedPacket.station}_${parsedPacket.channel}`
    // if(key == "BKB_BHE") {
    //     console.log(parsedPacket.data)
    // }
    setChannelsWaveform(key, parsedPacket);
  };
};
