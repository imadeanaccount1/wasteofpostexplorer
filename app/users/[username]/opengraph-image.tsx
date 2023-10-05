import { ImageResponse } from 'next/server'
import Typography from '@mui/joy/Typography';

export const runtime = 'edge'
 
export const alt = 'About Acme'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'
 
export default async function Image({ params }: { params: { username: string } }) {
 
  return new ImageResponse(
    (
      <Typography>{params.username}</Typography>
    ),
    {
      ...size,
    }
  )
}