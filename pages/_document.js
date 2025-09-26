import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="tr">
      <Head>
        <meta charSet="UTF-8" />
        <link rel="icon" type="image/svg+xml" href="/favicon.ico" />
        <title>AidatPlus</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Aidat Plus" />
        <link rel="apple-touch-icon" href="/logo192.png" />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
