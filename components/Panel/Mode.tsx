import { AxiosClient } from "@/lib/axios";
import { toiso } from "@/lib/functions/toiso";
import { useEEWS } from "@/lib/hooks/useEEWS";
import { useState } from "react";

export const ControlMode = () => {
  const { packetsCount, setLoading } = useEEWS();
  const [starttime, setStarttime] = useState<Date>(new Date(new Date().getTime() - 1000 * 60 * 60));
  const [endtime, setEndtime] = useState<Date>(new Date(new Date().getTime() - 1000 * 60 * 59 - 1000 * 30));

  const onSubmit = async () => {
    if (!starttime || !endtime || starttime.getTime() + 1000 * 10 * 60 < endtime.getTime()) {
      alert("Isi starttime, endtime, dan pastikan endtime tidak lebih besar dari 10 menit");
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
    const res = await AxiosClient.get("/api/idle");
    console.log(res.status);
  };
  return (
    <div className="w-full flex flex-col gap-y-4">
      <div className="flex flex-col w-full border-2 border-red-500 gap-y-2">
        <div>
          <h4 className="font-bold">Playback Mode:</h4>
          <label htmlFor="starttime">Start Time</label>
          <input
            name="starttime"
            id="starttime"
            type="datetime-local"
            onChange={(e) => setStarttime(new Date(e.target.value))}
            value={toiso(starttime)}
          ></input>
        </div>
        <div>
          <label htmlFor="endtime">End Time</label>
          <input
            name="endtime"
            id="endtime"
            type="datetime-local"
            onChange={(e) => setEndtime(new Date(e.target.value))}
            value={toiso(endtime)}
          ></input>
        </div>
        <div className="w-full flex justify-center">
          <button onClick={onSubmit} className="px-2 py-1 font-bold text-white bg-red-700 rounded-xl hover:bg-red-500">
            Playback!
          </button>
        </div>
      </div>
      <div className="flex justify-between items-center w-full border-2 border-red-500">
        <h4 className="font-bold">Live Mode:</h4>
        <div>
          <button onClick={onlive} className="px-2 py-1 font-bold text-white bg-red-700 rounded-xl hover:bg-red-500">
            Start!
          </button>
          <button
            onClick={onStoplive}
            className="px-2 py-1 font-bold text-white bg-red-700 rounded-xl hover:bg-red-500"
          >
            Stop!
          </button>
        </div>
      </div>
      <div className="flex justify-between w-full border-2 border-red-500">
        <form action="" method="get" className="">
          <div className="flex gap-x-2">
            <label htmlFor="minutes">Panjang Line Chart (menit)</label>
            <input
              id="minutes"
              defaultValue={packetsCount ? packetsCount / 10 : 5}
              type="number"
              min={3}
              max={1000}
              name="minutes"
            />
          </div>
          <button className="px-2 py-1 mx-auto font-bold text-white bg-red-700 rounded-xl hover:bg-red-500">
            Ubah!
          </button>
        </form>
      </div>
    </div>
  );
};
