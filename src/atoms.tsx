import { atom, PrimitiveAtom } from 'jotai'
import { createRef, Ref } from 'react'
import produce from 'immer'
import { makeConnectorId, uuid } from './utils'




/**
 * Creating connections
 */
export enum ConnectorDirection {
  input = "INPUT",
  output = "OUTPUT"
}

export type Connector = {
  node: string,
  field: string,
  direction: ConnectorDirection
}

export type Connection = string[]

export const connectionsAtom = atom<Connection[]>([])

export function createConnection(input: Connector, output: Connector): Connection {
  return [makeConnectorId(input), makeConnectorId(output)]
}

/***
 * Node
 */
export type Position = number[]

export type NodeField = {
  id: string,
  name: string,
}


export const createFieldAtom = ({
  id,
  name,
}) => atom<NodeField>({
  id,
  name
})

export type Node = {
  id: string,
  name: string,
  position: PrimitiveAtom<Position>,
  fields: PrimitiveAtom<NodeField>[]
}

export const createNodeAtom = ({ 
  id, 
  position = [0, 0], 
  name = "My Node",
  fields = [{
    id: uuid(),
    name: "Default name"
  }]
}) => atom<Node>({ 
  id, 
  name, 
  position: atom<Position>(position), 
  fields: fields.map(createFieldAtom)
})

export const nodesAtom = atom<PrimitiveAtom<Node>[]>([])

const filterConnection = (id) => (connection: Connection) => connection.map(connectorId => connectorId.split('_')[1]).join('-').indexOf(id) < 0

export const removeFieldAtom = (nodeAtom) => atom(null, (get, set, fieldId) => {
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


/**
 * Holds refs for all connectors, used to draw the lines
 */
type ConnectorsRefMap = {
  [key: string]: Ref<HTMLDivElement>
}

export const connectorsRef = createRef<ConnectorsRefMap>()
// @ts-expect-error
connectorsRef.current = {}

export  const connectionStateAtom = atom<{
  connecting: boolean,
  origin: Connector | null
}>({
  connecting: false,
  origin: null
})

/**
 * Used to save and restore state
 */
export const serializedStateAtom = atom((get) => {
  const nodeAtoms = get(nodesAtom)
  const connections = get(connectionsAtom)

  return {
    nodes: nodeAtoms.map(nodeAtom => {

    const node = get(nodeAtom)
    const position = get(node.position)

    return {
      ...node,
      position
    }

  }), connections }
})

export const deserializeStateAtom = atom(null, (get, set, data) => {
  // @ts-ignore
  set(nodesAtom, data.nodes.map(node => createNodeAtom(node)))
  // @ts-ignore
  set(connectionsAtom, data.connections)
})
