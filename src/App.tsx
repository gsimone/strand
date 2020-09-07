import React, { useCallback } from "react";
import { Provider as Jotai, useAtom } from 'jotai'

import { createNodeAtom, nodesAtom } from './atoms'

import Node from './components/Node'
import Canvas from './components/Canvas'

function Nodes() {
  const [nodes, setNodes] = useAtom(nodesAtom);

  const onAdd = useCallback(() => {
    setNodes(state => [ ...state, createNodeAtom({ id: new Date().getTime() }) ])
  }, [setNodes])

  return (
    <>
      {nodes.map((node, i) => <Node nodeAtom={node} />)}
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
