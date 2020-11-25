import React, { useEffect } from "react";

import Node from './components/Node'
import Canvas from './components/Canvas'
import Toolbar from './components/Toolbar';

import { useStore } from './store';

import { initialState } from "./initial-state"

function Nodes() {
  const nodes = useStore(store => store.nodes)
  
  useEffect(() => {
    const { setInitialState } = useStore.getState()
    setInitialState(JSON.parse(initialState))
  },[])

  return (
    <div>
      {Array.from(nodes).map(([id], i) => <Node key={id} id={id} />)}
    </div>
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
      <div>
        <Canvas />
        <Nodes />
      </div>
      
      <Toolbar />
    </div>
  );
}

export default App;
