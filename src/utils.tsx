import {hri} from 'human-readable-ids'
import { Connector } from './atoms'

export function makeConnectorId({ node, field, direction }: Connector) {
  return `${node}_${field}_${direction}`
}

export const uuid = () => hri.random()
 
export function decimalPlaces(num) {
  return Number(num.toFixed(2))
}
