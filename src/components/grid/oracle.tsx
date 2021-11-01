import React from 'react'
import CssGrid from './grid'
import spawn from '../utils/spawn'
import type {AnimalsType} from '../../../types/animals'

function CssOracle() {
  const historyRef = React.useRef<AnimalsType>([])
  const sheepsRef = React.useRef<AnimalsType>([])
  const redZonesRef = React.useRef<AnimalsType>([])
  const blueZonesRef = React.useRef<AnimalsType>([])
  const combined = React.useRef<AnimalsType>([])

  React.useEffect(() => {
    setInterval(() => {
      const animal = spawn(500, 0.1)
      if (combined.current.length > 20) {
        combined.current.splice(19, combined.current.length - 1)
      }
      combined.current.unshift(animal)
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
      <CssGrid
        animals={sheepsRef.current}
        wolfs={redZonesRef.current}
        bears={blueZonesRef.current}
        history={historyRef.current}
        combined={combined.current}
      />
    </div>
  )
}

export default CssOracle
