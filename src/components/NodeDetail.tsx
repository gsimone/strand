import * as React from 'react'
import { useStore } from "../store";

function NodeDetails({ id }) {
  const useNode = useStore(store => store.nodes.get(id))!
  const node = useNode()


  return (<div>
    {node.fields.map(field => <div key={field}>{field}</div>)}
  </div>)
}

export default NodeDetails
