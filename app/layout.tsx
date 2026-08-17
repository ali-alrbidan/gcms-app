import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { LocaleProvider } from "@/lib/locale-context";
import { ThemeProvider } from "@/lib/theme-context";

export const metadata: Metadata = {
  title: "GCMS — Government Complaints Management System",
  description:
    "Employee and admin console for the Government Complaints Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className="h-full antialiased" suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: "(function(){try{var t=localStorage.getItem('balagh-theme');if(t!=='light'&&t!=='dark')t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';document.documentElement.dataset.theme=t;document.documentElement.style.colorScheme=t}catch(e){}})()" }} /></head>
      <body className="min-h-full flex flex-col bg-paper text-ink font-sans">
        <LocaleProvider>
          <ThemeProvider><AuthProvider>{children}</AuthProvider></ThemeProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
