"use client"

import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { useDebouncedCallback } from "use-debounce"
import { Input } from "../ui/input"

type Props = {
  placeholder?: string
}

export default function SearchFilter({ placeholder = "" }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // This function will only execute after the user stops typing for 300ms
  const debouncedSearch = useDebouncedCallback((query: string) => {
    const params = new URLSearchParams(searchParams.toString())

    if (query) {
      params.set("search", query.trim())
    } else {
      params.delete("search")
    }

    router.push(`${pathname}?${params.toString()}`)
  }, 300)

  return (
    <Input
      placeholder={placeholder}
      defaultValue={searchParams.get("search")?.toString()}
      onChange={(e) => debouncedSearch(e.target.value)}
      className="bg-background"
    />
  )
}
