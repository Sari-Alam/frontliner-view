import { cn } from "@/lib/utils"
import { Enrollment } from "@/lib/data-schema"
import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontalIcon } from "lucide-react"
import { useEnrollmentTableStore } from "@/stores/enrollment-table-store"
import { useShallow } from "zustand/shallow"

import { Button } from "@/components/ui/button"
import TableHeaderQuickAction from "@/components/tables/table-header-quick-action"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"

export const enrollmentTableColumns: ColumnDef<Enrollment>[] = [
  {
    accessorKey: "name",
    header: () => {
      const { visibleColumns, toggleColumn } = useEnrollmentTableStore(
        useShallow((s) => ({
          visibleColumns: s.visibleColumns,
          toggleColumn: s.toggleColumn,
        }))
      )
      const isVisibles = visibleColumns.includes("name")

      return (
        <TableHeaderQuickAction
          isVisible={isVisibles}
          columnName="name"
          buttonLabel="Nama"
          toggleColumn={toggleColumn}
        />
      )
    },
    cell: ({ row }) => {
      const visibleColumns = useEnrollmentTableStore((s) => s.visibleColumns)
      const isVisibles = visibleColumns.includes("name")

      return (
        <div className={cn("px-3", !isVisibles && "hidden")}>
          {row.getValue("name")}
        </div>
      )
    },
  },
  {
    accessorKey: "nip",
    header: () => {
      const { visibleColumns, toggleColumn } = useEnrollmentTableStore(
        useShallow((s) => ({
          visibleColumns: s.visibleColumns,
          toggleColumn: s.toggleColumn,
        }))
      )
      const isVisibles = visibleColumns.includes("nip")

      return (
        <TableHeaderQuickAction
          isVisible={isVisibles}
          columnName="nip"
          buttonLabel="NIP"
          toggleColumn={toggleColumn}
        />
      )
    },
    cell: ({ row }) => {
      const visibleColumns = useEnrollmentTableStore((s) => s.visibleColumns)
      const isVisibles = visibleColumns.includes("nip")

      return (
        <div className={cn("px-3", !isVisibles && "hidden")}>
          {row.getValue("nip")}
        </div>
      )
    },
  },
  {
    accessorKey: "has_face",
    header: () => {
      const { visibleColumns, toggleColumn } = useEnrollmentTableStore(
        useShallow((s) => ({
          visibleColumns: s.visibleColumns,
          toggleColumn: s.toggleColumn,
        }))
      )
      const isVisibles = visibleColumns.includes("has_face")

      return (
        <TableHeaderQuickAction
          isVisible={isVisibles}
          columnName="has_face"
          buttonLabel="Pendaftaran wajah"
          toggleColumn={toggleColumn}
        />
      )
    },
    cell: ({ row }) => {
      const visibleColumns = useEnrollmentTableStore((s) => s.visibleColumns)
      const isVisibles = visibleColumns.includes("has_face")

      const isEnrolled = row.getValue("has_face")

      const badgeColor = {
        not_enrolled:
          "border-amber-400 bg-amber-300 text-amber-900 dark:bg-amber-200 dark:border-amber-300",
        enrolled:
          "border-teal-400 bg-teal-300 text-teal-900 dark:bg-teal-200 dark:border-teal-300",
      }

      return (
        <div
          className={cn(
            "ml-3 w-max rounded-full border px-2 py-0.5 text-xs",
            isEnrolled ? badgeColor.enrolled : badgeColor.not_enrolled,
            !isVisibles && "hidden"
          )}
        >
          {isEnrolled ? "Terdaftar" : "Tidak terdaftar"}
        </div>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const isEnrolled = row.original.has_face

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon-xs">
              <MoreHorizontalIcon className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuGroup>
              {isEnrolled ? (
                <DropdownMenuItem>
                  <Link href={`/app/enrollment/update/${row.original.id}`}>
                    Update wajah
                  </Link>
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem>
                  <Link href={`/app/enrollment/baru/${row.original.id}`}>
                    Daftarkan wajah
                  </Link>
                </DropdownMenuItem>
              )}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
