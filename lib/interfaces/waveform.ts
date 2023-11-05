export interface IWaveform {
    data: IPacket[]; // max 10 (1 minute)
    arrival: number | null;
}
export interface IPacket { // packet received from websocket server
    starttime: string;
    endtime: string;
    channel: string;
    station: string;
    data: number[]
}