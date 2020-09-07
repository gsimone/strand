import React, { useCallback, useEffect, useRef } from 'react'
import { useAtom } from 'jotai'
import clsx from 'clsx'

import { 
  connectionStateAtom, 
  connectionsAtom, 
  connectorsRef, 
  createConnection,
  makeConnectorId
} from '../atoms'



import produce from 'immer';

export default function Connector({ node, field, direction }) {
  const connectorRef = useRef()
  const [connectionState, setConnectionState] = useAtom(connectionStateAtom);
  const [, setConnections] = useAtom(connectionsAtom)

  /**
   * Register the connector ref, will be used to draw the connection lines
   */
  useEffect(() => {
    connectorsRef.current[makeConnectorId(node, field, direction)] = connectorRef
  }, [direction, node, field])

  const { input, connecting, output } = connectionState

  // disable a connection when one the same direction is set
  const disabled = (input || output)?.node === node || (input && direction === "input") || (output && direction === "output")
  const active = (direction === "input" && input?.field === field) || (direction === "output" && output?.field === field)

  const candidate = connecting && !disabled && !active && (input || output).node !== node

  const handleClick = useCallback((field, direction) => {

    if (disabled) return
    if (input === field) return
    
    /**
     * If we are already connecting, close a connection
     */
    if (connecting === true) {

      setConnections(produce(connections => {
        const connection = direction === "input" ? createConnection({ field, node}, output) : createConnection(input, {field, node})
        connections.push(connection)
      }))
      
      setConnectionState({ connecting: false })
    } else {
      // Otherwise start a new connection and set the input/output

      setConnectionState(produce(draft => {
        draft.connecting = true
        draft[direction] = { field, node }
      }))

    }
    
  }, [connecting, disabled, input, node, output, setConnectionState, setConnections])

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
            opacity-50
            cursor-not-allowed
          `, 
          active && `
            border-orange-400
            bg-orange-400
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
