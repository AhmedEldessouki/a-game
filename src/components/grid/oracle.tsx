import React from 'react'
import faker from 'faker'
import Grid from './grid'

type SpawnAbleAnimals = 'sheep' | 'wolf' | 'bear'
type AnimalsType = {
  type: SpawnAbleAnimals
  location: {latitude: number; longitude: number}
  createdAt: number
  color: string
  id?: string
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
    color: string
  } = {
    type: 'sheep',
    location: {
      longitude: Number(faker.address.latitude(500, 0.1)),
      latitude: Number(faker.address.longitude(500, 0.1)),
    },
    createdAt: Date.now(),
    color: 'white',
  }
  if (num < 101) {
    // ? Defaulted
  } else if (num < 111) {
    animal.type = 'wolf'
    animal.color = '#ff0035'
  } else {
    animal.type = 'bear'
    animal.color = ' 	#1b45d7'
  }
  return animal
}
function Oracle() {
  const historyRef = React.useRef<AnimalsType>([])
  const sheepsRef = React.useRef<AnimalsType>([])
  const redZonesRef = React.useRef<AnimalsType>([])
  const blueZonesRef = React.useRef<AnimalsType>([])

  React.useEffect(() => {
    setInterval(() => {
      const animal = spawn()
      if (animal.type === 'wolf') {
        redZonesRef.current.push(animal)
      } else if (animal.type === 'bear') {
        blueZonesRef.current.push(animal)
      } else {
        sheepsRef.current.push(animal)
      }
    }, 1000)
  }, [])

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
      <Grid
        animals={sheepsRef.current}
        wolfs={redZonesRef.current}
        bears={blueZonesRef.current}
        history={historyRef.current}
      />
    </div>
  )
}

export default Oracle
export type {AnimalsType}
