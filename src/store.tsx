import p, { enableMapSet } from "immer";
import create, { UseStore } from "zustand";
import {createRef, Ref} from 'react';

enableMapSet();

const uuid = () => Math.floor(Math.random() * 1000);

export type Field = {
  id: number,
  name: string,
  value: string,
  setValue: (value: Record<string, any>) => void
}

export type FieldStore = UseStore<Field>

export type Node = {
  id: number,
  name: string
  fields: Map<number, FieldStore>
  addField: () => void
  removeField: (id: number) => void
}

export type NodeStore = UseStore<Node>

type Position = number[]


const createField = (id) =>
  create<Field>((set, get) => ({
    id,
    name: id,
    value: "Field",
    setValue: (value) => {
      set(value)
    }
  }));

const createNode = (id) =>
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
      removeField: (id) =>
        set(
          p((node) => {
            console.log(id);
            node.fields.delete(id);
            return node;
          })
        )
    };
  });

/**
 * Creating connections
*/

/**
 * Holds refs for all connectors, used to draw the lines
 */
type ConnectorsRefMap = {
  [key: string]: Ref<HTMLDivElement>
}

export const connectorsRef = createRef<ConnectorsRefMap>()
// @ts-expect-error
connectorsRef.current = {}

export enum ConnectorDirection {
  input = "INPUT",
  output = "OUTPUT"
}

export type Connector = {
  node: number | string,
  field: number | string,
  direction: ConnectorDirection
}

export type Connection = string[]

type State = {
  nodes: Map<number, NodeStore>,
  positions: Map<number, Position>

  connections: Connection[]
  addConnection: (origin: Connector, destination: Connector) => void,

  setPosition: (id: number, position: Position) => void,
  addNode: () => void,
  removeNode: (id: number) => void,
  active?: number,
  setActive: (id: number) => void,
}

type ConnectionState = {
  origin?: Connector,
  destination?: Connector,
  startConnecting: (from: Connector) => void,
  stopConnecting: () => void,
  connecting: boolean,
  reset: () => void
}

export const useConnectionStore = create<ConnectionState>((set, get) => {

  return {
    origin: undefined,
    destination: undefined,
    connecting: false,
    startConnecting: (from) => set({ connecting : true, origin: from }),
    stopConnecting: () => set({ connecting: false }),
    reset: () => set({
      origin: undefined,
      destination: undefined,
      connecting: false
    })
  }
  
})

type ConnectorsState = {
  connectors:Map<string, Ref<HTMLDivElement>>
  registerConnector: (id: string, ref: Ref<HTMLDivElement>) => void
  unregisterConnector: (id: string) => void
}

export const useConnectorsStore = create<ConnectorsState>((set, get) => {
  return { 
    connectors: new Map(),
    registerConnector: (id, ref) => set(p(store => {
      store.connectors.set(id, ref)
      return store
    })),
    unregisterConnector: (id) => set(p(store => {
      store.connectors.delete(id)
      return store
    }))
  }
})

export const useStore = create<State>((set, get) => {
  const f = uuid();
  
  return {
    nodes: new Map([[f, createNode(f)]]),
    positions: new Map([[f, [0, 0]]]),

    connections: [],

    addConnection: (origin, destination) => set(p(store => {
      store.connections.push([origin,destination])
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
          store.nodes.set(n, createNode(n));
          store.active = n;

          store.positions.set(n, [0, 0])

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
