import type { Metadata } from "next";
import { Inter, Kanit } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
const kanit = Kanit({ subsets: ["latin"], weight: ["300", "400"] });


export const metadata: Metadata = {
  title: "COLONOSCOPY TUH",
  // description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`bg-[#705396] ${inter.className} ${kanit.className}`}>{children}</body>
    </html>
  );
}
