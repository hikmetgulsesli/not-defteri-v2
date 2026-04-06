import { useState, useEffect } from 'react'
import './App.css'

interface Note {
  id: string
  content: string
  createdAt: Date
  priority: 'low' | 'medium' | 'high'
}

function App() {
  const [notes, setNotes] = useState<Note[]>([])
  const [newNote, setNewNote] = useState('')
  const [charCount, setCharCount] = useState(0)

  useEffect(() => {
    setCharCount(newNote.length)
  }, [newNote])

  const addNote = () => {
    if (!newNote.trim()) return
    const note: Note = {
      id: Date.now().toString(),
      content: newNote,
      createdAt: new Date(),
      priority: newNote.length > 200 ? 'high' : newNote.length > 100 ? 'medium' : 'low'
    }
    setNotes([note, ...notes])
    setNewNote('')
  }

  const deleteNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id))
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).toUpperCase()
  }

  return (
    <div className="container">
      {/* Header */}
      <header className="header">
        <div className="logo">The Obsidian Manuscript</div>
        <h1 className="title">Not Defteri</h1>
        <p className="subtitle"> düşüncelerinizi özenle kaydedin</p>
      </header>

      {/* Input Section */}
      <section className="input-section">
        <div className="textarea-wrapper">
          <textarea
            className="note-input"
            placeholder="Yeni notunuzu buraya yazın..."
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            aria-label="Not içeriği"
          />
        </div>
        <div className="actions-row">
          <span className="char-count">{charCount} karakter</span>
          <button className="add-btn" onClick={addNote}>Ekle</button>
        </div>
      </section>

      {/* Notes List */}
      <div className="notes-list">
        <div className="section-divider">
          <span className="section-label">Notlarınız</span>
          <div className="divider-line"></div>
          <span className="timestamp">{notes.length} adet</span>
        </div>

        {notes.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <span className="material-symbols-outlined">edit_note</span>
            </div>
            <h3 className="empty-title">Henüz not yok</h3>
            <p className="empty-text">Yukarıdaki alandan ilk notunuzu ekleyin</p>
          </div>
        ) : (
          notes.map((note) => (
            <div key={note.id} className="note-card">
              <div className="note-header">
                <span className="note-id">#{note.id.slice(-6)}</span>
                <span className={`priority-chip ${note.priority}`}>
                  {note.priority === 'low' ? 'Düşük' : note.priority === 'medium' ? 'Orta' : 'Yüksek'}
                </span>
              </div>
              <p className="note-content">{note.content}</p>
              <div className="note-footer">
                <span className="timestamp">{formatDate(note.createdAt)}</span>
                <button className="delete-btn" onClick={() => deleteNote(note.id)}>
                  Sil
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default App
