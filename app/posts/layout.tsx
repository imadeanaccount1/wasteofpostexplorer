import React from "react";

export const metadata = {
    title: "Filter Posts | Wasteof Post Explorer",
    description: "Filter, sort, paginate, and search wasteof.money posts.",
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
