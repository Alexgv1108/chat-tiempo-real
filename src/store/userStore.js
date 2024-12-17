import { create } from "zustand"

export const userStore = create((set) => ({
  pathStore: null,
  friendStore: null,
  setPath: (newPath) => set({ pathStore: newPath }),
  setFriend: (friends) => set({ friendStore: friends }),
}))
