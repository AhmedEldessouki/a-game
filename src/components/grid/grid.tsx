import React from 'react'
import styled from '@emotion/styled'

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
  justify-content: flex-start;
  align-items: center;
  overflow: auto;
`
function draw(
  ctx: CanvasRenderingContext2D,
  squareLength: number,
  latitude: number,
  longitude: number,
  text: string,
  color: string,
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
  ctx.fillStyle = color
  ctx.font = `13px sans-serif`
  ctx.fillText(text, longitude, latitude)
  ctx.ellipse(longitude, latitude, radius, radius, Math.PI / 4, 0, 2 * Math.PI)
  ctx.stroke()

  ctx.closePath()
  ctx.restore()
}

type SpawnAbleAnimals = 'sheep' | 'wolf' | 'bear'

function Grid({
  animals,
  wolfs,
  bears,
  history,
}: {
  animals: {
    type: SpawnAbleAnimals
    location: {latitude: number; longitude: number}
    createdAt: number
    color: string
  }[]
  wolfs?: {
    latitude: number
    longitude: number
  }[]
  bears?: {
    latitude: number
    longitude: number
  }[]
  history?: {
    type: SpawnAbleAnimals
    location: {latitude: number; longitude: number}
    createdAt: number
    color: string
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
        animal.color,
      ),
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(animals)])

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

  React.useEffect(() => {
    if (!history) return
    if (!bears) return
    if (!wolfs) return
    if (animals.length <= 0) return
    for (let i = 0; i < animals.length; i += 1) {
      if (Date.now() - 60000 - animals[i].createdAt < 0) return
      const removedAnimal = animals.shift()
      if (removedAnimal) {
        console.log(
          `${removedAnimal.type} Is Dead`,
          Date.now() - 60000 - removedAnimal.createdAt > 0,
          Date.now() - 60000 - removedAnimal.createdAt,
        )
        if (removedAnimal.type === 'wolf') {
          wolfs.shift()
        } else if (removedAnimal.type === 'bear') {
          bears.shift()
        }
        history.push(removedAnimal)
        if (history.length > 60) {
          history.splice(0, history.length - 61)
        }
      }
    }
  }, [
    JSON.stringify(animals),
    JSON.stringify(bears),
    JSON.stringify(history),
    JSON.stringify(wolfs),
  ])

  return (
    <div>
      <h1>Current: {time}</h1>
      <Canvas width="500" height="500" ref={canvasRef} />
      <HistoryContainer>
        {animals.map((item, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <div key={item.createdAt * (i + 1)}>{JSON.stringify(item)}</div>
        ))}
      </HistoryContainer>
      <HistoryContainer>
        {history &&
          history.map(({type, location, createdAt}, i) => (
            // eslint-disable-next-line react/no-array-index-key
            <React.Fragment key={createdAt * (i + 10)}>
              <h2>{type}</h2>
              <div>
                <h3>{location.latitude}</h3>
                <h3>{location.longitude}</h3>
              </div>
              <span>{createdAt}</span>
            </React.Fragment>
          ))}
      </HistoryContainer>
    </div>
  )
}

export default Grid
