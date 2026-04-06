import { useState, useMemo } from 'react'
import './App.css'

type Priority = 'low' | 'medium' | 'high'

interface Note {
  id: string
  title: string
  content: string
  createdAt: Date
  priority: Priority
  folder: string
  tags: string[]
}

const FOLDERS = ['Projeler', 'Kişisel Gelişim', 'İş Toplantıları', 'Seyahat Planları']

const INITIAL_NOTES: Note[] = [
  {
    id: '1',
    title: 'Yeni Tasarım Fikirleri',
    content: 'Uygulama için yeni bir renk paleti düşünüyorum. Koyu tema daha iyi olabilir.',
    createdAt: new Date('2026-04-05T10:30:00'),
    priority: 'high',
    folder: 'Projeler',
    tags: ['tasarım', 'fikir']
  },
  {
    id: '2',
    title: 'Haftalık Rapor',
    content: 'Bu haftaki ilerlemeler: 3 yeni özellik eklendi, 2 hata düzeltildi.',
    createdAt: new Date('2026-04-04T14:20:00'),
    priority: 'medium',
    folder: 'İş Toplantıları',
    tags: ['rapor']
  },
  {
    id: '3',
    title: 'Kitap Listesi',
    content: 'Okumak istediğim kitaplar: Atomic Habits, Derin Çalışma, Sapiens.',
    createdAt: new Date('2026-04-03T09:00:00'),
    priority: 'low',
    folder: 'Kişisel Gelişim',
    tags: ['kitap']
  }
]

