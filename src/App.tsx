import React from "react";

import Node from './components/Node'
import Canvas from './components/Canvas'

import { useStore } from './store';
import Toolbar from './components/Toolbar';

function Nodes() {
  const nodes = useStore(store => store.nodes)

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
