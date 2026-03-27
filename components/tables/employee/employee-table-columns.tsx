import { cn } from "@/lib/utils"
import { Employee } from "@/lib/data-schema"
import { ColumnDef } from "@tanstack/react-table"
import { useEmployeeTableStore } from "@/stores/use-employee-table-store"
import { useShallow } from "zustand/shallow"

import TableHeaderQuickAction from "@/components/tables/table-header-quick-action"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

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
      const isVisible = visibleColumns.includes("name")

      const { name, nip, departement, position, has_face } = row.original

      return (
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                "cursor-pointer bg-transparent! text-sm font-normal! hover:bg-transparent!",
                isVisible ? "flex" : "hidden"
              )}
            >
              {row.getValue("name")}
            </Button>
          </DialogTrigger>

          <DialogContent showCloseButton={false}>
            <DialogHeader>
              <DialogTitle>Detail Karyawan</DialogTitle>
              <DialogDescription>Informasi lengkap karyawan</DialogDescription>
            </DialogHeader>

            <div className="relative max-h-[30em]">
              <ScrollArea className="h-full">
                <div className="flex flex-col gap-1.5 py-4">
                  <p className="text-sm font-medium">{name}</p>

                  <div className="flex items-center gap-2 text-xs opacity-75">
                    <span>{position.name}</span>
                    <span>•</span>
                    <span>NIP {nip}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="flex flex-col gap-1.5">
                    <span className="text-xs opacity-75">Departemen</span>
                    <p className="overflow-hidden text-sm font-medium text-ellipsis">
                      {departement.name}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <span className="text-xs opacity-75">Posisi</span>
                    <p className="overflow-hidden text-sm font-medium text-ellipsis">
                      {position.name}
                    </p>
                  </div>
                </div>
              </ScrollArea>
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" className="w-full">
                  Tutup
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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
