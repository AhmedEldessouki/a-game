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
  const [history, setHistory] = React.useState<
    {
      type: SpawnAbleAnimals
      location: {latitude: number; longitude: number}
      createdAt: number
    }[]
  >([])
  const animalsRef = React.useRef<
    {
      type: SpawnAbleAnimals
      location: {latitude: number; longitude: number}
      createdAt: number
    }[]
  >([])

  React.useLayoutEffect(() => {
    setInterval(() => {
      animalsRef.current.shift()
      console.log(animalsRef.current.length)
    }, 61000)
  }, [])
  React.useLayoutEffect(() => {
    setInterval(() => {
      const animal = spawn()
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
      <Grid animals={animalsRef.current} />
      {/* <HistoryContainer>
        {history.map(({type, location, createdAt}, i) => (
          //   eslint-disable-next-line react/no-array-index-key
          <React.Fragment key={createdAt * (i + 1)}>
            <h2>{type}</h2>
            <div>
              <h3>{location.latitude}</h3>
              <h3>{location.longitude}</h3>
            </div>
            <span>{createdAt}</span>
          </React.Fragment>
        ))}
      </HistoryContainer> */}
    </div>
  )
}

export default Oracle
