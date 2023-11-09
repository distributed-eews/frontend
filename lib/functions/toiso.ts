export const toiso = (t: Date) => {
    let z = t.getTimezoneOffset() * 60 * 1000;
    let tLocal: any = t.getTime() - z;
    return new Date(tLocal).toISOString().split(".")[0];
  };

  export const toMetricsFormat = (t: Date) => {
    let z = t.getTimezoneOffset() * 60 * 1000;
    let tLocal: any = t.getTime() - z;
    return new Date(tLocal).toISOString().split("T")[1];
  };