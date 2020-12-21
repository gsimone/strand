import { SchemaStatus, useStore } from "../store";

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

  describe("Nodes, fields, schemas", () => {

    test("It should create all necessary data when adding a new node", () => {

      const { addNode } = useStore.getState()

      addNode("my-node")

      // 1. node is created
      const node = useStore.getState().nodes.get("my-node")
      expect(node).not.toBeUndefined()

      // 2. schema is created & valid
      const schemaStore = useStore.getState().schemas.get("my-node")
      expect(schemaStore).not.toBeUndefined()

      const schema = schemaStore.getState()
      expect(schema.status).toBe(SchemaStatus.VALID)

      // 3. a default field is created and assigned to the node
      expect(node.getState().fields).toHaveLength(1)
      expect(node.getState().fields[0]).toBe("0")
      expect(useStore.getState().fields.values().next().value.getState().id).toBe("0")

    })

  })
  
  // connections are tested on their own since they are mostly indipendent from state
  describe("Connections", () => {
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
      expect(state.schemas.get("0")).toBeUndefined()
      expect(state.connections).toHaveLength(0)
    })
  })

})




