import React, { useCallback, useEffect, useRef } from "react";
import Connector from "./Connector";

import { ConnectorDirection, FieldStore, NodeStore } from "../store";
import { useStore } from "../store";

type FieldProps = {
  useField: FieldStore;
  useNode: NodeStore;
};

function Field({ useField, useNode }: FieldProps) {
  const nodeId = useNode((state) => state.id);
  const { id, name, setValue } = useField();
  const removeField = useNode((state) => state.removeField);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => console.log("unmounting Field");
  }, []);

  useEffect(() => {
    if (inputRef.current) {
      inputRef!.current!.focus();
    }
  }, []);

  const handleNameChange = useCallback(
    (e) => {
      const value = e.target.value;
      setValue({
        name: value,
      });
    },
    [setValue]
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
            value={name}
            onChange={handleNameChange}
          />
          <button
            tabIndex={-1}
            className="font-bold text-red-600 text-xs absolute right-0 mr-3 opacity-0 group-hover:opacity-100"
            onClick={() => removeField(id)}
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

export default function ConnectedField({ id, useNode }) {
  const useField = useStore((state) => state.fields.get(id));

  if (typeof useField !== "undefined")
    return <Field useField={useField} useNode={useNode} />;

  return null;
}
