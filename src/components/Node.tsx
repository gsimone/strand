import React, { useCallback, useRef } from "react";

import NodePosition from './NodePosition'
import Field from './Field'

import clsx from "clsx";
import Edit from "icons/edit";
import CircleAdd from "icons/circle-add";
import { useStore, NodeStore } from '../store';

type NodeProps = {
  useNode: NodeStore
}

function Node({ useNode }: NodeProps) {
  const { id, name, fields, addField } = useNode();

  const nodeRef = useRef<HTMLDivElement>(null);

  const handleAddField = useCallback(() => {
    addField()
  }, [addField])

  const active = true

  return (
    <div
      className={
        clsx("rounded-lg overflow-hidden w-64 bg-gray-800 bg-opacity-75 fixed top-0 z-10", 
        !active && `border-2 border-gray-700 `,
        active && `border-3 border-green-500`)
      }
      style={{ transform: `translate3d(0, 0, .1)` }}
      ref={nodeRef}
    >
        <NodePosition id={id} nodeRef={nodeRef}>
          <div className="flex justify-between text-xs font-bold py-2 pb-1 px-4 bg-gray-100 text-gray-800" >
            <span>{name}</span>

            <span className="w-4 h-4">
              {/* <Link to={`nodes/${id}`}> */}
                <Edit />
              {/* </Link> */}
            </span>
          </div>
        </NodePosition>

        <div className="mt-2 p-2 ">
          {fields.map((id, i) => <Field id={id} key={id} useNode={useNode} />)}
          <button onClick={handleAddField} className="mt-4 text-gray-600 hover:text-green-500 w-4 h-4 m-auto block">
            <CircleAdd />
          </button>
        </div>
    </div>
  );
}


export default function ConnectedNode({ id }) {
  const useNode = useStore(store => store.nodes.get(id))

  if (typeof useNode !== "undefined") return <Node useNode={useNode!} /> 

  return null
} 
