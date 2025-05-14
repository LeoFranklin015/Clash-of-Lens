import React from "react";
import { MainNav } from "../main-nav";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <MainNav isLoaded={true} />
      <main className="w-full bg-[#0B0B0F] min-h-screen ">{children}</main>
    </>
  );
}
