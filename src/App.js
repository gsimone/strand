import React, { useCallback, useEffect } from "react";
import { Provider as Jotai, useAtom } from 'jotai'

import { createNodeAtom, connectionStateAtom, nodesAtom, connectionsAtom } from './atoms'

import Connector from './components/Connector'
import Canvas from './components/Canvas'

function NodePosition({ nodeRef, positionAtom }) {
  const [position, setPosition] = useAtom(positionAtom)
  const offset = React.useRef();

  function startMoving(e) {
    const { x: originX, y: originY } = nodeRef.current.getBoundingClientRect();

    const [relX, relY] = [e.clientX - originX, e.clientY - originY];

    offset.current = [relX, relY];
    window.addEventListener("mousemove", handleMovement);
    window.addEventListener("mouseup", stopMoving);
  }

  function stopMoving(e) {
    window.removeEventListener("mousemove", handleMovement);
    window.removeEventListener("mouseup", stopMoving);
  }
  
  const handleMovement = React.useCallback((e) => {
    e.preventDefault();

    const [x, y] = [
      e.clientX - offset.current[0],
      e.clientY - offset.current[1],
    ];

    setPosition([x,y])

  }, [setPosition]);
  
  useEffect(() => {

    const [x,y] = position

    nodeRef.current.style.transform = `
    translate3d(
      ${x}px, 
      ${y}px, 
      0
    )
  `;
    
  }, [nodeRef, position])

  return (
    <div
      className="text-xs font-bold py-2 px-6 bg-gray-100 text-gray-800"
      onMouseDownCapture={startMoving}
    >
      Handle
    </div>
  )
}

function Node({ nodeAtom }) {
  const [myNode] = useAtom(nodeAtom);
  
  const nodeRef = React.useRef();

  return (
    <>
      <div
        className="border-2 border-gray-700 rounded-lg overflow-hidden w-64 bg-gray-800 bg-opacity-75 fixed top-0 z-10"
        style={{
          transform: `translate3d(0, 0, .1)`
        }}
        ref={nodeRef}
      >
          <NodePosition nodeRef={nodeRef} positionAtom={myNode.position} />
          <div className="text-xs font-bold py-2 px-6 bg-gray-100 text-gray-800" >
            {myNode.name}
          </div>

          <div className="mt-2 p-2 ">
            {myNode.fields.map((field) => (
              <div className="flex space-x-2 items-center group">
                <Connector parent={field.id} direction="input" />
                <div className="flex-1 mb-2">
                  {field.name}
                  <div className="text-xs text-gray-600">{field.id}</div>
                </div>
                <Connector parent={field.id} direction="output" />
              </div>
            ))}
          </div>
      </div>
    </>
  );
}

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
