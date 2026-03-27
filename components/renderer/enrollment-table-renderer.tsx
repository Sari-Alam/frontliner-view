"use client"

import { useQuery } from "@tanstack/react-query"
import { useSearchParams } from "next/navigation"

import {
  EnrollmentQuerySchema,
  fetchEnrollments,
} from "@/services/enrollments-services"
import {
  EnrollmentTable,
  EnrollmentTableSkeleton,
} from "../tables/enrollment/enrollment-table"
import { enrollmentTableColumns } from "../tables/enrollment/enrollment-table-columns"

export default function EnrollmentTableRenderer() {
  const searchParams = useSearchParams()

  const rawParams = Object.fromEntries(searchParams.entries())
  const params = EnrollmentQuerySchema.parse(rawParams)

  const { data, isPending, isError } = useQuery({
    queryKey: ["enrollments", params],
    queryFn: async () => await fetchEnrollments(params),
  })

  if (isPending) return <EnrollmentTableSkeleton />

  if (isError || !data) return <div>Failed to load data</div>

  return <EnrollmentTable columns={enrollmentTableColumns} data={data.data} />
}
