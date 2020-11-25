import create, { UseStore } from "zustand";

export type Field = {
  id: number,
  name: string,
  value: string,
  setValue: (value: Record<string, any>) => void
}

export type FieldStore = UseStore<Field>

export const createField = (id) =>
  create<Field>((set, get) => ({
    id,
    name: id,
    value: "Field",
    setValue: (value) => {
      set(value)
    }
  }));

