import { Global, css } from "@emotion/react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Menu from "../../components/menu";

export default function About() {
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
      <Menu selected="/about" />
      <Container>
        <Typography
          align="center"
          sx={{
            fontSize: {
              xs: "1em",
              md: "1.3em",
              lg: "1.6em",
            },
            mt: {
              xs: 2,
              md: 8,
            },
          }}
        >
          In trunk-based development, developers push code directly into trunk.
          Changes made in the release branches—snapshots of the code when it's
          ready to be released—are usually merged back to trunk (depicted by the
          downward arrows) as soon as possible. In this approach, there are
          cases where bug fixes must be cherry picked and merged into releases
          (depicted by the upward arrow), but these cases are not as frequent as
          the development of new features in trunk. In cases where releases
          happen multiple times a day, release branches are not required at all,
          because changes can be pushed directly into trunk and deployed from
          there. One key benefit of the trunk-based approach is that it reduces
          the complexity of merging events and keeps code current by having
          fewer development lines and by doing small and frequent merges.
        </Typography>
      </Container>
    </>
  );
}
