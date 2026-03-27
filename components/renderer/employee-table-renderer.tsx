"use client"

import { useQuery } from "@tanstack/react-query"
import { useSearchParams } from "next/navigation"

import { GETRequestSchema, fetchEmployees } from "@/services/employee-services"
import {
  EmployeeTable,
  EmployeeTableSkeleton,
} from "../tables/employee/employee-table"
import { employeeTableColumns } from "../tables/employee/employee-table-columns"

export default function EmployeeTableRenderer() {
  const searchParams = useSearchParams()

  const rawParams = Object.fromEntries(searchParams.entries())
  const params = GETRequestSchema.parse(rawParams)

  const { data, isPending, isError } = useQuery({
    queryKey: ["employees", params],
    queryFn: async () => await fetchEmployees(params),
  })

  if (isPending) return <EmployeeTableSkeleton />
  if (isError || !data) return <div>Failed to load data</div>

  return <EmployeeTable columns={employeeTableColumns} data={data.data} />
}
