"use client"

import { ReactNode } from "react"
import { QueryClientProvider } from "@tanstack/react-query"

import { getQueryClient } from "@/lib/get-query-clients"

export default function QueryClientRootLayout({
  children,
}: {
  children: ReactNode
}) {
  // NOTE: Avoid useState for the queryClient to prevent
  // multiple instances during reconciliation
  const queryClient = getQueryClient()

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}
