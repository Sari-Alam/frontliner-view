import { create } from "zustand"

interface RFIDSecurityState {
  registeredIds: Record<string, string>[]
  setRegisteredIds: (registeredIds: Record<string, string>) => void
  clearRegisteredIds: (id: string) => void
}

const useRFIDSecurity = create<RFIDSecurityState>((set) => ({
  registeredIds: [],
  setRegisteredIds: (registeredIds: Record<string, string>) =>
    set((state) => ({
      registeredIds: [...state.registeredIds, registeredIds],
    })),
  clearRegisteredIds: (id: string) =>
    set((state) => ({
      registeredIds: state.registeredIds.filter((x) => x.id !== id),
    })),
}))

export { useRFIDSecurity }
