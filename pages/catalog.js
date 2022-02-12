import React from "react";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Image from "next/image";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import CartIcon from "@mui/icons-material/ShoppingCart";
import MenuIcon from "@mui/icons-material/Menu";
import A from "@mui/material/Link";
import Link from "next/link";

import lips from "../public/images/lips.jpg";
import brows from "../public/images/brows.jpg";
import face from "../public/images/face.jpg";

const Catalog = () => {
  return (
    <>
      <AppBar>
        <Container>
          <Toolbar disableGutters>
            <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center" }}>
              <IconButton
                size="large"
                edge="start"
                sx={{
                  mr: 2,
                  display: {
                    sm: "none",
                  },
                }}
              >
                <MenuIcon />
              </IconButton>
              <Link href="/" passHref>
                <A
                  variant="h6"
                  underline="none"
                  color="text.primary"
                  sx={{ mr: 6 }}
                >
                  LandB
                </A>
              </Link>
              {["губы", "брови", "лицо"].map((title) => (
                <Button
                  key={title}
                  size="large"
                  sx={{
                    display: {
                      xs: "none",
                      sm: "initial",
                    },
                  }}
                >
                  {title}
                </Button>
              ))}
            </Box>
            <IconButton size="large">
              <CartIcon />
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>
      <Container
        sx={{
          mt: {
            xs: 9,
            sm: 12,
          },
        }}
      >
        {[
          { id: "lips", title: "Губы", image: lips },
          { id: "brows", title: "Брови", image: brows },
          { id: "face", title: "Лицо", image: face },
        ].map(({ id, title, image }) => (
          <Box
            key={id}
            sx={{
              display: "flex",
              mb: 4,
              gap: {
                xs: 2,
                sm: 4,
              },
              flexDirection: {
                xs: "column",
                sm: "row",
              },
            }}
          >
            <Box
              sx={{
                flexShrink: 0,
                lineHeight: 0,
                width: {
                  xs: "100%",
                  sm: "50%",
                },
              }}
            >
              <Image src={image} />
            </Box>
            <Box
              sx={{
                flexShrink: 1,
                flexGrow: 1,
              }}
            >
              <Typography variant="h3" gutterBottom>
                {title}
              </Typography>
              <Typography variant="body1" paragraph>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Phasellus molestie elementum diam sed fermentum. Curabitur
                efficitur lacus nec massa hendrerit ultrices. Proin at quam
                odio. Cras in ipsum eget ligula scelerisque placerat a sit amet
                est. In quis lorem tellus. Maecenas tincidunt libero at turpis
                lacinia, et condimentum felis elementum. Sed id rutrum elit,
                vitae feugiat nisi. Suspendisse eu vulputate sapien. Cras eget
                diam tellus. Interdum et malesuada fames ac ante ipsum primis in
                faucibus. Duis ornare elementum nibh, id gravida turpis gravida
                ut.
              </Typography>
            </Box>
          </Box>
        ))}
      </Container>
    </>
  );
};

export default Catalog;
