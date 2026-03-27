import { z } from "zod"

const fakeEnrollmentData = [
  {
    id: "550e8400-e29b-41d4-a716-446655440000",
    name: "Katniss Everdeen",
    nip: "12010001",
    has_face: true,
  },
  {
    id: "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
    name: "Peeta Mellark",
    nip: "12010002",
    has_face: true,
  },
  {
    id: "e4eaaaf2-d142-11e1-b3e4-080027620cdd",
    name: "Gale Hawthorne",
    nip: "12010003",
    has_face: false,
  },
  {
    id: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    name: "Haymitch Abernathy",
    nip: "12010004",
    has_face: true,
  },
  {
    id: "25870093-6b58-466d-8153-61a7a03648f4",
    name: "Effie Trinket",
    nip: "12010005",
    has_face: true,
  },
  {
    id: "1c6a8581-26c3-4903-b097-400a4b7f9401",
    name: "Primrose Everdeen",
    nip: "12010006",
    has_face: false,
  },
  {
    id: "7d446920-56d1-4770-9856-11f8e12d4d9c",
    name: "Finnick Odair",
    nip: "12040001",
    has_face: true,
  },
  {
    id: "a4388631-567c-403d-82c5-3a863499b19e",
    name: "Johanna Mason",
    nip: "12070001",
    has_face: true,
  },
  {
    id: "8828989e-4a6c-486a-8480-1639d675685a",
    name: "Beetee Latier",
    nip: "12030001",
    has_face: true,
  },
  {
    id: "d3b32f51-2c0c-4447-9753-48b6c8632669",
    name: "Annie Cresta",
    nip: "12040002",
    has_face: false,
  },
  {
    id: "46f3d17a-8d1a-4d40-a17f-05988e404b4d",
    name: "Coriolanus Snow",
    nip: "11000001",
    has_face: true,
  },
  {
    id: "b9e97c11-9e20-4e31-863a-234b6b19a710",
    name: "Cinna",
    nip: "11000002",
    has_face: true,
  },
  {
    id: "f2c6e611-370c-4b6d-83b6-3a79d0342981",
    name: "Rue",
    nip: "12110001",
    has_face: false,
  },
  {
    id: "c568f230-071a-4286-905e-8519e96f13b6",
    name: "Thresh",
    nip: "12110002",
    has_face: true,
  },
  {
    id: "983d8a7c-487b-4d4e-b56a-1e967a5789f2",
    name: "Cato",
    nip: "12020001",
    has_face: true,
  },
  {
    id: "6e2646d5-e354-4632-959c-70e676571520",
    name: "Clove",
    nip: "12020002",
    has_face: true,
  },
  {
    id: "3f3c4d51-e94a-4e6a-93a8-444a9e5b12a3",
    name: "Plutarch Heavensbee",
    nip: "11000003",
    has_face: true,
  },
  {
    id: "1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p",
    name: "Seneca Crane",
    nip: "11000004",
    has_face: true,
  },
  {
    id: "a1b2c3d4-e5f6-47a8-b9c0-d1e2f3a4b5c6",
    name: "Mags Flanagan",
    nip: "12040003",
    has_face: false,
  },
  {
    id: "e9f8d7c6-b5a4-3210-fedc-ba9876543210",
    name: "Wiress",
    nip: "12030002",
    has_face: true,
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

export async function fetchEnrollment(id: string) {
  try {
    // BFF Implementation: Call Golang API if configured
    if (process.env.INTERNAL_GO_API) {
      const res = await fetch(`${process.env.INTERNAL_GO_API}/v1/users/${id}`, {
        headers: { Authorization: `Bearer ${process.env.GO_API_KEY}` },
        cache: "no-store",
      })

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
      const enrollment = fakeEnrollmentData.find((e) => e.id === id)
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

export async function enrollFaceData({
  id,
  front,
  left,
  right,
  up,
  down,
}: {
  id: string
  front: string
  left: string
  right: string
  up: string
  down: string
}) {
  try {
    // BFF Implementation: Call Golang API if configured
    if (process.env.INTERNAL_GO_API) {
      const res = await fetch(`${process.env.INTERNAL_GO_API}/v1/users/${id}`, {
        headers: { Authorization: `Bearer ${process.env.GO_API_KEY}` },
        cache: "no-store",
        method: "POST",
        body: JSON.stringify({ front, left, right, up, down }),
      })

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
      const enrollment = fakeEnrollmentData.map((e) =>
        e.id === id ? { ...e, has_face: true } : e
      )
      resolve(enrollment || null)
    }, 1000)
  })

  return await mockApi
}
