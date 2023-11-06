import { ChannelChart } from "./channel";
import RenderIfVisible from "react-render-if-visible";
import { useEEWS } from "@/lib/hooks/useEEWS";

export const StationCharts = () => {
  const { channels } = useEEWS();

  return (
    <div className="max-h-screen w-full border-4 border-black p-4 overflow-auto">
      {Object.entries(channels)
        .sort(([a, _], [b, __]) => (a > b ? 1 : -1))
        .map(([_, channel]) => (
          <RenderIfVisible key={`${channel.stationCode}-${channel.code}`} defaultHeight={100} visibleOffset={300}>
            <ChannelChart channel={channel} />
          </RenderIfVisible>
        ))}
    </div>
  );
};
