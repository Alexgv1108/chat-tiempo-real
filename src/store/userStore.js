import { create } from "zustand"

export const userStore = create((set) => ({
  pathStore: null,
  showUsers: false,
  setPath: (newPath) => set({ pathStore: newPath }),
  setShowUsers: (isShowUser) => set({ showUsers: isShowUser }),
}))
