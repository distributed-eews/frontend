import { AxiosClient } from "@/lib/axios";
import { toiso } from "@/lib/functions/toiso";
import { useEEWS } from "@/lib/hooks/useEEWS";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export const ControlMode = () => {
  const { setLoading } = useEEWS();
  const [starttime, setStarttime] = useState<Date>(new Date(new Date().getTime() - 1000 * 60 * 60));
  const [endtime, setEndtime] = useState<Date>(new Date(new Date().getTime() - 1000 * 60 * 59 - 1000 * 30));
  const [mode, setMode] = useState<"PLAYBACK" | "LIVE">("PLAYBACK");
  const onSubmit = async () => {
    if (!starttime || !endtime || starttime.getTime() + 1000 * 30 * 60 < endtime.getTime()) {
      alert("Isi starttime, endtime, dan pastikan endtime tidak lebih besar dari 30 menit");
      return;
    }
    const res = await AxiosClient.get("/api/playback", {
      params: {
        start_time: starttime,
        end_time: endtime,
      },
    });
    console.log(res);
    if (res.status === 200) {
    }
    console.log(res.status);
    console.log(res.data);
  };
  const onlive = async () => {
    const res = await AxiosClient.get("/api/live");
    console.log(res.status);
    if (res.status === 200) {
      setLoading();
    }
    console.log(res.data);
  };
  const onStoplive = async () => {
    const res = await AxiosClient.post("/api/stop");
    console.log(res.status);
  };
  const active = "bg-indigo-950 ";
  return (
    <div className="w-full flex flex-col gap-y-4">
      <div className="flex flex-col w-full rounded bg-slate-100 gap-y-2 p-2">
        <div className="rounded bg-indigo-800 grid grid-cols-2 font-semibold">
          <div
            onClick={() => setMode("PLAYBACK")}
            className={`text-center text-white cursor-pointer p-1 rounded ${
              mode == "PLAYBACK" && active
            } hover:bg-indigo-900`}
          >
            PlayBack
          </div>
          <div
            onClick={() => setMode("LIVE")}
            className={`text-center text-white cursor-pointer p-1 rounded ${
              mode == "LIVE" && active
            } hover:bg-indigo-900`}
          >
            Live
          </div>
        </div>
        {mode == "PLAYBACK" && (
          <div className="grid grid-cols-2 gap-y-2">
            <p className="col-span-2 text-center font-medium underline">Data PlayBack dari FDSN GEOFON</p>
            <label htmlFor="starttime">Waktu Mulai (+7)</label>
            <div className="flex">
              <p>:</p>
              <input
                name="starttime"
                id="starttime"
                type="datetime-local"
                onChange={(e) => setStarttime(new Date(e.target.value))}
                value={toiso(starttime)}
              ></input>
            </div>
            <label htmlFor="endtime">Waktu Selesai (+7)</label>
            <div className="flex">
              <p>:</p>
              <input
                name="endtime"
                id="endtime"
                type="datetime-local"
                onChange={(e) => setEndtime(new Date(e.target.value))}
                value={toiso(endtime)}
              ></input>
            </div>
            <div className="col-span-2 flex flex-row-reverse pt-2">
              <button
                onClick={onSubmit}
                className="px-2 py-1 font-bold text-white bg-indigo-900 rounded-xl hover:bg-indigo-700 cursor-pointer"
              >
                Start!
              </button>
            </div>
          </div>
        )}
        {mode == "LIVE" && (
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            <p className="col-span-2 text-center font-medium underline">Data Terbaru dari Seedlink GEOFON</p>
            <button
              onClick={onlive}
              className="w-auto px-2 py-1 font-bold text-white bg-indigo-800 rounded-xl hover:bg-indigo-950"
            >
              Start!
            </button>
            <button
              onClick={onStoplive}
              className="px-2 py-1 font-bold text-white bg-indigo-800 rounded-xl hover:bg-indigo-950"
            >
              Stop!
            </button>
          </div>
        )}
      </div>
      <Settings />
    </div>
  );
};

const Settings = () => {
  const { packetsCount, setMinutes } = useEEWS();
  const [m, sm] = useState(packetsCount / 10);
  return (
    <div className="flex flex-col w-full rounded bg-slate-100 gap-y-2 p-2">
      <h4 className="font-semibold text-base">Pengaturan</h4>
      <table className="table">
        <tbody>
          <tr>
            <td>
              <label htmlFor="minutes">Durasi Trace</label>
            </td>
            <td className="">
              <span>: </span>
              <input
                className="w-20"
                id="minutes"
                value={Number(m)}
                onChange={(e) => sm(Number(e.target.value))}
                type="number"
                min={1}
                max={30}
                name="minutes"
              />
              <span> (menit)</span>
            </td>
          </tr>
        </tbody>
      </table>
      <div className="flex gap-x-2">
        <button
          onClick={() => {
            setMinutes && setMinutes(m)
          }}
          className="px-2 py-1 font-bold text-white bg-indigo-900 rounded-xl hover:bg-indigo-700 cursor-pointer"
        >
          ubah!
        </button>
      </div>
    </div>
  );
};
