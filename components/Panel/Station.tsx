import { AxiosClient } from "@/lib/axios";
import { useEEWS } from "@/lib/hooks/useEEWS";
import { IStation } from "@/lib/interfaces/stations";
import { useRouter } from "next/router";

export const ControlStations = () => {
  const { stations } = useEEWS();
  return (
    <div id="control-stations" className="w-full overflow-y-auto">
      <table className="table-auto relative border-collapse border-black border w-full">
        <thead className="sticky top-0 left-0">
          <tr className="bg-white">
            <th>Station</th>
            <th>Channels</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(stations)
            .sort((a, b) => (a > b ? 1 : -1))
            .map((key) => (
              <ControlStation key={`control-station-${key}`} {...stations[key]} />
            ))}
        </tbody>
      </table>
    </div>
  );
};
const ControlStation = (station: IStation) => {
  const router = useRouter();
  const toggle = async () => {
    const res = await AxiosClient.post("/api/stations/toggle", {
      code: station.code,
    });
    if (res.status == 200) {
      router.reload();
    }
  };
  return (
    <>
      {station.channels.map((chan, idx) => (
        <tr key={`control-station-channel-${station.code}-${chan.code}-${idx}`}>
          {idx == 0 && <td rowSpan={station.channels.length}>{station.code}</td>}
          <td>{`${chan.code} [${
            station.status == "DISABLED" ? "disabled" : chan.waveform.data.length == 0 ? "enabled" : "active"
          }]`}</td>
          {idx == 0 && (
            <td rowSpan={station.channels.length}>
              {station.status == "DISABLED" ? (
                <button className="p-2 bg-green-400 text-white rounded" onClick={toggle}>
                  Enable
                </button>
              ) : (
                <button className="p-2 bg-red-400 text-white rounded" onClick={toggle}>
                  Disable
                </button>
              )}
            </td>
          )}
        </tr>
      ))}
    </>
  );
};
