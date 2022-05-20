import { useEffect, useState, useRef } from "react";
import Head from "next/head";
import { Global, css, keyframes } from "@emotion/react";
import { styled } from "@mui/material/styles";
import debounce from "lodash/debounce";
import Link from "next/link";
import Box from "@mui/material/Box";
import A from "@mui/material/Link";
import { sessionOptions } from "../constants";
import { withIronSessionSsr } from "iron-session/next";
import cart from "../middleware/cart";

const Img = styled("img")``;

const circleAnimation = keyframes`
  0% {
    opacity: 0
  }
  50% {
    opacity: 0.5
  }
  100% {
    opacity: 0
  }
`;

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
const circleRelativeOffsets = {
  left: 77 / 751,
  top: 41 / 651,
  right: 90 / 751,
  offset: 102,
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

    const circleLeft = circleRelativeOffsets.left * resizedLogoSize.width;
    const circleTop = circleRelativeOffsets.top * resizedLogoSize.height;
    const circleRight = circleRelativeOffsets.right * resizedLogoSize.width;
    const circleOffset = circleRelativeOffsets.offset * resize;

    return {
      ...resizedLogoSize,
      ...resizedLogoPosition,
      circleLeft,
      circleTop,
      circleRight,
      circleOffset,
    };
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

    const circleLeft = circleRelativeOffsets.left * resizedLogoSize.width;
    const circleTop = circleRelativeOffsets.top * resizedLogoSize.height;
    const circleRight = circleRelativeOffsets.right * resizedLogoSize.width;
    const circleOffset = circleRelativeOffsets.offset * resize;

    if (resizedLogoPosition.top + resizedLogoSize.height > windowSize.height) {
      resizedLogoSize.height = windowSize.height - resizedLogoPosition.top;
    }

    return {
      ...resizedLogoSize,
      ...resizedLogoPosition,
      circleLeft,
      circleTop,
      circleRight,
      circleOffset,
    };
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
  const shineRef = useRef(null);
  const backgroundRef = useRef(null);

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function drawLogo(logoRect) {
      logoRef.current.style.width = `${logoRect.width}px`;
      logoRef.current.style.height = `${logoRect.height}px`;
      logoRef.current.style.left = `${logoRect.left}px`;
      logoRef.current.style.top = `${logoRect.top}px`;
    }

    function drawJingle(jingleRect) {
      jingleRef.current.style.width = `${jingleRect.width}px`;
      jingleRef.current.style.height = `${jingleRect.height}px`;
      jingleRef.current.style.left = `${jingleRect.left}px`;
      jingleRef.current.style.top = `${jingleRect.top}px`;
    }

    function drawCircle(logoRect) {
      shineRef.current.style.left = `${
        logoRect.circleLeft - logoRect.circleOffset
      }px`;
      shineRef.current.style.top = `${
        logoRect.circleTop - logoRect.circleOffset
      }px`;
      shineRef.current.style.width = `${
        logoRect.width -
        logoRect.circleLeft -
        logoRect.circleRight +
        logoRect.circleOffset * 2
      }px`;
    }

    function drawBackground(windowSize) {
      backgroundRef.current.style.height = `${windowSize.height}px`;
    }

    function draw() {
      const windowSize = {
        width: document.documentElement.offsetWidth,
        height: document.documentElement.offsetHeight,
      };

      const logoRect = getLogoRect(windowSize);
      const jingleRect = getJingleRect(windowSize, logoRect);

      drawBackground(windowSize);
      drawLogo(logoRect);
      drawJingle(jingleRect);
      drawCircle(logoRect);

      setVisible(true);
    }

    const redraw = debounce(draw, 500);

    draw();

    window.addEventListener("resize", redraw);

    return () => {
      window.removeEventListener("resize", redraw);
    };
  }, [setVisible]);

  return (
    <>
      <Global
        styles={css`
          body {
            background-color: transparent;
          }
        `}
      />
      <Head>
        <title key="title">LandB</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <link rel="prefetch" href="/images/balm.png" />
        <link rel="preload" href="/images/balm.png" as="image" />
        <link rel="prefetch" href="/images/photo_balm.png" />
        <link rel="preload" href="/images/photo_balm.png" as="image" />
        <link rel="prefetch" href="/images/oil.png" />
        <link rel="preload" href="/images/oil.png" as="image" />
        <link rel="prefetch" href="/images/photo_oil.png" />
        <link rel="preload" href="/images/photo_oil.png" as="image" />
        <link rel="prefetch" href="/images/scrub.png" />
        <link rel="preload" href="/images/scrub.png" as="image" />
        <link rel="prefetch" href="/images/photo_scrub.png" />
        <link rel="preload" href="/images/photo_scrub.png" as="image" />
        <link rel="prefetch" href="/images/catalog_background.jpg" />
        <link rel="preload" href="/images/catalog_background.jpg" as="image" />
      </Head>
      <Box
        sx={{
          height: "100vh",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box
          ref={backgroundRef}
          sx={{
            position: "absolute",
            height: "100vh",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1,
            background:
              "url(/images/home_background.jpg) no-repeat center center",
            backgroundSize: "cover",
          }}
        />
        <Link href="/catalog" passHref>
          <A
            ref={logoRef}
            underline="none"
            sx={{
              position: "absolute",
              zIndex: 2,
              width: 0,
              height: 0,
              x: 0,
              y: 0,
            }}
          >
            <Img
              src="/images/home_shine.png"
              ref={shineRef}
              sx={{
                position: "absolute",
                userSelect: "none",
                animation: `${circleAnimation} 3s ease-out 1s infinite`,
                opacity: 0,
              }}
            />
          </A>
        </Link>
        <Link href="/catalog" passHref>
          <A
            ref={jingleRef}
            underline="none"
            sx={{
              position: "absolute",
              zIndex: 2,
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
      </Box>
    </>
  );
}

export const getServerSideProps = withIronSessionSsr(cart, sessionOptions);
