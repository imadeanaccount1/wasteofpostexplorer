export const metadata = {
  title: 'Home | Wasteof Post Explorer',
  description: 'Find, filter, search, sort, and paginate scraped wasteof posts and users.',
  "opengraph-image": "https://wasteof-postexplorer.vercel.app/image.jpg",
  metadataBase: new URL('https://wasteof-postexplorer.vercel.app/'),
}


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
