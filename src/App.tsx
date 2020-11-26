import React, { useEffect } from "react";

import Node from "./components/Node";
import Canvas from "./components/Canvas";
import Toolbar from "./components/Toolbar";

import { useStore } from "./store";

import initialState from "./initial-state.json"
import { useRoute, Link } from 'wouter';

function Nodes() {
  const nodes = useStore((store) => store.nodes);

  useEffect(() => {
    const { setInitialState } = useStore.getState();
    // @ts-expect-error
    setInitialState(initialState);
  }, []);

  return (
    <div>
      {Array.from(nodes).map(([id], i) => (
        <Node key={id} id={id} />
      ))}
    </div>
  );
}

function NodeDetails({ id }) {
  const useNode = useStore(store => store.nodes.get(id))!
  const node = useNode()
  
  return <>{node.fields.map(field => <div key={field}>{field}</div>)}</>
}


function ConnectedNodeDetails({ id }) {
  const node = useStore(store => store.nodes.get(id))

  return  <div className="h-screen w-64 bg-gray-900 text-white fixed right-0 top-0 z-20 p-4">
   <h3>Edit {id} - <Link href="/"><a href="/">Close</a></Link></h3>
   {node ? <NodeDetails id={id} /> : <>Node not found</>}
  </div>
}

function App() {
  const [match, params] = useRoute("/nodes/:id");

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

      {(match && params) && <ConnectedNodeDetails id={params.id}></ConnectedNodeDetails>}
      
      <Toolbar />
    </div>
  );
}

export default App;
