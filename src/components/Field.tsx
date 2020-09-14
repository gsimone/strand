import React, { useCallback, useEffect, useRef } from "react";
import { PrimitiveAtom, useAtom } from 'jotai'

import Connector from './Connector'

import { ConnectorDirection, NodeField as FieldType } from '../atoms'
import produce from "immer";


type FieldProps = {
  fieldAtom: PrimitiveAtom<FieldType>,
  nodeId: string,
  onDelete: (deleteId) => void
}

function Field({ fieldAtom, nodeId, onDelete }: FieldProps) {

  const [{ id, name }, setField] = useAtom(fieldAtom)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef!.current!.focus()
  }, [])

  const handleChange = useCallback((e)=>{
    const value = e.target.value
    setField(produce(field => {
      field.name = value
    }))
  }, [setField])
  
  return (
    <div key={id} className="flex space-x-2 items-center group">
      <Connector node={nodeId} field={id} direction={ConnectorDirection.input} />
      <div className="flex-1 mb-2 group">
        <input ref={inputRef} className="bg-transparent" defaultValue={name} onChange={handleChange} />
        <div>
          <span className="text-xs text-gray-600">{id}</span> 
          <button className="opacity-25 group-hover:opacity-100 p-2" onClick={() => onDelete(id)}>Delete field</button>
        </div>
      </div>
      <Connector node={nodeId} field={id} direction={ConnectorDirection.output} />
    </div>
  )
}

export default Field
