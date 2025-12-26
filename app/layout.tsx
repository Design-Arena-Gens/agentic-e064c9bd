import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Agentic Forex & Media Studio",
  description:
    "Autonomous agent for forex intelligence, AI player generation, and cinematic video synthesis."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen bg-background text-slate-100">
          <main className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-10 sm:px-10">{children}</main>
        </div>
      </body>
    </html>
  );
}
