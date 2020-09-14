import React, { useCallback, useEffect, useRef } from 'react'
import { useAtom } from 'jotai'
import clsx from 'clsx'
import produce from 'immer';

import { 
  connectionStateAtom, 
  connectionsAtom, 
  createConnection,
  connectorsRef,
  ConnectorDirection,
  stopConnectingAtom
} from '../atoms'

import { makeConnectorId } from '../utils'

type ConnectorProps = {
  node: string,
  field: string,
  direction: ConnectorDirection
}

export default function Connector({ node, field, direction }: ConnectorProps) {
  const connectorRef = useRef<HTMLDivElement>(null)
  
  const [connectionState, setConnectionState] = useAtom(connectionStateAtom);
  const [, stopConnecting] = useAtom(stopConnectingAtom)
  const [, setConnections] = useAtom(connectionsAtom)

  /**
   * Register the connector ref, will be used to draw the connection lines
   */
  useEffect(() => {
    const id = makeConnectorId({ node, field, direction })
    // @ts-expect-error
    connectorsRef.current[id] = connectorRef
  }, [direction, node, field])

  const { connecting, origin } = connectionState

  // disable a connection when one the same direction is set
  const disabled = origin?.node === node || origin?.direction === direction;
  const active = origin?.node === node && origin?.direction === direction;
  
  /**
   * The node is a candidate if we are connecting and it's not disabled 
   */
  const candidate = connecting && !disabled && direction !== origin?.direction

  const handleClick = useCallback((field, direction) => {

    if (disabled) return
    
    /**
     * If we are already connecting, close a connection
     */
    if (connecting === true) {
      // @TODO sub this with a reset atom
      // @ts-expect-error
      stopConnecting()
      setConnectionState({ connecting: false, origin: null, destination: null })
      setConnections(produce(state => {
        state.push(createConnection(origin!, {field, node,direction}))
      }))
    }  else {
      setConnectionState(produce(state => {
        state.connecting = true
        state.origin = { field, node, direction }
      }))
    }
    
  }, [connecting, disabled, node, origin, setConnectionState, setConnections, stopConnecting])

  const handleMouseEnter = useCallback(() => {
    if (connecting) {
      setConnectionState(produce(state => {
        state.destination = { field, node, direction }
      }))
    }
  }, [connecting, direction, field, node, setConnectionState])

  const handleMouseLeave = useCallback(() => {
    if (connecting) {
      setConnectionState(produce(state => {
        state.destination = null
      }))
    }
  }, [connecting, setConnectionState])

  return (
    <span 
      className={`
        flex
        w-2
        h-2
        cursor-pointer
        relative
        items-center
      `}
      ref={connectorRef}
    >
      <div className="absolute z-10 -m-2 w-6 h-6 rounded-full opacity-25"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseDownCapture={(e) => { 
          handleClick(field, direction)
          e.preventDefault()
        }}
      />
      {candidate && <span className="animate-ping absolute inline-flex h-4 w-4 -ml-1 rounded-full bg-orange-400 opacity-75"></span>}
      <span 
        className={ clsx(
          `relative inline-flex rounded-full h-2 w-2 border`, 
          !active && !candidate && !disabled && `hover:border-green-500`,
          candidate && `border-orange-500 hover:bg-orange-500`,
          active && `bg-green-500 border-green-500`
        )}
      />
    </span>
  );
}
