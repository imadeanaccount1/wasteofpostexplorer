import React from "react";

export async function generateMetadata({ params,}: { params: {username: string } }) {
    return {
      title: "@" + params.username + "'s profile | wasteof Post Explorer",
      description: "Explore @" + params.username + "'s posts on wasteof.money",
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
