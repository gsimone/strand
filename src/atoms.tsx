import { atom, WritableAtom } from 'jotai'
import { createRef, Ref } from 'react'

import { makeConnectorId, uuid } from './utils'

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
  name = "My Node",
  fields = [{
    id: `field-${Math.floor(Math.random() * uuid() / 1000000000)}`,
    name: "My field"
  }]
}) => atom<Node>({ 
  id, 
  name, 
  position: atom(position), 
  fields
})

export const nodesAtom = atom<WritableAtom<Node, Node>[]>([])

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

export  const connectionStateAtom = atom<{
  connecting: boolean,
  origin: Connector | null
}>({
  connecting: false,
  origin: null
})

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
