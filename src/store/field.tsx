import create, { UseStore } from "zustand";

export type FieldValues = {
  id: number,
  name: string,
  value: string,
}

export type Field = FieldValues & {
  setValue: (value: Record<string, any>) => void,
  preSerialize: () => FieldValues,
  serialize: () => string
}

export type FieldStore = UseStore<Field>

export const createField = (id) =>
  create<Field>((set, get) => ({
    id,
    name: id,
    value: "Field",
    setValue: (value) => {
      set(value)
    },
    preSerialize: () => {
      const { id, name, value } = get()
      return { id, name, value }
    },
    serialize: () => {
      const { preSerialize } = get()
      return JSON.stringify(preSerialize())
    }
  }));

