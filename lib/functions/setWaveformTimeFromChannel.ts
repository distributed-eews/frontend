import { IChannel } from "../interfaces/channels";

export const setWaveformTimeFromChannel = (channel: IChannel, packetCount: number = 30) => {
  let waveforms: any[] = [];
  const missingPacket = packetCount - channel.waveform.data.length;
  if (missingPacket > 0 && channel.waveform.data[0]) {
    const tick = (missingPacket * 6 * 1000) / channel.sample_rate;
    const waveformsWithTime = Array(tick).fill({
      value: 0,
    });
    waveforms = waveforms.concat(waveformsWithTime);
  }
  channel.waveform.data.forEach((packet) => {
    const current = new Date(packet.starttime).getTime();
    const endtime = new Date(packet.endtime).getTime();
    const tick = Math.round(endtime - current) / packet.data.length;
    const waveformsWithTime = packet.data.map((value, idx) => ({
      value: value,
      time: current + idx * tick,
    }));
    waveforms = waveforms.concat(waveformsWithTime);
  });

  return waveforms;
};
