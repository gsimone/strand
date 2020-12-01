import Ajv, { ValidateFunction } from 'ajv'
import create from 'zustand';
import p from 'immer'

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

type SchemaStore = {
  jsonSchema: Record<string, any>,
  error: Error,
  status: SchemaStatus,

  set: (newSchema: string) => void
}

export const createSchemaStore = (jsonSchema) => {
  
  const store = create<SchemaStore>((set, get) => {
  const ajv = new Ajv()
  
  return {
    jsonSchema: null,

    status: SchemaStatus.MISSING,
    error: false,
    
    validate: ajv.validate,
    compile: (newSchema) => {
      ajv.compile(newSchema)
    },
    // handle schema change
    set: (newSchema) => {

      // 1. check if valid json
      try {
        const parsedSchema: Record<string, any> = JSON.parse(newSchema)

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
    removeField: (id: string) => {
      set(p(state => {
        const {jsonSchema} = state
        delete jsonSchema.properties[id]
        return state
      }))
    },
    addField: (key) => {
      set(p(state => {
        const {jsonSchema} = state
        jsonSchema.properties[key] = createDefaultSchema(key)
        return state
      }))
    }
  }

})

store.getState().set(jsonSchema)

return store
}
