
import { atom, useAtom } from 'jotai';
import React, {useRef, useEffect, useCallback, useMemo, useLayoutEffect} from 'react' 
import throttle from 'lodash.throttle'

import { Connection, connectionsAtom, connectorsRef, nodesAtom } from '../atoms';
import produce from 'immer';

type ClientRect = {
  x: number,
  y: number,
  width: number,
  height: number
}

function decimalPlaces(num) {
  return Math.round(num * 100) / 100
}

function calcLine(a: ClientRect, b: ClientRect): number[] {

  // @ts-ignore
  const { x, y, width, height } = a
  // @ts-ignore
  const { x: bx, y: by } = b

  return [
    decimalPlaces(x + width / 2),
    decimalPlaces(y + height / 2),
    decimalPlaces(bx + width / 2),
    decimalPlaces(by + height / 2),
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
  const interactivePathRef = useRef<SVGPathElement>(null)
  const draw = useCallback(throttle(() => {
      const [input, output] = connection 
      
      // @ts-expect-error
      const inputRef = connectorsRef.current[input];
      // @ts-expect-error
      const outputRef = connectorsRef.current[output];

      if (typeof inputRef === "undefined" || typeof outputRef === "undefined") {
        return
      }

      // @ts-expect-error
      const [x, y, x2, y2] = calcLine(inputRef.current.getBoundingClientRect(), outputRef.current.getBoundingClientRect())

      const line = `
        M${x},${y} 
        C${(x + x2) / 2},${y} 
        ${(x2 + x) / 2},${y2} 
        ${x2},${y2}
      `
      
      pathRef.current!.setAttribute( 'd', line );
      interactivePathRef.current!.setAttribute( 'd', line );
        
    }), 
    [connection]
  )

  useLayoutEffect(() => {
    draw()
  })

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
    <g className="cursor-pointer hover:text-red-500 ">
      <path ref={pathRef} strokeWidth={2} className={`stroke-current`} />
      <path ref={interactivePathRef} strokeWidth={15} style={{ opacity: 0 }} onContextMenuCapture={removeConnection} />
    </g>
  )

}
