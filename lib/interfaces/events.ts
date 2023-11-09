export interface IEvent {
  time: Date;
  depth: number;
  magnitude: number;
  latitude: number;
  longitude: number;
  detectedAt: Date
}