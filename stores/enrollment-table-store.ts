import { create } from "zustand"

interface TableUIState {
  visibleColumns: string[]
  toggleColumn: (id: string) => void
  resetColumns: () => void
}

export const useEnrollmentTableStore = create<TableUIState>((set) => ({
  visibleColumns: ["name", "nip", "has_face"],
  toggleColumn: (id) =>
    set((state) => ({
      visibleColumns: state.visibleColumns.includes(id)
        ? state.visibleColumns.filter((i) => i !== id)
        : [...state.visibleColumns, id],
    })),
  resetColumns: () => set({ visibleColumns: [] }),
}))
