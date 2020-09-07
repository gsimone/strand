import React, { useCallback,useRef, useEffect, Ref } from "react";
import { useAtom, WritableAtom } from 'jotai'

import { Position } from '../atoms'

type NodePositionProps = {
  nodeRef: Ref<HTMLDivElement>,
  positionAtom: WritableAtom<Position, Position>,
  children: JSX.Element
}

export default function NodePosition({ 
  nodeRef, 
  positionAtom, 
  children
}: NodePositionProps) {
  const [position, setPosition] = useAtom(positionAtom)
  const offset = useRef<number[]>([]);

  function startMoving(e: MouseEvent) {
    // @ts-ignore
    const { x: originX, y: originY } = nodeRef.current.getBoundingClientRect();

    const [relX, relY] = [e.clientX - originX, e.clientY - originY];

    offset.current = [relX, relY];
    window.addEventListener("mousemove", handleMovement);
    window.addEventListener("mouseup", stopMoving);
  }

  function stopMoving() {
    window.removeEventListener("mousemove", handleMovement);
    window.removeEventListener("mouseup", stopMoving);
  }
  
  const handleMovement = useCallback((e: MouseEvent) => {
    e.preventDefault();

    const [x, y] = [
      e.clientX - offset.current[0],
      e.clientY - offset.current[1],
    ];

    setPosition([x,y])

  }, [offset, setPosition]);
  
  useEffect(() => {

    const [x,y] = position

    // @ts-ignore
    nodeRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    
  }, [nodeRef, position])

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
