import { useState } from 'react'
import './App.css'

interface Note {
  id: string
  content: string
  createdAt: Date
}

function App() {
  const [notes, setNotes] = useState<Note[]>([])
  const [newNote, setNewNote] = useState('')

  const addNote = () => {
    if (!newNote.trim()) return
    const note: Note = {
      id: Date.now().toString(),
      content: newNote,
      createdAt: new Date()
    }
    setNotes([note, ...notes])
    setNewNote('')
  }

  const deleteNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id))
  }

  return (
    <div className="container">
      <h1 className="title">Not Defteri</h1>
      <div className="input-section">
        <textarea
          className="note-input"
          placeholder="Yeni not..."
          value={newNote}
          onChange={e => setNewNote(e.target.value)}
        />
        <button className="add-btn" onClick={addNote}>Ekle</button>
      </div>
      <div className="notes-list">
        {notes.map(note => (
          <div key={note.id} className="note-card">
            <p className="note-content">{note.content}</p>
            <button className="delete-btn" onClick={() => deleteNote(note.id)}>Sil</button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App