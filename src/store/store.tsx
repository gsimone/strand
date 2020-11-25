import create from 'zustand'
import p from "immer";

import { createNode, NodeStore, NodeValues } from './node'
import { useConnectionStore, Connection } from './connection'
import { Connector } from './connector'

import { makeConnectorId } from '../utils';
import { FieldStore, FieldValues } from './field';
import { ID } from './index';

const uuid = () => Math.floor(Math.random() * 1000);

export type StateFromJson = {
  nodes: NodeValues[]
  positions: Record<ID, number[]>
  fields: FieldValues[],
  connections: Array<string>
}

export type Position = number[]

export type State = {
  nodes: Map<ID, NodeStore>
  positions: Map<ID, Position>
  fields: Map<ID, FieldStore>
  connections: Connection[]

  addConnection: (origin: Connector, destination: Connector) => void,
  removeConnection: (connection: Connection) => void,
  
  setPosition: (id: ID, position: Position) => void,
  addNode: () => void,
  removeNode: (id: ID) => void,
  active?: ID,
  setActive: (id: ID) => void,
  serialize: () => void,
  setState: (initValues: StateFromJson) => void,
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

    removeConnection: (connection: Connection) => {

      set(p(store => {

        const index = store.connections.findIndex(searchConnection => searchConnection.join('') === connection.join(''))
        store.connections.splice(index)

        return store

      }))

    },
    
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
    setActive: (id) => set({ active: id }),
    serialize: () => {
      const { nodes, positions, fields, connections } = get()
      console.log(
        JSON.stringify({
          nodes: Array.from(nodes).map(([_, x]) => x.getState().preSerialize()),
          positions: Array.from(positions),
          fields: Array.from(fields).map(([_, x]) => x.getState().preSerialize()),
          connections
        }, null, "  ")
      )
    },
    setState: initValues => {
      const { nodes, positions, fields, connections } = initValues
    }
  };
});
