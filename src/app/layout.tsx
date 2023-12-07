import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { AiOutlineDollar, AiOutlineUser } from "react-icons/ai";
import Logo from "public/logo.svg";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex min-h-screen">
          <div className="w-34 bg-emerald-900 text-white">
            <div>
              <Logo className="w-20 h-20" />
            </div>
            <ul>
              <li>
                <Link
                  href={"/budget"}
                  className="p-2 inline-block hover:bg-emerald-800"
                >
                  <AiOutlineDollar className="text-3xl mx-auto" />
                </Link>
              </li>
              <li>
                <Link
                  href={"/account"}
                  className="p-2 inline-block hover:bg-emerald-800"
                >
                  <AiOutlineUser className="text-3xl mx-auto" />
                </Link>
              </li>
            </ul>
          </div>
          <div className="flex-1 p-4">{children}</div>
        </div>
      </body>
    </html>
  );
}
