"use client"

import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { useDebouncedCallback } from "use-debounce"
import { Input } from "../ui/input"
import { SearchIcon } from "lucide-react"

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
    <div className="relative">
      <SearchIcon className="absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        placeholder={placeholder}
        defaultValue={searchParams.get("search")?.toString()}
        onChange={(e) => debouncedSearch(e.target.value)}
        className="bg-card! pl-9"
      />
    </div>
  )
}
