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
      <EnrollmentListRenderer />
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
    <section className="grid flex-1 grid-rows-[auto_1fr_auto] gap-2">
      <div className="flex w-full shrink-0 items-center justify-between">
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
        <ScrollArea className="h-[calc(100vh-54px-32px-34px-40px)] min-h-0">
          <Suspense
            key={JSON.stringify(params)}
            fallback={<EnrollmentTableSkeleton />}
          >
            <EnrollmentListServer params={params} />
          </Suspense>
        </ScrollArea>
      </div>

      <div className="shrink-0">
        <AppPagination />
      </div>
    </section>
  )
}
