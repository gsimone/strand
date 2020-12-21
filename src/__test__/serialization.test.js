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

    addNode("my-node");

    const { nodes } = useStore.getState();

    // is not equal to an empty state JSON
    expect(serialize()).not.toBe(emptyState);

    // a node exists
    expect(nodes.size).toBe(1);

    const iterator = nodes.values();
    const node = iterator.next().value;

    // node has a default field
    expect(nodes.get(node.getState().id).getState().fields.length).toBe(1);
  });

  test("Serialize multiple nodes", () => {
    const { serialize, addNode } = useStore.getState();

    addNode("1");
    addNode("2");

    expect(str(serialize())).toBe(
      str({
        nodes: {
          "1": {
            name: "1",
            fields: ["0"],
          },
          "2": { 
            name: "2", 
            fields: ["1"]
          },
        },
        fields: {
          "0": {
            "name": "name",
            "value": "0"
          },
            "1": {
            "name": "name",
            "value": "1"
          }
        },
        connections: [],
        positions: {
          "1": [100, 100],
          "2": [100, 100],
        },
        schemas: {
          "1": {
            "$schema": "http://json-schema.org/draft-07/schema",
            "$id": "http://example.com/example.json",
            "type": "object",
            "title": "The root schema",
            "description": "The root schema comprises the entire JSON document.",
            "default": {},
            "properties": {
              "0": {
                $id: `#/properties/0`,
                type: "string",
                title: `The 0 Schema`,
                description: "An explanation about the purpose of this instance.",
              }
            },
            "additionalProperties": true
          },
          "2": {
            "$schema": "http://json-schema.org/draft-07/schema",
            "$id": "http://example.com/example.json",
            "type": "object",
            "title": "The root schema",
            "description": "The root schema comprises the entire JSON document.",
            "default": {},
            "properties": {
              "1": {
                $id: `#/properties/1`,
                type: "string",
                title: `The 1 Schema`,
                description: "An explanation about the purpose of this instance.",
              }
            },
            "additionalProperties": true
          }
        }
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
