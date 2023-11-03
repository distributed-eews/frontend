import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en" className='bg-pink-300'>
      <Head />
      <body className='bg-slate-300'>
        <Main />
        <NextScript />
      </body>
      <footer className='bg-pink-300 w-full h-32'>
        EEWS Pacil 2020
      </footer>
    </Html>
  )
}
