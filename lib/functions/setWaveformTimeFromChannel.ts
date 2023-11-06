import { IChannel } from "../interfaces/channels";

export const setWaveformTimeFromChannel = (channel: IChannel) => {
  let waveforms: any[] = [];
  channel.waveform.data.forEach((packet) => {
    const current = new Date(packet.starttime).getTime();
    const waveformsWithTime = packet.data.map((value, idx) => ({
      value: value,
      time: current + idx * 50,
    }));
    waveforms = waveforms.concat(waveformsWithTime);
  });
  return waveforms;
};