function App() {
  const [notes, setNotes] = useState<Note[]>(INITIAL_NOTES)
  const [searchQuery, setSearchQuery] = useState('')
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'all'>('all')
  const [activeNav, setActiveNav] = useState('notes')
  const [showModal, setShowModal] = useState(false)
  const [editingNote, setEditingNote] = useState<Note | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    priority: 'low' as Priority,
    folder: 'Projeler',
    tags: [] as string[]
  })
  const [tagInput, setTagInput] = useState('')

  const filteredNotes = useMemo(() => {
    return notes.filter(note => {
      const matchesSearch = 
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesPriority = priorityFilter === 'all' || note.priority === priorityFilter
      return matchesSearch && matchesPriority
    })
  }, [notes, searchQuery, priorityFilter])

  const getPriorityIcon = (priority: Priority) => {
    switch (priority) {
      case 'low': return 'low_priority'
      case 'medium': return 'priority_high'
      case 'high': return 'report'
    }
  }

  const getPriorityLabel = (priority: Priority) => {
    switch (priority) {
      case 'low': return 'Düşük'
      case 'medium': return 'Orta'
      case 'high': return 'Yüksek'
    }
  }

  const getPriorityClass = (priority: Priority) => {
    switch (priority) {
      case 'low': return 'priority-low'
      case 'medium': return 'priority-medium'
      case 'high': return 'priority-high'
    }
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

  const openNewNoteModal = () => {
    setEditingNote(null)
    setFormData({ title: '', content: '', priority: 'low', folder: 'Projeler', tags: [] })
    setTagInput('')
    setShowModal(true)
  }

  const openEditNoteModal = (note: Note) => {
    setEditingNote(note)
    setFormData({
      title: note.title,
      content: note.content,
      priority: note.priority,
      folder: note.folder,
      tags: [...note.tags]
    })
    setTagInput('')
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingNote(null)
  }

  const handleSaveNote = () => {
    if (!formData.title.trim() || !formData.content.trim()) return

    if (editingNote) {
      setNotes(notes.map(n => 
        n.id === editingNote.id 
          ? { ...n, ...formData }
          : n
      ))
    } else {
      const newNote: Note = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date()
      }
      setNotes([newNote, ...notes])
    }
    closeModal()
  }

  const deleteNote = (id: string) => {
    setNotes(notes.filter(n => n.id !== id))
  }

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] })
      setTagInput('')
    }
  }

  const removeTag = (tag: string) => {
    setFormData({ ...formData, tags: formData.tags.filter(t => t !== tag) })
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTag()
    }
  }

  return (
    <div className="app">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h1 className="sidebar-title">Digital Atelier</h1>
          <p className="sidebar-subtitle">Not Defteri v2</p>
        </div>
        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${activeNav === 'notes' ? 'active' : ''}`}
            onClick={() => setActiveNav('notes')}
          >
            <span className="material-symbols-outlined">description</span>
            <span>Notlarım</span>
          </button>
          <button 
            className={`nav-item ${activeNav === 'favorites' ? 'active' : ''}`}
            onClick={() => setActiveNav('favorites')}
          >
            <span className="material-symbols-outlined">star</span>
            <span>Favoriler</span>
          </button>
          <button 
            className={`nav-item ${activeNav === 'archive' ? 'active' : ''}`}
            onClick={() => setActiveNav('archive')}
          >
            <span className="material-symbols-outlined">archive</span>
            <span>Arşiv</span>
          </button>
          <button 
            className={`nav-item ${activeNav === 'trash' ? 'active' : ''}`}
            onClick={() => setActiveNav('trash')}
          >
            <span className="material-symbols-outlined">delete</span>
            <span>Çöp Kutusu</span>
          </button>
        </nav>
        <button className="new-note-btn" onClick={openNewNoteModal}>
          <span className="material-symbols-outlined">add</span>
          Yeni Not
        </button>
        <div className="sidebar-footer">
          <button className="nav-item">
            <span className="material-symbols-outlined">settings</span>
            <span>Ayarlar</span>
          </button>
          <button className="nav-item">
            <span className="material-symbols-outlined">help</span>
            <span>Yardım</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Top Bar */}
        <header className="top-bar">
          <div className="top-bar-left">
            <span className="brand-text">Digital Atelier</span>
            <nav className="top-nav">
              <button className="top-nav-item active">Klasörler</button>
              <button className="top-nav-item">Etiketler</button>
            </nav>
          </div>
          <div className="top-bar-right">
            <div className="search-wrapper">
              <span className="material-symbols-outlined search-icon">search</span>
              <input 
                type="text"
                className="search-input"
                placeholder="Notlarda ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="top-icons">
              <span className="material-symbols-outlined top-icon">notifications</span>
              <span className="material-symbols-outlined top-icon">account_circle</span>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="content-area">
          {/* Filter Bar */}
          <div className="filter-bar">
            <div className="filter-group">
              <button 
                className={`filter-btn ${priorityFilter === 'all' ? 'active' : ''}`}
                onClick={() => setPriorityFilter('all')}
              >
                Tümü
              </button>
              <button 
                className={`filter-btn ${priorityFilter === 'high' ? 'active' : ''}`}
                onClick={() => setPriorityFilter('high')}
              >
                Yüksek
              </button>
              <button 
                className={`filter-btn ${priorityFilter === 'medium' ? 'active' : ''}`}
                onClick={() => setPriorityFilter('medium')}
              >
                Orta
              </button>
              <button 
                className={`filter-btn ${priorityFilter === 'low' ? 'active' : ''}`}
                onClick={() => setPriorityFilter('low')}
              >
                Düşük
              </button>
            </div>
            <span className="note-count">{filteredNotes.length} not</span>
          </div>

          {/* Notes Grid */}
          {filteredNotes.length === 0 ? (
            <div className="empty-state">
              <span className="material-symbols-outlined empty-icon">edit_note</span>
              <h3 className="empty-title">Henüz not yok</h3>
              <p className="empty-text">Yeni not eklemek için "Yeni Not" butonuna tıklayın</p>
            </div>
          ) : (
            <div className="notes-grid">
              {filteredNotes.map(note => (
                <div key={note.id} className="note-card">
                  <div className="note-header">
                    <span className="note-id">#{note.id.slice(-6)}</span>
                    <span className={`priority-chip ${getPriorityClass(note.priority)}`}>
                      <span className="material-symbols-outlined priority-icon">
                        {getPriorityIcon(note.priority)}
                      </span>
                      {getPriorityLabel(note.priority)}
                    </span>
                  </div>
                  <h3 className="note-title">{note.title}</h3>
                  <p className="note-content">{note.content}</p>
                  <div className="note-footer">
                    <span className="note-date">{formatDate(note.createdAt)}</span>
                    <div className="note-actions">
                      <button 
                        className="note-action-btn"
                        onClick={() => openEditNoteModal(note)}
                        aria-label="Düzenle"
                      >
                        <span className="material-symbols-outlined">edit</span>
                      </button>
                      <button 
                        className="note-action-btn delete"
                        onClick={() => deleteNote(note.id)}
                        aria-label="Sil"
                      >
                        <span className="material-symbols-outlined">delete</span>
                      </button>
                    </div>
                  </div>
                  {note.tags.length > 0 && (
                    <div className="note-tags">
                      {note.tags.map(tag => (
                        <span key={tag} className="tag">#{tag}</span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span className="modal-subtitle">DÜZENLENİYOR: {editingNote ? 'MEVCUT NOT' : 'YENİ TASLAK'}</span>
                <h2 className="modal-title">Fikir Atölyesi <span className="text-primary">.</span></h2>
              </div>
              <div className="modal-actions">
                <button className="btn-secondary" onClick={closeModal}>İptal</button>
                <button className="btn-primary" onClick={handleSaveNote}>
                  <span className="material-symbols-outlined">save</span>
                  Kaydet
                </button>
              </div>
            </div>

            <div className="modal-body">
              <div className="modal-main">
                <div className="form-group">
                  <label className="form-label">Başlık</label>
                  <input
                    type="text"
                    className="form-input title-input"
                    placeholder="Notunuzun başlığı..."
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">İçerik</label>
                  <textarea
                    className="form-input content-input"
                    placeholder="Düşüncelerinizi buraya dökün..."
                    rows={8}
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-sidebar">
                <div className="form-group">
                  <label className="form-label">Önem Derecesi</label>
                  <div className="priority-options">
                    {(['low', 'medium', 'high'] as Priority[]).map(p => (
                      <label key={p} className={`priority-option ${formData.priority === p ? 'selected' : ''}`}>
                        <input
                          type="radio"
                          name="priority"
                          checked={formData.priority === p}
                          onChange={() => setFormData({ ...formData, priority: p })}
                          className="hidden"
                        />
                        <div className={`priority-option-icon ${getPriorityClass(p)}`}>
                          <span className="material-symbols-outlined">
                            {getPriorityIcon(p)}
                          </span>
                        </div>
                        <div>
                          <p className="priority-option-label">{getPriorityLabel(p)}</p>
                          <p className="priority-option-desc">
                            {p === 'low' ? 'Genel düşünceler' : p === 'medium' ? 'Takip gerektirir' : 'Acil eylem planı'}
                          </p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Klasör</label>
                  <select
                    className="form-select"
                    value={formData.folder}
                    onChange={(e) => setFormData({ ...formData, folder: e.target.value })}
                  >
                    {FOLDERS.map(f => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Etiketler</label>
                  <div className="tags-container">
                    {formData.tags.map(tag => (
                      <span key={tag} className="tag-chip">
                        #{tag}
                        <button className="tag-remove" onClick={() => removeTag(tag)}>
                          <span className="material-symbols-outlined">close</span>
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="tag-input-wrapper">
                    <input
                      type="text"
                      className="form-input tag-input"
                      placeholder="Yeni etiket..."
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                    />
                    <button className="tag-add-btn" onClick={addTag}>
                      <span className="material-symbols-outlined">add_circle</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App