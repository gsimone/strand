
import { useAtom } from 'jotai';
import React, {useRef} from 'react' 
import { connectionsAtom, connectorsRef, makeConnectorId } from '../atoms';

const DRAW_INTERVAL = 16;

export default function Canvas({ nodes }) {
  const [connections] = useAtom(connectionsAtom)
  const svg = useRef();

  const draw = React.useCallback(
    function draw() {
      const coords = connections.map(connection => {

        const [input, output] = connection 
        const inputRef = connectorsRef.current[makeConnectorId(input.node, input.field, "input")];
        const outputRef = connectorsRef.current[makeConnectorId(output.node, output.field, "output")];

        return [inputRef, outputRef]        
      })
      .map(connection => {
        const [fromNode, toNode] = connection
        
          const {
            x,
            y,
            width,
            height,
          } = fromNode.current.getBoundingClientRect();
          const { x: bx, y: by } = toNode.current.getBoundingClientRect();
        
        return [
          x + width / 2,
          y + height / 2,
          bx + width / 2,
          by + height / 2,
        ];
      })

      svg.current.innerHTML = coords
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
    [connections]
  );

  React.useEffect(() => {
    const interval = setInterval(draw, DRAW_INTERVAL);
    return () => clearInterval(interval);
  }, [draw, nodes]);

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
        "stroke-width": 2,
        fill: "none",
        zIndex: 1,
      }}
    >
      
    </svg>
  );
}
