import Document, { Html, Head, Main, NextScript } from 'next/document';

export default class MyDocument extends Document {
  render() {
    const pageProps = this.props?.__NEXT_DATA__?.props?.pageProps;
    return (
      <Html lang="is-IS">
        <Head />
        <body className={pageProps.isDarkTheme ? 'dark' : 'light'}>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}