import { Plus_Jakarta_Sans } from "next/font/google"

import "./globals.css"
import { cn } from "@/lib/utils"

import QueryClientRootLayout from "@/providers/query-clients-provider"

import { ThemeProvider } from "@/components/theme-provider"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Toaster } from "@/components/ui/sonner"

const fontSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata = {
  title: "Sari Alam - Frontliner View",
  description: "Frontliner View",
  icons: {
    icon: "/favicon.ico",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", "font-sans", fontSans.variable)}
    >
      <body>
        <QueryClientRootLayout>
          <ThemeProvider>
            <TooltipProvider>
              {children}
              <Toaster position="bottom-center" />
            </TooltipProvider>
          </ThemeProvider>
        </QueryClientRootLayout>
      </body>
    </html>
  )
}
