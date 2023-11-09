import { IPacket } from "../interfaces/waveform";

const onWaveformMessage = (setEvent: (data: any) => void) => {
  return (ev: MessageEvent<any>) => {
    const res = JSON.parse(ev.data);
    var parsedPacket = res.value
    // alert("Earthquake Detected")
    setEvent(parsedPacket);
  };
};

export const setEventConnectionListener = (socket: WebSocket, setEvent: (data: any) => void)=>{
    socket.onmessage = onWaveformMessage(setEvent);
    socket.onclose = (close)=>{
        console.log(close.reason)
        console.log(close)
    }
    return socket
}