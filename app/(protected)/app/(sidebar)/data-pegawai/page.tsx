import { fetchEmployeePositions } from "@/services/employee-services"
import { EmployeePosition } from "@/lib/data-schema"

import { ScrollArea } from "@/components/ui/scroll-area"
import MultiSelectFilter from "@/components/filter/multi-select-filter"
import AppPagination from "@/components/pagination/app-paginations"
import SearchFilter from "@/components/filter/search-filter"
import EmployeeTableColumnsVisibility from "@/components/tables/employee/employee-table-cols-visibility"
import EmployeeTableRenderer from "@/components/renderer/employee-table-renderer"

export default async function DataPegawaiPage() {
  const employeePositions = await fetchEmployeePositions()

  const employeePosCheckboxItems = employeePositions.map(
    (position: EmployeePosition) => ({
      label: position.name,
      value: position.id,
    })
  )

  const initialEmployeePosCheckboxItems = employeePositions.map(
    (position: EmployeePosition) => position.id
  )

  return (
    <section className="relative flex flex-1 flex-col gap-2">
      <div className="absolute top-0 left-0 z-20 flex w-full shrink-0 items-center justify-between bg-linear-to-b from-slate-200 via-slate-200/90 to-transparent pb-2 dark:from-background dark:via-background/90">
        <div className="flex gap-2">
          <MultiSelectFilter
            buttonLabel="Semua jabatan"
            checkBoxLabel="Jabatan"
            initialState={initialEmployeePosCheckboxItems}
            checkBoxItems={employeePosCheckboxItems}
            searchParamsKey="job_positions"
          />
          <MultiSelectFilter
            buttonLabel="Semua status enrollment"
            checkBoxLabel="Status Enrollment"
            initialState={["1", "0"]}
            checkBoxItems={[
              { label: "Terdaftar", value: "1" },
              { label: "Tidak terdaftar", value: "0" },
            ]}
            searchParamsKey="enrollment_status"
          />
        </div>

        <div className="flex items-center gap-2">
          <SearchFilter placeholder="Cari karyawan" />
          <EmployeeTableColumnsVisibility />
        </div>
      </div>

      <div className="h-full">
        <ScrollArea className="h-[calc(100dvh-50px-24px)] min-h-0">
          <div className="py-10 pb-13">
            <EmployeeTableRenderer />
          </div>
        </ScrollArea>
      </div>

      <div className="absolute bottom-0 left-0 z-20 w-full shrink-0 bg-linear-to-t from-slate-200 via-slate-200/90 to-transparent pt-2 dark:from-background dark:via-background/90">
        <AppPagination />
      </div>
    </section>
  )
}
