import Link from "next/link";
import { useRef, useEffect } from "react";
import { Global, css, keyframes } from "@emotion/react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Menu from "../../components/menu";
import A from "@mui/material/Link";
import { styled, useTheme } from "@mui/material/styles";
import debounce from "lodash/debounce";
import memoize from "lodash/memoize";
import useMediaQuery from "@mui/material/useMediaQuery";
import {
  SVG,
  Rect,
  Polygon,
  Gradient,
  Circle as SvgCircle,
} from "@svgdotjs/svg.js";

const items = [
  {
    id: "balm",
    title: "lip balm",
    from: "#0642ff",
    to: "#59fca6",
    delay: "1s",
  },
  {
    id: "oil",
    title: "dry oil",
    from: "#4874ff",
    to: "#ff00ff",
    delay: "1.25s",
  },
  {
    id: "scrub",
    title: "scrub",
    from: "#59fca6",
    to: "#cc09e0",
    delay: "1.5s",
  },
];

const Img = styled("img")``;

export default function Catalog() {
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
      <Box
        sx={{
          display: "flex",
          width: {
            sm: "100vw",
          },
          height: {
            sm: "calc(100vh - 100px)",
          },
          alignItems: {
            sm: "center",
          },
          pt: {
            xs: 3,
            sm: "initial",
          },
        }}
      >
        <Container
          sx={{
            display: "flex",
            flexDirection: {
              xs: "column",
              sm: "row",
            },
            alignItems: {
              xs: "center",
              sm: "initial",
            },
            gap: {
              xs: 5,
              sm: 1,
            },
          }}
        >
          {items.map((item) => (
            <CatalogItem key={item.id} {...item} />
          ))}
        </Container>
      </Box>
    </>
  );
}

function CatalogItem({ id, title, from, to, delay }) {
  return (
    <Link href={`/catalog/${id}`} passHref>
      <A
        underline="none"
        sx={{
          flexGrow: 1,
          flexShrink: 1,
          maxWidth: {
            xs: 300,
            sm: "initial",
          },
          width: {
            xs: "100%",
            sm: "30%",
          },
          display: "block",
          position: "relative",
          "& .circle, & .underline, & .title": {
            opacity: 0.7,
            transition: "opacity 0.2s ease-out",
          },
          "&:hover .circle, &:hover .underline, &:hover .title": {
            opacity: 1,
          },
          "& .image": {
            transition: "transform 0.2s ease-out",
            transform: "translate3d(0)",
          },
          "&:hover .image": {
            transform: "scale(1.01)",
          },
        }}
      >
        <Underline />
        <Typography
          className="title"
          textAlign="center"
          variant="h4"
          sx={{
            color: "common.white",
            textShadow: "0 0 6px #fff",
            mb: {
              xs: 6,
              md: 9,
              lg: 12,
            },
          }}
        >
          {title}
        </Typography>
        <Box
          sx={{
            position: "relative",
            padding: {
              xs: 4,
              md: 5,
            },
          }}
        >
          <Circle from={from} to={to} />
          <Img
            className="image"
            src={`/images/${id}.png`}
            alt={title}
            sx={{
              position: "relative",
              pointerEvents: "none",
              display: "block",
              maxWidth: "100%",
              zIndex: 1,
            }}
          />
        </Box>
      </A>
    </Link>
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

function Circle({ from, to, delay }) {
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

function Underline() {
  const containerRef = useRef();

  useEffect(() => {
    if (!containerRef.current) return;

    const canvas = SVG().addTo(containerRef.current).size("100%", "100%");

    const horizontalOffset = 40;
    const rect1Offset = 11;
    const rect2Offset = rect1Offset + 6;
    const rect3Offset = rect2Offset + 1;
    const rect4Offset = rect3Offset + 1;

    const rect1Background = "#29d5f4";
    const rect2Background = "#2ae9f4";
    const rect3Background = "#ffffff";

    const rect1 = new Rect();
    canvas.add(rect1);

    const rect2 = new Rect();
    canvas.add(rect2);

    const rect3 = new Rect();
    canvas.add(rect3);

    const rect4 = new Rect();
    canvas.add(rect4);

    function draw() {
      const width = containerRef.current.offsetWidth;
      const height = containerRef.current.offsetHeight;

      rect1
        .x(rect1Offset + horizontalOffset)
        .y(rect1Offset)
        .width(width - horizontalOffset * 2 - rect1Offset * 2)
        .height(height - rect1Offset * 2)
        .fill(rect1Background)
        .radius((height - rect1Offset * 2) / 2)
        .opacity(0.8)
        .css("filter", "blur(3px)");

      rect2
        .x(rect2Offset + horizontalOffset)
        .y(rect2Offset)
        .width(width - horizontalOffset * 2 - rect2Offset * 2)
        .height(height - rect2Offset * 2)
        .fill(rect1Background)
        .radius((height - rect2Offset * 2) / 2);

      rect3
        .x(rect3Offset + horizontalOffset)
        .y(rect3Offset)
        .width(width - horizontalOffset * 2 - rect3Offset * 2)
        .height(height - rect3Offset * 2)
        .fill(rect2Background)
        .radius((height - rect3Offset * 2) / 2);

      rect4
        .x(rect4Offset + horizontalOffset)
        .y(rect4Offset)
        .width(width - horizontalOffset * 2 - rect4Offset * 2)
        .height(height - rect4Offset * 2)
        .fill(rect3Background)
        .radius((height - rect4Offset * 2) / 2);
    }

    draw();

    const debouncedDraw = debounce(draw, 500);
    window.addEventListener("resize", debouncedDraw);

    return () => {
      canvas.remove();
      window.removeEventListener("resize", debouncedDraw);
    };
  }, []);

  return (
    <Box
      className="underline"
      ref={containerRef}
      sx={{
        position: "absolute",
        top: {
          xs: 35,
          md: 45,
        },
        left: 0,
        right: 0,
        height: 40,
      }}
    />
  );
}
