import React from 'react'
import styled from '@emotion/styled'
import FiberOracle from './components/3d/oracle'
import CssOracle from './components/grid/oracle'
import './App.css'

type Target = 'Fiber' | 'Css'

const Btn = styled.button``

function Switch({target}: {target: Target}) {
  switch (target) {
    case 'Fiber':
      return (
        <div className="App">
          <main className="App-header">
            <FiberOracle aria-describedby="Fiber" />
          </main>
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
