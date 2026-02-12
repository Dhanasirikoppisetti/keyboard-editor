import { useEffect, useState } from "react"
import Editor from "./components/Editor"
import EventDashboard from "./components/EventDashboard"
import "./styles.css"

export default function App() {
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    document.body.classList.toggle("dark", darkMode)
  }, [darkMode])

  return (
    <>
      <div className="app-header">
        <div className="app-title">Keyboard Code Editor</div>
        <button className="mode-btn" onClick={() => setDarkMode(d => !d)}>
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>
      </div>

      <div className="main-layout">
        <Editor />
        <EventDashboard />
      </div>
    </>
  )
}
