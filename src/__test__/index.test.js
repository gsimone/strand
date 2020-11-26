import { useStore } from "../store";

import emptyState from './__fixtures__/empty.json'

const { uuid } = require('../utils')

jest.mock('./utils', () => {
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
  expect(serialize()).toBe(emptyState);
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

  expect(serialize()).toBe(JSON.stringify({
    nodes: {
      1: {
        name: "1",
        fields: [],
        position: [100, 100],
      },
      2: { name: "2", fields: [], position: [100, 100] },
    },
    fields: {},
    connections: [],
  }));
    
})

test('Init node from json', () => {
  const initJson = `{
    "nodes": {
      "black-quail-45": {
        "name": "black-quail-45",
        "fields": []
      }
    },
    "positions": {
      "black-quail-45": [100, 100]
    },
    "fields": {},
    "connections": []
  }`

  const { setInitialState } = useStore.getState()
  setInitialState(JSON.parse(initJson));
 
  const { nodes } = useStore.getState()

  expect(nodes.size).toBe(1)
  expect(nodes.values().next().value.getState())
    .toContain(
      {
        "id": "black-quail-45",
        "name": "black-quail-45",
        "fields": [],
    })

})
