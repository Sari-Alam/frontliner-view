"use client"

import { useState, useEffect } from "react"
import { usePathname, useSearchParams, useRouter } from "next/navigation"
import { ChevronDownIcon } from "lucide-react"
import { cn } from "@/lib/utils"

import { Button } from "../ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"

type Props = {
  buttonLabel: string
  checkBoxLabel: string
  initialState: Record<string, boolean>
  checkBoxItems: { label: string; value: string }[]
}

export default function MultiSelectFilter({
  buttonLabel,
  checkBoxLabel,
  initialState,
  checkBoxItems,
}: Props) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()

  const [isOpen, setIsOpen] = useState(false)
  const [values, setValues] = useState<Record<string, boolean>>(initialState)

  useEffect(() => {
    const newValues = { ...initialState }
    checkBoxItems.forEach((item) => {
      const param = searchParams.get(item.value)
      if (param !== null) {
        newValues[item.value] = param === "true"
      }
    })
    setValues(newValues)
  }, [searchParams, checkBoxItems, initialState])

  const handleCheckedChange = (value: string) => {
    const nextCheckedStatus = !values[value]
    const newValues = {
      ...values,
      [value]: nextCheckedStatus,
    }

    setValues(newValues)

    const params = new URLSearchParams(searchParams.toString())

    Object.entries(newValues).forEach(([key, val]) => {
      params.set(key, val.toString())
    })

    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="cursor-pointer gap-2 bg-card!">
          {buttonLabel}
          <ChevronDownIcon
            className={cn(
              "h-4 w-4 transition-transform duration-200",
              isOpen ? "rotate-180" : "rotate-0"
            )}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuLabel>{checkBoxLabel}</DropdownMenuLabel>
          {checkBoxItems.map((item) => (
            <DropdownMenuCheckboxItem
              key={item.value}
              checked={values[item.value] || false}
              onCheckedChange={() => handleCheckedChange(item.value)}
            >
              {item.label}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
