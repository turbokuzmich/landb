import { useRef, useEffect, useState } from "react";
import { keyframes } from "@emotion/react";
import { styled, useTheme } from "@mui/material/styles";
import Menu from "./menu";
import Layout from "./layout";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Popper from "@mui/material/Popper";
import Price from "./price";
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

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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
    <Layout>
      <Menu selected="/catalog" sum={sum} cartMenuItemRef={cartMenuItemRef} />
      <ClickAwayListener onClickAway={close}>
        <Popper
          open={isCartDialogOpen}
          anchorEl={cartMenuItemRef.current}
          placement="bottom-end"
          modifiers={[
            {
              name: "offset",
              options: {
                offset: [16, isMobile ? -51 : -76],
              },
            },
          ]}
          keepMounted
        >
          <Box
            sx={{
              width: {
                xs: 300,
                sm: 350,
              },
              display: "flex",
              justifyContent: "end",
            }}
          >
            <Typography
              sx={{
                fontSize: {
                  xs: "18px",
                  sm: "20px",
                },
                pr: 2,
                pl: 2,
                borderTop: "solid 1px rgba(255, 255, 255, 0.5)",
                backgroundColor: "grey.900",
                lineHeight: "50px",
                color: "#ffffff",
                display: "flex",
                alignItems: "center",
              }}
            >
              <ShoppingCartIcon sx={{ mr: "6px" }} />
              <Price sum={sum} />
            </Typography>
          </Box>
          <Box
            sx={{
              backgroundColor: "grey.900",
              display: "flex",
              flexDirection: "column",
              p: 2,
              gap: 2,
              width: {
                sx: 300,
                sm: 350,
              },
            }}
          >
            <Button
              onClick={close}
              variant="outlined"
              size="large"
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
              Продолжить покупки
            </Button>
            <Button href="/cart" variant="contained" size="large">
              Заказать доставку
            </Button>
          </Box>
        </Popper>
      </ClickAwayListener>
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
            flexDirection: {
              xs: "column",
              sm: "row",
            },
            gap: 4,
            alignItems: "center",
            maxWidth: 800,
            mb: {
              xs: 2,
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
            <CartBlock
              id={id}
              add={add}
              itemStatus={itemStatus}
              sx={{
                justifyContent: "center",
                display: isMobile ? "flex" : "none",
                mb: 4,
              }}
            />
            <Typography variant="h6" paragraph>
              Состав:
            </Typography>
            <Typography
              component="ul"
              sx={{
                listStyleType: "none",
                listStylePosition: "outside",
                pl: 0,
                mb: {
                  xs: 0,
                  sm: 4,
                },
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
            <CartBlock
              id={id}
              add={add}
              itemStatus={itemStatus}
              sx={{
                display: isMobile ? "none" : "flex",
              }}
            />
          </Box>
        </Box>
        <Typography
          sx={{
            textAlign: {
              xs: "left",
              sm: "center",
            },
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
    </Layout>
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

function CartBlock({ id, add, itemStatus, sx = {} }) {
  return (
    <Box
      sx={{
        gap: 2,
        display: "flex",
        alignItems: "center",
        ...sx,
      }}
    >
      <Typography variant="h4">
        <Price sum={prices[id]} />
      </Typography>
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
  );
}
