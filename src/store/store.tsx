import create from "zustand";
import p from "immer";

import { createNode, NodeStore } from "./node";
import { useConnectionStore, Connection } from "./connection";
import { Connector } from "./connector";

import { makeConnectorId } from "../utils";
import { FieldStore, FieldValues } from "./field";
import { ID } from "./index";

import { uuid } from "../utils"

export type Position = number[];

export type StateFromJson = {
  nodes: any;
  fields: any;
  connections: Array<string>;
};

export type State = {
  nodes: Map<ID, NodeStore>;
  positions: Map<ID, Position>;
  fields: Map<ID, FieldStore>;
  connections: Connection[];

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
  active?: ID;
  setActive: (id: ID) => void;
  serialize: () => string;
  setInitialState: (initValues: StateFromJson) => void;
};

export const useStore = create<State>((set, get) => {
  return {
    nodes: new Map(),
    positions: new Map(),
    fields: new Map(),
    connections: [],

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
          store.connections.splice(index);

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

      if (fields && fields.length > 0) {
        fields.forEach((field) =>
          node.getState().addField(field.id, field.name, field.value)
        );
      }

      set(
        p((store) => {
          store.positions.set(n, position || [100, 100]);
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
      const { nodes, positions, fields, connections } = get();

      const _nodes = Array.from(nodes).reduce((acc, [_, x]) => {
        const { id, ...theRest } = x.getState().pick();

        acc[id] = theRest;
        acc[id].position = Array.from(positions).reduce(
          (acc, position) => {
        
            if (id === position[0]) {
              acc = position[1];
            }
        
            return acc;
          },
          [100, 100]
        );

        return acc;
      }, {})

      const _fields = Array.from(fields).reduce((acc, [_, x]) => {
        const { id, ...theRest } = x.getState().pick();
        acc[id] = theRest;
        
        return acc;
      }, {})

      console.log(JSON.stringify({ nodes: _nodes, fields: _fields, connections }, null, "  "))
      
      return JSON.stringify({ nodes: _nodes, fields: _fields, connections })
    },
    setInitialState: (initValues) => {
      const { nodes, fields, connections } = initValues;

      const initializedNodes = Object.entries(nodes).map(([id, node]: any) => {
        const _fields = node.fields.reduce((acc, fieldId) => {
          const _field = fields[fieldId];
          if (_field) {
            acc.push({ id: fieldId, ..._field });
          }

          return acc;
        }, []);

        const _node = createNode(id, node.name);

        _fields.forEach((field) =>
          _node.getState().addField(field.id, field.name, field.value)
        );

        return { node: _node, position: node.position };
      });

      set(
        p((store) => {
          initializedNodes.forEach(({ node, position }) => {
            const { id } = node.getState();

            store.positions.set(id, position || [100, 100]);
            store.nodes.set(id, node);
          });

          store.connections = connections || [];

          return store;
        })
      );
      useConnectionStore.getState().reset();
    },
  };
});
