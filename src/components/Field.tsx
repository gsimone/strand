import React, { useCallback, useEffect, useRef } from "react";
import Connector from "./Connector";

import { ConnectorDirection, ID, SchemaStore } from "../store";
import { useStore } from "../store";

type FieldProps = {
  id: ID;
  nodeId: ID;
  useSchema: SchemaStore;
};

function Field({ id, nodeId, useSchema }: FieldProps) {
  const removeField = useSchema(state => state.removeField)
  const removeConnections = useStore(state => state.removeFieldConnections)

  const handleRemove = useCallback(() => {
    removeConnections(id, nodeId)
    removeField(id)
  }, [removeConnections, removeField, id, nodeId])
  
  const setFieldSchema = useSchema(store => store.setFieldSchema)
  const title = useSchema(store => store.getFieldSchema(id).title)

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef!.current!.focus();
    }
  }, []);

  const handleNameChange = useCallback(
    (e) => {
      setFieldSchema(id, {
        title: e.target.value
      });
    },
    [setFieldSchema, id]
  );

  return (
    <div key={id} className="flex space-x-2 items-center">
      <Connector
        node={nodeId}
        field={id}
        direction={ConnectorDirection.input}
      />
      <div className="flex-1">
        <div className="relative group flex items-center">
          <input
            ref={inputRef}
            className="flex-1 p-1 px-2 bg-transparent"
            value={title}
            onChange={handleNameChange}
          />
          <button
            tabIndex={-1}
            className="font-bold text-red-600 text-xs absolute right-0 mr-3 opacity-0 group-hover:opacity-100"
            onClick={handleRemove}
          >
            Delete
          </button>
        </div>
      </div>
      <Connector
        node={nodeId}
        field={id}
        direction={ConnectorDirection.output}
      />
    </div>
  );
}

export default function ConnectedField({ id, nodeId }) {
  const useSchema = useStore(state => state.schemas.get(nodeId))!

  if (typeof useSchema !== "undefined")
    return <Field id={id} useSchema={useSchema} nodeId={nodeId} />;

  return null;
}
