import * as React from 'react'
import { useStore } from "../store";

function NodeDetails({ id }) {
  const useNode = useStore(store => store.nodes.get(id))!
  const node = useNode()

  const useSchema = useStore(store => store.schemas.get(id))!
  const jsonSchema = useSchema(state => state.jsonSchema)

  return (<div>

    <pre className="p-2">
      {JSON.stringify(jsonSchema, null, '  ')}
    </pre>

    {node.fields.map(field => <div key={field}>{field}</div>)}
  </div>)
}

export default NodeDetails
