import { useEffect, useRef, useState } from "react"

const HIGHLIGHT_DELAY = 200

export default function Editor() {
  const [content, setContent] = useState("")
  const editorRef = useRef(null)

  const undoStack = useRef([""])
  const redoStack = useRef([])

  const highlightTimer = useRef(null)
  const highlightCount = useRef(0)

  const chordTimer = useRef(null)
  const awaitingChord = useRef(false)

  const lastCommittedLength = useRef(0)

  /* ===============================
     EXPOSE REQUIRED FUNCTIONS
     =============================== */
  useEffect(() => {
    window.getEditorState = () => ({
      content,
      historySize: undoStack.current.length
    })

    window.getHighlightCallCount = () => highlightCount.current
  }, [content])

  /* ===============================
     HISTORY
     =============================== */
  function commitState(value) {
    if (undoStack.current[undoStack.current.length - 1] !== value) {
      undoStack.current.push(value)
      redoStack.current = []
      lastCommittedLength.current = value.length
    }
  }

  function undo() {
    if (undoStack.current.length > 1) {
      const current = undoStack.current.pop()
      redoStack.current.push(current)
      setContent(undoStack.current[undoStack.current.length - 1])
    }
  }

  function redo() {
    if (redoStack.current.length > 0) {
      const value = redoStack.current.pop()
      undoStack.current.push(value)
      setContent(value)
    }
  }

  /* ===============================
     PROFESSIONAL INPUT HANDLING
     =============================== */
  function handleInput(e) {
    const value = e.target.value
    setContent(value)

    const diff = value.length - lastCommittedLength.current

    // Commit on:
    // - Space
    // - Enter
    // - Large paste
    if (
      value.endsWith(" ") ||
      value.endsWith("\n") ||
      Math.abs(diff) > 1
    ) {
      commitState(value)
    }

    // Debounced highlight
    clearTimeout(highlightTimer.current)
    highlightTimer.current = setTimeout(() => {
      highlightCount.current++
    }, HIGHLIGHT_DELAY)
  }

  /* ===============================
     LINE HELPERS
     =============================== */
  function getLineStart(value, pos) {
    return value.lastIndexOf("\n", pos - 1) + 1
  }

  function getLine(value, pos) {
    const start = getLineStart(value, pos)
    const end = value.indexOf("\n", pos)
    return value.slice(start, end === -1 ? value.length : end)
  }

  /* ===============================
     KEYBOARD HANDLER
     =============================== */
  function handleKeyDown(e) {
    const isMac = navigator.platform.toUpperCase().includes("MAC")
    const mod = isMac ? e.metaKey : e.ctrlKey

    const el = editorRef.current
    const value = el.value
    const pos = el.selectionStart

    /* SAVE */
    if (mod && e.key.toLowerCase() === "s") {
      e.preventDefault()
      window.dispatchEvent(
        new CustomEvent("editor-action", { detail: "Action: Save" })
      )
      return
    }

    /* UNDO */
    if (mod && e.key === "z" && !e.shiftKey) {
      e.preventDefault()
      undo()
      return
    }

    /* REDO */
    if (mod && e.shiftKey && e.key.toLowerCase() === "z") {
      e.preventDefault()
      redo()
      return
    }

    /* TAB */
    if (e.key === "Tab") {
      e.preventDefault()

      let updated

      if (e.shiftKey) {
        const lineStart = getLineStart(value, pos)
        if (value.slice(lineStart, lineStart + 2) === "  ") {
          updated =
            value.slice(0, lineStart) +
            value.slice(lineStart + 2)

          setContent(updated)
          setTimeout(() => {
            el.setSelectionRange(pos - 2, pos - 2)
          }, 0)
          commitState(updated)
        }
      } else {
        updated =
          value.slice(0, pos) +
          "  " +
          value.slice(pos)

        setContent(updated)
        setTimeout(() => {
          el.setSelectionRange(pos + 2, pos + 2)
        }, 0)
        commitState(updated)
      }
      return
    }

    /* ENTER WITH INDENT */
    if (e.key === "Enter") {
      e.preventDefault()

      const line = getLine(value, pos)
      const indent = line.match(/^ */)[0]

      const updated =
        value.slice(0, pos) +
        "\n" +
        indent +
        value.slice(pos)

      setContent(updated)
      setTimeout(() => {
        el.setSelectionRange(
          pos + 1 + indent.length,
          pos + 1 + indent.length
        )
      }, 0)
      commitState(updated)
      return
    }

    /* COMMENT TOGGLE */
    if (mod && e.key === "/") {
      e.preventDefault()

      const lineStart = getLineStart(value, pos)
      const line = getLine(value, pos)

      let updated

      if (line.startsWith("// ")) {
        updated =
          value.slice(0, lineStart) +
          line.slice(3) +
          value.slice(lineStart + line.length)
      } else {
        updated =
          value.slice(0, lineStart) +
          "// " +
          line +
          value.slice(lineStart + line.length)
      }

      setContent(updated)
      commitState(updated)
      return
    }

    /* CHORD */
    if (mod && e.key.toLowerCase() === "k") {
      e.preventDefault()
      awaitingChord.current = true

      clearTimeout(chordTimer.current)
      chordTimer.current = setTimeout(() => {
        awaitingChord.current = false
      }, 2000)
      return
    }

    if (awaitingChord.current && mod && e.key.toLowerCase() === "c") {
      e.preventDefault()
      awaitingChord.current = false
      clearTimeout(chordTimer.current)

      window.dispatchEvent(
        new CustomEvent("editor-action", {
          detail: "Action: Chord Success"
        })
      )
      return
    }
  }

  return (
    <div data-test-id="editor-container">
      <textarea
        ref={editorRef}
        data-test-id="editor-input"
        role="textbox"
        aria-multiline="true"
        tabIndex={0}
        value={content}
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        spellCheck={false}
      />
    </div>
  )
}
