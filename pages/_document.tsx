import { EEWSProvider } from "@/lib/context/eews";
import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en" className="bg-indigo-950">
      <Head />
        <body className="bg-slate-300">
          <Main />
          <NextScript />
        </body>
      <footer className="bg-indigo-950 w-full h-32">EEWS Pacil 2020</footer>
    </Html>
  );
}
