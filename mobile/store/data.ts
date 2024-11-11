import { create } from 'zustand'

export type User = {
    name: string;
    weight: string;
    height: string;
    age: string;
    gender: string;
    systolic: string;
    diastolic: string;
}

type DataState = {
    user: User;
    setPageOne: (data: Omit<User, "gender" | "systolic" | "diastolic">) => void;
    setPageTwo: (data: Pick<User, "gender" | "systolic" | "diastolic">) => void;
}

export const useDataStore = create<DataState>((set) => ({
    user: {
        name: "",
        weight: "",
        height: "",
        age: "",
        gender: "",
        systolic: "",
        diastolic: "",
    },

    setPageOne: (data) => set((state) => ({user:{...state.user, ...data}})),
    setPageTwo: (data) => set((state) => ({user:{...state.user, ...data}})),
}))