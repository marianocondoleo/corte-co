import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Corte & Co.",
  description: "Carne premium. Puerta a puerta.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider 
      signInUrl="/sign-in" 
      signUpUrl="/sign-up"
      signOutRedirectUrl="/sign-in"
      fallbackRedirectUrl="/"
    >
      <html lang="es">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}