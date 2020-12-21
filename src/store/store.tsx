import create from "zustand";
import p from "immer";

import { useConnectionStore, Connection } from "./connection";
import { Connector, ConnectorDirection } from "./connector";

import { makeConnectorId } from "../utils";
import { ID } from "./index";

import { uuid } from "../utils"
import { SchemaStore, createDefaultSchema, createSchemaStore, JsonSchema } from './schema';

export type Position = number[];

export type StateFromJson = {
  positions: Record<ID, number[]>;
  connections: Array<string[]>;
  schemas: Record<ID, JsonSchema>
};

export type State = {
  positions: Map<ID, Position>;
  schemas: Map<ID, SchemaStore>
  connections: Connection[];

  reset: () => void;
  
  addConnection: (origin: Connector, destination: Connector) => void;
  removeConnection: (connection: Connection) => void;

  setPosition: (id: ID, position: Position) => void;
  addNode: (
    id?: ID,
    position?: Array<number>
  ) => void;
  removeNode: (id: ID) => void;
  removeField: (id: ID) => void;
  active?: ID;
  setActive: (id: ID) => void;
  serialize: () => any;
  setInitialState: (initValues: StateFromJson) => void;
  removeNodeConnections: (nodeId: ID) => void;
  removeFieldConnections: (fieldID: ID, nodeID: ID) => void;
};

export const useStore = create<State>((set, get) => {
  return {
    positions: new Map(),
    schemas: new Map(),
    connections: [],

    reset: () => {
      set({
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
    addNode: (id = uuid(), position = [100, 100]) => {
      
      set(
        p((store) => {
          store.positions.set(id, position);

          const schema = createSchemaStore(createDefaultSchema())
          store.schemas.set(id, schema)

          store.active = id;
          return store;
        })
      );
    },
    removeFieldConnections: (fieldId: ID, nodeID: ID) => {
      const { connections } = useStore.getState();

      set(p(state => {

        state.connections = connections.filter(([connectionInput, connectionOutput]) => {
          const connectionString = [connectionInput, connectionOutput].join('_')
          return connectionString.indexOf(`${fieldId}`) === -1
        })

        return state

      }))

    },
    removeNodeConnections: (nodeId: ID) => {
      const { connections, schemas } = useStore.getState();
      const { properties } = schemas.get(nodeId)!.getState().jsonSchema!
      
      const possibleConnections = Object.keys(properties!).reduce((acc, field) => {
        acc.push(makeConnectorId({ node: nodeId, field, direction: ConnectorDirection.input}))
        acc.push(makeConnectorId({ node: nodeId, field, direction: ConnectorDirection.output}))
        return acc
      }, [] as string[])
      
      const newConnections = connections.filter(([connectionIn, connectionOut]) => !(possibleConnections.includes(connectionIn)||possibleConnections.includes(connectionOut)))
      
      useStore.setState(
        p((state) => {
          state.connections = newConnections
          return state;
        })
      );
    },
    removeNode: (id) => {
      const { removeNodeConnections } = get()
      removeNodeConnections(id)

      set(
        p((store) => {
          
          store.positions.delete(id);
          store.schemas.delete(id);

          /* Unset active so that the sidebar closes */
          store.active = null;
          return store;
        })
      );
    },

    removeField: (id) => {

      const { connections, removeConnection } = get()
      
      connections.forEach((connection: Connection) => {
        // join the two ends of the connection since we only care if the field id is any of them
        const connectionString = connection.join("");
        if (connectionString.indexOf(`${id}`) > -1) {
          removeConnection(connection);
        }
      });

    },

    active: undefined,
    setActive: (id) => set({ active: id }),
    serialize: () => {
      const { positions, connections, schemas } = get();

      const _positions = Array.from(positions).reduce((acc, [id, position]) => {
        acc[id] = position
        return acc
      }, {})

      const _schemas = Array.from(schemas).reduce((acc, [id, schema]) => {
        acc[id] = schema.getState().pick()

        return acc
      }, {})

      return { 
        connections,
        positions: _positions,
        schemas: _schemas
      }
    },
    setInitialState: (initValues) => {
      const { connections, positions, schemas } = initValues;

      set(
        p((store) => {
          Object.keys(schemas).forEach((id) => {
            store.positions.set(id, positions[id] || [100, 100]);
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
