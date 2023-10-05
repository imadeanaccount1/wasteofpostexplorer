export const metadata = {
  title: 'Wasteof Post Explorer',
  description: 'Find, filter, search, sort, and paginate scraped wasteof posts and users.',
  "opengraph-image": "https://wasteof-postexplorer.vercel.app/image.jpg",
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
