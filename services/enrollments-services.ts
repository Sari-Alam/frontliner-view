import { Employee } from "@/lib/data-schema"
import { z } from "zod"

const fakeDepartments = [
  { id: "dept-01", name: "Executive Leadership" },
  { id: "dept-02", name: "Peacekeeping Operations" },
  { id: "dept-03", name: "District Administration" },
  { id: "dept-04", name: "Gamemaking & Logistics" },
]

let fakeEnrollmentData: Employee[] = [
  {
    id: "550e8400-e29b-41d4-a716-446655440000",
    name: "Coriolanus Snow",
    nip: "10000001",
    has_face: true,
    departement: fakeDepartments[0],
    position: { id: "1", name: "President Director" },
    face_data: {
      id: "1",
      face_descriptor: {
        front: "",
        left: "",
        right: "",
        up: "",
        down: "",
      },
    },
  },
]

export const EnrollmentQuerySchema = z.object({
  page: z.preprocess(
    (val) => (val === "" || val === undefined ? 1 : Number(val)),
    z.number().min(1).default(1)
  ),
  limit: z.preprocess(
    (val) => (val === "" || val === undefined ? 25 : Number(val)),
    z.number().min(1).default(25)
  ),
  search: z.string().optional().default(""),
  sort: z.string().optional().default("created_at"),
  sortDirection: z.string().optional().default("desc"),
  enrollment_status: z.string().optional().default("all"),
})

export type EnrollmentQueryParams = z.infer<typeof EnrollmentQuerySchema>

export async function fetchEnrollments(params: EnrollmentQueryParams) {
  const { page, limit, search, sort, sortDirection, enrollment_status } =
    EnrollmentQuerySchema.parse(params)

  const query = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    search,
    sort,
    sortDirection,
    enrollment_status: enrollment_status?.toString() || "all",
  })

  try {
    // BFF Implementation: Call Golang API if configured
    if (process.env.INTERNAL_GO_API) {
      const res = await fetch(
        `${process.env.INTERNAL_GO_API}/v1/users?${query}`,
        {
          headers: { Authorization: `Bearer ${process.env.GO_API_KEY}` },
          cache: "no-store", // Ensure it doesn't return stale caches if changing queries
        }
      )

      if (!res.ok) throw new Error(`Golang API unreachable: ${res.statusText}`)
      return await res.json()
    }
  } catch (error) {
    console.warn(
      "BFF Error: Failed to fetch from Golang API, falling back to mock",
      error
    )
  }

  // Fallback for development since "it hasn't online yet"
  const mockApi = new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: fakeEnrollmentData,
        pagination: {
          page,
          limit,
          total: 100,
        },
      })
    }, 300) // Slight delay to visually demonstrate suspense Skeleton instantly
  })

  return await mockApi
}

export async function fetchEnrollment(nip: string) {
  try {
    // BFF Implementation: Call Golang API if configured
    if (process.env.INTERNAL_GO_API) {
      const res = await fetch(
        `${process.env.INTERNAL_GO_API}/v1/users/${nip}`,
        {
          headers: { Authorization: `Bearer ${process.env.GO_API_KEY}` },
          cache: "no-store",
        }
      )

      if (!res.ok) throw new Error(`Golang API unreachable: ${res.statusText}`)
      return await res.json()
    }
  } catch (error) {
    console.warn(
      "BFF Error: Failed to fetch from Golang API, falling back to mock",
      error
    )
  }

  // Fallback for development since "it hasn't online yet"
  const mockApi = new Promise((resolve) => {
    setTimeout(() => {
      const enrollment = fakeEnrollmentData.find((e) => e.nip === nip)
      resolve(enrollment || null)
    }, 1000)
  })

  return (await mockApi) as {
    id: string
    name: string
    nip: string
    has_face: boolean
  } | null
}

export async function setEmployeeFace(
  nip: string,
  faceDescriptor: {
    left: string
    front: string
    right: string
    up: string
    down: string
  }
) {
  console.log("faceDescriptorServer", faceDescriptor)

  try {
    // BFF Implementation: Call Golang API if configured
    if (process.env.INTERNAL_GO_API) {
      const res = await fetch(
        `${process.env.INTERNAL_GO_API}/v1/users/${nip}/face`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${process.env.GO_API_KEY}` },
          body: JSON.stringify({ face_descriptor: faceDescriptor }),
        }
      )

      if (!res.ok) throw new Error(`Golang API unreachable: ${res.statusText}`)
      return await res.json()
    }
  } catch (error) {
    console.warn(
      "BFF Error: Failed to fetch from Golang API, falling back to mock",
      error
    )
  }

  const response = fakeEnrollmentData.map((employee) => ({
    ...employee,
    face_data: { id: "1", face_descriptor: faceDescriptor },
  }))

  console.log("service", response[0])

  return response[0]
}
