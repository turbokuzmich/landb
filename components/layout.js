import { Global, css } from "@emotion/react";
import Box from "@mui/material/Box";

export default function Layout({ children }) {
  return (
    <>
      <Global
        styles={css`
          body {
            background-color: transparent;
          }
        `}
      />
      <Box
        sx={{
          minHeight: "100vh",
          backgroundImage:
            "linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0)), url(/images/catalog_background.jpg)",
          backgroundRepeat: "no-repeat, no-repeat",
          backgroundPosition: "center center, center center",
          backgroundAttachment: "fixed, fixed",
          backgroundSize: "cover, cover",
        }}
      >
        {children}
      </Box>
    </>
  );
}
