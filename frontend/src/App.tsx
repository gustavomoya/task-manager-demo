import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
      <main className="min-h-screen bg-slate-100 flex items-center justify-center">
        <h1 className="text-4xl font-bold text-blue-600">
          Task Manager
        </h1>
      </main>
  )
}

export default App
