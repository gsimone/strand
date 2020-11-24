import React, { useCallback, useEffect, useState } from "react";
import { Provider as Jotai, useAtom } from 'jotai'
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';

import { deserializeStateAtom, createNodeAtom, nodesAtom } from './atoms'
  
import Node from './components/Node'
// import Canvas from './components/Canvas'
import NodeDetails from './components/NodeDetails/NodeDetails'

import data from './data.json'
import { useStore } from './store';

function Nodes() {
  const nodes = useStore(store => store.nodes)
  const addNode = useStore(store => store.addNode)

  return (
    <div>
      {Array.from(nodes).map(([id], i) => <Node key={id} id={id} />)}
      <div>
        {/* eslint-disable-next-line */}
        <button className="relative z-20 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={addNode}> 🆕 Add node</button>
      </div>
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
        {/* <Canvas /> */}
        <Nodes />
      </div>
    </div>
  );
}

export default App;
