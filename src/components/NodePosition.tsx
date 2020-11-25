import React, { useCallback,useRef, useEffect, useLayoutEffect, Ref } from "react";

import { Position } from '../atoms'
import { useStore } from '../store';

type NodePositionProps = {
  nodeRef: Ref<HTMLDivElement>,
  id: number,
  children: JSX.Element
}

function NodePosition({ 
  id,
  nodeRef, 
  children
}: NodePositionProps) {
  const offset = useRef<number[]>([]);
  const setPosition = useStore(store => store.setPosition)
  
  // Set node position on initial mount
  useEffect(() => {
    const [x,y] = useStore.getState().positions.get(id) as Position
    // @ts-ignore
    nodeRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  }, [id, nodeRef])
  
  // react to position changes by setting transform when position changes
  useEffect(() =>  useStore.subscribe((position: Position | undefined) => {
      if (position ) {
        const [x,y] = position
      // @ts-ignore
        nodeRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      }
    },
    store => store.positions.get(id)),
    [id, nodeRef]
  )

  function mouseEventToPosition(e: MouseEvent) {
    return [
      e.clientX - offset.current[0],
      e.clientY - offset.current[1],
    ];
  }

  function startMoving(e: MouseEvent) {
    // @ts-ignore
    const { x: originX, y: originY } = nodeRef.current.getBoundingClientRect();

    const [relX, relY] = [e.clientX - originX, e.clientY - originY];

    offset.current = [relX, relY];
    window.addEventListener("mousemove", handleMovement);
    window.addEventListener("mouseup", stopMoving);
  }

  function stopMoving(e: MouseEvent) {
    setPosition(id, mouseEventToPosition(e))

    window.removeEventListener("mousemove", handleMovement);
    window.removeEventListener("mouseup", stopMoving);
  }
  
  const handleMovement = useCallback((e: MouseEvent) => {
    e.preventDefault();
    setPosition(id, mouseEventToPosition(e))
  }, [id, setPosition]);
  
  return (
    <div
      // @ts-ignore
      onMouseDownCapture={startMoving}
      style={{
        cursor: "grab"
      }}
    >
      {children}
    </div>
  )
}

export default React.memo(NodePosition)
