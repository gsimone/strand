import { Ref } from "react";
import create from "zustand";

export enum ConnectorDirection {
  input = "INPUT",
  output = "OUTPUT",
}

export type Connector = {
  node: number | string;
  field: number | string;
  direction: ConnectorDirection;
};

export type ConnectorsState = {
  connectors: Map<string, Ref<HTMLDivElement>>;
  registerConnector: (id: string, ref: Ref<HTMLDivElement>) => void;
  unregisterConnector: (id: string) => void;
};

export const useConnectorsStore = create<ConnectorsState>((set, get) => {
  return {
    connectors: new Map(),
    registerConnector: (id, ref) => {
      get().connectors.set(id, ref);
    },
    unregisterConnector: (id) => {
      get().connectors.delete(id);
    },
  };
});
