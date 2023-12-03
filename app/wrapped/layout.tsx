import React from "react";

export const metadata = {
    title: "wasteof Wrapped | wasteof Post Explorer",
    description: "wasteof year in review" ,
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
