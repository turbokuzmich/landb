import CssBaseline from "@mui/material/CssBaseline";
import {
  createTheme,
  ThemeProvider,
  responsiveFontSizes,
} from "@mui/material/styles";

import "../styles/global.css";

const theme = responsiveFontSizes(
  createTheme({
    palette: {
      mode: "dark",
      background: {
        default: "#001331",
      },
      primary: {
        main: "rgba(255, 255, 255, 0.8)",
        dark: "rgba(255, 255, 255, 1)",
      },
    },
    typography: {
      fontFamily: '"Evolventa", sans-serif',
    },
  })
);

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default MyApp;
