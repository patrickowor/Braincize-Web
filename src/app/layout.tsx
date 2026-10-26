import type { Metadata } from "next";
import { Montserrat, Poppins } from "next/font/google";
import { Toaster } from "sonner";
import { site } from "@/config/site";
import { AuthProvider } from "@/providers/AuthProvider";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins-src",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat-src",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: { default: site.name, template: `%s | ${site.name}` },
  description: site.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} ${montserrat.variable} min-h-screen`}>
        <AuthProvider>{children}</AuthProvider>
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
