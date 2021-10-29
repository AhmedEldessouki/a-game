import {usePlane, useSphere} from '@react-three/cannon'
import React from 'react'

function Circle({color}: {color?: string}) {
  const [ref, api] = useSphere(() => ({mass: 1}))
  return (
    <mesh
      onClick={() => {
        api.velocity.set(0, 2, 0)
      }}
      ref={ref}
      position={[0, 2, 0]}
    >
      <sphereBufferGeometry attach="geometry" />
      <meshMatcapMaterial attach="material" color={color ?? 'blue'} />
    </mesh>
  )
}
function Plane({color}: {color?: string}) {
  const [ref] = usePlane(() => ({rotation: [-Math.PI / 2, 0, 0]}))
  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]}>
      <planeBufferGeometry attach="geometry" args={[100, 100]} />
      <meshLambertMaterial attach="material" color={color ?? 'lightblue'} />
    </mesh>
  )
}

export {Circle, Plane}
