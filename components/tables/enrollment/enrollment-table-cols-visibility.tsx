"use client"

import { useState } from "react"
import { ChevronDownIcon, ColumnsIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { useShallow } from "zustand/shallow"

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { useEnrollmentTableStore } from "@/stores/enrollment-table-store"

export default function EnrollmentTableColumnsVisibility() {
  const { toggleColumn, visibleColumns } = useEnrollmentTableStore(
    useShallow((s) => ({
      toggleColumn: s.toggleColumn,
      visibleColumns: s.visibleColumns,
    }))
  )

  const [isOpen, setIsOpen] = useState(false)

  const columns = [
    { name: "Nama", value: "name" },
    { name: "NIP", value: "nip" },
    { name: "Pendaftaran wajah", value: "has_face" },
  ]

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="cursor-pointer gap-2 bg-card!">
          <ColumnsIcon className="h-4 w-4" />
          Atur kolom
          <ChevronDownIcon
            className={cn(
              "h-4 w-4 transition-transform duration-200",
              isOpen ? "rotate-180" : "rotate-0"
            )}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-max">
        <DropdownMenuGroup>
          {columns.map((column) => (
            <DropdownMenuCheckboxItem
              key={column.value}
              checked={visibleColumns.includes(column.value)}
              onCheckedChange={() => toggleColumn(column.value)}
              className="w-full"
            >
              {column.name}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
