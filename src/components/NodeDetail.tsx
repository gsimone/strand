import * as React from 'react'

import { ID, SchemaStore, useStore } from "../store";
import { Link } from 'wouter';
import { createFileSchema } from '../store/schema';

type FieldDetailsProps = {
  useSchema: SchemaStore,
  id: ID
}

// this function will probably need to be different
function makeSchemaOfType(type) {

  if (type === "string") {
    return {
      "type": "string",
      "default": ""
    }
  }

  if (type === "number") {
    return {
      type,
      default: 0
    }
  }

  if (type === "file") {
    return createFileSchema("lorem-ipsum")
  }

  return {
    type: "object",
    default: {}
  }

}

function recognizeType(schema) {
  if (schema.type === "object") {
    if (typeof schema.properties === "undefined") return "object"
    if (schema.properties.hasOwnProperty("key") && schema.properties.hasOwnProperty("bucket")) {
      return "file"
    }

    return "object"
  }

  return schema.type

}

function FieldDetails({ id, useSchema }: FieldDetailsProps) {

  const useField = useStore(store => store.fields.get(id))!
  const {name, setValue} = useField()

  const setFieldSchema = useSchema(store => store.setFieldSchema)

  /* Initial type for the field-type select */
  const initialType = React.useMemo(() => {
    const schema = useSchema.getState().getFieldSchema(id)
    if (typeof schema !== "undefined") {
      return recognizeType(schema)
    }

    return ''
  }, [id, useSchema])

  const handleNameChange = React.useCallback((e) => {
    setValue({
      name: e.target.value
    })
  }, [setValue])
 
  const handleTypeChange = React.useCallback((e) => {
    setFieldSchema(id, makeSchemaOfType(e.target.value))
  }, [setFieldSchema, id])

  return (
    <div className="mb-8">
      <h3 className="text-lg font-bold mb-4">Field {id}</h3>

      <div>

        <div className="mb-4">
          <label htmlFor="fieldName" className="block text-sm font-medium text-gray-200">Name</label>
          <input type="text" 
            id="fieldName"
            className="
              mt-1 block w-full pl-3 pr-10 py-2 
              text-base border-gray-900 
              text-gray-100
              bg-gray-700
              focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm 
              rounded-md" 
              onChange={handleNameChange}
            value={name} 
          />
  
        </div>

        <div>
          <div>
            <label htmlFor="fieldType" className="block text-sm font-medium text-gray-200">Field Type</label>
            <select 
              id="fieldType" 
              name="fieldType" 
              onChange={handleTypeChange}
              defaultValue={initialType}
              className="
                mt-1 block w-full pl-3 pr-10 py-2 
                text-base border-gray-900 
                text-gray-100
                bg-gray-700
                focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
              <option value="string">string</option>
              <option value="number">number</option>
              <option value="file">file</option>
              <option value="object">object</option>
            </select>
          </div>
        </div>
        
      </div>
    </div>
  )
}

function NodeTitle({ useNode }) {
  const {name, id} = useNode()
  
  return <div className="mb-8">
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-bold">{name}</h2>
      <Link href="/">
        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
        <a>Close</a>
      </Link>
    </div>
    <Link href={`${id}/schema`}>
      {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
      <a className="hover:underline">Edit Node schema</a>
    </Link>
  </div>
}

function NodeDetails({ id }) {
  const useNode = useStore(store => store.nodes.get(id))!
  const fields = useNode(state => state.fields)
  const useSchema = useStore(store => store.schemas.get(id))!

  return (<div>
    <NodeTitle useNode={useNode} />

    {fields.map(field => <FieldDetails key={field} id={field} useSchema={useSchema} />)}
  </div>)
}

export default NodeDetails
