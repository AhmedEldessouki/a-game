import React from 'react'
import styled from '@emotion/styled'
import {keyframes} from '@emotion/react'
import {OrbitControls, Stars} from '@react-three/drei'
import {Physics} from '@react-three/cannon'
import {Canvas} from '@react-three/fiber'
import type {AnimalsType} from './oracle'
import {Circle, Plane} from './utils'

// const Canvas = styled.canvas`
//   background: #1eff61a1;
//   border-radius: 2px;
// `

function Field({combinedJSON}: {combinedJSON: string}) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const combined = React.useRef<AnimalsType | null>(JSON.parse(combinedJSON))

  React.useEffect(() => {
    console.log(combinedJSON === JSON.stringify(combined.current))
    if (combinedJSON === JSON.stringify(combined.current)) return
    combined.current = JSON.parse(combinedJSON) as AnimalsType
  }, [combinedJSON])

  return (
    <Canvas ref={canvasRef} style={{width: '98vw', height: '98vh'}}>
      {/* @ts-ignore */}
      <OrbitControls />
      <Stars />
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 15, 10]} angle={0.3} />
      <Physics>
        <Plane color="#1eff61" />
        {combined.current?.map(({color, id, location}) => (
          <Circle
            key={id + location.longitude + location.latitude}
            color={color}
            x={location.longitude}
            y={location.latitude}
          />
        ))}
      </Physics>
    </Canvas>
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

const enterAnimation = keyframes`
from {
  transform: translateX(-100px);
  opacity: 0;
} to {
  transform: translateX(0);
  opacity: 1;
}
`

const SubHistoryContainer = styled.div`
  background: #111f11a1;
  border-radius: 2px;
  margin: 5px;
  padding: 5px;
  gap: 10px;
  width: 400px;
  font-size: 14px;
  color: white;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  align-items: center;
  h3 {
    margin-top: 0;
  }
  animation: ${enterAnimation} 300ms ease;
`

function Card({
  latitude,
  longitude,
  createdAt,
  type,
}: {
  latitude: number
  longitude: number
  createdAt: number
  type: string
}) {
  return (
    <SubHistoryContainer>
      <span>
        <h3> Animal</h3>
        {type}
      </span>
      <div>
        <span>
          <h3>Location</h3>({latitude}, {longitude})
        </span>
      </div>
      <span>
        <h3>Created At</h3> {createdAt}
      </span>
    </SubHistoryContainer>
  )
}

function FiberGrid({
  animals: sheeps,
  wolfs,
  bears,
  history,
  combined,
}: {
  animals: AnimalsType
  wolfs: AnimalsType
  bears: AnimalsType
  history: AnimalsType
  combined: AnimalsType
}) {
  const [time, setTime] = React.useState(`${new Date()
    .getHours()
    .toString()
    .padStart(2, '0')}:${new Date().getMinutes().toString().padStart(2, '0')}:
      ${new Date().getSeconds().toString().padStart(2, '0')}`)

  React.useEffect(() => {
    if (!history) return
    if (!bears) return
    if (!wolfs) return
    if (sheeps.length <= 0) return

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
    if (!history) return
    if (!wolfs) return

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
          history.unshift({...removedAnimal[0]})
          console.log(`A Wolf Has Eaten a ${type}`)
          break
        }
      }
    }
  }, [JSON.stringify(sheeps), JSON.stringify(history), JSON.stringify(wolfs)])

  React.useEffect(() => {
    if (!bears) return
    if (!wolfs) return
    if (!history) return

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
          history.unshift({...removedAnimal[0]})
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
      <Field combinedJSON={JSON.stringify([...sheeps, ...wolfs, ...bears])} />
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
