import React, { useCallback, useEffect, useRef } from 'react'
import { useAtom } from 'jotai'
import clsx from 'clsx'

import { connectionStateAtom, connectionsAtom, connectorsAtom, createConnection } from '../atoms'
import produce from 'immer';

export default function Connector({ node, field, direction }) {
  const connectorRef = useRef()
  const [{ connecting, input, output }, setConnectionState] = useAtom(connectionStateAtom);
  const [, setConnections] = useAtom(connectionsAtom)
  const [, setConnectors] = useAtom(connectorsAtom)

  /**
   * Register the connector ref, will be used to draw the connection lines
   */
  useEffect(() => {

    setConnectors(produce(connectors => {
      connectors[`${node}-${field}-${direction}`] = connectorRef
    }))
    
  }, [direction, node, field, setConnectors])
  
  const disabled = (input && direction === "input") || (output && direction === "output")
  const active = (input === field)

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
          border-2 bg-gray-700 
          group-hover:visible 
          rounded-full
        `, 
        !disabled && !active && `
          hover:border-green-600
        `,
          disabled && `
            opacity-50
            cursor-not-allowed
          `, 
          active && `
            border-green-400
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
