import { ScrollArea } from "@/components/ui/scroll-area"
import MultiSelectFilter from "@/components/filter/multi-select-filter"
import AppPagination from "@/components/pagination/app-paginations"
import EnrollmentListRenderer from "@/components/renderer/enrollment-table-renderer"
import SearchFilter from "@/components/filter/search-filter"
import EnrollmentTableColumnsVisibility from "@/components/tables/enrollment/enrollment-table-cols-visibility"

export default async function EnrollmentPage() {
  return (
    <section className="relative flex flex-1 flex-col gap-2">
      <div className="absolute top-0 left-0 z-20 flex w-full shrink-0 items-center justify-between bg-linear-to-b from-slate-200 via-slate-200/90 to-transparent pb-2 dark:from-background dark:via-background/90">
        <MultiSelectFilter
          buttonLabel="Semua status enrollment"
          checkBoxLabel="Status Enrollment"
          initialState={{ enrolled: true, not_enrolled: true }}
          checkBoxItems={[
            { label: "Terdaftar", value: "enrolled" },
            { label: "Tidak terdaftar", value: "not_enrolled" },
          ]}
        />

        <div className="flex items-center gap-2">
          <SearchFilter placeholder="Cari karyawan" />
          <EnrollmentTableColumnsVisibility />
        </div>
      </div>

      <div className="h-full">
        <ScrollArea className="h-[calc(100dvh-50px-24px)] min-h-0">
          <div className="py-10 pb-13">
            <EnrollmentListRenderer />
          </div>
        </ScrollArea>
      </div>

      <div className="absolute bottom-0 left-0 z-20 w-full shrink-0 bg-linear-to-t from-slate-200 via-slate-200/90 to-transparent pt-2 dark:from-background dark:via-background/90">
        <AppPagination />
      </div>
    </section>
  )
}
