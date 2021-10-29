import {usePlane, useSphere} from '@react-three/cannon'
import {animated} from '@react-spring/three'
import React from 'react'

function Circle({color, x, y}: {color?: string; x: number; y: number}) {
  let newX = x
  let newY = y
  if (x > 250) {
    newX = x - 500
  }
  if (y > 250) {
    newY = y - 500
  }
  const [active, setActive] = React.useState(false)
  const [ref, {velocity}] = useSphere(() => ({
    mass: 1,
    position: [newX, 0, newY],
  }))

  return (
    <animated.mesh
      onClick={() => {
        velocity.set(0, 2, 0)
        setActive(!active)
      }}
      ref={ref}
      position={[newX, 0, newY]}
    >
      <sphereBufferGeometry attach="geometry" args={[5]} />
      <meshMatcapMaterial attach="material" color={color ?? 'blue'} />
    </animated.mesh>
  )
}
function Plane({color}: {color?: string}) {
  const [ref] = usePlane(() => ({rotation: [-Math.PI / 2, 0, 0]}))
  return (
    <mesh ref={ref}>
      <planeBufferGeometry attach="geometry" args={[500, 500]} />
      <meshLambertMaterial attach="material" color={color ?? 'lightblue'} />
    </mesh>
  )
}

export {Circle, Plane}
