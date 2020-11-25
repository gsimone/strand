import create from 'zustand'
import p from "immer";

import { createNode, NodeStore } from './node'
import { useConnectionStore, Connection } from './connection'
import { Connector } from './connector'

import { makeConnectorId } from '../utils';
import { FieldStore } from './field';

const uuid = () => Math.floor(Math.random() * 1000);

export type Position = number[]

export type State = {
  nodes: Map<number, NodeStore>,
  positions: Map<number, Position>
  fields: Map<number, FieldStore>

  connections: Connection[]
  addConnection: (origin: Connector, destination: Connector) => void,

  setPosition: (id: number, position: Position) => void,
  addNode: () => void,
  removeNode: (id: number) => void,
  active?: number,
  setActive: (id: number) => void,
}

export const useStore = create<State>((set, get) => {
  const f = uuid();
  
  return {

    nodes: new Map(),
    positions: new Map(),
    fields: new Map(),
    connections: [],

    addConnection: (origin, destination) => set(p(store => {
      store.connections.push([makeConnectorId(origin), makeConnectorId(destination)])
      useConnectionStore.getState().reset()
      return store
    })),
    
    setPosition: (id, position) => {
      set(p(store => {
        store.positions.set(id, position)
        return store
      }))
    },
    addNode: () => {
      set(
        p((store) => {
          const n = uuid();
          store.positions.set(n, [100, 100])
          store.nodes.set(n, createNode(n));
          store.active = n;


          return store;
        })
      );
    },
    removeNode: (id) => {
      set(
        p((store) => {
          store.nodes.delete(id);
          store.active = null;

          return store;
        })
      );
    },
    active: undefined,
    setActive: (id) => set({ active: id })
  };
});
