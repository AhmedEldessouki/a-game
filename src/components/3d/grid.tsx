import React from 'react'
import styled from '@emotion/styled'
import {OrbitControls, Stars} from '@react-three/drei'
import {Physics} from '@react-three/cannon'
import {Canvas} from '@react-three/fiber'
import {Circle, Plane} from './utils'
import Card from '../../card'
import type {AnimalsType} from '../../../types/animals'

function Field({animals}: {animals: AnimalsType}) {
  return (
    <>
      {animals.map(({color, id, location}) => (
        <Circle
          key={id + location.longitude + location.latitude}
          color={color}
          x={location.longitude}
          y={location.latitude}
        />
      ))}
    </>
  )
}

const HistoryContainer = styled.div`
  background: #111f11a1;
  border-radius: 2px;
  height: 500px;
  margin: 5px 0;
  padding: 15px 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  overflow: auto;
`

function FiberGrid({
  sheeps,
  wolfs,
  bears,
  history,
  combined,
}: {
  sheeps: AnimalsType
  wolfs: AnimalsType
  bears: AnimalsType
  history: AnimalsType
  combined: AnimalsType
}) {
  const [time, setTime] = React.useState(`${new Date()
    .getHours()
    .toString()
    .padStart(2, '0')}:${new Date().getMinutes().toString().padStart(2, '0')}:
        ${`${new Date().getSeconds()}`.padStart(2, '0')}`)
  const canvasRef = React.useRef<HTMLCanvasElement>(null)

  React.useEffect(() => {
    for (
      let i = 0;
      i < (sheeps.length || bears.length || wolfs.length);
      i += 1
    ) {
      if (i < sheeps.length) {
        if (Date.now() - 60000 - sheeps[i].createdAt < 0) return
        const removedAnimal = sheeps.shift()
        if (removedAnimal) {
          console.log(`${removedAnimal.type} Is Dead`)
          history.unshift({...removedAnimal})
        }
      }
      if (i < wolfs.length) {
        if (Date.now() - 60000 - wolfs[i].createdAt < 0) return
        const removedAnimal = wolfs.shift()
        if (removedAnimal) {
          console.log(`${removedAnimal.type} Is Dead`)
          history.unshift({...removedAnimal})
        }
      }
      if (i < bears.length) {
        if (Date.now() - 60000 - bears[i].createdAt < 0) return
        const removedAnimal = bears.shift()
        if (removedAnimal) {
          console.log(`${removedAnimal.type} Is Dead`)
          history.unshift({...removedAnimal})
        }
      }
      if (history.length > 60) {
        history.splice(59, history.length - 1)
      }
    }
  }, [
    JSON.stringify(sheeps),
    JSON.stringify(bears),
    JSON.stringify(history),
    JSON.stringify(wolfs),
  ])

  React.useEffect(() => {
    for (let i = 0; i < wolfs.length; i += 1) {
      const wolf = wolfs[i]
      for (let x = 0; x < sheeps.length; x += 1) {
        const {type, location} = sheeps[x]
        if (
          location.latitude <= wolf.location.latitude + 500 * 0.15 &&
          location.latitude >= wolf.location.latitude - 500 * 0.15 &&
          location.longitude <= wolf.location.longitude + 500 * 0.15 &&
          location.longitude >= wolf.location.longitude - 500 * 0.15
        ) {
          const removedAnimal = sheeps.splice(x, 1)
          wolf.location = removedAnimal[0].location
          history.unshift(removedAnimal[0])
          console.log(`A Wolf Has Eaten a ${type}`)
          break
        }
      }
    }
  }, [JSON.stringify(sheeps), JSON.stringify(history), JSON.stringify(wolfs)])

  React.useEffect(() => {
    for (let i = 0; i < bears.length; i += 1) {
      const bear = bears[i]
      for (let x = 0; x < wolfs.length; x += 1) {
        const {type, location} = wolfs[x]
        if (
          location.latitude <= bear.location.latitude + 500 * 0.2 &&
          location.latitude >= bear.location.latitude - 500 * 0.2 &&
          location.longitude <= bear.location.longitude + 500 * 0.2 &&
          location.longitude >= bear.location.longitude - 500 * 0.2
        ) {
          const removedAnimal = wolfs.splice(x, 1)
          bear.location = removedAnimal[0].location
          history.unshift(removedAnimal[0])
          console.log(`A Bear Has Eaten a ${type}`)
          break
        }
      }
    }
  }, [JSON.stringify(bears), JSON.stringify(history), JSON.stringify(wolfs)])

  React.useEffect(() => {
    setInterval(
      () =>
        setTime(
          () => `${new Date()
            .getHours()
            .toString()
            .padStart(2, '0')}:${new Date()
            .getMinutes()
            .toString()
            .padStart(2, '0')}:
            ${`${new Date().getSeconds()}`.padStart(2, '0')}`,
        ),
      1000,
    )
  }, [])

  return (
    <div>
      <Canvas ref={canvasRef} style={{width: '98vw', height: '98vh'}}>
        {/* @ts-ignore */}
        <OrbitControls />
        <Stars />
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 15, 10]} angle={0.3} />
        <Physics>
          <Plane color="#1eff61" />
          <Field animals={sheeps} />
          <Field animals={wolfs} />
          <Field animals={bears} />
        </Physics>
      </Canvas>
      <HistoryContainer>
        <h2>Spawned Animals</h2>
        {combined.map(({type, location, createdAt, id}, i) => (
          <Card
            key={id}
            type={type}
            latitude={location.latitude}
            longitude={location.longitude}
            createdAt={createdAt}
          />
        ))}
      </HistoryContainer>
    </div>
  )
}

export default FiberGrid
