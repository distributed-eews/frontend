import { IPacketWaveform } from "../interfaces/waveform";

const onWaveformMessage = (setChannelsWaveform: (key: string, key2: string, packet: IPacketWaveform) => void) => {
  return (ev: MessageEvent<any>) => {
    const res = JSON.parse(ev.data);
    var parsedPacket = JSON.parse(res.value);
    if(parsedPacket.hasOwnProperty('type')){
      setChannelsWaveform(parsedPacket.type, "", parsedPacket);
      return
    }
    if (parsedPacket.station == "BKB" && parsedPacket.channel == "BHE") {
      console.log(parsedPacket)
      console.log(
        parsedPacket.station,
        parsedPacket.channel,
        new Date(parsedPacket.starttime).toLocaleString(),
        new Date(parsedPacket.endtime).toLocaleString()
      );
    }
    setChannelsWaveform(parsedPacket.station, parsedPacket.channel, parsedPacket);
  };
};