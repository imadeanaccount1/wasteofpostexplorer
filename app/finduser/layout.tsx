import React from "react";

export const metadata = {
    title: "Find Specific Users | wasteof Post Explorer",
    description: "Search for specific wasteof.money users by username, and view their posts.",
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
