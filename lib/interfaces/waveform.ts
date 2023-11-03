export interface IWaveform {
    station: string;
    channel: string;
    data: number[];
    arrival?: number;
}