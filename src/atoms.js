import { atom } from 'jotai'

export const createNodeAtom = ({ id, position, name = "My field" }) => atom({ 
  id, 
  name, 
  position: atom(position), 
  fields: [{
    id: "Field",
    name: "My field"
  }]
})

export const nodesAtom = atom([
  createNodeAtom({ id: 1, position: [100, 100]}), 
  createNodeAtom({ id: 2, name: "Another field", position: [400, 100]})
])

export const connectionsAtom = atom([])

export function createConnection(input, output) {
  return [input, output]
}

export  const connectionStateAtom = atom({
  connecting: false,
  input: undefined,
  output: undefined
})
