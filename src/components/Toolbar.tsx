import React from 'react'
import { useStore } from '../store';

function Toolbar() {
  const addNode = useStore(state => state.addNode)
  const serialize = useStore(state => state.serialize)
  
  return (<div className="fixed top-0 left-0 right-0 h-12 bg-red-100 px-4 flex items-center space-x-4 z-10">
    <button onClick={addNode} className="p-2 bg-blue-600">Add node</button>
    <button onClick={serialize} className="p-2 bg-blue-600">Serialize</button>
  </div>)
}

export default Toolbar
