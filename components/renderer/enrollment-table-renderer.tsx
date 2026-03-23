"use client"

import { useSuspenseQuery } from "@tanstack/react-query"
import { useSearchParams } from "next/navigation"

import { getEnrollmentsAction } from "@/actions/enrollment-actions"
import { EnrollmentQuerySchema } from "@/lib/api/enrollments"
import { EnrollmentTable } from "../tables/enrollment/enrollment-table"
import { enrollmentTableColumns } from "../tables/enrollment/enrollment-table-columns"

export default function EnrollmentTableRenderer() {
  const searchParams = useSearchParams()

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
