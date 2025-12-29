import { Inter } from "next/font/google";
import "./globals.css";
import Head from "next/head";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Smoke Aware",
  description: "Created by Alex Xu",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" translate="no">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
