import Head from "next/head";
import { Global, css } from "@emotion/react";

export default function Home() {
  return (
    <>
      <Global
        styles={css`
          html {
            background: url(/images/background.jpg) no-repeat center center
              fixed;
            background-size: cover;
          }
        `}
      />
      <Head>
        <title>LandB</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
    </>
  );
}
