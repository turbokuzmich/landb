import { useEffect, useState, useRef } from "react";
import Head from "next/head";
import { Global, css, keyframes } from "@emotion/react";
import { SVG, Polygon } from "@svgdotjs/svg.js";
import { styled } from "@mui/material/styles";
import debounce from "lodash/debounce";
import memoize from "lodash/memoize";
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
  3% {
    opacity: 0.3
  }
  6% {
    opacity: 0
  }
  9% {
    opacity: 0.6
  }
  15% {
    opacity: 0
  }
  100% {
    opacity: 1
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
  top: 40 / 651,
  right: 90 / 751,
  width: 19 / 751,
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
    const circleWidth = circleRelativeOffsets.width * resizedLogoSize.width;

    return {
      ...resizedLogoSize,
      ...resizedLogoPosition,
      circleLeft,
      circleTop,
      circleRight,
      circleWidth,
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
    const circleWidth = circleRelativeOffsets.width * resizedLogoSize.width;

    if (resizedLogoPosition.top + resizedLogoSize.height > windowSize.height) {
      resizedLogoSize.height = windowSize.height - resizedLogoPosition.top;
    }

    return {
      ...resizedLogoSize,
      ...resizedLogoPosition,
      circleLeft,
      circleTop,
      circleRight,
      circleWidth,
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

const calculateCirclePoints = memoize(
  (size, width = 8, x = 0, y = 0) => {
    const pointsCount = 100;
    const radius = size / 2;
    const innerRadius = radius - width;
    const pointAngle = 360 / pointsCount;

    let outerPoints = [];
    let innerPoints = [];

    for (let i = 0, j = pointsCount; i <= pointsCount; i++, j--) {
      const outerAngle = (pointAngle * i * Math.PI) / 180;
      const outerX = radius * Math.sin(outerAngle) + radius + x;
      const outerY = radius * Math.cos(outerAngle) + radius + y;

      const innerAngle = (pointAngle * j * Math.PI) / 180;
      const innerX = innerRadius * Math.sin(innerAngle) + radius + x;
      const innerY = innerRadius * Math.cos(outerAngle) + radius + y;

      outerPoints.push([outerX, outerY]);
      innerPoints.push([innerX, innerY]);
    }

    return [...outerPoints, ...innerPoints];
  },
  (size, width, x, y) => `${size}-${width}-${x}-${y}`
);

export default function Home() {
  const logoRef = useRef(null);
  const jingleRef = useRef(null);
  const circleRef = useRef(null);
  const backgroundRef = useRef(null);

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const canvas = SVG().addTo(circleRef.current).size("100%", "100%");

    const shine = new Polygon().fill("#ffffff");
    canvas.add(shine);

    const circle = new Polygon().fill("#ffffff").css("filter", "blur(8px)");
    canvas.add(circle);

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
      const size = logoRect.width - logoRect.circleLeft - logoRect.circleRight;
      const points = calculateCirclePoints(
        size,
        logoRect.circleWidth,
        logoRect.circleLeft,
        logoRect.circleTop
      );

      circle.plot(points);
      shine.plot(points);
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
      canvas.remove();
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
        <title>LandB</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="initial-scale=1, width=device-width" />
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
            <Box
              ref={circleRef}
              sx={{
                animation: `${circleAnimation} 2s ease-out 1s forwards`,
                opacity: 0,
                height: "100%",
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
