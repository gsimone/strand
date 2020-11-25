import create, { UseStore } from "zustand";
import p from "immer";
import pick from 'lodash.pick'

import { FieldStore,createField } from './field'

const uuid = () => Math.floor(Math.random() * 1000);

export type Node = {
  id: number,
  name: string
  fields: Map<number, FieldStore>
  addField: () => void
  removeField: (id: number) => void
}

export type NodeStore = UseStore<Node>

export const createNode = (id) =>
  create<Node>((set, get) => {
    const fieldId = uuid();
    return {
      id,
      name: id,
      fields: new Map([[fieldId, createField(fieldId)]]),
      addField: () =>
        set(
          p((node) => {
            const n = uuid();
            node.fields.set(n, createField(n));
            return node;
          })
        ),
      removeField: (id) => set(
        p((node) => {
          node.fields.delete(id);
          return node;
        })
      )
    };
  });
