
import { useAtom } from 'jotai';
import React, {useRef, useEffect } from 'react' 

import { connectionsAtom } from '../atoms';

import Strand from './Strand'

export default function Canvas() {
  const [connections] = useAtom(connectionsAtom)
  console.log(connections)
  // const [{ connecting, origin }] = useAtom(connectionStateAtom)
  const svg = useRef<SVGSVGElement>(null);
  
  const mouse = useRef<number[]>([0, 0])
  
  // const draw = useCallback(
  //   function draw() {
  //     const coords = connections.map(connection => {
  //       const [input, output] = connection 
        
  //       // @ts-expect-error
  //       const inputRef = connectorsRef.current[input];
  //       // @ts-expect-error
  //       const outputRef = connectorsRef.current[output];
        
  //       // @ts-expect-error
  //       return calcLine(inputRef.current.getBoundingClientRect(), outputRef.current.getBoundingClientRect())
  //     })

  //     if (connecting) {

  //       const fakeLine =  calcLine(
  //         // @ts-expect-error
  //         connectorsRef.current[makeConnectorId(origin)].current.getBoundingClientRect(),
  //         { x: mouse.current[0], y: mouse.current[1], width: 10, height: 10 }, 
  //       )

  //       coords.push(fakeLine)
  //     }

      
  //   },
  //   [connecting, connections, origin]
  // );

  useEffect(() => {
    function handleMouse(e: MouseEvent) {
      mouse.current = [e.clientX, e.clientY] 
    }
    
    document.addEventListener('mousemove', handleMouse)

    return () => document.removeEventListener('mousemove', handleMouse)
  }, [])

  return (
    <svg
      ref={svg}
      style={{
        top: 0,
        left: 0,
        position: "fixed",
        width: "100vw",
        height: "100vw",
        stroke: "white",
        strokeWidth: 2,
        fill: "none",
        zIndex: 1,
      }}
    >
      {connections.map((connection, i) => (<Strand key={connection.join('.')} connection={connection} />))}
    </svg>
  );
}
