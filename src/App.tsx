import React, { useEffect } from "react";

import Node from "./components/Node";
import Canvas from "./components/Canvas";
import Toolbar from "./components/Toolbar";
import NodeDetail from "./components/NodeDetail";

import { useStore } from "./store";

import initialState from "./initial-state.json"
import { useRoute } from 'wouter';
import SchemaEditorModal from "components/SchemaEditor";
import { motion } from 'framer-motion';

function Nodes() {
  const nodes = useStore((store) => store.schemas);

  useEffect(() => {
    const { setInitialState } = useStore.getState();
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

function ConnectedNodeDetails({ id }) {
  const node = useStore(store => store.schemas.get(id))

  const animationSpring = {
    type: "tween",
    ease: [0.87, 0, 0.13, 1]
  }
  
  return  <motion.div
  initial={{ x: "100%" }}
  animate={{ x: "0%" }}
  transition={animationSpring}
  className="h-screen bg-gray-800 text-white fixed right-0 top-0 bottom-0 overflow-y-scroll z-20 p-4" style={{width: 600}}>
   {node ? <NodeDetail id={id} key={id} /> : <>Node not found</>}
  </motion.div>
}

function App() {
  const [matchesEditor] = useRoute("/nodes/:id/schema");
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
      {matchesEditor && <SchemaEditorModal />}
    </div>
  );
}

export default App;
