import { BACKEND_URL } from "../credentials";
import { setWaveformConnectionListener } from "./waveform";
import { setPickConnectionListener } from "./pick";
import { setEventConnectionListener } from "./event";

export enum WSType {
  WAVEFORM,
  PICK,
  EVENT,
}
export const createWSConnection = (str: string) => {
  const socket = new WebSocket(`ws://${BACKEND_URL}${str}`);
  socket.onopen = () => {
    console.log("Connect");
  };
  return socket;
};
export const setConnectionListener = (str: WSType, socket: WebSocket, cb: any) => {
  if (str == WSType.WAVEFORM) {
    return setWaveformConnectionListener(socket, cb);
  }
  if (str == WSType.PICK) {
    return setPickConnectionListener(socket, cb);
  }
  if(str == WSType.EVENT){
    return setEventConnectionListener(socket, cb)
  }
  return socket
};
