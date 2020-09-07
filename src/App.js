import React, { useCallback } from "react";
import { Provider as Jotai, useAtom } from 'jotai'

import { createNodeAtom, connectionStateAtom, nodesAtom, connectionsAtom } from './atoms'

import Node from './components/Node'

function Nodes() {
  const [nodes, setNodes] = useAtom(nodesAtom);
  const [{ connecting }] = useAtom(connectionStateAtom)
  const [connections] = useAtom(connectionsAtom)

  const onAdd = useCallback(() => {
    setNodes(state => [ ...state, createNodeAtom(new Date().getTime()) ])
  }, [setNodes])

  return (
    <>
    <h1>
      Connecting: {connecting ? "✅" : "⛔"}
    </h1>
    <pre>
      {JSON.stringify(connections, null, '  ')}
    </pre>
    {nodes.map((node) => <Node nodeAtom={node} key={node.id} />)}
    <div>
        <button onClick={onAdd}>Add node</button>
    </div>
    </>
  )
  
}

function App() {
  return (
    <div
      className="
        h-screen 
        w-screen 

        bg-gray-900 
        text-white 
        
        justify-center 

        text-xs
      "
    >
      <Jotai>
        <Nodes />
      </Jotai>
    </div>
  );
}

export default App;
