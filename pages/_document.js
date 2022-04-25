import React from "react";
import Document, { Html, Head, Main, NextScript } from "next/document";
import { CacheProvider } from "@emotion/react";
import createEmotionServer from "@emotion/server/create-instance";
import createCache from "@emotion/cache";

export default class LnBDocument extends Document {
  render() {
    return (
      <Html>
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }

  static async getInitialProps(ctx) {
    const originalRenderPage = ctx.renderPage;
    const cache = createCache({ key: "css" });
    const { extractCritical } = createEmotionServer(cache);

    ctx.renderPage = () =>
      originalRenderPage({
        enhanceApp: (App) => (props) => {
          return (
            <CacheProvider value={cache}>
              <App {...props} />
            </CacheProvider>
          );
        },
      });

    const initialProps = await Document.getInitialProps(ctx);
    const { ids, css } = extractCritical(initialProps.html);

    return {
      ...initialProps,
      styles: [
        ...React.Children.toArray(initialProps.styles),
        <style
          key="emotion"
          data-emotion={`css ${ids.join(" ")}`}
          dangerouslySetInnerHTML={{ __html: css }}
        />,
      ],
    };
  }
}