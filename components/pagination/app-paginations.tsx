"use client"

import { useRouter, usePathname, useSearchParams } from "next/navigation"

import { Field, FieldLabel } from "@/components/ui/field"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { Button } from "../ui/button"

export default function AppPagination() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const currentPage = searchParams.get("page") || "1"
  const limit = searchParams.get("limit") || "25"

  const handlePageChange = (page: number) => {
    const newPageNumber = Number(currentPage) + page

    const params = new URLSearchParams(searchParams.toString())
    params.set("page", newPageNumber.toString())
    router.push(`${pathname}?${params.toString()}`)
  }

  const handleRowsPerPageChange = (rowsPerPage: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("limit", rowsPerPage.toString())
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="flex items-center justify-end gap-20">
      <Field orientation="horizontal" className="w-fit">
        <FieldLabel htmlFor="select-rows-per-page">Item per halaman</FieldLabel>
        <Select
          defaultValue={limit}
          onValueChange={(value) => handleRowsPerPageChange(Number(value))}
        >
          <SelectTrigger
            className="w-20 cursor-pointer rounded-lg border border-border bg-card"
            id="select-rows-per-page"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent align="start">
            <SelectGroup>
              <SelectItem value="10" className="cursor-pointer">
                10
              </SelectItem>
              <SelectItem value="25" className="cursor-pointer">
                25
              </SelectItem>
              <SelectItem value="50" className="cursor-pointer">
                50
              </SelectItem>
              <SelectItem value="100" className="cursor-pointer">
                100
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </Field>

      <Pagination className="mx-0 w-auto">
        <PaginationContent>
          <PaginationItem
            className={cn(
              "cursor-pointer rounded-lg border border-border bg-card",
              Number(currentPage) === 1 ? "pointer-events-none opacity-50" : ""
            )}
          >
            <PaginationPrevious onClick={() => handlePageChange(-1)} />
          </PaginationItem>

          <PaginationItem className="text-sm">
            <PaginationLink isActive>{Number(currentPage)}</PaginationLink>
          </PaginationItem>

          <PaginationItem className="cursor-pointer rounded-lg border border-border bg-card">
            <PaginationNext onClick={() => handlePageChange(1)} />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}
