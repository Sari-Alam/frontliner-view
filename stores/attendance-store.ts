import { Employee, Shift } from "@/lib/data-schema"
import { create } from "zustand"

interface AttendaceStore {
  isLoading: boolean
  employeeNIP: string
  employeeData?: Employee
  shiftData?: Shift
  setEmployeeData: (data: Employee) => void
  setEmployeeNIP: (nip: string) => void
  setIsLoading: (isLoading: boolean) => void
  clearData: () => void
  setShiftData: (data: Shift) => void
}

export const useAttendanceStore = create<AttendaceStore>((set) => ({
  isLoading: false,
  employeeNIP: "",
  employeeData: undefined,
  setEmployeeData: (data: Employee) => set({ employeeData: data }),
  setEmployeeNIP: (nip: string) => set({ employeeNIP: nip }),
  setIsLoading: (isLoading: boolean) => set({ isLoading }),
  clearData: () => set({ employeeNIP: "", employeeData: undefined }),
  setShiftData: (data: Shift) => set({ shiftData: data }),
}))
