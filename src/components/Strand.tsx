
import { atom, useAtom } from 'jotai';
import React, {useRef, useEffect, useCallback, useMemo} from 'react' 
import throttle from 'lodash.throttle'

import { Connection, connectionsAtom, connectorsRef, nodesAtom } from '../atoms';
import produce from 'immer';

type ClientRect = {
  x: number,
  y: number,
  width: number,
  height: number
}

function calcLine(a: ClientRect, b: ClientRect): number[] {

  // @ts-ignore
  const { x, y, width, height } = a
  // @ts-ignore
  const { x: bx, y: by } = b

  return [
    x + width / 2,
    y + height / 2,
    bx + width / 2,
    by + height / 2,
  ];

}

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

export default function Strand({ connection }: StrandProps) {
  // this will rerender our component when involved nodes positions change
  // eslint-disable-next-line
  useAtom(useMemo(() => createConnectedNodesPositions(connection), [connection]))
  const [, setConnections] = useAtom(connectionsAtom)

  const pathRef = useRef<SVGPathElement>(null)
  const draw = useCallback(throttle(() => {
      const [input, output] = connection 
      
      // @ts-expect-error
      const inputRef = connectorsRef.current[input];
      // @ts-expect-error
      const outputRef = connectorsRef.current[output];
      // @ts-expect-error
      const [x, y, x2, y2] = calcLine(inputRef.current.getBoundingClientRect(), outputRef.current.getBoundingClientRect())

      pathRef.current!.setAttribute(
        'd', 
        `
          M${x},${y} 
          C${(x + x2) / 2},${y} 
          ${(x2 + x) / 2},${y2} 
          ${x2},${y2}
        `);
    }), 
    [connection]
  )

  useEffect(() => {
    draw()
  })

  const removeConnection = useCallback((e) => {
    e.preventDefault()
    
    setConnections(produce(connections => {
      connections = connections.filter(thisConnection => { 
        return connection[0] !== thisConnection[0] && connection[1] !== thisConnection[1]
      })

      return connections
    }))
  }, [connection, setConnections])

  return (<path ref={pathRef} onContextMenuCapture={removeConnection} className={`cursor-pointer hover:text-red-500 stroke-current`} />)

}
