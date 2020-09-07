import React, { useCallback,useRef, useEffect } from "react";
import { useAtom } from 'jotai'

export default function NodePosition({ nodeRef, positionAtom }) {
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
      className="text-xs font-bold py-2 px-6 bg-gray-100 text-gray-800"
      onMouseDownCapture={startMoving}
    >
      Handle
    </div>
  )
}
