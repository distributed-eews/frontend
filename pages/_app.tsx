import type { AppProps } from "next/app";
import "mapbox-gl/dist/mapbox-gl.css";
import "@/styles/globals.css";
import { EEWSProvider } from "@/lib/hooks/eewsCtx";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <EEWSProvider>
      <Component {...pageProps} />
    </EEWSProvider>
  );
}
