import z from "zod"

export const LoginRequestSchema = z.object({
  nip: z.string().min(1, "NIP tidak boleh kosong"),
  password: z.string().min(1, "Password tidak boleh kosong"),
})

export type LoginRequestParams = z.infer<typeof LoginRequestSchema>

export interface LoginResponse {
  access_token: string
}

/**
 * Performs authentication against the Internal Go API.
 * Throws an error if the request fails or if the API is misconfigured.
 */
export async function login(
  params: LoginRequestParams
): Promise<LoginResponse> {
  const validated = LoginRequestSchema.parse(params)
  const url = "/api/proxy/auth/login"

  // if (!process.env.NEXT_PUBLIC_INTERNAL_GO_API) {
  //   throw new Error(
  //     "Configuration Error: INTERNAL_GO_API environment variable is not set."
  //   )
  // }

  const response = await fetch(`${url}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // Authorization: `Bearer ${process.env.NEXT_PUBLIC_GO_API_KEY}`,
    },
    body: JSON.stringify(validated),
    cache: "no-store",
  })

  if (!response.ok) {
    // Attempt to parse error message from server, fallback to status text
    const errorBody = await response.json().catch(() => ({}))
    throw new Error(
      errorBody.message || `Login failed with status: ${response.status}`
    )
  }

  return response.json()
}
