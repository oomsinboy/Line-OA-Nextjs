import { Kanit } from "next/font/google";
import "../globals.css";

const kanit = Kanit({ subsets: ["latin"], weight: ["300", "400"] });

export default function OTPLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode
}) {
  //   <html lang="en">
  //   <body className={`bg-white ${kanit.className}`}>
  //     {children}
  //   </body>
  // </html>

  return (
    <section className={`bg-white`}>
      {children}
    </section>
  )
}