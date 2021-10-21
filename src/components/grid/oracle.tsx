import React from 'react'
import styled from '@emotion/styled'
import faker from 'faker'
import Grid from './grid'

const HistoryContainer = styled.div`
  background: #1eff61a1;
  border-radius: 2px;
  color: black;
  height: 500px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: auto;
`

type SpawnAbleAnimals = 'sheep' | 'wolf' | 'bear'
type AnimalsType = {
  type: SpawnAbleAnimals
  location: {latitude: number; longitude: number}
  createdAt: number
}[]
const spawn = () => {
  // ? Sheep s > 0 && s <= 100
  // ? Wolf w > 101 && w <= 110 Radius: 15%
  // ? Bear b > 111 && b <= 115 Radius: 20%
  const num = faker.datatype.number(115)
  const animal: {
    type: SpawnAbleAnimals
    location: {latitude: number; longitude: number}
    createdAt: number
  } = {
    type: 'sheep',
    location: {
      longitude: Number(faker.address.latitude(500, 0.1)),
      latitude: Number(faker.address.longitude(500, 0.1)),
    },
    createdAt: Date.now(),
  }
  if (num < 101) {
    animal.type = 'sheep'
  } else if (num < 111) {
    animal.type = 'wolf'
  } else {
    animal.type = 'bear'
  }
  // setAnimals([...animals, animal])
  return animal
}
function Oracle() {
  const [time, setTime] = React.useState(`${new Date()
    .getHours()
    .toString()
    .padStart(2, '0')}:${new Date().getMinutes().toString().padStart(2, '0')}:
  ${new Date().getSeconds().toString().padStart(2, '0')}`)
  const [animals, setAnimals] = React.useState<
    {
      type: SpawnAbleAnimals
      location: {latitude: number; longitude: number}
      createdAt: number
    }[]
  >([])
  const historyRef = React.useRef<
    {
      type: SpawnAbleAnimals
      location: {latitude: number; longitude: number}
      createdAt: number
    }[]
  >([])
  const animalsRef = React.useRef<AnimalsType>([])
  const redZonesRef = React.useRef<{latitude: number; longitude: number}[]>([])
  const blueZonesRef = React.useRef<{latitude: number; longitude: number}[]>([])

  React.useLayoutEffect(() => {
    setInterval(() => {
      const removedAnimal = animalsRef.current.shift()
      if (removedAnimal) {
        if (removedAnimal.type === 'wolf') {
          redZonesRef.current.shift()
        } else if (removedAnimal.type === 'bear') {
          blueZonesRef.current.shift()
        }
        historyRef.current.push(removedAnimal)
        console.log(
          animalsRef.current.length,
          redZonesRef.current.length,
          blueZonesRef.current.length,
        )
      }
    }, 61000)
  }, [])
  React.useLayoutEffect(() => {
    setInterval(() => {
      const animal = spawn()
      if (animal.type === 'wolf') {
        redZonesRef.current.push(animal.location)
      } else if (animal.type === 'bear') {
        blueZonesRef.current.push(animal.location)
      }
      animalsRef.current.push(animal)
      console.log(`spawn`, animalsRef.current.length)
    }, 1000)
  }, [])
  React.useEffect(() => {
    if (JSON.stringify(animals) === JSON.stringify(animalsRef.current)) return
    setAnimals([...animalsRef.current])
  }, [animals])

  return (
    <div>
      <h1>
        Start:{' '}
        {`${new Date().getHours().toString().padStart(2, '0')}:${new Date()
          .getMinutes()
          .toString()
          .padStart(2, '0')}:
  ${new Date().getSeconds().toString().padStart(2, '0')}`}
      </h1>
      {/* <h1>Current: {time}</h1> */}
      <Grid animals={animalsRef.current} history={historyRef.current} />
    </div>
  )
}

export default Oracle
