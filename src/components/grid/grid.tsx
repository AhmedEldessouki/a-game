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

function Grid({
  animals,
  history,
}: {
  animals: {
    type: SpawnAbleAnimals
    location: {latitude: number; longitude: number}
    createdAt: number
  }[]
  history: {
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
        {history.map(({type, location, createdAt}, i) => (
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
