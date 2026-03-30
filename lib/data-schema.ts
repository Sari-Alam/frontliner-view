import z, { string } from "zod"

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
  face_data: z.object({
    id: z.string(),
    face_descriptor: z.object({
      left: z.string(),
      front: z.string(),
      right: z.string(),
      up: z.string(),
      down: z.string(),
    }),
  }),
})

const Shift = z.object({
  id: z.string(),
  name: z.string(),
})

export type Enrollment = z.infer<typeof EnrollmentSchema>
export type EmployeePosition = z.infer<typeof EmployeePositionSchema>
export type Employee = z.infer<typeof EmployeeSchema>
export type Shift = z.infer<typeof Shift>
