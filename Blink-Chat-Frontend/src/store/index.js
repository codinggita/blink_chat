import { create } from "zustand";
import { createAuthSlice } from "./slices/auth-slice"; //authentication state logic from auth-slice to manage user authentication.

export const useAppStore = create()((...a)=>({
    ...createAuthSlice(...a),
}));