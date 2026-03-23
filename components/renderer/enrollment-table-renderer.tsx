"use client"

import { useSuspenseQuery } from "@tanstack/react-query"
import { useSearchParams } from "next/navigation"
import { useShallow } from "zustand/react/shallow"
import { getEnrollmentsAction } from "@/actions/enrollment-actions"
import { useEnrollmentTableStore } from "@/stores/enrollment-table-store"
import { EnrollmentQuerySchema } from "@/lib/api/enrollments"
import { EnrollmentTable } from "../tables/enrollment-table"
import { enrollmentTableColumns } from "../tables/columns/enrollment-table-columns"

export default function EnrollmentTableRenderer() {
  const searchParams = useSearchParams()

  const { selectedId, toggleSelection, resetSelection } =
    useEnrollmentTableStore(
      useShallow((state) => ({
        selectedId: state.selectedIds,
        toggleSelection: state.toggleSelection,
        resetSelection: state.resetSelection,
      }))
    )

  const rawParams = Object.fromEntries(searchParams.entries())
  const params = EnrollmentQuerySchema.parse(rawParams)

  const { data } = useSuspenseQuery({
    queryKey: ["enrollments", params],
    queryFn: () => getEnrollmentsAction(params),
  })

  return (
    <EnrollmentTable columns={enrollmentTableColumns} data={data.enrollments} />
  )
}
