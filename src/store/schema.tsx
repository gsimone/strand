import Ajv, { ValidateFunction } from 'ajv'
import create from 'zustand';
import p from 'immer'

import { ID } from './index'

export enum SchemaStatus {
  VALID,
  INVALID,
  MISSING,
}

export const createDefaultSchema = (key) => {
  return {
    "$id": `#/properties/${key}`,
    "type": "string",
    "title": `The ${key} Schema`,
    "description": "An explanation about the purpose of this instance.",
  }
}

type JsonSchema = {
  $schema?: string,
  $id: string,
  type: string,
  title?: string,
  description?: string,
  default: Record<string, any>,
  required?: string[],
  properties: Record<string, JsonSchema>,
  additionalProperties?: boolean,
  examples: any[]
}

type SchemaStore = {
  jsonSchema: JsonSchema | null,
  error?: Error,
  status: SchemaStatus,

  set: (newSchema: string) => void,
  addField: (id: ID) => void,
  removeField: (id: ID) => void,
}

export const createSchemaStore = (jsonSchema) => {
  
  const store = create<SchemaStore>((set, get) => {
  const ajv = new Ajv()
  
  return {
    jsonSchema: null,

    status: SchemaStatus.MISSING,
    error: undefined,
    
    compile: (newSchema) => {
      ajv.compile(newSchema)
    },
    // handle schema change
    set: (newSchema) => {

      // 1. check if valid json
      try {
        const parsedSchema: JsonSchema = JSON.parse(newSchema)

        // remove previous version of the schema
        ajv.removeSchema(parsedSchema.$id)

        // 2. check if compiles
        const validate = ajv.compile(parsedSchema)
        
        // 3. validate against ajv schema

        // if no examples, consider valid but warn about missing examples
       
        if ("examples" in parsedSchema && parsedSchema.examples.length > 0) {

          const results = parsedSchema.examples.map((example) => {
            return validate(example)
          })

          if (!results.reduce((acc, result) => acc && result, true)) {
            throw new Error("Invalid examples")
          }

        } 

        set({ status:SchemaStatus.VALID, jsonSchema: parsedSchema })
        
      } catch (err) {
        set({ status: SchemaStatus.INVALID, error: err })
      }

    },
    removeField: (id) => {
      set(p(state => {
        const {jsonSchema} = state
        delete jsonSchema.properties[id]
        return state
      }))
    },
    addField: (id) => {
      set(p(state => {
        const {jsonSchema} = state
        jsonSchema.properties[id] = createDefaultSchema(id)
        return state
      }))
    },
    getFieldSchema: (id) => {
      return get().jsonSchema?.properties[id]
    },
    setFieldSchema: (id, modifiedFieldSchema) => {
      const { jsonSchema, set } = get()

      const newSchema = p(jsonSchema, jsonSchema => {
        const fieldSchema = jsonSchema!.properties[id]
        jsonSchema!.properties[id] = { ...fieldSchema, ...modifiedFieldSchema }

        return jsonSchema
      })

      set(JSON.stringify(newSchema))
    } 
  }

})

store.getState().set(jsonSchema)

return store
}
