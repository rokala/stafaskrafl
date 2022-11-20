import Image from 'next/image';
import Link from 'next/link';
import { getStaticProps } from '../pages';
//import { useState } from 'react';
import styles from '../styles/Layout.module.scss' ;

export default function Layout({ onThemeToggle, children }) {
  return (
    <div className={styles.container}>
      <nav className={styles.header}>
        <Image
          src="/brand.png"
          alt="Stafasett logo"
          width={60}
          height={60}
          priority={true}
        />
        <input
          className={styles.toggleTheme}
          type="checkbox"
          defaultChecked={false}
          onClick={(e) => onThemeToggle(e)}
        />
      </nav>
      <main>
        {children}
      </main>
      <footer className={styles.footer}>
        <Link href="/about">Um Stafasett</Link>
      </footer>
    </div>
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