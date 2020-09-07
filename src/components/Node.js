import React from "react";
import { useAtom } from 'jotai'

import NodePosition from './NodePosition'
import Connector from './Connector'

export default function Node({ nodeAtom }) {
  const [{ position, name, fields, id }] = useAtom(nodeAtom);
  
  const nodeRef = React.useRef();

  return (
    <>
      <div
        className="border-2 border-gray-700 rounded-lg overflow-hidden w-64 bg-gray-800 bg-opacity-75 fixed top-0 z-10"
        style={{
          transform: `translate3d(0, 0, .1)`
        }}
        ref={nodeRef}
      >
          <NodePosition nodeRef={nodeRef} positionAtom={position} >
            <div className="text-xs font-bold py-2 px-6 bg-gray-100 text-gray-800" >
              {name}
            </div>
          </NodePosition>

          <div className="mt-2 p-2 ">
            {fields.map((field) => (
              <div className="flex space-x-2 items-center group">
                <Connector node={id} field={field.id} direction="input" />
                <div className="flex-1 mb-2">
                  {field.name}
                  <div className="text-xs text-gray-600">{field.id}</div>
                </div>
                <Connector node={id} field={field.id} direction="output" />
              </div>
            ))}
          </div>
      </div>
    </>
  );
}
