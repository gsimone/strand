import React, { useCallback, useRef } from "react";

import { Link, useRoute } from 'wouter';

import NodePosition from './NodePosition'
import Field from './Field'

import clsx from "clsx";
import Edit from "icons/edit";
import CircleAdd from "icons/circle-add";

import { useStore, SchemaStore, ID } from '../store';

type NodeProps = {
  useSchema: SchemaStore;
  id: ID
};

function Node({ useSchema, id }: NodeProps) {
  const removeNode = useStore(state => state.removeNode)
  const addField = useSchema(state => state.addField)

  const name = useSchema(store => store.jsonSchema!.title)
  const fields = useSchema(store => store.jsonSchema!.properties)!

  const [match, params] = useRoute("/nodes/:id")

  const nodeId = id

  const nodeRef = React.useRef<HTMLDivElement>(null);

  const handleAddField = React.useCallback(() => {
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

            <div className="space-x-2 flex">
              <span className="w-4 h-4">
                <button tabIndex={-1} onClick={() => removeNode(id)}>X</button>
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
        {Object.keys(fields).map((id, i) => (
          <Field id={id} key={id} nodeId={nodeId} />
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
  const useSchema = useStore(store => store.schemas.get(id))

  if (typeof useSchema !== "undefined") return <Node id={id} useSchema={useSchema!} />;

  return null;
}
