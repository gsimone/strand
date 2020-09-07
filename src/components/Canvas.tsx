
import { useAtom } from 'jotai';
import React, {useRef} from 'react' 
import { connectionsAtom, connectorsAtom, makeConnectorId } from '../atoms';

const DRAW_INTERVAL = 16;

export default function Canvas() {
  const [connections] = useAtom(connectionsAtom)
  const [connectors] = useAtom(connectorsAtom)
  const svg = useRef<SVGSVGElement>(null);
  
  const draw = React.useCallback(
    function draw() {
      const coords = connections.map(connection => {
        
        const [input, output] = connection 
        const inputRef = connectors[makeConnectorId(input.node, input.field, "input")];
        const outputRef = connectors[makeConnectorId(output.node, output.field, "output")];

        // @ts-ignore
        const { x, y, width, height, } = inputRef.current.getBoundingClientRect();
        // @ts-ignore
        const { x: bx, y: by } = outputRef.current.getBoundingClientRect();
      
        return [
          x + width / 2,
          y + height / 2,
          bx + width / 2,
          by + height / 2,
        ];
      })

      svg.current!.innerHTML = coords
        .map(
          ([x, y, x2, y2]) => `
            <path d="
              M${x},${y} 
              C${(x + x2) / 2},${y} 
              ${(x2 + x) / 2},${y2} 
              ${x2},${y2}"
            />
        `
        )
        .join("");
      
    },
    [connections, connectors]
  );

  React.useEffect(() => {
    const interval = setInterval(draw, DRAW_INTERVAL);
    return () => clearInterval(interval);
  }, [draw]);

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
