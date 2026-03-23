import { Suspense } from "react"
import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import { getQueryClient } from "@/lib/get-query-clients"
import {
  fetchEnrollments,
  EnrollmentQuerySchema,
  type EnrollmentQueryParams,
} from "@/lib/api/enrollments"

import { ScrollArea } from "@/components/ui/scroll-area"
import { EnrollmentTableSkeleton } from "@/components/tables/enrollment-table"
import MultiSelectFilter from "@/components/filter/multi-select-filter"
import AppPagination from "@/components/pagination/app-paginations"
import EnrollmentListRenderer from "@/components/renderer/enrollment-table-renderer"
import SearchFilter from "@/components/filter/search-filter"

async function EnrollmentListServer({
  params,
}: {
  params: EnrollmentQueryParams
}) {
  const queryClient = getQueryClient()

  await queryClient.prefetchQuery({
    queryKey: ["enrollments", params],
    queryFn: () => fetchEnrollments(params),
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="py-10 pb-13">
        <EnrollmentListRenderer />
      </div>
    </HydrationBoundary>
  )
}

export default async function EnrollmentPage({
  searchParams,
}: {
  searchParams: {
    page?: string
    limit: string
    search: string
    sort: string
    has_face: string
  }
}) {
  const rawParams = await searchParams
  const params = EnrollmentQuerySchema.parse(rawParams)

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

        <div>
          <SearchFilter placeholder="Cari karyawan" />
        </div>
      </div>

      <div className="h-full">
        <ScrollArea className="h-[calc(100dvh-54px-24px)] min-h-0">
          <Suspense
            key={JSON.stringify(params)}
            fallback={<EnrollmentTableSkeleton />}
          >
            <EnrollmentListServer params={params} />
          </Suspense>
        </ScrollArea>
      </div>

      <div className="absolute bottom-0 left-0 z-20 w-full shrink-0 bg-linear-to-t from-slate-200 via-slate-200/90 to-transparent pt-2 dark:from-background dark:via-background/90">
        <AppPagination />
      </div>
    </section>
  )
}
