
import "./globals.css";
import type { Metadata } from "next";
import GlobalBackground from "@/components/GlobalBackground";
import { ChatProvider } from "@/components/ChatProvider";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import FAB from "@/components/FAB";



export const metadata: Metadata = {
  title: "Mini Apps Hub",
  description: "Daily useful Apps Here",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#009689" />
        <link rel="icon" href="/logo.svg" type="image/svg+xml" />
      </head>
      <body className="relative text-white">

        <GlobalBackground />

        <ChatProvider>
           
          <Navbar/> 
          <main className="relative font-Noto min-h-screen z-10">{children}</main>
          <Footer/>
          
            <FAB/>

        </ChatProvider>
      </body>
    </html>
  );
}
