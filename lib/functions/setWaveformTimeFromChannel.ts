import { IChannel } from "../interfaces/channels";

export const setWaveformTimeFromChannel = (channel: IChannel) => {
  let waveforms: any[] = [];
  channel.waveform.data.forEach((packet) => {
    const current = new Date(packet.starttime).getTime();
    const endtime = new Date(packet.endtime).getTime();
    const tick = Math.round(endtime-current) / packet.data.length
    const waveformsWithTime = packet.data.map((value, idx) => ({
      value: value,
      time: current + idx * tick,
    }));
    waveforms = waveforms.concat(waveformsWithTime);
  });
  return waveforms;
};
