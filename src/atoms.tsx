import { atom, WritableAtom } from 'jotai'
import { createRef, Ref } from 'react'

const uuid = () => new Date().getTime()

export type Position = number[]

export type NodeField = {
  id: string,
  name: string
}

export type Node = {
  id: string,
  name: string,
  position: WritableAtom<Position, Position>,
  fields: NodeField[]
}

export const createNodeAtom = ({ 
  id, 
  position = [0, 0], 
  name = "My field"
}) => atom<Node>({ 
  id, 
  name, 
  position: atom(position), 
  fields: [{
    id: `field-${Math.floor(Math.random() * uuid() / 1000000000)}`,
    name: "My field"
  }]
})

export const nodesAtom = atom([
  createNodeAtom({ id: "node-1", position: [100, 100]}), 
  // createNodeAtom({ id: "node-2", name: "Another Node", position: [400, 100]})
])


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

type ConnectorsRefMap = {
  [key: string]: Ref<HTMLDivElement>
}

/**
 * Holds refs for all connectors, used to draw the lines
 */
export const connectorsRef = createRef<ConnectorsRefMap>()
// @ts-expect-error
connectorsRef.current = {}

export function makeConnectorId({ node, field, direction }: Connector) {
  return `${node}_${field}_${direction}`
}

export  const connectionStateAtom = atom<{
  connecting: boolean,
  origin: Connector | null
}>({
  connecting: false,
  origin: null
})
