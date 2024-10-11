import { Kanit } from "next/font/google";
import "../globals.css";

const kanit = Kanit({ subsets: ["latin"], weight: ["300", "400"] });

export default function MobileLayout({
  children, 
}: {
  children: React.ReactNode
}) {

  return (
    <section className={`bg-white`}>
      {children}
    </section>
  )
}