import { create } from "zustand"

interface TableUIState {
  selectedIds: string[]
  toggleSelection: (id: string) => void
  resetSelection: () => void
}

export const useEnrollmentTableStore = create<TableUIState>((set) => ({
  selectedIds: [],
  toggleSelection: (id) =>
    set((state) => ({
      selectedIds: state.selectedIds.includes(id)
        ? state.selectedIds.filter((i) => i !== id)
        : [...state.selectedIds, id],
    })),
  resetSelection: () => set({ selectedIds: [] }),
}))
