import React from "react";

import App from "./App";
import { useStore } from "./store";

test('Empty store serialize', () => {
  const { nodes, serialize, addNode } = useStore.getState()
  expect(serialize()).toBe(JSON.stringify({nodes:{},fields:{},connections:[]}));
  addNode()
  expect(serialize()).not.toBe(JSON.stringify({nodes:{},fields:{},connections:[]}));
  expect(Array.from(nodes).length).toBe(1);
})