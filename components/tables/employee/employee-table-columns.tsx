import { cn } from "@/lib/utils"
import { Employee } from "@/lib/data-schema"
import { ColumnDef } from "@tanstack/react-table"
import { useEmployeeTableStore } from "@/stores/use-employee-table-store"
import { useShallow } from "zustand/shallow"

import TableHeaderQuickAction from "@/components/tables/table-header-quick-action"

export const employeeTableColumns: ColumnDef<Employee>[] = [
  {
    accessorKey: "name",
    header: () => {
      const { visibleColumns, toggleColumn } = useEmployeeTableStore(
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
      const visibleColumns = useEmployeeTableStore((s) => s.visibleColumns)
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
      const { visibleColumns, toggleColumn } = useEmployeeTableStore(
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
      const visibleColumns = useEmployeeTableStore((s) => s.visibleColumns)
      const isVisibles = visibleColumns.includes("nip")

      return (
        <div className={cn("px-3", !isVisibles && "hidden")}>
          {row.getValue("nip")}
        </div>
      )
    },
  },
  {
    accessorKey: "departement",
    header: () => {
      const { visibleColumns, toggleColumn } = useEmployeeTableStore(
        useShallow((s) => ({
          visibleColumns: s.visibleColumns,
          toggleColumn: s.toggleColumn,
        }))
      )
      const isVisibles = visibleColumns.includes("departement")

      return (
        <TableHeaderQuickAction
          isVisible={isVisibles}
          columnName="departement"
          buttonLabel="Departemen"
          toggleColumn={toggleColumn}
        />
      )
    },
    cell: ({ row }) => {
      const visibleColumns = useEmployeeTableStore((s) => s.visibleColumns)
      const isVisibles = visibleColumns.includes("departement")
      const employeeDepartement = row.original.departement

      return (
        <div className={cn("px-3", !isVisibles && "hidden")}>
          {employeeDepartement.name}
        </div>
      )
    },
  },
  {
    accessorKey: "position",
    header: () => {
      const { visibleColumns, toggleColumn } = useEmployeeTableStore(
        useShallow((s) => ({
          visibleColumns: s.visibleColumns,
          toggleColumn: s.toggleColumn,
        }))
      )
      const isVisibles = visibleColumns.includes("position")

      return (
        <TableHeaderQuickAction
          isVisible={isVisibles}
          columnName="position"
          buttonLabel="Jabatan"
          toggleColumn={toggleColumn}
        />
      )
    },
    cell: ({ row }) => {
      const visibleColumns = useEmployeeTableStore((s) => s.visibleColumns)
      const isVisibles = visibleColumns.includes("position")
      const employeePosition = row.original.position

      return (
        <div className={cn("px-3", !isVisibles && "hidden")}>
          {employeePosition.name}
        </div>
      )
    },
  },
  {
    accessorKey: "has_face",
    header: () => {
      const { visibleColumns, toggleColumn } = useEmployeeTableStore(
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
      const visibleColumns = useEmployeeTableStore((s) => s.visibleColumns)
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
]
