import { Connector } from './atoms'

export function makeConnectorId({ node, field, direction }: Connector) {
  return `${node}_${field}_${direction}`
}

export const uuid = () => new Date().getTime()
 
export function decimalPlaces(num) {
  return Number(num.toFixed(2))
}
