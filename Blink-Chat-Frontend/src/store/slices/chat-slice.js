import { create } from "zustand";

export const useContact = create((set, get) => ({
    contact: undefined,

    selectContact: (input) => set({ contact: input }),

    clearContact: () => set({
        contact: undefined,
    })
}))
