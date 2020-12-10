import React, { useCallback, useRef } from "react";

import { Link, useRoute } from 'wouter';

import NodePosition from './NodePosition'
import Field from './Field'

import clsx from "clsx";
import Edit from "icons/edit";
import CircleAdd from "icons/circle-add";

import { useStore, NodeStore } from '../store';

type NodeProps = {
  useNode: NodeStore;
};

function Node({ useNode }: NodeProps) {
  const removeNode = useStore(state => state.removeNode)
  const { id, name, fields, addField } = useNode();
  const [match, params] = useRoute("/nodes/:id")

  const nodeRef = useRef<HTMLDivElement>(null);

  const handleAddField = useCallback(() => {
    addField();
  }, [addField]);

  const active = match && (params!.id === id)

  return (
    <div
      className={
        clsx("rounded-lg w-64 bg-gray-800 bg-opacity-75 fixed top-0 z-10 overflow-hidden", 
        "border-2",
        !active && `border-gray-900`,
        active && `border-green-500`
        )
      }
      style={{ transform: `translate3d(0, 0, .1)` }}
      ref={nodeRef}
    >
        <NodePosition id={id} nodeRef={nodeRef}>
          <div className="flex justify-between text-xs font-bold py-2 pb-1 px-4 bg-gray-100 text-gray-800" >
            <span>{name}</span>

            <div className="space-x-2 flex ">
              <span className="w-4 h-4">
                <button onClick={() => removeNode(id)}>X</button>
              </span>
                
              <span className="w-4 h-4">
                <Link href={`/nodes/${id}`}>
                  <a href={`/nodes/${id}`}><Edit /></a>
                </Link>
              </span>
            </div>

           
          </div>
        </NodePosition>

      <div className="mt-2 p-2 ">
        {fields.map((id, i) => (
          <Field id={id} key={id} useNode={useNode} />
        ))}
        <button
          onClick={handleAddField}
          className="mt-4 text-gray-600 hover:text-green-500 w-4 h-4 m-auto block"
        >
          <CircleAdd />
        </button>
      </div>
    </div>
  );
}

export default function ConnectedNode({ id }) {
  const useNode = useStore((store) => store.nodes.get(id));

  if (typeof useNode !== "undefined") return <Node useNode={useNode!} />;

  return null;
}
