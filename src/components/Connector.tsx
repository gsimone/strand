import React, { useCallback, useEffect, useRef } from 'react'
import { useAtom } from 'jotai'
import clsx from 'clsx'

import { 
  connectionStateAtom, 
  connectionsAtom, 
  connectorsAtom, 
  createConnection,
  makeConnectorId
} from '../atoms'

import produce from 'immer';

export default function Connector({ node, field, direction }) {
  const connectorRef = useRef<HTMLDivElement>(null)
  const [connectionState, setConnectionState] = useAtom(connectionStateAtom);
  const [, setConnections] = useAtom(connectionsAtom)
  const [connectors, setConnectors] = useAtom(connectorsAtom)

  /**
   * Register the connector ref, will be used to draw the connection lines
   */
  useEffect(() => {

    const id = makeConnectorId(node, field, direction)

    console.log("add new connector ", id)
    
    setConnectors(connectors => ({
      ...connectors,
      [id]: connectorRef
    }))
    
  }, [direction, node, field, setConnectors])

  const { input, connecting, output } = connectionState

  // disable a connection when one the same direction is set
  const disabled = (input || output)?.node === node
  const active = (direction === "input" && input?.field === field) || (direction === "output" && output?.field === field)

  /**
   * The node is a candidate if we are connecting and it's not disabled 
   */
  const candidate = connecting && !disabled && (input || output).node !== node

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
      
      setConnectionState({ connecting: false, input: undefined, output: undefined })
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
