import React from 'react'
import {usePlane, useSphere} from '@react-three/cannon'
import {animated} from '@react-spring/three'

function Circle({color, x, y}: {color?: string; x: number; y: number}) {
  const [ref, {velocity}] = useSphere(() => ({
    mass: 1,
    position: [x, 0, y],
  }))

  return (
    <animated.mesh
      onClick={() => {
        velocity.set(0, 2, 0)
      }}
      ref={ref}
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
