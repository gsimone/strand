import React from 'react'
import { Routes, Route } from 'react-router-dom'

import NodeDetail from './NodeDetail'

function NodeDetails() {
  return (
    <div className="fixed right-0 top-0 bottom-0 m-4 rounded-md shadow-md bg-gray-800 text-white max-w-xl w-full z-10 p-6">
      <Routes>
      <Routes>
        <Route path="/" element={<div>No node selected</div>} />
        <Route path=":id" element={<NodeDetail />} />
      </Routes>
      </Routes>
    </div>
  )

}

export default NodeDetails
