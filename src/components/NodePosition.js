import React, { useCallback,useRef, useEffect } from "react";
import { useAtom } from 'jotai'

export default function NodePosition({ nodeRef, positionAtom, children }) {
  const [position, setPosition] = useAtom(positionAtom)
  const offset = useRef();

  function startMoving(e) {
    const { x: originX, y: originY } = nodeRef.current.getBoundingClientRect();

    const [relX, relY] = [e.clientX - originX, e.clientY - originY];

    offset.current = [relX, relY];
    window.addEventListener("mousemove", handleMovement);
    window.addEventListener("mouseup", stopMoving);
  }

  function stopMoving(e) {
    window.removeEventListener("mousemove", handleMovement);
    window.removeEventListener("mouseup", stopMoving);
  }
  
  const handleMovement = useCallback((e) => {
    e.preventDefault();

    const [x, y] = [
      e.clientX - offset.current[0],
      e.clientY - offset.current[1],
    ];

    setPosition([x,y])

  }, [setPosition]);
  
  useEffect(() => {

    const [x,y] = position

    nodeRef.current.style.transform = `
    translate3d(
      ${x}px, 
      ${y}px, 
      0
    )
  `;
    
  }, [nodeRef, position])

  return (
    <div
      onMouseDownCapture={startMoving}
      style={{
        cursor: "grab"
      }}
    >
      {children}
    </div>
  )
}
