"use server"

import {
  fetchEnrollments,
  type EnrollmentQueryParams,
} from "@/lib/api/enrollments"

export async function getEnrollmentsAction(params: EnrollmentQueryParams) {
  try {
    const data = await fetchEnrollments(params)
    return data
  } catch (e) {
    console.error("Failed to fetch enrollments action:", e)
    throw new Error("Failed to fetch enrollments")
  }
}
