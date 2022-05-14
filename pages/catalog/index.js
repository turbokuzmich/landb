import Link from "next/link";
import { useRef, useEffect, useState, useCallback } from "react";
import Box from "@mui/material/Box";
import Layout from "../../components/layout";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Menu from "../../components/menu";
import A from "@mui/material/Link";
import { styled, useTheme } from "@mui/material/styles";
import debounce from "lodash/debounce";
import memoize from "lodash/memoize";
import useMediaQuery from "@mui/material/useMediaQuery";
import { sessionOptions } from "../../constants";
import { withIronSessionSsr } from "iron-session/next";
import cart from "../../middleware/cart";
import useCart from "../../hooks/useCart";
import { titles, subtitles } from "../../constants";
import { isTouch as detectIsTouch } from "../../helpers/features";
import {
  SVG,
  Rect,
  Text,
  Polygon,
  Gradient,
  Circle as SvgCircle,
} from "@svgdotjs/svg.js";

const circleApproximation = 0.55191502449351;

const items = [
  {
    id: "balm",
    from: "#0642ff",
    to: "#59fca6",
    glow: "#59fca6",
  },
  {
    id: "oil",
    from: "#4874ff",
    to: "#ff00ff",
    glow: "#4874ff",
  },
  {
    id: "scrub",
    from: "#59fca6",
    to: "#cc09e0",
    glow: "#cc09e0",
  },
];

const Img = styled("img")``;

export default function Catalog({ cart }) {
  const { sum } = useCart(cart);

  return (
    <Layout>
      <Menu selected="/catalog" sum={sum} />
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
    </Layout>
  );
}

function CatalogItem({ id, from, to, glow }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [isHover, setIsHover] = useState(false);

  const onMouseEnter = useCallback(() => setIsHover(true), [setIsHover]);

  const onMouseLeave = useCallback(() => setIsHover(false), [setIsHover]);

  return (
    <Link href={`/catalog/${id}`} passHref>
      <A
        underline="none"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
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
          "@media (hover: hover)": {
            "& .subtitle": {
              opacity: 0,
              transform: "translateY(10px)",
              transition: "all 0.2s ease-out",
            },
            "&:hover .subtitle": {
              opacity: 1,
              transform: "translateY(0)",
            },
            "& .circle, & .title": {
              opacity: 0.7,
              transition: "opacity 0.2s ease-out",
            },
            "&:hover .circle, &:hover .title": {
              opacity: 1,
            },
            "& .image": {
              transition: "transform 0.2s ease-out",
              transform: "translate3d(0)",
            },
            "&:hover .image": {
              transform: "scale(1.05)",
            },
          },
        }}
      >
        <Underline glow={glow} hover={isHover} />
        <Typography
          className="title"
          textAlign="center"
          variant="h4"
          sx={{
            color: "common.white",
            textShadow: "0 0 6px #fff",
            textTransform: "uppercase",
            mb: {
              xs: 3,
              md: 6,
              lg: 9,
            },
          }}
        >
          {titles[id]}
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
          <Subtitle title={subtitles[id]} />
          <Img
            className="image"
            src={`/images/${id}.png`}
            alt={titles[id]}
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

function calculateArcPoints(radius, offset) {
  const control = radius * circleApproximation;
  const points = [
    `M${offset} ${offset + radius}`,
    `C${offset} ${offset + radius - control}, ${
      offset + radius - control
    } ${offset}, ${offset + radius} ${offset}`,
    `M${offset + radius} ${offset}`,
    `C${offset + radius + control} ${offset}, ${offset + radius + radius} ${
      offset + radius - control
    }, ${offset + radius + radius} ${offset + radius}`,
  ];

  return points.join();
}

function Subtitle({ title }) {
  const containerRef = useRef();

  useEffect(() => {
    if (!containerRef.current) return;

    const canvas = SVG().addTo(containerRef.current).size("100%", "100%");

    const text = new Text().text(title).fill("#ffffff");
    canvas.add(text);

    const path = text.path();

    function draw() {
      const containerWidth = containerRef.current.offsetWidth;
      const centerX = containerWidth / 2;
      const offset = 14;
      const radius = centerX - offset;
      const length = (radius * 2 * Math.PI) / 2;

      path
        .plot(calculateArcPoints(150, 0))
        .attr("x", (length - text.get(0).length()) / 2);

      path.plot(calculateArcPoints(radius, offset));
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
      className="subtitle"
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

function Underline({ glow, hover = false }) {
  const containerRef = useRef();
  const glowRectRef = useRef();
  const baseRectRef = useRef();

  const glowOffsets = {
    left: 40,
    top: 14,
  };
  const baseOffsets = {
    left: 48,
    top: 19,
  };

  useEffect(() => {
    if (!containerRef.current || detectIsTouch()) return;

    const canvas = SVG().addTo(containerRef.current).size("100%", "100%");

    const glowRect = new Rect();
    glowRectRef.current = glowRect;
    canvas.add(glowRect);

    const baseRect = new Rect();
    baseRectRef.current = baseRect;
    canvas.add(baseRect);

    function draw() {
      const width = containerRef.current.offsetWidth;
      const height = containerRef.current.offsetHeight;

      glowRect
        .x(glowOffsets.left)
        .y(glowOffsets.top)
        .width(0)
        .height(height - glowOffsets.top * 2)
        .fill(glow)
        .radius((height - glowOffsets.top * 2) / 2)
        .css("filter", "blur(3px)")
        .opacity(0);

      baseRect
        .x(baseOffsets.left)
        .y(baseOffsets.top)
        .width(0)
        .height(height - baseOffsets.top * 2)
        .fill("rgba(255, 255, 255, 0.5")
        .opacity(0);
    }

    draw();

    const debouncedDraw = debounce(draw, 500);
    window.addEventListener("resize", debouncedDraw);

    return () => {
      canvas.remove();
      window.removeEventListener("resize", debouncedDraw);
    };
  }, []);

  useEffect(() => {
    if (!glowRectRef.current || !baseRectRef.current || detectIsTouch()) {
      return;
    }

    const width = containerRef.current.offsetWidth;
    const height = containerRef.current.offsetHeight;

    if (hover) {
      glowRectRef.current
        .animate(200, 0, "now")
        .opacity(1)
        .width(width - glowOffsets.left * 2);
      baseRectRef.current
        .animate(200, 0, "now")
        .opacity(0.8)
        .width(width - baseOffsets.left * 2);
    } else {
      glowRectRef.current.animate(200, 0, "now").opacity(0).width(0);
      baseRectRef.current.animate(200, 0, "now").opacity(0).width(0);
    }
  }, [hover]);

  return (
    <Box
      ref={containerRef}
      sx={{
        position: "absolute",
        pointerEvents: "none",
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

export const getServerSideProps = withIronSessionSsr(cart, sessionOptions);
