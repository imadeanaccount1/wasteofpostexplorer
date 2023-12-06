export const metadata = {
  title: 'Home | wasteof Post Explorer',
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
      <head>
      <script async src="https://postexplorer-umami-imadeanaccount.vercel.app/script.js" data-website-id="21c969ed-14e3-450f-bb08-8ee748fe8590"></script>
      </head>
      <body>{children}</body>
    </html>
  )
}
