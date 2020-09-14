import React from 'react'
import {useAtom } from 'jotai'
import { Node as NodeType } from '../../atoms'

type NodeDebugProps = {
  node: NodeType
}

function NodeDebug({ node }: NodeDebugProps) {

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

export default NodeDebug
