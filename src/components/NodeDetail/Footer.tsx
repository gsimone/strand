import * as React from 'react'
import { ID, useStore } from "store";

type NodeDetailFooterProps = {
  id: ID;
}

function NodeDetailFooter({ id }: NodeDetailFooterProps) {

  const removeNode = useStore(state => state.removeNode)
  const handleDelete = React.useCallback(() => {
      if (window.confirm("Do you really want to delete this node?")) {
        removeNode(id)
      }
  }, [removeNode, id])

  return <div className="bg-gray-900 p-2 text-gray-500 flex justifyend sticky bottom-0">
    <button onClick={handleDelete}>
      Delete this node
    </button>
  </div>

}

export default NodeDetailFooter
