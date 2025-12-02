import { create } from "zustand"
import type { User, FilterParams } from "./types"

interface AppState {
  user: User | null
  setUser: (user: User | null) => void
  filters: FilterParams
  setFilters: (filters: FilterParams) => void
  resetFilters: () => void
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  filters: {},
  setFilters: (filters) => set({ filters }),
  resetFilters: () => set({ filters: {} }),
}))
