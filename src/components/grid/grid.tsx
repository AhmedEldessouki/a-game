import React from 'react'
import styled from '@emotion/styled'
import type {AnimalsType} from './oracle'

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

function Grid({
  animals: sheeps,
  wolfs,
  bears,
  history,
}: {
  animals: AnimalsType
  wolfs?: AnimalsType
  bears?: AnimalsType
  history?: AnimalsType
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

    sheeps.forEach(animal =>
      draw(
        ctx,
        squareLength,
        animal.location.latitude,
        animal.location.longitude,
        animal.type,
        animal.color,
      ),
    )
    if (wolfs) {
      wolfs.forEach(wolf =>
        draw(
          ctx,
          squareLength,
          wolf.location.latitude,
          wolf.location.longitude,
          wolf.type,
          wolf.color,
        ),
      )
    }
    if (bears) {
      bears.forEach(bear =>
        draw(
          ctx,
          squareLength,
          bear.location.latitude,
          bear.location.longitude,
          bear.type,
          bear.color,
        ),
      )
    }
  }, [JSON.stringify(sheeps), JSON.stringify(bears), JSON.stringify(wolfs)])

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
          history.push(removedAnimal)
          if (history.length > 60) {
            history.splice(0, history.length - 61)
          }
        }
      }
      if (i < wolfs.length) {
        if (Date.now() - 60000 - wolfs[i].createdAt < 0) return
        const removedAnimal = wolfs.shift()
        if (removedAnimal) {
          console.log(`${removedAnimal.type} Is Dead`)
          history.push(removedAnimal)
          if (history.length > 60) {
            history.splice(0, history.length - 61)
          }
        }
      }
      if (i < bears.length) {
        if (Date.now() - 60000 - bears[i].createdAt < 0) return
        const removedAnimal = bears.shift()
        if (removedAnimal) {
          console.log(`${removedAnimal.type} Is Dead`)
          history.push(removedAnimal)
          if (history.length > 60) {
            history.splice(59, history.length - 1)
          }
        }
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
        if (type === 'sheep') {
          if (
            location.latitude <= wolf.location.latitude + 500 * 0.15 &&
            location.latitude >= wolf.location.latitude - 500 * 0.15 &&
            location.longitude <= wolf.location.longitude + 500 * 0.15 &&
            location.longitude >= wolf.location.longitude - 500 * 0.15
          ) {
            console.log(`A Wolf Has Eaten a ${type}`)
            const removedAnimal = sheeps.splice(x, 1)
            wolf.location = removedAnimal[0].location
            history.unshift(removedAnimal[0])
          }
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
        if (type === 'wolf') {
          if (
            location.latitude <= bear.location.latitude + 500 * 0.2 &&
            location.latitude >= bear.location.latitude - 500 * 0.2 &&
            location.longitude <= bear.location.longitude + 500 * 0.2 &&
            location.longitude >= bear.location.longitude - 500 * 0.2
          ) {
            console.log(`A Bear Has Eaten a ${type}`)
            const removedAnimal = wolfs.splice(x, 1)
            bear.location = removedAnimal[0].location
            history.unshift(removedAnimal[0])
          }
        }
      }
    }
  }, [JSON.stringify(bears), JSON.stringify(history), JSON.stringify(wolfs)])

  return (
    <div>
      <h1>Current: {time}</h1>
      <Canvas width="500" height="500" ref={canvasRef} />
      <HistoryContainer>
        {sheeps.map((item, i) => (
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
