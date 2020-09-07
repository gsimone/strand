import { atom } from 'jotai'
import { createRef } from 'react'

const uuid = () => new Date().getTime()

export const createNodeAtom = ({ id, position = [0, 0], name = "My field" }) => atom({ 
  id, 
  name, 
  position: atom(position), 
  fields: [{
    id: parseInt(Math.random() * uuid() / 100, 10),
    name: "My field"
  }]
})

export const nodesAtom = atom([
  createNodeAtom({ id: 1, position: [100, 100]}), 
  createNodeAtom({ id: 2, name: "Another Node", position: [400, 100]})
])

export const connectorsAtom = atom({})

export const connectionsAtom = atom([])

export function createConnection(input, output) {
  return [input, output]
}

export const connectorsRef = createRef()
connectorsRef.current = {}

export function makeConnectorId(node, field, direction) {
  return `${node}-${field}-${direction}`
}

export  const connectionStateAtom = atom({
  connecting: false,
  input: undefined,
  output: undefined
})
