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
  nodes: any
  fields: any,
  connections: Array<string>
}

export type State = {
  nodes: Map<ID, NodeStore>
  positions: Map<ID, Position>
  fields: Map<ID, FieldStore>
  connections: Connection[]

  addConnection: (origin: Connector, destination: Connector) => void,
  removeConnection: (connection: Connection) => void,
  
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
          nodes: Array.from(nodes).reduce((acc, [_, x]) => {
            const { id, ...theRest } = x.getState().pick()
            acc[id] = theRest
            acc[id].position = Array.from(positions).reduce((acc, position) => {
              if (id === position[0]) {
                acc = position[1]
              }
              return acc
            }, [100, 100])
            return acc
          }, {}),
          fields: Array.from(fields).reduce((acc, [_, x]) => {
            const { id, ...theRest } = x.getState().pick()
            acc[id] = theRest
            return acc
          }, {}),
          connections
        }, null, "  ")
      )
    },
    setInitialState: initValues => {
      const { nodes, fields, connections } = initValues
      const { addNode } = get()

      // set initial nodes, fields and positions
      Object.entries(nodes).forEach(([id, node] : any) => {
        const _fields = node.fields.reduce((acc, fieldId) => {
          const _field = fields[fieldId]
          if (_field) {
            acc.push(_field)
          }
          return acc
        }, [])
        addNode(node.id, node.name, _fields, node.position)
      })

      // set initial connections
      set(p(store => {
        store.connections = connections || []
        useConnectionStore.getState().reset()
        return store
      }))
    }
  };
});
