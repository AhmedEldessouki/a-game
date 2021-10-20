import React from 'react'
import styled from '@emotion/styled'
import faker from 'faker'

const Canvas = styled.canvas`
  background: #1eff61a1;
  border-radius: 2px;
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

  ctx.fillText(text, longitude, latitude)
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillStyle = `white`
  ctx.font = `13px sans-serif`
  ctx.ellipse(longitude, latitude, radius, radius, Math.PI / 4, 0, 2 * Math.PI)
  ctx.stroke()
}

function spawn(ctx: CanvasRenderingContext2D, squareLength: number) {
  // ? Sheep s > 0 && s <= 100
  // ? Wolf w > 101 && w <= 110 Radius: 15%
  // ? Bear b > 111 && b <= 115 Radius: 20%
  const num = faker.datatype.number(115)
  const latitude = Number(faker.address.latitude(500, 0.1))
  const longitude = Number(faker.address.longitude(500, 0.1))

  if (num < 101) {
    draw(ctx, squareLength, latitude, longitude, 'sheep')
  } else if (num < 111) {
    draw(ctx, squareLength, latitude, longitude, 'wolf')
  } else {
    draw(ctx, squareLength, latitude, longitude, 'bear')
  }
}

function Grid() {
  const [time, setTime] = React.useState(`${new Date()
    .getHours()
    .toString()
    .padStart(2, '0')}:${new Date().getMinutes().toString().padStart(2, '0')}:
  ${new Date().getSeconds().toString().padStart(2, '0')}`)
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  React.useEffect(() => {
    if (!canvasRef.current) return
    const ctx = canvasRef.current.getContext('2d')
    if (!ctx) return
    const squareLength = canvasRef.current.width
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
    // draw(ctx, squareLength)
  }, [])

  React.useEffect(() => {
    if (!canvasRef.current) return
    const ctx = canvasRef.current.getContext('2d')
    if (!ctx) return
    const squareLength = canvasRef.current.width
    setInterval(() => spawn(ctx, squareLength), 1000)
  }, [])

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
      <h1>{time}</h1>
      <Canvas width="500" height="500" ref={canvasRef} />
    </div>
  )
}

export default Grid
