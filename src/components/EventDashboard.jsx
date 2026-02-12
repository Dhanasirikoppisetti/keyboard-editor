import { useEffect, useState } from "react"

export default function EventDashboard() {
  const [logs, setLogs] = useState([])

  function formatKey(key) {
    if (key === " ") return "[SPACE]"
    if (key === "Enter") return "[ENTER]"
    if (key === "Backspace") return "[BACKSPACE]"
    if (!key) return ""
    return key
  }

  useEffect(() => {
    const editor = document.querySelector(
      '[data-test-id="editor-input"]'
    )
    if (!editor) return

    function logEvent(e) {
      setLogs((prev) => [
        ...prev,
        `${e.type} | key=${formatKey(e.key)}`
      ])
    }

    function logAction(e) {
      setLogs((prev) => [...prev, e.detail])
    }

    const events = [
      "keydown",
      "keyup",
      "input",
      "compositionstart",
      "compositionupdate",
      "compositionend"
    ]

    events.forEach((type) =>
      editor.addEventListener(type, logEvent)
    )

    window.addEventListener("editor-action", logAction)

    return () => {
      events.forEach((type) =>
        editor.removeEventListener(type, logEvent)
      )

      window.removeEventListener("editor-action", logAction)
    }
  }, [])

  return (
    <div data-test-id="event-dashboard">
      <h3>Event Dashboard</h3>
      <div
        data-test-id="event-log-list"
        style={{ maxHeight: "80vh", overflowY: "auto" }}
      >
        {logs.map((log, index) => (
          <div key={index} data-test-id="event-log-entry">
            {log}
          </div>
        ))}
      </div>
    </div>
  )
}
