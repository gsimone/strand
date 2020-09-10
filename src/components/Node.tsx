import React, { SetStateAction, useCallback, useRef } from "react";
import { atom, useAtom, WritableAtom } from 'jotai'

import NodePosition from './NodePosition'
import Field from './Field'

import { Connection, connectionsAtom, createFieldAtom, Node as NodeType } from '../atoms'
import produce from "immer";
import { uuid } from "utils";

type NodeProps = {
  nodeAtom: WritableAtom<NodeType, SetStateAction<NodeType>>
}

const filterConnection = (id) => (connection: Connection) => connection.map(connectorId => connectorId.split('_')[1]).join('-').indexOf(id) < 0

const removeFieldAtom = (nodeAtom) => atom(null, (get, set, fieldId) => {
  // cleanup connections
  set(connectionsAtom, produce(connections => connections.filter(filterConnection(fieldId))))
  // remove field from node fields
  set(nodeAtom, produce(node => {
    node.fields = node.fields.filter(fieldAtom => {
      const { id } = get(fieldAtom)
      return id !== fieldId
    })
  }))
})

export default function Node({ nodeAtom }: NodeProps) {
  const [{ position, id, name, fields: fieldAtoms }, setNode] = useAtom(nodeAtom);
  const [, removeField] = useAtom(removeFieldAtom(nodeAtom))

  const nodeRef = useRef<HTMLDivElement>(null);

  const addField = useCallback(() => {
    setNode(produce(node => {
      node.fields.push(createFieldAtom({ id: uuid(), name: "New field "}))
    }))
  }, [setNode])

  const deleteField = useCallback((deleteId) => {
    // @ts-ignore
    removeField(deleteId)
  }, [removeField])

  return (
    <>
      <div
        className="border-2 border-gray-700 rounded-lg overflow-hidden w-64 bg-gray-800 bg-opacity-75 fixed top-0 z-10"
        style={{ transform: `translate3d(0, 0, .1)` }}
        ref={nodeRef}
      >
          <NodePosition nodeRef={nodeRef} positionAtom={position} >
            <div className="text-xs font-bold py-2 px-6 bg-gray-100 text-gray-800" >
              {name}
            </div>
          </NodePosition>

          <div className="mt-2 p-2 ">
            {fieldAtoms.map((field, i) => <Field onDelete={deleteField} nodeId={id} fieldAtom={field} key={i} />)}
            <button onClick={addField}>Add field</button>
          </div>
      </div>
    </>
  );
}
