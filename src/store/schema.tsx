import Ajv, { ValidateFunction } from "ajv";
import create, { UseStore } from "zustand";
import p from "immer";

import { ID } from "./index";

export enum SchemaStatus {
  VALID,
  INVALID,
  MISSING,
}

export const createDefaultSchema = () => ({
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "http://example.com/example.json",
  "type": "object",
  "title": "The root schema",
  "description": "The root schema comprises the entire JSON document.",
  "default": {},
  "properties": {
  },
  "additionalProperties": true
})

export const createDefaultFieldSchema = (key) => {
  return {
    $id: `#/properties/${key}`,
    type: "string",
    title: `The ${key} Schema`,
    description: "An explanation about the purpose of this instance.",
  };
};

export type JsonSchema = {
  $schema?: string;
  $id: string;
  type: string;
  title?: string;
  description?: string;
  default?: Record<string, any>;
  required?: string[];
  properties?: Record<string, JsonSchema>;
  additionalProperties?: boolean;
  examples?: Record<string, any>[];
};

export type Schema = {
  jsonSchema: JsonSchema | null;
  error?: Error;
  status: SchemaStatus;

  set: (newSchema: JsonSchema | string) => void;
  addField: (id: ID) => void;
  removeField: (id: ID) => void;

  getFieldSchema: (id: ID) => JsonSchema;
  setFieldSchema: (id: ID, modifiedSchema: Record<any, any>) => void;

  pick: () => JsonSchema
};

export type SchemaStore = UseStore<Schema>;

export const createSchemaStore = (jsonSchema: JsonSchema) => {
  const store = create<Schema>((set, get) => {
    const ajv = new Ajv();

    return {
      jsonSchema: null,

      status: SchemaStatus.MISSING,
      error: undefined,

      // handle schema change
      set: (newSchema) => {
        // 1. check if valid json
        try {
          const parsedSchema: JsonSchema = typeof newSchema === "string" ? JSON.parse(newSchema) : newSchema;

          // remove previous version of the schema
          ajv.removeSchema(parsedSchema.$id);

          // 2. check if compiles
          const validate = ajv.compile(parsedSchema);

          // 3. validate against ajv schema

          // if no examples, consider valid but warn about missing examples

          if ("examples" in parsedSchema && (parsedSchema.examples!).length > 0) {
            const results = parsedSchema.examples!.map((example) => {
              return validate(example);
            });

            if (!results.reduce((acc, result) => acc && result, true)) {
              throw new Error("Invalid examples");
            }
          }

          set({ status: SchemaStatus.VALID, jsonSchema: parsedSchema });
        } catch (err) {
          set({ status: SchemaStatus.INVALID, error: err });
        }
      },
      removeField: (id) => {
        set(
          p((state) => {
            const { jsonSchema } = state;
            delete jsonSchema.properties[id];
            return state;
          })
        );
      },
      addField: (id) => {
        set(
          p((state) => {
            const { jsonSchema } = state;
            jsonSchema.properties[id] = createDefaultFieldSchema(id);
            return state;
          })
        );
      },
      getFieldSchema: (id) => {
        return get().jsonSchema?.properties![id] as JsonSchema;      },
      
      pick: () => {
        return get().jsonSchema! 
      },

      setFieldSchema: (id, modifiedFieldSchema) => {
        const { jsonSchema, set } = get();

        const newSchema = p(jsonSchema, (jsonSchema) => {
          const fieldSchema = jsonSchema!.properties![id];
          jsonSchema!.properties![id] = {
            ...fieldSchema,
            ...modifiedFieldSchema,
          };

          return jsonSchema;
        });

        set(JSON.stringify(newSchema));
      },
    };
  });

  store.getState().set(jsonSchema);

  return store;
};
