import z from "zod"

const EnrollmentSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  nip: z.string(),
  has_face: z.boolean(),
})

export type Enrollment = z.infer<typeof EnrollmentSchema>
