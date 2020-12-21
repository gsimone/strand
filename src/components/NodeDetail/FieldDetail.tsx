import * as React from 'react'
import { recognizeType, makeSchemaOfType } from 'utils'
import { ID, SchemaStore } from "store";

type FieldDetailsProps = {
  useSchema: SchemaStore,
  id: ID
}

function FieldDetails({ id, useSchema }: FieldDetailsProps) {
  const setFieldSchema = useSchema(store => store.setFieldSchema)
  const { title, description } = useSchema(store => store.getFieldSchema(id))!

  /* Initial type for the field-type select */
  const initialType = React.useMemo(() => {
    const schema = useSchema.getState().getFieldSchema(id)
    if (typeof schema !== "undefined") {
      return recognizeType(schema)
    }

    return 'string'
  }, [id, useSchema])

  const handleChange = React.useCallback(key => e => setFieldSchema(id, { [key]: e.target.value }), [setFieldSchema, id])
  const handleTypeChange = React.useCallback(e => setFieldSchema(id, makeSchemaOfType(e.target.value)), [setFieldSchema, id])

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
              onChange={handleChange("title")}
            value={title} 
          />
        </div>

        <div className="mb-4">
          <label htmlFor="fieldDescription" className="block text-sm font-medium text-gray-200">Description</label>
          <input type="text" 
            id="fieldDescription"
            className="
              mt-1 block w-full pl-3 pr-10 py-2 
              text-base border-gray-900 
              text-gray-100
              bg-gray-700
              focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm 
              rounded-md" 
              onChange={handleChange("description")}
            value={description} 
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

export default FieldDetails
