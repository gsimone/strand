import { createSchemaStore, SchemaStatus, createDefaultFieldSchema } from '../../store/schema'

describe('Validity', () => {
  test("Should correctly set the new schema when valid", () => {
    const schema = require('./__fixtures__/valid.json')
    const store = createSchemaStore(JSON.stringify(schema, null, '  '))
    
    expect(store.getState().status).toBe(SchemaStatus.VALID)
  })
  
  test("Should fail when schema isn't valid", () => {
    const schema = require('./__fixtures__/invalid-type.json')
    const store = createSchemaStore(JSON.stringify(schema, null, '  '))
  
    expect(store.getState().status).toBe(SchemaStatus.INVALID)
    expect(store.getState().error.message).toBe("schema is invalid: data.type should be equal to one of the allowed values, data.type should be array, data.type should match some schema in anyOf")
    expect(store.getState().jsonSchema).toBe(null)
  })
})


describe("Examples validation", () => {
  test("Should error when schema can't validate examples", () => {
    const schema = require('./__fixtures__/invalid-example.json')
    const store = createSchemaStore(JSON.stringify(schema, null, '  '))
  
    expect(store.getState().status).toBe(SchemaStatus.INVALID)
  })
  
  test("Should skip example validation if no examples are found in the json", () => {
    const schema = require('./__fixtures__/valid.json')
    const store = createSchemaStore()
  
    delete schema.examples
  
    store.getState().set(JSON.stringify(schema, null, '  '))
  
    expect(store.getState().status).toBe(SchemaStatus.VALID)
  })

  test("Should skip example validation if examples is empty", () => {
    const schema = require('./__fixtures__/valid.json')
    const store = createSchemaStore()
  
    schema.examples = []

    store.getState().set(JSON.stringify(schema, null, '  '))
  
    expect(store.getState().status).toBe(SchemaStatus.VALID)
  })
})

describe("Field manipulation", () => {

  test("Should remove a field", () => {

    const schema = require('./__fixtures__/valid.json')
    const store = createSchemaStore(JSON.stringify(schema, null, '  '))

    store.getState().removeField("wise-horse-48")
    
    expect(store.getState().jsonSchema.properties["wise-horse-48"]).toBeUndefined()

  })

  test("Should add a field", () => {

    const schema = require('./__fixtures__/valid.json')
    const store = createSchemaStore(JSON.stringify(schema, null, '  '))

    store.getState().addField("new-field")
   
    expect(store.getState().jsonSchema.properties["new-field"]).toEqual(createDefaultFieldSchema('new-field'))

  })

  test("Should set a field schema", () => {

    const schema = require('./__fixtures__/valid.json')
    const store = createSchemaStore(JSON.stringify(schema, null, '  '))

    const {addField, setFieldSchema} = store.getState()
    addField("new-field")
    setFieldSchema("new-field", {
      type: "object"
    })

    expect(store.getState().status).toBe(SchemaStatus.VALID)
    expect(store.getState().jsonSchema.properties["new-field"].type).toBe("object")

  })

})
