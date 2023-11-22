import { IPacketWaveform } from "../interfaces/waveform";

const onWaveformMessage = (setChannelPick: (stat: string, chan: string, time: string) => void) => {
  return (ev: MessageEvent<any>) => {
    const res = JSON.parse(ev.data);
    var parsedPacket = res.value
    setChannelPick(parsedPacket.station, parsedPacket.channel, parsedPacket.arrival);
  };
};