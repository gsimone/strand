import {hri} from 'human-readable-ids'
import { Connector } from './store'

export function makeConnectorId({ node, field, direction }: Connector) {
  return `${node}_${field}_${direction}`
}

export const uuid = () => hri.random()
 
type ClientRect = {
  x: number,
  y: number,
  width: number,
  height: number
}

export function calcLine(a: ClientRect, b: ClientRect): number[] {

  // @ts-ignore
  const { x, y, width = 0, height = 0 } = a
  // @ts-ignore
  const { x: bx, y: by, width: bwidth = 0, height: bheight = 0 } = b

  return [
    x + width / 2,
    y + height / 2,
    bx + bwidth / 2,
    by + bheight / 2,
  ];

}
