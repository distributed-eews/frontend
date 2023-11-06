import { IPacket } from "../interfaces/waveform";

export const onWaveformMessage = (setChannelsWaveform: (key: string, key2: string, packet: IPacket) => void) => {
  return (ev: MessageEvent<any>) => {
    const res = JSON.parse(ev.data);
    var parsedPacket = JSON.parse(res.value);
    // console.log(parsedPacket.station, parsedPacket.channel, new Date(parsedPacket.endtime).toLocaleTimeString())
    setChannelsWaveform(parsedPacket.station, parsedPacket.channel, parsedPacket);
  };
};
