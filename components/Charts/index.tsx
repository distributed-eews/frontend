import { ChannelChart } from "./channel";
import RenderIfVisible from "react-render-if-visible";
import { useEEWS } from "@/lib/hooks/useEEWS";
import { IChannel } from "@/lib/interfaces/channels";

export const StationCharts = () => {
  const { stations } = useEEWS();
  const channels: IChannel[] = [];
  Object.entries(stations).forEach(([_, station]) => {
    station.channels.forEach((channel) => {
      channels.push(channel);
    });
  });
  // sort by station name
  channels.sort((a, b) => (`${a.stationCode}${a.code}` > `${b.stationCode}${b.code}` ? 1 : -1));
  return (
    <div className="max-h-screen w-full border-4 border-black p-4 overflow-auto">
      {channels
        .filter((chan) => chan.waveform.data.length > 0)
        .map((chan, idx) => {
          const id = chan.code == "BHE" ? chan.stationCode : chan.stationCode+chan.code
          return (
            <div id={id} key={`${chan.stationCode}${chan.code}${idx}`}>
              <RenderIfVisible defaultHeight={100} visibleOffset={50}>
                <ChannelChart channel={chan} />
              </RenderIfVisible>
            </div>
          );
        })}
    </div>
  );
};
