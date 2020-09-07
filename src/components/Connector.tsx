import React, { useCallback, useEffect, useRef } from 'react'
import { useAtom } from 'jotai'
import clsx from 'clsx'

import { 
  connectionStateAtom, 
  connectionsAtom, 
  createConnection,
  makeConnectorId,
  connectorsRef,
  ConnectorDirection
} from '../atoms'

import produce from 'immer';

type ConnectorProps = {
  node: string,
  field: string,
  direction: ConnectorDirection
}

export default function Connector({ node, field, direction }: ConnectorProps) {
  const connectorRef = useRef<HTMLDivElement>(null)
  
  const [connectionState, setConnectionState] = useAtom(connectionStateAtom);
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
  const active = true
  
  /**
   * The node is a candidate if we are connecting and it's not disabled 
   */
  const candidate = connecting && !disabled

  const handleClick = useCallback((field, direction) => {

    if (disabled) return
    
    /**
     * If we are already connecting, close a connection
     */
    if (connecting === true) {
      setConnectionState({ connecting: false, origin: null })
      setConnections(produce(state => {
        state.push(createConnection(origin!, {field, node,direction}))
      }))
    }  else {
      setConnectionState(produce(state => {
        state.connecting = true
        state.origin = { field, node, direction }
      }))
    }
    
  }, [connecting, disabled, node, origin, setConnectionState, setConnections])

  return (
    <div
      className={
        clsx(`
          cursor-pointer w-2 h-2 
          
          group-hover:visible 
          rounded-full

          border-2
        `, 
        false && `
          hover:border-green-600
          bg-gray-700 
        `,
          disabled && `
            cursor-not-allowed
          `, 
          active && `
            border-orange-300
            bg-orange-300
          `,
          candidate && `
            border-blue-600
            hover:bg-blue-600
          `
        )
      }
      ref={connectorRef}
      onMouseDown={() => { 
        handleClick(field, direction)
      }}
    />
  );
}
