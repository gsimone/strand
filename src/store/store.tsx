import create from 'zustand'
import p from "immer";

import { createNode, NodeStore, NodeValues } from './node'
import { useConnectionStore, Connection } from './connection'
import { Connector } from './connector'

import { makeConnectorId } from '../utils';
import { FieldStore, FieldValues } from './field';
import { ID } from './index';

const uuid = () => Math.floor(Math.random() * 1000);

export type Position = number[]

export type StateFromJson = {
  nodes: NodeValues[]
  positions: any // TODO Record<[ID, Position]>
  fields: FieldValues[],
  connections: Array<string>
}

export type State = {
  nodes: Map<ID, NodeStore>
  positions: Map<ID, Position>
  fields: Map<ID, FieldStore>
  connections: Connection[]

  addConnection: (origin: Connector, destination: Connector) => void,
  setPosition: (id: ID, position: Position) => void,
  addNode: (id?: ID, name?: string, fields?: FieldValues[], position?: Array<number>) => void,
  removeNode: (id: ID) => void,
  active?: ID,
  setActive: (id: ID) => void,
  serialize: () => void,
  setInitialState: (initValues: StateFromJson) => void,
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
    addNode: (id, name, fields, position) => {
      const n = id || uuid();
      const node = createNode(n, name)
      
      if (fields && fields.length > 0) {
        fields.forEach(field => node.getState().addField(field.id, field.name, field.value))
      }

      set(
        p((store) => {
          store.positions.set(n, position || [100, 100])
          store.nodes.set(n, node);
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
    setInitialState: initValues => {
      const { nodes, positions, fields, connections } = initValues
      const { addNode } = get()

      // set initial nodes, fields and positions
      nodes.forEach(node => {

        const position = positions.reduce((acc, [_id, _position]) => {
          if (node.id === _id) {
            return _position
          }
          return acc
        }, [100, 100])

        const _fields = fields.filter(field => node.fields.includes(field.id))

        addNode(node.id, node.name, _fields, position)
      })

      // set initial connections
      set(p(store => {
        connections.forEach(connection => {
          if (connection?.length === 2 && typeof connection[0] === "string" && typeof connection[1] === "string") {
            store.connections.push(connection)
          }
        })
        useConnectionStore.getState().reset()

        return store
      }))
    }
  };
});
