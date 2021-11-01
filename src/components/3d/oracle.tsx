import React from 'react'
import FiberGrid from './grid'
import spawn from '../utils/spawn'
import type {AnimalsType} from '../../../types/animals'

function FiberOracle() {
  const historyRef = React.useRef<AnimalsType>([])
  const sheepsRef = React.useRef<AnimalsType>([])
  const wolfsRef = React.useRef<AnimalsType>([])
  const bearsRef = React.useRef<AnimalsType>([])
  const combined = React.useRef<AnimalsType>([])

  React.useEffect(() => {
    setInterval(() => {
      const animal = spawn(250, -250)
      if (combined.current.length > 20) {
        combined.current.splice(19, combined.current.length - 1)
      }
      combined.current.unshift(animal)
      if (animal.type === 'wolf') {
        wolfsRef.current.push(animal)
      } else if (animal.type === 'bear') {
        bearsRef.current.push(animal)
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
      <FiberGrid
        sheeps={sheepsRef.current}
        wolfs={wolfsRef.current}
        bears={bearsRef.current}
        history={historyRef.current}
        combined={combined.current}
      />
    </div>
  )
}

export default FiberOracle
