import { useRef, useEffect } from "react";
import { Global, css, keyframes } from "@emotion/react";
import { styled, useTheme } from "@mui/material/styles";
import Menu from "../../../components/menu";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import memoize from "lodash/memoize";
import debounce from "lodash/debounce";
import useMediaQuery from "@mui/material/useMediaQuery";
import { SVG, Polygon, Gradient, Circle as SvgCircle } from "@svgdotjs/svg.js";

const circleAnimation = keyframes`
  0% {
    opacity: 0.7
  }
  50% {
    opacity: 1
  }
  100% {
    opacity: 0.7
  }
`;

const Img = styled("img")``;

export default function Scrub() {
  return (
    <>
      <Global
        styles={css`
          html {
            background: url(/images/catalog_background.jpg) no-repeat center
              center fixed;
            background-size: cover;
          }
          body {
            background-color: transparent;
          }
        `}
      />
      <Menu selected="/catalog" />
      <Container
        sx={{
          pt: {
            xs: 2,
            md: 8,
          },
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            position: "relative",
            width: "100%",
            maxWidth: 400,
            lineHeight: 0,
            p: 5,
            mb: {
              xs: 0,
              md: 4,
            },
          }}
        >
          <Circle from="#0642ff" to="#59fca6" />
          <Img
            src="/images/scrub.png"
            sx={{
              maxWidth: "100%",
              pointerEvents: "none",
              position: "relative",
              zIndex: 1,
            }}
          />
        </Box>
        <Typography
          variant="h3"
          sx={{
            color: "common.white",
            textShadow: "0 0 6px #fff",
            textTransform: "uppercase",
            mb: {
              xs: 2,
              md: 4,
            },
          }}
        >
          lip balm
        </Typography>
        <Typography
          sx={{
            textAlign: "center",
            maxWidth: 800,
          }}
        >
          There are two main patterns for developer teams to work together using
          version control. One is to use feature branches, where either a
          developer or a group of developers create a branch usually from trunk
          (also known as main or mainline) and then work in isolation on that
          branch until the feature they are building is complete. When the team
          considers the feature ready to go, they merge the feature branch back
          to trunk.
        </Typography>
      </Container>
    </>
  );
}

const calculateCirclePoints = memoize(
  (size, width = 8, offset = 0) => {
    const pointsCount = 100;
    const radius = size / 2 - offset;
    const innerRadius = radius - width;
    const pointAngle = 360 / pointsCount;

    let outerPoints = [];
    let innerPoints = [];

    for (let i = 0, j = pointsCount; i <= pointsCount; i++, j--) {
      const outerAngle = (pointAngle * i * Math.PI) / 180;
      const outerX = radius * Math.sin(outerAngle) + radius + offset;
      const outerY = radius * Math.cos(outerAngle) + radius + offset;

      const innerAngle = (pointAngle * j * Math.PI) / 180;
      const innerX = innerRadius * Math.sin(innerAngle) + radius + offset;
      const innerY = innerRadius * Math.cos(outerAngle) + radius + offset;

      outerPoints.push([outerX, outerY]);
      innerPoints.push([innerX, innerY]);
    }

    return [...outerPoints, ...innerPoints];
  },
  (size, width, offset) => `${size}-${width}-${offset}`
);

function Circle({ from, to }) {
  const theme = useTheme();
  const isLarge = useMediaQuery(theme.breakpoints.up("md"));
  const containerRef = useRef();

  const circleWidth = isLarge ? 8 : 6;
  const circleOffset = 19;
  const glowWidth = circleWidth * 2;
  const glowOffset = circleOffset - (glowWidth - circleWidth) / 2;
  const blur = isLarge ? 8 : 5;

  useEffect(() => {
    if (!containerRef.current) return;

    const canvas = SVG().addTo(containerRef.current).size("100%", "100%");

    const gradient = new Gradient("linear");
    gradient.stop(0, from);
    gradient.stop(1, to);
    canvas.add(gradient);

    const glow = new Polygon().fill(gradient).css("filter", `blur(${blur}px)`);
    canvas.add(glow);

    const circle = new Polygon().fill("#ffffff");
    canvas.add(circle);

    const inner = new SvgCircle()
      .fill(gradient)
      .css("filter", `blur(${blur}px)`);
    canvas.add(inner);

    function draw() {
      const size = containerRef.current.offsetWidth;
      const center = size / 2;
      const offset =
        parseInt(
          getComputedStyle(containerRef.current.parentElement).paddingLeft
        ) - 5;

      const circlePoints = calculateCirclePoints(
        size,
        circleWidth,
        circleOffset
      );
      const glowPoints = calculateCirclePoints(size, glowWidth, glowOffset);

      glow.plot(glowPoints);
      circle.plot(circlePoints);

      inner.radius(center - offset).move(offset, offset);
    }

    draw();

    const debouncedDraw = debounce(draw, 500);
    window.addEventListener("resize", debouncedDraw);

    return () => {
      canvas.remove();
      window.removeEventListener("resize", debouncedDraw);
    };
  }, [circleWidth, circleOffset, glowWidth, glowOffset, blur, from, to]);

  return (
    <Box
      className="circle"
      ref={containerRef}
      sx={{
        animation: `${circleAnimation} 2s ease-in-out infinite`,
        position: "absolute",
        zIndex: 0,
        left: 0,
        top: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
    />
  );
}
