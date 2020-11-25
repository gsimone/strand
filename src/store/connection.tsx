
import create, { UseStore } from "zustand";

import { Connector } from './connector'

export type Connection = string[]

type ConnectionState = {
  origin?: Connector,
  destination?: Connector,
  startConnecting: (from: Connector) => void,
  stopConnecting: () => void,
  connecting: boolean,
  reset: () => void
}

export const useConnectionStore = create<ConnectionState>((set, get) => {

  return {
    origin: undefined,
    destination: undefined,
    connecting: false,
    startConnecting: (from) => set({ connecting : true, origin: from }),
    stopConnecting: () => set({ connecting: false }),
    reset: () => set({
      origin: undefined,
      destination: undefined,
      connecting: false
    })
  }
  
})
