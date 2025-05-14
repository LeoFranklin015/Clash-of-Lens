import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Provider } from "@/components/FamilyConnectProvider";
import { LensProviderWrapper } from "@/components/LensProviderWrapper";
import { Layout } from "@/components/layout/layout";
import { SessionProvider } from "@/components/SessionContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Clash of Lens",
  description: "Blockchain-based social strategy game built on Lens Protocol",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Provider>
          <LensProviderWrapper>
            <SessionProvider>
              <Layout>{children}</Layout>
            </SessionProvider>
          </LensProviderWrapper>
        </Provider>
      </body>
    </html>
  );
}
