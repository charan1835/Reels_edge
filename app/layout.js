// app/layout.js
import "./globals.css";
import { ClerkProvider } from '@clerk/nextjs';
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "ReelEdge",
  description: "Cinematic Video Editing Platform",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
    <html lang="en">
        <body className={`${inter.className} antialiased`}>
          {children}
        </body>
    </html>
    </ClerkProvider>
  );
}
