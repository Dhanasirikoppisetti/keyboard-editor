# High-Performance Code Editor with Advanced Keyboard Event Handling

## 📌 Overview

This project is a browser-based code editor built using React and containerized with Docker.  
The goal was to implement advanced keyboard event handling similar to modern editors like VS Code.

The editor supports complex shortcut combinations, undo/redo history management, indentation handling, comment toggling, and a real-time event debugging dashboard.

This project focuses on understanding:

- JavaScript keyboard events (`keydown`, `input`, `composition`)
- Cross-platform shortcut handling (Ctrl / Cmd)
- State management for undo/redo
- Debouncing for performance optimization
- Docker-based containerization
- Accessibility best practices

---

## 🚀 Features

### ✍️ Editor Capabilities

- Standard text input and paste support
- Real-time keyboard event logging
- Professional undo/redo stack
- Cross-platform shortcut handling (Windows/Linux/Mac)

### ⌨️ Implemented Shortcuts

| Shortcut | Action |
|-----------|--------|
| Ctrl / Cmd + S | Save action (prevents browser default) |
| Ctrl / Cmd + Z | Undo |
| Ctrl / Cmd + Shift + Z | Redo |
| Tab | Insert 2-space indentation |
| Shift + Tab | Remove 2-space indentation |
| Enter | Preserve indentation level |
| Ctrl / Cmd + / | Toggle comment on current line |
| Ctrl / Cmd + K → Ctrl / Cmd + C | Chord shortcut action |

---

## 🧠 Undo / Redo Implementation

Undo and redo are implemented using two stacks:

- `undoStack`
- `redoStack`

History is committed intelligently:

- On space or enter
- On structural changes (tab, comment toggle)
- On paste or multi-character changes

This prevents random per-letter undo behavior and provides a professional editing experience.

---

## ⚡ Performance Optimization

A simulated syntax highlighting function is implemented and debounced.

- Highlight logic runs only after 200ms of inactivity
- `window.getHighlightCallCount()` is exposed for verification
- Rapid typing triggers only one highlight execution

This ensures high performance during continuous typing.

---

## 🖥 Event Debugging Dashboard

The application includes a real-time event dashboard that logs:

- `keydown`
- `keyup`
- `input`
- `compositionstart`
- `compositionupdate`
- `compositionend`
- Custom actions (Save, Chord Success)

This allows visualization of event firing order and helps validate behavior.

---

## 🔍 Exposed Verification Functions

For automated evaluation:

```javascript
window.getEditorState()
Returns:

{
  content: "current editor content",
  historySize: number
}
```
window.getHighlightCallCount()
Returns:
Number of highlight executions
## 🐳 Docker Setup
Build and Run
docker-compose up --build
The application runs on:

http://localhost:3000
## Health Check
Docker includes a health check to ensure the development server is running before evaluation.

## 📁 Project Structure
``` bash
keyboard-editor/
│
├── src/
│   ├── components/
│   │   ├── Editor.jsx
│   │   └── EventDashboard.jsx
│   ├── App.jsx
│   └── main.jsx
│
├── docker-compose.yml
├── Dockerfile
├── .env.example
└── package.json
```

## 🌍 Cross-Platform Support
The editor automatically detects:

event.ctrlKey for Windows/Linux

event.metaKey for macOS

This ensures shortcuts work correctly across operating systems.

## ♿ Accessibility
The editor uses:

role="textbox"

aria-multiline="true"

Tab behavior is overridden intentionally to maintain editor focus while still supporting indentation.

## ✅ Requirements Coverage
All core requirements from the assignment are satisfied:

Required DOM elements present

Keyboard event logging works

Save shortcut prevents default behavior

Indentation handling works

Enter preserves indentation

Undo/redo implemented correctly

Comment toggle works

Chord shortcut works

Debounce implemented

Cross-platform support implemented

Fully Dockerized

.env.example included

## 📌 Final Notes
This project was built to simulate a lightweight code editor while focusing heavily on:

Correct event sequencing

Shortcut handling

State synchronization

Performance awareness

The implementation prioritizes correctness, clarity, and testability.

## 🎥 Demo Video

[![Watch the demo](https://youtu.be/9rl-eUG12Fw)
