import Ajv from "ajv";
import create, { UseStore } from "zustand";
import p from "immer";

import { ID } from "./index";
import { uuid } from '../utils';

export enum SchemaStatus {
  VALID,
  INVALID,
  MISSING,
}

export const createFileSchema = id => ({
  "$id":`#/properties/${id}`,
  "description":"An explanation about the purpose of this field.",
  "examples":[
     {
        "bucket":"http://aws.aws.aws",
        "key":"fjhtyr74839woolskdfjhytr4u8eikd"
     }
  ],
  "required":[
     "bucket",
     "key"
  ],
  "title": "Field title",
  "properties":{
     "bucket":{
        "$id": `#/properties/${id}/properties/bucket`,
        "type":"string",
        "title":"The bucket schema",
        "description":"An explanation about the purpose of this field.",
        "default":"",
        "examples":[
           "http://aws.aws.aws"
        ]
     },
     "key":{
        "$id": `#/properties/${id}/properties/key`,
        "type":"string",
        "title":"The key schema",
        "description":"An explanation about the purpose of this field.",
        "default":"",
        "examples":[
           "fjhtyr74839woolskdfjhytr4u8eikd"
        ]
     }
  },
  "additionalProperties":true
})

export const createDefaultSchema = () => {

    const id = uuid()
    const field = createDefaultFieldSchema(id)
    
    return {
    "$schema": "http://json-schema.org/draft-07/schema",
    "$id": "http://example.com/example.json",
    "type": "object",
    "title": "The root schema",
    "description": "The root schema comprises the entire JSON document.",
    "default": {},
    "properties": {
      [id]: field
    },
    "additionalProperties": true
  }
}

export const createDefaultFieldSchema = (key) => {
  return {
    $id: `#/properties/${key}`,
    type: "string",
    title: `Field title`,
    description: "An explanation about the purpose of this field.",
  };
};

export type JsonSchema = {
  $schema?: string;
  $id: string;
  type: string;
  title?: string;
  description?: string;
  default?: any;
  required?: string[];
  properties?: Record<string, JsonSchema>;
  additionalProperties?: boolean;
  examples?: any[];
};

export type Schema = {
  jsonSchema: JsonSchema | null;
  error?: Error;
  status: SchemaStatus;

  set: (newSchema: JsonSchema | string) => void;
  addField: (id?: ID) => void;
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
          // set({ status: SchemaStatus.INVALID, error: err });
          throw err;
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
        const newId = id || uuid()
        
        set(
          p((state) => {
            const { jsonSchema } = state;
            jsonSchema.properties[newId] = createDefaultFieldSchema(newId);
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

          /**
           * Discard unnecessary schema keys for simple types.
           * properties, required are only needed for objects
           * examples are completely discared since we aren't handling those yet
           */
          if (
            modifiedFieldSchema!.type === "string" || 
            modifiedFieldSchema!.type === "number" || 
            modifiedFieldSchema!.type === "boolean"
          ) {
            delete fieldSchema!.properties
            delete fieldSchema!.required
            delete fieldSchema!.examples
          }
          
          return jsonSchema;
        });

        set(JSON.stringify(newSchema));
      },
    };
  });

  store.getState().set(jsonSchema);

  return store;
};
