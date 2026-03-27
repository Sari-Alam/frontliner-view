import z from "zod"

const EnrollmentSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  nip: z.string(),
  has_face: z.boolean(),
})

const EmployeePositionSchema = z.object({
  id: z.string(),
  name: z.string(),
})

const EmployeeSchema = z.object({
  id: z.string(),
  name: z.string(),
  nip: z.string(),
  has_face: z.boolean(),
  departement: z.object({
    id: z.string(),
    name: z.string(),
  }),
  position: z.object({
    id: z.string(),
    name: z.string(),
  }),
})

export type Enrollment = z.infer<typeof EnrollmentSchema>
export type EmployeePosition = z.infer<typeof EmployeePositionSchema>
export type Employee = z.infer<typeof EmployeeSchema>
