import React, { useCallback } from 'react'
import { useAtom } from 'jotai'
import clsx from 'clsx'

import { connectionStateAtom, connectionsAtom, createConnection } from '../atoms'

export default function Connector({ parent, direction }) {
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
          createConnection(parent, output)
        ]))
      }  else {
        setConnections(connections => ([
          ...connections,
          createConnection(input, parent)
        ]))
      }
      
      setConnectionState({ connecting: false })
    } else {
      setConnectionState(state => ({ 
        ...state, 
        connecting: true, 
        [direction]: parent
     }))
    }
    
  }, [connecting, disabled, input, output, setConnectionState, setConnections])

  

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
