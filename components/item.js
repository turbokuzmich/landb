import { useRef, useEffect, useState } from "react";
import { Global, css, keyframes } from "@emotion/react";
import { styled, useTheme } from "@mui/material/styles";
import Link from "next/link";
import Menu from "./menu";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Popper from "@mui/material/Popper";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import memoize from "lodash/memoize";
import debounce from "lodash/debounce";
import useMediaQuery from "@mui/material/useMediaQuery";
import { SVG, Polygon, Gradient, Circle as SvgCircle } from "@svgdotjs/svg.js";
import { prices, titles, subtitles } from "../constants";
import useCart from "../hooks/useCart";

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

export default function Item({
  id,
  cart,
  composition,
  colorStart,
  colorStop,
  children,
}) {
  const cartMenuItemRef = useRef();

  const { sum, itemStatus, addToCart } = useCart(cart);

  const [isCartDialogOpen, setIsCartDialogOpen] = useState(false);

  const add = () => addToCart(id);

  const close = () => setIsCartDialogOpen(false);

  useEffect(() => {
    if (itemStatus[id] === "success") {
      setIsCartDialogOpen(true);
    }
  }, [itemStatus[id], setIsCartDialogOpen]);

  return (
    <>
      <Global
        styles={css`
          html {
            background-image: linear-gradient(
                rgba(0, 0, 0, 0),
                rgba(0, 0, 0, 0.8),
                rgba(0, 0, 0, 0)
              ),
              url(/images/catalog_background.jpg);
            background-repeat: no-repeat, no-repeat;
            background-position: center center, center center;
            background-attachment: fixed, fixed;
            background-size: cover, cover;
          }
          body {
            background-color: transparent;
          }
        `}
      />
      <Menu selected="/catalog" sum={sum} cartMenuItemRef={cartMenuItemRef} />
      <Popper
        open={isCartDialogOpen}
        anchorEl={cartMenuItemRef.current}
        placement="bottom-end"
        keepMounted
      >
        <IconButton
          onClick={close}
          size="small"
          sx={{
            position: "absolute",
            right: 0,
            top: 0,
            zIndex: 1,
          }}
        >
          <CloseIcon />
        </IconButton>
        <Paper
          elevation={2}
          sx={{
            position: "relative",
            width: 250,
          }}
        >
          <Typography
            variant="h6"
            textAlign="center"
            sx={{
              p: 4,
              borderBottom: "solid 1px #757575",
            }}
          >
            Товар добавлен
          </Typography>
          <Box
            sx={{
              p: 4,
              textTransform: "uppercase",
            }}
          >
            <Box
              sx={{
                mb: 2,
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Typography>итого</Typography>
              <Typography sx={{ fontWeight: "bold" }}>{sum}₽</Typography>
            </Box>
            <Link href="/cart" passHref>
              <Button
                variant="outlined"
                size="large"
                sx={{
                  width: "100%",
                  color: "#ffffff",
                  borderColor: "#ffffff",
                  backgroundColor: "rgba(255, 255, 255, 0)",
                  "&:hover": {
                    borderColor: "#ffffff",
                    backgroundColor: "rgba(255, 255, 255, 0.08)",
                  },
                }}
              >
                Купить
              </Button>
            </Link>
          </Box>
        </Paper>
      </Popper>
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
        <Typography
          variant="h3"
          sx={{
            color: "common.white",
            textShadow: "0 0 6px #fff",
            textTransform: "uppercase",
          }}
        >
          {titles[id]}
        </Typography>
        <Typography
          color="text.secondary"
          sx={{
            mb: {
              xs: 2,
              md: 4,
            },
          }}
        >
          ({subtitles[id]})
        </Typography>
        <Box
          sx={{
            display: "flex",
            gap: 4,
            alignItems: "center",
            maxWidth: 800,
            mb: {
              xs: 0,
              md: 4,
            },
          }}
        >
          <Box
            sx={{
              position: "relative",
              width: "100%",
              lineHeight: 0,
              p: 5,
            }}
          >
            <Circle from={colorStart} to={colorStop} />
            <Img
              src={`/images/${id}.png`}
              sx={{
                maxWidth: "100%",
                pointerEvents: "none",
                position: "relative",
                zIndex: 1,
              }}
            />
          </Box>
          <Box
            sx={{
              flexShrink: 0,
              flexGrow: 0,
              width: 300,
            }}
          >
            <Typography variant="h6" paragraph>
              Состав:
            </Typography>
            <Typography
              component="ul"
              sx={{
                listStyleType: "none",
                listStylePosition: "outside",
                pl: 0,
                mb: 4,
                "& li": {
                  position: "relative",
                  "&:after": {
                    content: "'—'",
                    position: "absolute",
                    left: -22,
                    top: 0,
                  },
                },
                "& li:not(:last-child)": {
                  mb: 1,
                },
              }}
            >
              {composition.map((text) => (
                <Typography key={text} component="li">
                  {text}
                </Typography>
              ))}
            </Typography>
            <Box
              sx={{
                gap: 2,
                display: "flex",
                alignItems: "center",
              }}
            >
              <Typography variant="h4">{prices[id]} ₽</Typography>
              <Button
                onClick={add}
                variant="outlined"
                size="large"
                disabled={itemStatus[id] !== "initial"}
                sx={{
                  color: "#ffffff",
                  borderColor: "#ffffff",
                  backgroundColor: "rgba(255, 255, 255, 0)",
                  "&:hover": {
                    borderColor: "#ffffff",
                    backgroundColor: "rgba(255, 255, 255, 0.08)",
                  },
                }}
              >
                {itemStatus[id] === "success" ? "Добавлено!" : "В корзину"}
              </Button>
            </Box>
          </Box>
        </Box>
        <Typography
          sx={{
            textAlign: "center",
            maxWidth: 800,
            mb: {
              xs: 2,
              md: 4,
            },
          }}
        >
          {children}
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
