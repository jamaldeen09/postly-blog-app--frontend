// ** Imports ** \\
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { NextFont } from "next/dist/compiled/@next/font";
import ReduxProvider from "@/providers/ReduxProvider";
import { SonnerProvider } from "@/providers/SonnerProvider";


// ** Poppins font setup ** \\
const poppins: NextFont = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

// ** Metadata (for icons, app title, description and icons) ** \\
export const metadata: Metadata = {
  title: "Postly",
  description: "A clean and interactive blogging platform. Create posts, like, comment, and explore ideas in real-time.",
  icons: {
    icon: "/favicon.svg"
  },
};

// ** Root layout (renders the whole app) ** \\
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.className}`}
      >
        <ReduxProvider>
          <SonnerProvider>
            {children}
          </SonnerProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
