import { useAtom } from 'jotai'
import React, { useMemo, useCallback } from 'react'
import { Routes, Route, Link, useParams } from 'react-router-dom'
import produce from 'immer'

import {getNodeAtomById } from 'atoms'
import Close from 'icons/close'

function FieldDetail({ fieldAtom }) {

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
      <label for="email" className="block text-sm font-bold leading-5 text-white">Name</label>

      <div className="mt-1 relative rounded-md shadow-sm">
        <input value={name} onChange={(e) => handleChange(e, "name")} className="form-input" />
      </div>

      <label for="email" className="mt-6 block text-sm font-bold leading-5 text-white">Description</label>

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

function NodeDebug({ node }) {

  const [position] = useAtom(node.position)
  
  return (
    <div className="p-4 bg-black rounded-md">
      <h3 className="font-bold">Debug</h3>

      <h3>Position</h3>
      <pre>
        {JSON.stringify(position, null, '  ')}
      </pre>
    </div>
  )

}

function NodeDetail() {

  const { id } = useParams()
  const [nodeAtom] = useAtom(getNodeAtomById(id))
  const [node] = useAtom(nodeAtom)

  return (
      <div>
        <div className="flex justify-between items-center  mb-10">
          <h3 className="font-bold uppercase">{node.name}</h3>
          <div className="w-5 h-5">
          <Link to="/">
            <Close />
          </Link>
          </div>
        </div>

        <div className="divide-y divide-gray-700">
          {node.fields.map((fieldAtom, i) => <FieldDetail fieldAtom={fieldAtom} key={i} />)}
        </div>

        <NodeDebug node={node} />
        
      </div>
  )

}

function NodeDetails() {
  return (
    <div className="fixed right-0 top-0 bottom-0 m-4 rounded-md shadow-md bg-gray-800 text-white max-w-xl w-full z-10 p-6">
      <Routes>
      <Routes>
        <Route path="/" element={<div>No node selected</div>} />
        <Route path=":id" element={<NodeDetail />} />
      </Routes>
      </Routes>
    </div>
  )

}

export default NodeDetails
