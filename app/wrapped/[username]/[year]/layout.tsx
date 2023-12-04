import React from "react";

export async function generateMetadata({ params,}: { params: {username: string, year: string } }) {
    return {
      title: "@" + params.username + "'s wasteof Wrapped for " + params.year ,
      description: "wasteof.money year in review | wasteof Post Explorer",
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
