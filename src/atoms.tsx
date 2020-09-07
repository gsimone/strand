import { atom, WritableAtom } from 'jotai'
import { Ref } from 'react'

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
    id: `${Math.floor(Math.random() * uuid() / 100)}`,
    name: "My field"
  }]
})

export const nodesAtom = atom([
  createNodeAtom({ id: 1, position: [100, 100]}), 
  createNodeAtom({ id: 2, name: "Another Node", position: [400, 100]})
])


type ConnectionInput = {
  node: string,
  field: string
}

type connection = ConnectionInput[]

export const connectionsAtom = atom<connection[]>([])

export function createConnection(input: ConnectionInput, output: ConnectionInput): connection {
  return [input, output]
}

type ConnectorsMap = {
  [key: string]: Ref<HTMLDivElement>
}

export const connectorsAtom = atom<ConnectorsMap>({})

export function makeConnectorId(node: string, field: string, direction: string) {
  return `${node}-${field}-${direction}`
}

export  const connectionStateAtom = atom<{
  connecting: boolean,
  input?: any,
  output?: any,
}>({
  connecting: false,
  input: undefined,
  output: undefined
})
