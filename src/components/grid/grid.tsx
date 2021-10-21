import React from 'react'
import styled from '@emotion/styled'
import faker from 'faker'

const Canvas = styled.canvas`
  background: #1eff61a1;
  border-radius: 2px;
`
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
function draw(
  ctx: CanvasRenderingContext2D,
  squareLength: number,
  latitude: number,
  longitude: number,
  text: string,
) {
  let radius = 0
  if (text === 'wolf') {
    radius = squareLength * 0.15
  } else if (text === 'bear') {
    radius = squareLength * 0.2
  }
  ctx.save()
  ctx.beginPath()

  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillStyle = `white`
  ctx.font = `13px sans-serif`
  ctx.fillText(text, longitude, latitude)
  ctx.ellipse(longitude, latitude, radius, radius, Math.PI / 4, 0, 2 * Math.PI)
  ctx.stroke()

  ctx.closePath()
  ctx.restore()
}

type SpawnAbleAnimals = 'sheep' | 'wolf' | 'bear'
const animalsOutside: {
  type: SpawnAbleAnimals
  location: {latitude: number; longitude: number}
  createdAt: number
}[] = []
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
  animalsOutside.push(animal)
  return animal
}

function Grid({
  animals,
}: {
  animals: {
    type: SpawnAbleAnimals
    location: {latitude: number; longitude: number}
    createdAt: number
  }[]
}) {
  const [time, setTime] = React.useState(`${new Date()
    .getHours()
    .toString()
    .padStart(2, '0')}:${new Date().getMinutes().toString().padStart(2, '0')}:
      ${new Date().getSeconds().toString().padStart(2, '0')}`)

  const canvasRef = React.useRef<HTMLCanvasElement>(null)

  React.useEffect(() => {
    if (!canvasRef.current) return
    const ctx = canvasRef.current.getContext('2d')
    const squareLength = canvasRef.current.width
    if (!ctx) return

    ctx.clearRect(0, 0, squareLength, squareLength)
    ctx.beginPath()
    for (let i = 50; i < squareLength; i += 50) {
      ctx.moveTo(squareLength - i, 0)
      ctx.lineTo(squareLength - i, squareLength)
      ctx.moveTo(0, squareLength - i)
      ctx.lineTo(squareLength, squareLength - i)
      ctx.strokeStyle = 'darkgray'
      ctx.stroke()
    }
    ctx.closePath()

    animals.forEach(animal =>
      draw(
        ctx,
        squareLength,
        animal.location.latitude,
        animal.location.longitude,
        animal.type,
      ),
    )
  }, [animals])

  React.useLayoutEffect(() => {
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
      <h1>Current: {time}</h1>
      <Canvas width="500" height="500" ref={canvasRef} />
      <HistoryContainer>
        {animals.map((item, i) => {
          const ctx = canvasRef.current?.getContext('2d')
          if (ctx) {
            draw(
              ctx,
              500,
              item.location.latitude,
              item.location.longitude,
              item.type,
            )
          }
          return (
            // eslint-disable-next-line react/no-array-index-key
            <div key={item.createdAt * (i + 1)}>{JSON.stringify(item)}</div>
          )
        })}
      </HistoryContainer>
    </div>
  )
}

export default Grid
