import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useLayoutEffect,
} from "react";

import { calcLine } from "utils";
import { useConnectorsStore, Connection, useStore } from "../store";

type StrandProps = {
  connection: Connection;
};

function getNodeIDFromConnectionID(connectionID) {
  return connectionID.split("_")[0];
}

type PureStrandProps = {
  points: number[] | undefined;
  onContextMenuCapture?: (e: any) => void;
  notInteractive?: boolean;
};

export function PureStrand({
  points,
  onContextMenuCapture,
  notInteractive,
}: PureStrandProps) {
  const pathRef = useRef<SVGGElement>(null);

  const draw = useCallback(
    () =>
      requestAnimationFrame(() => {
        if (points && pathRef.current) {
          const [x, y, x2, y2] = points;

          const line = `
        M${x},${y} 
        C${(x + x2) / 2},${y} 
        ${(x2 + x) / 2},${y2} 
        ${x2},${y2}
      `;

          pathRef.current!.children[0].setAttribute("d", line);
          pathRef.current!.children[1].setAttribute("d", line);
        }
      }),
    [points]
  );

  useLayoutEffect(() => {
    draw();
  });

  return (
    <g
      className={notInteractive ? "" : "cursor-pointer hover:text-red-500"}
      ref={pathRef}
    >
      <path strokeWidth={2} className={`stroke-current`} />
      <path
        strokeWidth={15}
        style={{ opacity: 0 }}
        onContextMenuCapture={onContextMenuCapture}
      />
    </g>
  );
}

export default function Strand({ connection }: StrandProps) {
  const [input, output] = connection;
  const [inputRef, outputRef] = useConnectorsStore((state) => [
    state.connectors.get(input),
    state.connectors.get(output),
  ]);
  const removeConnection = useStore((store) => store.removeConnection);

  const [, set] = useState(0);
  useEffect(() => {
    set(1);
  }, []);

  useStore((store) => {
    const connectedNodesIDs = connection.map(getNodeIDFromConnectionID);
    return connectedNodesIDs.map((id) => store.positions.get(id));
  });

  let points = undefined;

  if (inputRef && outputRef) {
    // @ts-expect-error
    points = calcLine(inputRef.current.getBoundingClientRect(),outputRef.current.getBoundingClientRect());
  }

  const handleRightClick = useCallback(
    (e) => {
      e.preventDefault();
      removeConnection(connection);
    },
    [connection, removeConnection]
  );

  return <PureStrand points={points} onContextMenuCapture={handleRightClick} />;
}
