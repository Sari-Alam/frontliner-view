import MultiSelectFilter from "@/components/filter/multi-select-filter"
import AppPagination from "@/components/pagination/app-paginations"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function EnrollmentPage() {
  return (
    <section className="grid flex-1 grid-rows-[auto_1fr_auto] gap-2">
      <div className="flex shrink-0">
        <MultiSelectFilter
          buttonLabel="Semua status enrollment"
          checkBoxLabel="Status Enrollment"
          initialState={{ enrolled: true, not_enrolled: true }}
          checkBoxItems={[
            { label: "Terdaftar", value: "enrolled" },
            { label: "Tidak terdaftar", value: "not_enrolled" },
          ]}
        />
      </div>

      <div className="h-full">
        <ScrollArea className="h-[calc(100vh-54px-32px-34px-40px)] min-h-0 rounded-xl border border-border bg-card"></ScrollArea>
      </div>

      <div className="shrink-0">
        <AppPagination />
      </div>
    </section>
  )
}
