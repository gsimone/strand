import React, { useEffect } from "react";

import Node from './components/Node'
import Canvas from './components/Canvas'
import Toolbar from './components/Toolbar';

import { useStore } from './store';

import { initialState } from "./initial-state"
import { useRoute } from "wouter";

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

function NodeDetails({ id }) {

  return <div className="h-screen w-64 bg-gray-900 text-white fixed right-0 top-0 z-20 p-4">
   {id} 
  </div>

}

function App() {
  const [match, params] = useRoute("/nodes/:id");

  console.log(match, params)

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

      {(match && params) && <NodeDetails id={params.id}></NodeDetails>}
      
      <Toolbar />
    </div>
  );
}

export default App;
