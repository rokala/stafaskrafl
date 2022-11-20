import Link from 'next/link';
import Head from 'next/head';

export default function AboutPage() {
  return (
    <div>
      <Head>
        <title>About page</title>
      </Head>
      <h1>About page</h1>
      <div>
        <Link href="/">Home page</Link>
      </div>
    </div>
  );
}

export async function getStaticProps() {
  return { props: { isDark: false } };
}