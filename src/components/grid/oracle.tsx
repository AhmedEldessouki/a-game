import React from 'react'
import faker from 'faker'
import Grid from './grid'

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
  return animal
}
function Oracle() {
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
      <Grid animals={animalsRef.current} history={historyRef.current} />
    </div>
  )
}

export default Oracle
