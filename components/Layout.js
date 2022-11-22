import Image from 'next/image';
import Link from 'next/link';
import styles from '../styles/Layout.module.scss' ;

export default function Layout({ darkThemeOn, onThemeToggle, children }) {
  return (
    <div className={styles.container}>
      <nav className={styles.header}>
        <svg className={styles.brand} width="100%" height="100%" viewBox="0 0 78 67" version="1.1" xmlns="http://www.w3.org/2000/svg" xlinkHref="http://www.w3.org/1999/xlink" xmlSpace="preserve">
          <path className={styles.top} d="M52.013,11.54l7.436,-11.54l-40.29,-0.009l-19.159,33.474l13.69,0.009l12.514,-21.934l25.809,0Z"/>
          <path className={styles.bot} d="M25.939,55.39l-7.435,11.539l40.29,0.009l19.159,-33.473l-13.69,-0.009l-12.514,21.934l-25.81,0Z"/>
        </svg>
        <input
          className={styles.toggleTheme}
          type="checkbox"
          defaultChecked={!darkThemeOn}
          onClick={(e) => onThemeToggle(e)}
        />
      </nav>
      <main className={styles.main}>
        {children}
      </main>
      <footer className={styles.footer}>
        <Link href="/about">Um Stafasett</Link>
      </footer>
    </div>
  )
}
