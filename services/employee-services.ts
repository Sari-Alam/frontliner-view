import { Employee, EmployeePosition } from "@/lib/data-schema"
import z from "zod"

const fakeEmployeePositions: EmployeePosition[] = [
  { id: "1", name: "President Director" },
  { id: "2", name: "Vice President Director" },
  { id: "3", name: "General Manager" },
  { id: "4", name: "Manager" },
  { id: "5", name: "Assistant Manager" },
  { id: "6", name: "Supervisor" },
  { id: "7", name: "Staff" },
  { id: "8", name: "Contract" },
  { id: "9", name: "Internship" },
  { id: "10", name: "Outsourcing" },
]

export async function fetchEmployeePositions() {
  try {
    // BFF Implementation: Call Golang API if configured
    if (process.env.INTERNAL_GO_API) {
      const res = await fetch(
        `${process.env.INTERNAL_GO_API}/v1/employee-positions`,
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
      const enrollment = fakeEmployeePositions
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

const fakeDepartments = [
  { id: "dept-01", name: "Executive Leadership" },
  { id: "dept-02", name: "Peacekeeping Operations" },
  { id: "dept-03", name: "District Administration" },
  { id: "dept-04", name: "Gamemaking & Logistics" },
]

const fakeEmployees: Employee[] = [
  {
    id: "550e8400-e29b-41d4-a716-446655440000",
    name: "Coriolanus Snow",
    nip: "10000001",
    has_face: true,
    departement: fakeDepartments[0],
    position: { id: "1", name: "President Director" },
  },
  {
    id: "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
    name: "Plutarch Heavensbee",
    nip: "10000002",
    has_face: true,
    departement: fakeDepartments[3],
    position: { id: "3", name: "General Manager" },
  },
  {
    id: "e4eaaaf2-d142-11e1-b3e4-080027620cdd",
    name: "Haymitch Abernathy",
    nip: "12010001",
    has_face: true,
    departement: fakeDepartments[2],
    position: { id: "4", name: "Manager" },
  },
  {
    id: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    name: "Katniss Everdeen",
    nip: "12010002",
    has_face: true,
    departement: fakeDepartments[2],
    position: { id: "7", name: "Staff" },
  },
  {
    id: "25870093-6b58-466d-8153-61a7a03648f4",
    name: "Peeta Mellark",
    nip: "12010003",
    has_face: true,
    departement: fakeDepartments[2],
    position: { id: "7", name: "Staff" },
  },
  {
    id: "1c6a8581-26c3-4903-b097-400a4b7f9401",
    name: "Effie Trinket",
    nip: "10000005",
    has_face: true,
    departement: fakeDepartments[3],
    position: { id: "6", name: "Supervisor" },
  },
  {
    id: "7d446920-56d1-4770-9856-11f8e12d4d9c",
    name: "Finnick Odair",
    nip: "12040001",
    has_face: true,
    departement: fakeDepartments[2],
    position: { id: "7", name: "Staff" },
  },
  {
    id: "a4388631-567c-403d-82c5-3a863499b19e",
    name: "Cinna",
    nip: "10000006",
    has_face: true,
    departement: fakeDepartments[4] || fakeDepartments[3],
    position: { id: "8", name: "Contract" },
  },
  {
    id: "8828989e-4a6c-486a-8480-1639d675685a",
    name: "Beetee Latier",
    nip: "12030001",
    has_face: true,
    departement: fakeDepartments[3],
    position: { id: "5", name: "Assistant Manager" },
  },
  {
    id: "d3b32f51-2c0c-4447-9753-48b6c8632669",
    name: "Johanna Mason",
    nip: "12070001",
    has_face: true,
    departement: fakeDepartments[2],
    position: { id: "7", name: "Staff" },
  },
  {
    id: "46f3d17a-8d1a-4d40-a17f-05988e404b4d",
    name: "Gale Hawthorne",
    nip: "12010004",
    has_face: false,
    departement: fakeDepartments[1],
    position: { id: "7", name: "Staff" },
  },
  {
    id: "b9e97c11-9e20-4e31-863a-234b6b19a710",
    name: "Seneca Crane",
    nip: "10000007",
    has_face: true,
    departement: fakeDepartments[3],
    position: { id: "4", name: "Manager" },
  },
  {
    id: "f2c6e611-370c-4b6d-83b6-3a79d0342981",
    name: "Primrose Everdeen",
    nip: "12010005",
    has_face: false,
    departement: fakeDepartments[2],
    position: { id: "9", name: "Internship" },
  },
  {
    id: "c568f230-071a-4286-905e-8519e96f13b6",
    name: "Cato Hadley",
    nip: "12020001",
    has_face: true,
    departement: fakeDepartments[1],
    position: { id: "6", name: "Supervisor" },
  },
  {
    id: "983d8a7c-487b-4d4e-b56a-1e967a5789f2",
    name: "Clove Kentwell",
    nip: "12020002",
    has_face: true,
    departement: fakeDepartments[1],
    position: { id: "7", name: "Staff" },
  },
  {
    id: "6e2646d5-e354-4632-959c-70e676571520",
    name: "Wiress",
    nip: "12030002",
    has_face: true,
    departement: fakeDepartments[3],
    position: { id: "8", name: "Contract" },
  },
  {
    id: "3f3c4d51-e94a-4e6a-93a8-444a9e5b12a3",
    name: "Thresh",
    nip: "12110001",
    has_face: true,
    departement: fakeDepartments[2],
    position: { id: "10", name: "Outsourcing" },
  },
  {
    id: "1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p",
    name: "Rue",
    nip: "12110002",
    has_face: false,
    departement: fakeDepartments[2],
    position: { id: "9", name: "Internship" },
  },
  {
    id: "a1b2c3d4-e5f6-47a8-b9c0-d1e2f3a4b5c6",
    name: "Annie Cresta",
    nip: "12040002",
    has_face: false,
    departement: fakeDepartments[2],
    position: { id: "7", name: "Staff" },
  },
  {
    id: "e9f8d7c6-b5a4-3210-fedc-ba9876543210",
    name: "Mags Flanagan",
    nip: "12040003",
    has_face: false,
    departement: fakeDepartments[2],
    position: { id: "8", name: "Contract" },
  },
]

export const GETRequestSchema = z.object({
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
  job_positions: z.string().optional().default("all"),
})

export type GETRequestParams = z.infer<typeof GETRequestSchema>

export async function fetchEmployees(params: GETRequestParams) {
  const {
    page,
    limit,
    search,
    sort,
    sortDirection,
    enrollment_status,
    job_positions,
  } = GETRequestSchema.parse(params)

  const query = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    search,
    sort,
    sortDirection,
    enrollment_status,
    job_positions,
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
        data: fakeEmployees,
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

export async function fetchEmployeeByNIP(nip: string) {
  try {
    // BFF Implementation: Call Golang API if configured
    if (process.env.INTERNAL_GO_API) {
      const res = await fetch(
        `${process.env.INTERNAL_GO_API}/v1/users?nip=${nip}`,
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
      resolve({
        data: fakeEmployees.find((employee) => employee.nip === nip),
      })
    }, 300)
  })

  return await mockApi
}
