"use client"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { useDebouncedCallback } from "use-debounce"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import {
  ArrowDownIcon,
  ArrowUpDownIcon,
  ArrowUpIcon,
  EyeOffIcon,
} from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "../ui/button"

type Props = {
  isVisible: boolean
  columnName: string
  buttonLabel: string
  toggleColumn: (columnName: string) => void
}

export default function TableHeaderQuickAction({
  isVisible,
  columnName,
  buttonLabel,
  toggleColumn,
}: Props) {
  const [isOpen, setIsOpen] = useState(false)

  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const handleSort = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("sort", columnName)
    params.set("sortDirection", value)
    router.push(`${pathname}?${params.toString()}`)
  }

  const handleToggleColumn = useDebouncedCallback(() => {
    toggleColumn(columnName)
  }, 200)

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "group flex cursor-pointer items-center justify-between gap-10",
            !isVisible && "hidden"
          )}
        >
          {buttonLabel}
          <ArrowUpDownIcon className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-max" align="start">
        <DropdownMenuRadioGroup onValueChange={handleSort}>
          <DropdownMenuLabel>Urutkan</DropdownMenuLabel>
          <DropdownMenuRadioItem value="asc">
            <ArrowUpIcon className="h-4 w-4" /> Ascending
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="desc">
            <ArrowDownIcon className="h-4 w-4" /> Descending
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>

        <DropdownMenuSeparator />
        <DropdownMenuRadioItem value={columnName} onClick={handleToggleColumn}>
          <EyeOffIcon className="h-4 w-4" />
          Sembunyikan
        </DropdownMenuRadioItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
