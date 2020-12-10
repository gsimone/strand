import * as React from 'react'

import { useStore } from "../store";
import { Link } from 'wouter';

function FieldDetails({ id, useSchema }) {
  
  return (
    <div className="mb-8">
      <h3 className="text-lg font-bold">Field {id} Schema</h3>
      <Link href={`${id}/edit`}>
        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
        <a className="hover:underline">Edit Field schema</a>
      </Link>
    </div>
  )
}

function NodeTitle({useNode}) {
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
