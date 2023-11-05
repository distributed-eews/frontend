export const onWaveformMessage = () => {
    return (ev: MessageEvent<any>) => {
        const res = JSON.parse(ev.data);
        console.log(res)
    };
};
