import React, { useEffect } from 'react';
import Layout from '../components/layout';
import '../styles/globals.scss';

function MyApp({ Component, pageProps }) {
  const setTheme = (isDark) => {
    setIsDark(isDark);
    document.body.className = (isDark ? 'dark' : 'light');
    try {
      localStorage.setItem('prefers_dark', isDark);
    } catch {
      console.error('Could not save theme scheme, clients local storage is probably full.');
    }
  };
  const themeChanged = (e) => {
    const darkStatus = !e.target.checked;
    setTheme(darkStatus);
  };
  useEffect(() => {
    const darkStatus = localStorage.getItem('prefers_dark') === 'true' || false;
    setTheme(darkStatus);
    //setIsLoaded(true);
  }, []);
  const [isLoaded, setIsLoaded] = React.useState(true);
  const [isDark, setIsDark] = React.useState(true);
  return (
    isLoaded ?
      (<Layout darkThemeOn={isDark} onThemeToggle={themeChanged}>
        <Component {...pageProps} />
      </Layout>)
      : (<div></div>)
    )
}

export default MyApp;
