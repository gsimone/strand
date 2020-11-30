import { useStore } from "../store";

import emptyState from './__fixtures__/empty.json'
import simpleNode from './__fixtures__/simple-node-string.js'
import { ConnectorDirection } from "../store/connector"

const { uuid } = require('../utils')

jest.mock('../utils', () => {
  let i = 0

  return {
    uuid: () => `${i++}`
  }
})

beforeEach(() => {
  useStore.getState().reset()
})

test('Empty store serialize', () => {
  const { serialize } = useStore.getState()
  expect(JSON.stringify(serialize())).toBe(emptyState);
})

test('Add one node', () => {
  const { serialize, addNode } = useStore.getState()
  
  addNode()
  
  const { nodes } = useStore.getState()

  // is not equal to an empty state JSON
  expect(serialize()).not.toBe(emptyState);
  
  // a node exists
  expect(nodes.size).toBe(1);

  const iterator = nodes.values();
  const node = iterator.next().value

  // node doesn't have any field
  expect(nodes.get(node.getState().id).getState().fields.length).toBe(0);
})

test("Serialize", () => {

  const { serialize,addNode} = useStore.getState()

  addNode()
  addNode()

  expect(JSON.stringify(serialize())).toBe(JSON.stringify({
    nodes: {
      1: {
        name: "1",
        fields: [],
      },
      2: { name: "2", fields: [] },
    },
    fields: {},
    connections: [],
    positions: {
      1: [100,100],
      2: [100,100]
    }
  }));
    
})

test('Init node from json', () => {
  const { setInitialState } = useStore.getState()
  setInitialState(JSON.parse(simpleNode));
 
  const { nodes } = useStore.getState()

  expect(nodes.size).toBe(1)
  expect(nodes.values().next().value.getState().pick())
    .toMatchObject({
      "id": "black-quail-45",
      "name": "black-quail-45",
      "fields": []
  })
})

test('Delete node', () => {
  const { serialize, addNode, removeNode } = useStore.getState()
  addNode()
 
  const { nodes } = useStore.getState()
  expect(nodes.size).toBe(1)

  removeNode(nodes.values().next().value.getState().id)
  expect(useStore.getState().nodes.size).toBe(0)
  expect(JSON.stringify(serialize())).toBe(emptyState);
})

test('Check default and change position', () => {
  const { addNode, setPosition } = useStore.getState()
  addNode()
 
  const { nodes, positions: oldPositions } = useStore.getState()
  const { id } = nodes.values().next().value.getState()

  expect(oldPositions.values().next().value).toEqual([100, 100])

  setPosition(id, [123, 456])
  const { positions: newPositions } = useStore.getState()

  expect(newPositions.values().next().value).toEqual([123, 456])
})

test('Add and remove field', () => {
  const { addNode } = useStore.getState()
  addNode()
 
  const { nodes } = useStore.getState()
  const { id, fields: oldFields, addField, removeField } = nodes.values().next().value.getState()
  expect(oldFields.length).toBe(0)
  expect(useStore.getState().fields.size).toBe(0)

  addField("my-field-id", "my-field-name", "my-field-value")
  const { fields: newFields } = nodes.values().next().value.getState()
  expect(newFields.length).toBe(1)
  expect(useStore.getState().fields.size).toBe(1)

  removeField("my-field-id")
  const { fields: removedFields } = nodes.values().next().value.getState()
  expect(removedFields.length).toBe(0)
  expect(useStore.getState().fields.size).toBe(0)
})

test('Add and remove connections', () => {
  const { addNode, addConnection } = useStore.getState()
  addNode()
  addNode()
 
  const { nodes } = useStore.getState()
  nodes.forEach(node => {
    const { addField } = node.getState()
    addField()
  })

  const nodeIterator = nodes.values()
  const { id: firstNodeId, fields: firstNodeFields } = nodeIterator.next().value.getState()
  const {  id: secondNodeId, fields: secondNodeFields } = nodeIterator.next().value.getState()
  const { fields } = useStore.getState()

  addConnection({
    node: firstNodeId,
    field: firstNodeFields[0],
    direction: ConnectorDirection.input
  }, {
    node: secondNodeId,
    field: secondNodeFields[0],
    direction: ConnectorDirection.output
  })
})
