import React, { useEffect } from 'react';
import '../styles/globals.scss'

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    document.body.className = pageProps.isDarkTheme ? 'dark' : 'light';
  });
  return <Component {...pageProps}/>
}

export default MyApp
