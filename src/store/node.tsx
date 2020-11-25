import create, { UseStore } from "zustand";
import p from "immer";
import pick from 'lodash.pick'

import { FieldStore,createField } from './field'
import { useStore } from './store';

const uuid = () => Math.floor(Math.random() * 1000);

export type Node = {
  id: number,
  name: string
  fields: number[],
  addField: () => void
  removeField: (id: number) => void
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
    }
    };
  });
