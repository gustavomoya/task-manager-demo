import { useState } from 'react'
import './App.css'
import AppHeader from "./components/layout/AppHeader.tsx";
import {Route, Routes} from "react-router-dom";
import TasksPage from "./pages/TasksPage.tsx";
import CreateTaskPage from "./pages/CreateTaskPage.tsx";

function App() {
  const [count, setCount] = useState(0)

  return (
      <div className="min-h-screen bg-slate-50">
          <AppHeader/>

          <main className="mx-auto max-w-6xl px-6 py-8">
              <Routes>
                  <Route path="/" element={<TasksPage/>}/>
                  <Route path="/tasks/new" element={<CreateTaskPage/>}/>
              </Routes>
          </main>
      </div>
  )
}

export default App
