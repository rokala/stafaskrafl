import React, { useEffect } from 'react';
import Layout from '../components/layout';
import '../styles/globals.scss';

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    //console.log(pageProps);
    //document.body.className = pageProps.isDarkTheme ? 'dark' : 'light';
  });
  const themeChanged = (e) => {
    setIsDark(!e.target.checked);
    document.body.className = (e.target.checked ? 'light' : 'dark')
  };
  const [isDark, setIsDark] = React.useState(true);
  return (
    <Layout onThemeToggle={themeChanged}>
      <Component {...pageProps} /*currTheme={isDark ? 'dark' : 'light'}*/ />
    </Layout>
  )
}
/*
export async function getStaticProps (context) {
  return {
    props: {
      isDarkTheme: true
    }
  };
}
*/
export default MyApp;
