import React from "react";

export const metadata = {
    title: "Contact Us, Credits, and License | Wasteof Post Explorer",
    description: "Contact us, view credits, and view license information for the Wasteof Post Explorer.",
  };

  
export default function RootLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
        <>
        {children}
        </>
    )
  }
