import type { Metadata } from "next";
import { IBM_Plex_Mono, Work_Sans } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const workSans = Work_Sans({
  variable: "--font-work-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const nationalPark = localFont({
  variable: "--font-national-park",
  src: [
    { path: "./fonts/NationalPark-Regular.ttf", weight: "400", style: "normal" },
    { path: "./fonts/NationalPark-Bold.ttf", weight: "700", style: "normal" },
  ],
});

export const metadata: Metadata = {
  title: "VogelPaul",
  description: "Beheer je volière: vogels, koppels, broedsels en wedstrijden.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="nl"
      className={`${workSans.variable} ${plexMono.variable} ${nationalPark.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-ground text-ink">
        {children}
      </body>
    </html>
  );
}
