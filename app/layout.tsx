export const metadata = {
  title: 'Wasteof Post Explorer',
  description: 'Find, filter, search, sort, and paginate scraped wasteof posts and users.',
}

import Head from 'next/head'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <Head>
      <meta
          property="og:image"
          content="./image.jpg"
        />
      </Head>
      <body>{children}</body>
    </html>
  )
}
