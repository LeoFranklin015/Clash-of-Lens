"use client";

import { LensProvider } from "@lens-protocol/react";
import { client } from "../lib/client";

export function LensProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <LensProvider client={client}>{children}</LensProvider>;
}
