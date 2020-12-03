import { useStore } from "../store";

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

describe(("Connections"), () => {
  test('Add connection', () => {
    const {addConnection} = useStore.getState()
  
    const connectionA = {
      node: "node-A",
      field: "field-0",
      direction: ConnectorDirection.input
    }
  
    const connectionB =  {
      node: "node-B",
      field: "field-1",
      direction: ConnectorDirection.output
    }
  
    addConnection(connectionA, connectionB)
    expect(useStore.getState().connections[0])
      .toEqual([utils.makeConnectorId(connectionA), utils.makeConnectorId(connectionB)])
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
  
    expect(str(useStore.getState().serialize().connections))
      .toEqual(str(expected.connections))
  
  })
})

describe("Integration tests", () => {

  const connection = require('./__fixtures__/connection.json')

  test("It should remove connections when connected field is removed", () => {
    const { setInitialState } = useStore.getState()
    setInitialState(connection)
    
    const { nodes } = useStore.getState()
    const { fields, removeField } = nodes.get("0").getState()
    
    removeField(fields[0])
    expect(useStore.getState().connections.length).toBe(0)
  })

  test('It should remove connections and fields when a node is removed', () => {
    const { setInitialState, removeNode } = useStore.getState()
    setInitialState(connection)
    
    removeNode("0")

    const state = useStore.getState()

    expect(state.nodes.get("0")).toBeUndefined()
    expect(state.fields.get("2")).toBeUndefined()
    expect(state.connections).toHaveLength(0)
  })

})




