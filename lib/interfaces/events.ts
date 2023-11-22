import { IPacketBase } from "./waveform";

export interface ISEvent extends IPacketBase {
  time: Date;
  depth: number;
  magnitude: number;
  latitude: number;
  longitude: number;
  detectedAt: Date
}
export interface IPEvent extends IPacketBase{
  station: string;
  channel: string;
  time: string;
  process_time: number;
}
