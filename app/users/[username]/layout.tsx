import React from "react";

export async function generateMetadata({ params,}: { params: {username: string } }) {
    return {
      title: "@" + params.username + "'s profile | Wasteof Post Explorer",
    };
  }

  
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
