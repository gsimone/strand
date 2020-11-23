
import React, {useRef, useCallback, useMemo, useLayoutEffect, useState} from 'react' 
import { atom, useAtom } from 'jotai';
import produce from 'immer';

import { Connection, connectionsAtom, connectorsRef, nodesAtom } from '../atoms';

import { calcLine } from 'utils'

type StrandProps = {
  connection: Connection
}

function getNodeIDFromConnectionID(connectionID) {
  return connectionID.split('_')[0]
}

const createConnectedNodesPositions = (connection: Connection) => atom(get => {
  
  // get node ids 
  const connectedNodesIDs = connection.map(getNodeIDFromConnectionID)
  
  const nodes = get(nodesAtom)
  
  const connectedNodes = nodes.filter(nodeAtom => {
    const node = get(nodeAtom)
    // filter nodes if they are found in the connectedNodesIDs array
    return connectedNodesIDs.indexOf(`${node.id}`) > -1
  })

  const positions = connectedNodes.map(nodeAtom => {
    const node = get(nodeAtom)
    const position = get(node.position)
    return position
  })
  return [connectedNodes, positions]
})


type PureStrandProps = {
  points: number[] | undefined,
  onContextMenuCapture?: (e: any) => void,
  notInteractive?: boolean
}

export function PureStrand({ points, onContextMenuCapture, notInteractive }: PureStrandProps) {
  
  const pathRef = useRef<SVGGElement>(null)

  const draw = useCallback(() => requestAnimationFrame(() => {
    if (points) {
      const [x,y,x2,y2] = points
    
      const line = `
        M${x},${y} 
        C${(x + x2) / 2},${y} 
        ${(x2 + x) / 2},${y2} 
        ${x2},${y2}
      `
      
      pathRef.current!.children[0].setAttribute('d', line)
      pathRef.current!.children[1].setAttribute('d', line)
    }
    }), 
    [points]
  )

  useLayoutEffect(() => {
    draw()
  })

  return (
    <g className={notInteractive ? "" : "cursor-pointer hover:text-red-500"}  ref={pathRef}>
      <path strokeWidth={2} className={`stroke-current`} />
      <path strokeWidth={15} style={{ opacity: 0 }} onContextMenuCapture={onContextMenuCapture} />
    </g>
  )

}

export default function Strand({ connection }: StrandProps) {
  // this will rerender our component when involved nodes positions change
  useAtom(useMemo(() => createConnectedNodesPositions(connection), [connection]))
  const [, setConnections] = useAtom(connectionsAtom)

  /**
   * This hacks around the refs not being available at first
   */
  const [, set] = useState(false)
  useLayoutEffect(() => {
    set(true)
  }, [connection])

  const [input, output] = connection 
    
  const inputRef = connectorsRef!.current![input];
  const outputRef = connectorsRef!.current![output];

  let points = undefined

  if (inputRef && outputRef) {
    // @ts-expect-error
    points = calcLine( inputRef.current.getBoundingClientRect(), outputRef.current.getBoundingClientRect() )
  }

  const removeConnection = useCallback((e) => {
    e.preventDefault()
    
    setConnections(produce(connections => {
      connections = connections.filter(thisConnection => { 
        return connection[0] !== thisConnection[0] || connection[1] !== thisConnection[1]
      })

      return connections
    }))
  }, [connection, setConnections])

  return (
    <PureStrand points={points} onContextMenuCapture={removeConnection} />
  )

}
