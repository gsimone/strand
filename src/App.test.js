import React from "react";

import App from "./App";
import { useStore } from "./store";

test('Empty store serialize', () => {
  const { nodes, serialize, addNode } = useStore.getState()
  expect(serialize()).toBe(JSON.stringify({nodes:{},fields:{},connections:[]}));
})

test('Add one node', () => {
  const { serialize, addNode } = useStore.getState()
  
  addNode()
  
  const { nodes } = useStore.getState()

  expect(serialize()).not.toBe(JSON.stringify({nodes:{},fields:{},connections:[]}));
  expect(nodes.size).toBe(1);

  const iterator = nodes.values();

  expect(iterator.next().value.getState().fields.length).toBe(0);
})

test('Init node from json', () => {
  const initJson = `{
      "nodes": {
        "black-quail-45": {
          "name": "black-quail-45",
          "fields": [],
          "position": [
            100,
            100
          ]
        }
      },
      "fields": {},
      "connections": []
    }`

  const { serialize, setInitialState } = useStore.getState()
  setInitialState(JSON.parse(initJson));
  
  expect(serialize()).not.toBe(JSON.stringify({nodes:{},fields:{},connections:[]}));
  expect(serialize()).toBe(initJson);
  
  // addNode()
  // const { nodes } = useStore.getState()

  // expect(nodes.size).toBe(1);

  // const iterator = nodes.values();

  // expect(iterator.next().value.getState().fields.length).toBe(0);
})