import React from 'react'
import { Link, useParams } from 'react-router-dom'
import { useAtom } from 'jotai'


import {getNodeAtomById } from 'atoms'
import Close from 'icons/close'

import FieldDetail from './FieldDetail'
import NodeDebug from './NodeDebug'

export default function NodeDetail() {

  const { id } = useParams()
  const [nodeAtom] = useAtom(getNodeAtomById(id))
  const [node] = useAtom(nodeAtom!)

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
