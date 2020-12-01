import create, { UseStore } from "zustand";

export type FieldValues = {
  id: number;
  name: string;
  value: string;
};

export type Field = FieldValues & {
  setValue: (value: Record<string, any>) => void;
  pick: () => FieldValues;
  serialize: () => string;
};

export type FieldStore = UseStore<Field>;

export const createField = (id, name, value) =>
  create<Field>((set, get) => ({
    id,
    name: name || id,
    value: value || "Field",
    setValue: (value) => {
      set(value);
    },
    pick: () => {
      const { id, name, value } = get();
      return { id, name, value };
    },
    serialize: () => {
      const { pick } = get();
      return JSON.stringify(pick());
    },
  }));
