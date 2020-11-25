import create, { UseStore } from "zustand";
import p from "immer";
import pick from 'lodash.pick'

import { FieldStore,createField } from './field'
import { useStore } from './store';
import { ID } from "store";

const uuid = () => Math.floor(Math.random() * 1000);

export type NodeValues = {
  id: ID,
  name: string
  fields: ID[]
}

export type Node = NodeValues & {
  addField: () => void
  removeField: (id: ID) => void,
  preSerialize: () => NodeValues,
  serialize: () => string,
}

export type NodeStore = UseStore<Node>

export const createNode = (id) =>
  create<Node>((set, get) => {
    return {
      id,
      name: id,
      fields: [],
      addField: () =>{

        const fieldID = uuid();
        const field = createField(fieldID)

        useStore.setState(p(state => {
          state.fields.set(fieldID, field)
          return state
        }))
        
        set(
          p((node) => {
            node.fields.push(fieldID);
            return node;
          })
        )
      
      },
      removeField: (id) => {

        useStore.setState(p(state => {
          state.fields.delete(id)
          return state
        }))
        
        set(
          p((node) => {
            const index = node.fields.indexOf(id)
            
            node.fields.splice(index, 1);
            return node;
          })
        )
      },
      preSerialize: () => {
        const { id, name, fields } = get()
        return { id, name, fields }
      },
      serialize: () => {
        const { preSerialize } = get()
        return JSON.stringify(preSerialize())
      }
    };
  });
