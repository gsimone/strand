import React, { useCallback } from 'react'
import { PrimitiveAtom, useAtom } from 'jotai'
import produce from 'immer'
import { NodeField } from 'atoms'

type FieldDetailProps = {
  fieldAtom: PrimitiveAtom<NodeField>
}

function FieldDetail({ fieldAtom }: FieldDetailProps) {

  const [field, setField] = useAtom(fieldAtom)
  const { id, name, description } = field

  const handleChange = useCallback((e, key)=>{
    const value = e.target.value
    setField(produce(field => {
      field[key] = value
    }))
  }, [setField])
  
  return (
    <div className="mb-2 pb-4 pt-4">
      <label htmlFor="email" className="block text-sm font-bold leading-5 text-white">Name</label>

      <div className="mt-1 relative rounded-md shadow-sm">
        <input value={name} onChange={(e) => handleChange(e, "name")} className="form-input" />
      </div>

      <label htmlFor="email" className="mt-6 block text-sm font-bold leading-5 text-white">Description</label>

      <div className="mt-1 relative rounded-md shadow-sm">
        <textarea value={description} onChange={(e) => handleChange(e, "description")} className="form-input" />
      </div>

      <div className="mt-4 flex justify-between items-center">
        <div className="space-x-4">
          <button className="text-red-500 font-bold" disabled>
            Delete
          </button>

          <button className="font-bold" disabled>
            Duplicate
          </button>
        </div>

        <div className="text-gray-600 font-bold">
          {id}
        </div>
       
      </div>
    </div>
  )

}
export default FieldDetail
