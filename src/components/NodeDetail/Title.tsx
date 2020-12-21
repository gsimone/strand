import * as React from 'react'
import { Link } from 'wouter';

function NodeTitle({ useSchema, id }) {
  const {title} = useSchema(store => store.jsonSchema)
  
  return <div className="mb-8">
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-bold">{title}</h2>
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

export default NodeTitle
