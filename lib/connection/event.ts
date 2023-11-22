import { IPacketWaveform } from "../interfaces/waveform";

const onWaveformMessage = (setEvent: (data: any) => void) => {
  return (ev: MessageEvent<any>) => {
    const res = JSON.parse(ev.data);
    var parsedPacket = res.value
    // alert("Earthquake Detected")
    setEvent(parsedPacket);
  };
};