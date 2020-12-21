import * as React from 'react'

import { useStore } from "store";

import FieldDetail from './FieldDetail'
import Footer from './Footer'
import Title from './Title'

function NodeDetails({ id }) {
  const useSchema = useStore(store => store.schemas.get(id))!
  const {properties} = useSchema(store => store.jsonSchema!)

  return (<div className="flex flex-col h-full overflow-y-scroll">
    <div className="flex-1 p-4">
    <Title useSchema={useSchema} id={id} />

    {Object.keys(properties!).map(field => <FieldDetail key={field} id={field} useSchema={useSchema} />)}
    </div>
    
    <Footer id={id} />
  </div>)
}

export default NodeDetails
