import React, { useCallback } from 'react'
import { useAtom } from 'jotai'
import clsx from 'clsx'

import { connectionStateAtom, connectionsAtom, createConnection } from '../atoms'
import produce from 'immer';

export default function Connector({ node, parent, direction }) {
  const [{ connecting, input, output }, setConnectionState] = useAtom(connectionStateAtom);
  const [, setConnections] = useAtom(connectionsAtom)

  const disabled = (input && direction === "input") || (output && direction === "output")
  const active = (input === parent)
  const handleClick = useCallback((parent, direction) => {

    if (disabled) return
    if (input === parent) return
    
    if (connecting === true) {

      if (direction === "input") {
        setConnections(connections => ([
          ...connections,
          createConnection({ field: parent, node }, output)
        ]))
      }  else {
        setConnections(produce(connections => {
          connections.push(createConnection(input, {field: parent, node}))
        }))
      }
      
      // we reset state 
      setConnectionState({ connecting: false })
    } else {

      setConnectionState(produce(draft => {
        draft.connecting = true
        draft[direction] = { field: parent, node }
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
      onMouseDown={() => { 
        handleClick(parent, direction)
      }}
    />
  );
}
