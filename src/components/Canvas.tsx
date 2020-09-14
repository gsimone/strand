
import { useAtom } from 'jotai';
import React, { useRef, useEffect, useState, useCallback } from 'react' 

import { connectionsAtom, connectionStateAtom, stopConnectingAtom, connectorsRef } from 'atoms';
import {makeConnectorId, calcLine} from 'utils'

import Strand, {PureStrand} from './Strand'
import { createPortal } from 'react-dom';

function TempLine() {
  const [{ connecting, origin, destination }] = useAtom(connectionStateAtom)
  const [, stopConnecting] = useAtom(stopConnectingAtom)
  
  const [points, setPoints] = useState([])
  const pointer = useRef<HTMLDivElement>(null)
  
  const cancel = useCallback((e) => {
    e.preventDefault()
    // @ts-expect-error
    stopConnecting()
  }, [stopConnecting])
  
  useEffect(() => {
    function handleMouse(e: MouseEvent) {
      if (connecting) {

        // @ts-expect-error
        const originPoint = connectorsRef.current[makeConnectorId(origin!)].current.getBoundingClientRect()

        let candidatePoint = { x: e.clientX, y: e.clientY }

        // snap
        if (destination) {
          // @ts-expect-error
          candidatePoint = connectorsRef.current?.[makeConnectorId(destination!)]!.current.getBoundingClientRect()

          pointer.current!.style.transform = `
            translate3D(${candidatePoint.x + 4}px, ${candidatePoint.y + 4}px, 0px)
          `

          setPoints(
            // @ts-expect-error
            calcLine(originPoint, { x: candidatePoint.x + 4, y: candidatePoint.y + 4 })
          )
          
        } else {
          pointer.current!.style.transform = `
            translate3D(${candidatePoint.x}px, ${candidatePoint.y}px, 0px)
          `
          const offset = { x: originPoint.x > candidatePoint.x ? 8 : -8, y: 0 }

          setPoints(
            // @ts-expect-error
            calcLine(originPoint, { x: candidatePoint.x + offset.x, y: candidatePoint.y + offset.y })
          )
        }
        
        
      }
    }
    
    document.addEventListener('mousemove', handleMouse)
    document.addEventListener('contextmenu', cancel)

    return () => {
      document.removeEventListener('mousemove', handleMouse)
      document.removeEventListener('contextmenu', cancel)
    }
  }, [cancel, connecting, destination, origin])
  
  return (
    <>
      {createPortal(<div ref={pointer} className="pointer-events-none fixed z-10 w-4 h-4 top-0 left-0 rounded-full -m-2 border-2 border-white" />, document.querySelector('#test')!)}
      <PureStrand points={points} notInteractive />
    </>
  )

}

export default function Canvas() {
  const [connections] = useAtom(connectionsAtom)
  const [{ connecting }] = useAtom(connectionStateAtom)
  const svg = useRef<SVGSVGElement>(null);

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
      {connecting && <TempLine />}
    </svg>
  );
}
