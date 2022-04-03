import { useEffect, useState, useRef } from "react";
import Head from "next/head";
import { Global, css } from "@emotion/react";
import { styled } from "@mui/material/styles";
import debounce from "lodash/debounce";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import A from "@mui/material/Link";

const Img = styled("img")``;

const backgroundSize = {
  width: 2300,
  height: 2000,
};
const logoSize = {
  width: 900,
  height: 780,
};
const jingleSize = {
  width: 756,
  height: 161,
};
const logoPosition = {
  left: (backgroundSize.width - logoSize.width) / 2,
  top: 707,
};

const backgroundRatio = backgroundSize.width / backgroundSize.height;

function getLogoRect(windowSize) {
  const windowRatio = windowSize.width / windowSize.height;

  if (windowRatio < backgroundRatio) {
    const resize = windowSize.height / backgroundSize.height;

    const resizedLogoSize = {
      width: logoSize.width * resize,
      height: logoSize.height * resize,
    };
    const resizedBackgroundSize = {
      width: backgroundSize.width * resize,
      height: backgroundSize.height * resize,
    };
    const resizedLogoPosition = {
      left:
        logoPosition.left * resize -
        (resizedBackgroundSize.width - windowSize.width) / 2,
      top: logoPosition.top * resize,
    };

    return { ...resizedLogoSize, ...resizedLogoPosition };
  } else {
    const resize = windowSize.width / backgroundSize.width;

    const resizedLogoSize = {
      width: logoSize.width * resize,
      height: logoSize.height * resize,
    };
    const resizedBackgroundSize = {
      width: backgroundSize.width * resize,
      height: backgroundSize.height * resize,
    };
    const resizedLogoPosition = {
      left: logoPosition.left * resize,
      top:
        logoPosition.top * resize -
        (resizedBackgroundSize.height - windowSize.height) / 2,
    };

    if (resizedLogoPosition.top + resizedLogoSize.height > windowSize.height) {
      resizedLogoSize.height = windowSize.height - resizedLogoPosition.top;
    }

    return { ...resizedLogoSize, ...resizedLogoPosition };
  }
}

function getJingleRect(windowSize, logoRect) {
  const width = Math.min(jingleSize.width, logoRect.width);
  const ratio = width / jingleSize.width;
  const height = jingleSize.height * ratio;
  const top = (logoRect.top - height) / 2;
  const left = (windowSize.width - width) / 2;

  return { width, height, top, left };
}

export default function Home() {
  const logoRef = useRef(null);
  const jingleRef = useRef(null);

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function draw() {
      const windowSize = {
        width: document.documentElement.clientWidth,
        height: document.documentElement.clientHeight,
      };

      const logoRect = getLogoRect(windowSize);
      const jingleRect = getJingleRect(windowSize, logoRect);

      logoRef.current.style.width = `${logoRect.width}px`;
      logoRef.current.style.height = `${logoRect.height}px`;
      logoRef.current.style.left = `${logoRect.left}px`;
      logoRef.current.style.top = `${logoRect.top}px`;

      jingleRef.current.style.width = `${jingleRect.width}px`;
      jingleRef.current.style.height = `${jingleRect.height}px`;
      jingleRef.current.style.left = `${jingleRect.left}px`;
      jingleRef.current.style.top = `${jingleRect.top}px`;

      setVisible(true);
    }

    const redraw = debounce(draw, 500);

    draw();

    window.addEventListener("resize", redraw);

    return () => window.removeEventListener("resize", redraw);
  }, [setVisible]);

  return (
    <>
      <Global
        styles={css`
          html {
            background: url(/images/home_background.jpg) no-repeat center center
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
          ref={logoRef}
          underline="none"
          sx={{
            position: "absolute",
            width: 0,
            height: 0,
            x: 0,
            y: 0,
          }}
        >
          &nbsp;
        </A>
      </Link>
      <Link href="/catalog" passHref>
        <A
          ref={jingleRef}
          underline="none"
          sx={{
            position: "absolute",
            width: 0,
            height: 0,
            x: 0,
            y: 0,
          }}
        >
          <Img
            src="/images/jingle.png"
            sx={{
              transition: "opacity 0.5s ease-out, transform 0.5s ease-out",
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(-10px)",
              maxWidth: "100%",
            }}
          />
        </A>
      </Link>
    </>
  );
}

// <Typography
//   variant="h4"
//   sx={{
//     textTransform: "uppercase",
//     color: "text.primary",
//     fontWeight: "bold",
//     letterSpacing: 3,
//     animation: "neonAnimation 1s infinite",
//   }}
// >
//   посмотреть
// </Typography>
