import Head from "next/head";
import { Global, css } from "@emotion/react";
import Container from "@mui/material/Container";
import Toolbar from "@mui/material/Toolbar";
import Link from "next/link";
import A from "@mui/material/Link";

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
          body {
            background-color: transparent;
          }
        `}
      />
      <Head>
        <title>LandB</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <Link href="/catalog" passHref>
        <A
          sx={{
            display: "block",
            height: "100vh",
            width: "100vw",
            textDecoration: "none",
          }}
        >
          &nbsp;
        </A>
      </Link>
    </>
  );
}
