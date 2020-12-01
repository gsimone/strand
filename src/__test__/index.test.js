import { useStore } from "../store";

import emptyState from './__fixtures__/empty.json'
import simpleNode from './__fixtures__/simple-node-string.js'
import connection from './__fixtures__/connection.json'

import { ConnectorDirection } from "../store/connector"

const str = (x, replace = null, space = '  ') => JSON.stringify(x, replace, space)

jest.mock('../utils', () => {
  let i = 0
  return {
    ...(jest.requireActual('../utils')),
    uuid: () => `${i++}`,
    reset: () => i = 0
  }
})
const utils = require('../utils');

beforeEach(() => {
  useStore.getState().reset()
  utils.reset()
})

test('Empty store serialize', () => {
  const { serialize } = useStore.getState()
  expect(str(serialize())).toEqual(str(emptyState));
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

  const { serialize, addNode } = useStore.getState()

  addNode()
  addNode()

  expect(str(serialize())).toBe(str({
    nodes: {
      0: {
        name: "0",
        fields: [],
      },
      1: { name: "1", fields: [] },
    },
    fields: {},
    connections: [],
    positions: {
      0: [100,100],
      1: [100,100]
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
  expect(str(serialize())).toBe(str(emptyState));
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
  const { fields: oldFields, addField, removeField } = nodes.values().next().value.getState()
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
  const { addNode, addConnection, removeConnection } = useStore.getState()
  addNode()
  addNode()
 
  const { nodes } = useStore.getState()
  nodes.forEach(node => {
    const { addField } = node.getState()
    addField()
  })
  
  expect(useStore.getState().connections.length).toBe(0)

  const nodeIterator = nodes.values()
  const { id: firstNodeId, fields: firstNodeFields } = nodeIterator.next().value.getState()
  const {  id: secondNodeId, fields: secondNodeFields } = nodeIterator.next().value.getState()

  const connectionA = {
    node: firstNodeId,
    field: firstNodeFields[0],
    direction: ConnectorDirection.input
  }
  const connectionB =  {
    node: secondNodeId,
    field: secondNodeFields[0],
    direction: ConnectorDirection.output
  }

  addConnection(connectionA, connectionB)
  expect(useStore.getState().connections.length).toBe(1)
  expect(useStore.getState().connections[0]).toEqual([utils.makeConnectorId(connectionA), utils.makeConnectorId(connectionB)])

  removeConnection(useStore.getState().connections[0])
  expect(useStore.getState().connections.length).toBe(0)
})

test("Remove connection", () => {

  const state = require('./__fixtures__/connection/delete/state.json')
  const expected = require('./__fixtures__/connection/delete/expected.json')
  const { setInitialState, removeConnection } = useStore.getState()

  setInitialState(state)

  removeConnection([
    "serious-zebra-36_mighty-rabbit-70_OUTPUT",
    "dull-dragonfly-95_tame-gecko-25_INPUT"
  ])

  expect(str(useStore.getState().serialize()))
    .toEqual(str(expected))

})

test('Remove connected field', () => {
  const { setInitialState } = useStore.getState()
  setInitialState(connection)
  expect(useStore.getState().connections.length).toBe(1)
  
  const { nodes } = useStore.getState()
  const { fields, removeField } = nodes.values().next().value.getState()
  
  removeField(fields[0])
  expect(useStore.getState().connections.length).toBe(0)
})

test('Remove node with a connected field', () => {
  const { setInitialState, removeNode } = useStore.getState()
  setInitialState(connection)
  expect(useStore.getState().connections.length).toBe(1)
  
  const { nodes } = useStore.getState()
  const { id } = nodes.values().next().value.getState()
  removeNode(id)

  expect(useStore.getState().connections.length).toBe(0)
})


