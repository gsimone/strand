import React, { useCallback, useEffect, useState } from "react";
import { Provider as Jotai, useAtom } from 'jotai'
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';


import {  
  deserializeStateAtom, createNodeAtom, nodesAtom } from './atoms'
  
import Node from './components/Node'
import Canvas from './components/Canvas'
import NodeDetails from './components/NodeDetails'

import data from './data.json'

function Nodes() {
  const [nodes, setNodes] = useAtom(nodesAtom);

  const onAdd = useCallback(() => {
    setNodes(state => [ ...state, createNodeAtom({ id: new Date().getTime() }) ])
  }, [setNodes])

  return (
    <div>
      {nodes.map((node, i) => <Node key={i} nodeAtom={node} />)}
      <div>
        {/* eslint-disable-next-line */}
        <button className="relative z-20 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={onAdd}> 🆕 Add node</button>
      </div>
    </div>
  )
}

function LocalStateManager({ children }) {

  const [restored, set] = useState(false)
  const [, deserializeState] = useAtom(deserializeStateAtom)

  useEffect(() => {
    deserializeState(data)
    set(true)
  }, [deserializeState])
  
  return (restored ? children : "Loading")

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
        <LocalStateManager>
          <BrowserRouter>
            <Routes>
                <Route 
                  path="/" 
                  element={
                    <div>
                      <Canvas />
                      <Nodes />
                      <Outlet />
                    </div>
                  } 
                >
                  <Route path="/nodes/*" element={<NodeDetails />} />
                </Route>
              </Routes>
          </BrowserRouter>
        </LocalStateManager>
      </Jotai>
    </div>
  );
}

export default App;
