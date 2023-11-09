export interface IWaveform {
  data: IPacket[]; // max 10 (1 minute)
  pick: IPick | null;
}
interface IPick {
  arrival: number;
  arrivalDetected: number;
}
export interface IPacket {
  // packet received from websocket server
  starttime: string | number;
  endtime: string | number;
  channel: string;
  station: string;
  data: number[];
  recvAt: number
  eews_producer_time: string[]
  eews_queue_time: string[]
}
