import { useStore } from "../store";

import simpleNode from './__fixtures__/simple-node-string.js'

const str = (x, replace = null, space = "  ") =>
  JSON.stringify(x, replace, space);

jest.mock("../utils", () => {
  let i = 0;
  return {
    ...jest.requireActual("../utils"),
    uuid: () => `${i++}`,
    reset: () => (i = 0),
  };
});
const utils = require("../utils");

beforeEach(() => {
  useStore.getState().reset();
  utils.reset();
});

describe("Serialization", () => {
  const emptyState = require( "./__fixtures__/empty.json")
  
  test("Serialize empty store", () => {
    const { serialize } = useStore.getState();
    expect(str(serialize())).toEqual(str(emptyState));
  });

  test("Serialize one node", () => {
    const { serialize, addNode } = useStore.getState();

    addNode();

    const { nodes } = useStore.getState();

    // is not equal to an empty state JSON
    expect(serialize()).not.toBe(emptyState);

    // a node exists
    expect(nodes.size).toBe(1);

    const iterator = nodes.values();
    const node = iterator.next().value;

    // node doesn't have any field
    expect(nodes.get(node.getState().id).getState().fields.length).toBe(0);
  });

  test("Serialize multiple nodes", () => {
    const { serialize, addNode } = useStore.getState();

    addNode();
    addNode();

    expect(str(serialize())).toBe(
      str({
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
          0: [100, 100],
          1: [100, 100],
        },
        schemas: {},
      })
    );
  });

})

describe("Set initial state from serialized data", () => {
  
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

})
