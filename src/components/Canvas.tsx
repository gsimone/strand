
import { useAtom } from 'jotai';
import React, {useRef, useEffect, useCallback} from 'react' 
import { connectionsAtom, connectorsRef, connectionStateAtom, makeConnectorId } from '../atoms';

const DRAW_INTERVAL = 16;

type ClientRect = {
  x: number,
  y: number,
  width: number,
  height: number
}

function calcLine(a: ClientRect, b: ClientRect): number[] {

  // @ts-ignore
  const { x, y, width, height } = a
  // @ts-ignore
  const { x: bx, y: by } = b

  return [
    x + width / 2,
    y + height / 2,
    bx + width / 2,
    by + height / 2,
  ];

}

export default function Canvas() {
  const [connections] = useAtom(connectionsAtom)
  const [{ connecting, origin }] = useAtom(connectionStateAtom)
  const svg = useRef<SVGSVGElement>(null);
  
  const mouse = useRef<number[]>([0, 0])
  
  const draw = useCallback(
    function draw() {
      const coords = connections.map(connection => {
        const [input, output] = connection 
        
        // @ts-expect-error
        const inputRef = connectorsRef.current[input];
        // @ts-expect-error
        const outputRef = connectorsRef.current[output];
        
        // @ts-expect-error
        return calcLine(inputRef.current.getBoundingClientRect(), outputRef.current.getBoundingClientRect())
      })

      if (connecting) {

        const fakeLine =  calcLine(
          // @ts-expect-error
          connectorsRef.current[makeConnectorId(origin)].current.getBoundingClientRect(),
          { x: mouse.current[0], y: mouse.current[1], width: 10, height: 10 }, 
        )

        coords.push(fakeLine)
      }

      svg.current!.innerHTML = coords
        .map(
          ([x, y, x2, y2]) => `
            <path d="
              M${x},${y} 
              C${(x + x2) / 2},${y} 
              ${(x2 + x) / 2},${y2} 
              ${x2},${y2}"
            />
        `)
        .join("");
      
    },
    [connecting, connections, origin]
  );

  useEffect(() => {
    const interval = setInterval(draw, DRAW_INTERVAL);
    return () => clearInterval(interval);
  }, [draw]);

  useEffect(() => {
    function handleMouse(e: MouseEvent) {
      mouse.current = [e.clientX, e.clientY] 
    }
    
    document.addEventListener('mousemove', handleMouse)

    return () => document.removeEventListener('mousemove', handleMouse)
  }, [])

  return (
    <svg
      ref={svg}
      style={{
        pointerEvents: "none",
        top: 0,
        left: 0,
        position: "fixed",
        width: "100vw",
        height: "100vw",
        stroke: "white",
        strokeWidth: 2,
        fill: "none",
        zIndex: 1,
      }}
    />
  );
}
