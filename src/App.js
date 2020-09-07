import React, { useCallback } from "react";
import { Provider as Jotai, useAtom } from 'jotai'

import { createNodeAtom, connectionStateAtom, nodesAtom, connectionsAtom } from './atoms'

import Node from './components/Node'
import Canvas from './components/Canvas'

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

    <h3>Connections</h3>
    <pre>
      {JSON.stringify(connections, null, '  ')}
    </pre>
    {nodes.map((node) => <Node nodeAtom={node} key={node.id} />)}
    <div>
        {/* eslint-disable-next-line */}
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={onAdd}> 🆕 Add node</button>
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
        <Canvas />
      </Jotai>
    </div>
  );
}

export default App;
