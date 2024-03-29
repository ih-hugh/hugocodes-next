import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html className="flex justify-center bg-slate-900  text-slate-300">
      <Head />
      <body className=" max-w-screen-2xl">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
