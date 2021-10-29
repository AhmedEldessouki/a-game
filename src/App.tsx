import React from 'react'
import {Canvas} from '@react-three/fiber'
import {OrbitControls, Stars} from '@react-three/drei'
import styled from '@emotion/styled'
import FiberOracle from './components/3d/oracle'
import CssOracle from './components/grid/oracle'
import {Circle, Plane} from './components/3d/circle'
import './App.css'
import {Physics} from '@react-three/cannon'

type Target = 'Fiber' | 'Css'

const Btn = styled.button``

function Switch({target}: {target: Target}) {
  switch (target) {
    case 'Fiber':
      return (
        <div className="App">
          {/* <main className="App-header"> */}
          {/* <FiberOracle aria-describedby="Fiber" /> */}
          {/* </main> */}
          <Canvas style={{width: '98vw', height: '98vh'}}>
            {/* @ts-ignore */}
            <OrbitControls />
            <Stars />
            <ambientLight intensity={0.5} />
            <spotLight position={[10, 15, 10]} angle={0.3} />
            <Physics>
              <Circle />
              <Plane />
            </Physics>
          </Canvas>
        </div>
      )
    case 'Css':
      return (
        <div className="App">
          <main className="App-header">
            <CssOracle aria-describedby="Css" />
          </main>
        </div>
      )

    default:
      return (
        <div className="App">
          <main className="App-header">
            <h1>The Value You Passed To [Switch] Component Is not Handled</h1>
          </main>
        </div>
      )
  }
}
function App() {
  const [target, setTarget] = React.useState<Target>('Fiber')
  return (
    <div className="App">
      <header className="App-header">
        <button
          type="button"
          onClick={() => setTarget('Fiber')}
          disabled={target === 'Fiber'}
          id="Fiber"
          aria-disabled={target === 'Fiber'}
        >
          Fiber
        </button>
        <button
          type="button"
          onClick={() => setTarget('Css')}
          disabled={target === 'Css'}
          id="Css"
          aria-disabled={target === 'Css'}
        >
          Css
        </button>
      </header>
      <main className="App-main">
        <Switch target={target} />
      </main>
    </div>
  )
}

export default App
