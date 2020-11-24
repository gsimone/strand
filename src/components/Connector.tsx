import React, { useCallback, useEffect, useRef } from 'react'
import clsx from 'clsx'
import produce from 'immer';

import { makeConnectorId } from '../utils'
import { useConnectionStore, ConnectorDirection, useStore, useConnectorsStore } from '../store';

type ConnectorProps = {
  node: number,
  field: number,
  direction: ConnectorDirection
}

export default function Connector({ node, field, direction }: ConnectorProps) {
  const connectorRef = useRef<HTMLDivElement>(null)
  const [registerConnector, unregisterConnector] = useConnectorsStore(state => [state.registerConnector, state.unregisterConnector])
  const connectorId = makeConnectorId({ node, field, direction })

  useEffect(() => {
    registerConnector(connectorId, connectorRef)
    return () => unregisterConnector(connectorId)
  }, [connectorId, registerConnector, unregisterConnector])
  
  const addConnection = useStore(store => store.addConnection)
  const { origin, connecting, startConnecting } = useConnectionStore()

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
      addConnection(origin!, {field,node,direction})
    }  else {
      startConnecting({ field, node, direction })
    }
    
  }, [addConnection, connecting, disabled, node, origin, startConnecting])

  const handleMouseEnter = useCallback(() => {
    if (connecting) {
      useConnectionStore.setState(produce(state => {
        state.destination = { field, node, direction }
      }))
    }
  }, [connecting, direction, field, node])

  const handleMouseLeave = useCallback(() => {
    if (connecting) {
      useConnectionStore.setState(produce(state => {
        state.destination = null
      }))
    }
  }, [connecting])

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
          disabled && !active && `opacity-50 transform scale-50`,
          active && `bg-green-500 border-green-500`,
        )}
      />
    </span>
  );
}
