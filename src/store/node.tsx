import create, { UseStore } from "zustand";
import p from "immer";

import { createField } from './field'
import { useStore } from './store';
import { Connection } from './connection'
import { SchemaStore, createSchemaStore } from './schema';
import { ID } from "store";

import { uuid } from "../utils"
import { ConnectorDirection } from "./connector";

import tempJsonSchema from '../__test__/schema/__fixtures__/valid.json'
import { makeConnectorId } from 'utils';

export type NodeValues = {
  id: ID;
  name: string;
  fields: ID[];
};

export type Node = NodeValues & {
  addField: (id?: ID, name?: string, value?: any) => void;
  removeFields: () => void;
  removeField: (id: ID) => void;
  pick: () => NodeValues;
  serialize: () => string;
  removeConnections: () => void,
};

export type NodeStore = UseStore<Node>;

export const createNode = (id, name) =>
  {
    
    const store = create<Node>((set, get) => {
    return {
      id,
      name: name || id,
      fields: [],
      addField: (id, name, value) => {
        const nodeId = get().id
        const fieldID = id || uuid();
        const field = createField(fieldID, name, value);

        // @TODO create an action in the main state for this
        useStore.setState(
          p((state) => {
            state.fields.set(fieldID, field);
            return state;
          })
        );

        // add a property to schema
        useStore.getState().schemas.get(nodeId)?.getState().addField(fieldID)

        set(
          p((node) => {
            node.fields.push(fieldID);
            return node;
          })
        );
      },
      // cleanup all node fields
      removeFields: () => {
        const { fields, removeField } = get()
        fields.forEach(removeField)
      },
      removeField: (fieldID) => {
        const nodeId = get().id

        set(
          p((node) => {
            const index = node.fields.indexOf(fieldID);

            node.fields.splice(index, 1);
            return node;
          })
        );

        useStore.getState().schemas.get(nodeId)?.getState().removeField(fieldID)

        useStore.getState().removeField(fieldID)
        
      },
      removeConnections: () => {
        const { connections } = useStore.getState();
        const { id, fields } = get()
        
        const possibleConnections = fields.reduce((acc, field) => {
          acc.push(makeConnectorId({node: id, field, direction: ConnectorDirection.input}))
          acc.push(makeConnectorId({node: id, field, direction: ConnectorDirection.output}))
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
      pick: () => {
        const { id, name, fields } = get();
        return { id, name, fields };
      },
      serialize: () => {
        const { pick } = get();
        return JSON.stringify(pick());
      },
    };
  })

  return store
};
