import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div id="top">
        <div id="logo">kμ</div>
        <div id="filter"></div>
        <div id="login">Login</div>
      </div>
    </>
  )
}

export default App
