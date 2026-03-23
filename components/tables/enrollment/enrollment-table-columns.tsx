import { Button } from "@/components/ui/button"
import { Enrollment } from "@/lib/data-schema"
import { cn } from "@/lib/utils"
import { useEnrollmentTableStore } from "@/stores/enrollment-table-store"
import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontalIcon } from "lucide-react"

export const enrollmentTableColumns: ColumnDef<Enrollment>[] = [
  {
    accessorKey: "name",
    header: () => {
      const visibleColumns = useEnrollmentTableStore((s) => s.visibleColumns)
      const isVisibles = visibleColumns.includes("name")

      return (
        <div className={cn("text-sm font-semibold", !isVisibles && "hidden")}>
          Name
        </div>
      )
    },
    cell: ({ row }) => {
      const visibleColumns = useEnrollmentTableStore((s) => s.visibleColumns)
      const isVisibles = visibleColumns.includes("name")

      return (
        <div className={cn("", !isVisibles && "hidden")}>
          {row.getValue("name")}
        </div>
      )
    },
  },
  {
    accessorKey: "nip",
    header: () => {
      const visibleColumns = useEnrollmentTableStore((s) => s.visibleColumns)
      const isVisibles = visibleColumns.includes("nip")

      return (
        <div className={cn("text-sm font-semibold", !isVisibles && "hidden")}>
          NIP
        </div>
      )
    },
    cell: ({ row }) => {
      const visibleColumns = useEnrollmentTableStore((s) => s.visibleColumns)
      const isVisibles = visibleColumns.includes("nip")

      return (
        <div className={cn("", !isVisibles && "hidden")}>
          {row.getValue("nip")}
        </div>
      )
    },
  },
  {
    accessorKey: "has_face",
    header: () => {
      const visibleColumns = useEnrollmentTableStore((s) => s.visibleColumns)
      const isVisibles = visibleColumns.includes("has_face")

      return (
        <div className={cn("text-sm font-semibold", !isVisibles && "hidden")}>
          Pendaftaran wajah
        </div>
      )
    },
    cell: ({ row }) => {
      const visibleColumns = useEnrollmentTableStore((s) => s.visibleColumns)
      const isVisibles = visibleColumns.includes("has_face")

      const isEnrolled = row.getValue("has_face")

      const badgeColor = {
        enrolled:
          "border-yellow-400 bg-yellow-300 text-yellow-900 dark:bg-yellow-200 dark:border-yellow-300",
        not_enrolled:
          "border-teal-400 bg-teal-300 text-teal-900 dark:bg-teal-200 dark:border-teal-300",
      }

      return (
        <div
          className={cn(
            "w-max rounded-full border px-2 py-0.5 text-xs",
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
      const enrollment = row.original

      return (
        <Button variant="ghost" size="icon-xs">
          <MoreHorizontalIcon className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      )
    },
  },
]
