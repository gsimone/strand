import create from "zustand";
import p from "immer";

import { createNode, NodeStore } from "./node";
import { useConnectionStore, Connection } from "./connection";
import { Connector } from "./connector";

import { makeConnectorId } from "../utils";
import { createField, FieldStore, FieldValues } from "./field";
import { ID } from "./index";

import { uuid } from "../utils"
import { SchemaStore, createDefaultSchema, createSchemaStore, JsonSchema } from './schema';

export type Position = number[];

export type StateFromJson = {
  nodes: Record<ID, Record<string, any>>;
  positions: Record<ID, number[]>;
  connections: Array<string[]>;
  schemas: Record<ID, JsonSchema>
};

export type State = {
  nodes: Map<ID, NodeStore>;
  positions: Map<ID, Position>;
  schemas: Map<ID, SchemaStore>
  connections: Connection[];

  reset: () => void;
  
  addConnection: (origin: Connector, destination: Connector) => void;
  removeConnection: (connection: Connection) => void;

  setPosition: (id: ID, position: Position) => void;
  addNode: (
    id?: ID,
    name?: string,
    fields?: FieldValues[],
    position?: Array<number>
  ) => void;
  removeNode: (id: ID) => void;
  removeField: (id: ID) => void;
  active?: ID;
  setActive: (id: ID) => void;
  serialize: () => any;
  setInitialState: (initValues: StateFromJson) => void;
};

export const useStore = create<State>((set, get) => {
  return {
    nodes: new Map(),
    positions: new Map(),
    fields: new Map(),
    schemas: new Map(),
    connections: [],

    reset: () => {
      set({
        nodes: new Map(),
        positions: new Map(),
        schemas: new Map(),
        connections: [],
      })
    },

    addConnection: (origin, destination) =>
      set(
        p((store) => {
          store.connections.push([
            makeConnectorId(origin),
            makeConnectorId(destination),
          ]);
          useConnectionStore.getState().reset();
          return store;
        })
      ),
    removeConnection: (connection: Connection) => {
      set(
        p((store) => {
          const index = store.connections.findIndex(
            (searchConnection) =>
              searchConnection.join("") === connection.join("")
          );

          store.connections.splice(index, 1);

          return store;
        })
      );
    },

    setPosition: (id, position) => {
      set(
        p((store) => {
          store.positions.set(id, position);
          return store;
        })
      );
    },
    addNode: (id, name, fields, position) => {
      const n = id || uuid();
      const node = createNode(n, name);
      const schema = createSchemaStore(createDefaultSchema())

      if (fields && fields.length > 0) {
        
        fields.forEach((field) =>
          node.getState().addField(field.id, field.name, field.value)
        );
        
      } else {

        const id = uuid()
        const field = createField(id, "name", id)

        node.getState().addField(id)

        schema.getState().addField(id)
        
        set(p(store => {
          store.fields.set(id, field)
          return store
        }))

      }


      set(
        p((store) => {
          store.positions.set(n, position || [100, 100]);
          store.nodes.set(n, node);

          store.schemas.set(n, schema)
          
          store.active = n;
          return store;
        })
      );
    },
    removeNode: (id) => {
      const { nodes } = get()
      const node = nodes.get(id)
      if (node) {
        const { removeConnections, removeFields } = node.getState()
        removeConnections()
        removeFields()
      }

      set(
        p((store) => {
          store.nodes.delete(id);
          store.positions.delete(id);
          store.schemas.delete(id);

          store.active = null;
          return store;
        })
      );
    },

    removeField: (id) => {
      const {connections, removeConnection} = get()
      
      connections.forEach((connection: Connection) => {
        // join the two ends of the connection since we only care if the field id is any of them
        const connectionString = connection.join("");
        if (connectionString.indexOf(`${id}`) > -1) {
          removeConnection(connection);
        }
      });

      set(p(store => {
        store.fields.delete(id)
        return store
      }))

    },

    active: undefined,
    setActive: (id) => set({ active: id }),
    serialize: () => {
      const { nodes, positions, connections, schemas } = get();

      const _nodes = Array.from(nodes).reduce((acc, [_, x]) => {
        const { id, ...theRest } = x.getState().pick();
        acc[id] = theRest;
        return acc;
      }, {})

      const _positions = Array.from(positions).reduce((acc, [id, position]) => {
        acc[id] = position
        return acc
      }, {})

      const _schemas = Array.from(schemas).reduce((acc, [id, schema]) => {
        acc[id] = schema.getState().pick()

        return acc
      }, {})

      return { 
        nodes: _nodes,
        connections,
        positions: _positions,
        schemas: _schemas
      }
    },
    setInitialState: (initValues) => {
      const { nodes, connections, positions, schemas } = initValues;

      const initializedNodes = Object.entries(nodes).map(([id, node]: any) => {

        const _node = createNode(id, node.name, node.fields);

        return { node: _node };
      });
      

      set(
        p((store) => {
          initializedNodes.forEach(({ node }) => {
            const { id } = node.getState();
            store.positions.set(id, positions[id] || [100, 100]);
            store.nodes.set(id, node);
          });
          
          Object.entries(schemas).forEach(([id, serializedSchema]) => {
            // @ts-ignore
            store.schemas.set(id, createSchemaStore(serializedSchema))
          }) 

          store.connections = connections || [];

          return store;
        })
      );

      useConnectionStore.getState().reset();
    },
  };
});
