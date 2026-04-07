import { useState, useMemo, useCallback } from 'react'
import './App.css'

type Priority = 'low' | 'medium' | 'high'

interface Note {
  id: string
  title: string
  content: string
  createdAt: Date
  updatedAt: Date
  priority: Priority
  folder: string
  tags: string[]
}

interface NoteFormData {
  title: string
  content: string
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
    updatedAt: new Date('2026-04-05T10:30:00'),
    priority: 'high',
    folder: 'Projeler',
    tags: ['tasarım', 'fikir'],
  },
  {
    id: '2',
    title: 'Haftalık Rapor',
    content: 'Bu haftaki ilerlemeler: 3 yeni özellik eklendi, 2 hata düzeltildi.',
    createdAt: new Date('2026-04-04T14:20:00'),
    updatedAt: new Date('2026-04-04T14:20:00'),
    priority: 'medium',
    folder: 'İş Toplantıları',
    tags: ['rapor'],
  },
  {
    id: '3',
    title: 'Kitap Listesi',
    content: 'Okumak istediğim kitaplar: Atomic Habits, Derin Çalışma, Sapiens.',
    createdAt: new Date('2026-04-03T09:00:00'),
    updatedAt: new Date('2026-04-03T09:00:00'),
    priority: 'low',
    folder: 'Kişisel Gelişim',
    tags: ['kitap'],
  },
]

const EMPTY_FORM: NoteFormData = {
  title: '',
  content: '',
  priority: 'low',
  folder: 'Projeler',
  tags: [],
}

function App() {
  const [notes, setNotes] = useState<Note[]>(INITIAL_NOTES)
  const [searchQuery, setSearchQuery] = useState('')
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'all'>('all')
  const [activeNav, setActiveNav] = useState('notes')
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null)
  const [showEditor, setShowEditor] = useState(false)
  const [editingNote, setEditingNote] = useState<Note | null>(null)
  const [formData, setFormData] = useState<NoteFormData>(EMPTY_FORM)
  const [tagInput, setTagInput] = useState('')
  const [formErrors, setFormErrors] = useState<{ title?: string; content?: string }>({})

  const filteredNotes = useMemo(() => {
    return notes.filter((note) => {
      const matchesSearch =
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesPriority =
        priorityFilter === 'all' || note.priority === priorityFilter
      return matchesSearch && matchesPriority
    })
  }, [notes, searchQuery, priorityFilter])

  const selectedNote = useMemo(
    () => notes.find((n) => n.id === selectedNoteId) ?? null,
    [notes, selectedNoteId],
  )

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
      minute: '2-digit',
    })
  }

  const validateForm = useCallback((): boolean => {
    const errors: { title?: string; content?: string } = {}
    if (!formData.title.trim()) errors.title = 'Başlık zorunludur'
    if (!formData.content.trim()) errors.content = 'İçerik zorunludur'
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }, [formData])

  const handleOpenCreate = useCallback(() => {
    setEditingNote(null)
    setFormData(EMPTY_FORM)
    setTagInput('')
    setFormErrors({})
    setShowEditor(true)
  }, [])

  const handleOpenEdit = useCallback((note: Note) => {
    setEditingNote(note)
    setFormData({
      title: note.title,
      content: note.content,
      priority: note.priority,
      folder: note.folder,
      tags: [...note.tags],
    })
    setTagInput('')
    setFormErrors({})
    setShowEditor(true)
  }, [])

  const handleSaveNote = useCallback(() => {
    if (!validateForm()) return
    if (editingNote) {
      setNotes((prev) =>
        prev.map((n) =>
          n.id === editingNote.id
            ? { ...n, ...formData, tags: [...formData.tags], updatedAt: new Date() }
            : n,
        ),
      )
    } else {
      const newNote: Note = {
        id: Date.now().toString(),
        title: formData.title,
        content: formData.content,
        createdAt: new Date(),
        updatedAt: new Date(),
        priority: formData.priority,
        folder: formData.folder,
        tags: [...formData.tags],
      }
      setNotes((prev) => [newNote, ...prev])
      setSelectedNoteId(newNote.id)
    }
    setShowEditor(false)
    setEditingNote(null)
  }, [editingNote, formData, validateForm])

  const handleDeleteNote = useCallback(
    (id: string) => {
      setNotes((prev) => prev.filter((n) => n.id !== id))
      if (selectedNoteId === id) setSelectedNoteId(null)
    },
    [selectedNoteId],
  )

  const handleAddTag = useCallback(() => {
    const tag = tagInput.trim().toLowerCase()
    if (tag && !formData.tags.includes(tag)) {
      setFormData((prev) => ({ ...prev, tags: [...prev.tags, tag] }))
    }
    setTagInput('')
  }, [tagInput, formData.tags])

  const handleRemoveTag = useCallback((tag: string) => {
    setFormData((prev) => ({ ...prev, tags: prev.tags.filter((t) => t !== tag) }))
  }, [])

  const handleTagKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') { e.preventDefault(); handleAddTag() }
    },
    [handleAddTag],
  )

  const renderSidebar = () => (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h1 className="sidebar-brand">Digital Atelier</h1>
        <p className="sidebar-subtitle">Not Defteri v2</p>
      </div>
      <button className="new-note-btn" onClick={handleOpenCreate}>
        <span className="material-symbols-outlined">add</span>
        Yeni Not
      </button>
      <nav className="sidebar-nav">
        {[
          { key: 'notes', icon: 'description', label: 'Notlarım' },
          { key: 'favorites', icon: 'star', label: 'Favoriler' },
          { key: 'archive', icon: 'archive', label: 'Arşiv' },
          { key: 'trash', icon: 'delete', label: 'Çöp Kutusu' },
        ].map((item) => (
          <button
            key={item.key}
            className={`nav-item ${activeNav === item.key ? 'active' : ''}`}
            onClick={() => { setActiveNav(item.key); setSelectedNoteId(null); }}
          >
            <span className="material-symbols-outlined">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>
      <div className="sidebar-footer">
        <button className="nav-item" onClick={() => { setActiveNav('settings'); setSelectedNoteId(null); }}>
          <span className="material-symbols-outlined">settings</span>
          Ayarlar
        </button>
        <button className="nav-item" onClick={() => { setActiveNav('help'); setSelectedNoteId(null); }}>
          <span className="material-symbols-outlined">help</span>
          Yardım
        </button>
      </div>
    </aside>
  )

  if (showEditor) {
    return (
      <div className="app">
        <div className="modal-overlay" onClick={() => setShowEditor(false)}>
          <div className="modal-backdrop" />
        </div>
        <div className="editor-modal" role="dialog" aria-label={editingNote ? 'Not düzenle' : 'Yeni not oluştur'}>
          <div className="editor-header">
            <h2 className="editor-title">{editingNote ? 'Notu Düzenle' : 'Yeni Not'}</h2>
            <button className="editor-close-btn" onClick={() => setShowEditor(false)} aria-label="Kapat">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
          <div className="editor-body">
            <div className="form-group">
              <label className="form-label" htmlFor="note-title">Başlık</label>
              <input
                id="note-title"
                className={`form-input ${formErrors.title ? 'form-input-error' : ''}`}
                type="text"
                placeholder="Not başlığı..."
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                aria-label="Not başlığı"
              />
              {formErrors.title && <span className="form-error">{formErrors.title}</span>}
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="note-content">İçerik</label>
              <textarea
                id="note-content"
                className={`form-textarea ${formErrors.content ? 'form-input-error' : ''}`}
                placeholder="Not içeriğinizi yazın..."
                value={formData.content}
                onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
                rows={6}
                aria-label="Not içeriği"
              />
              {formErrors.content && <span className="form-error">{formErrors.content}</span>}
            </div>
            <div className="form-row">
              <div className="form-group form-group-half">
                <label className="form-label" htmlFor="note-priority">Öncelik</label>
                <select id="note-priority" className="form-select" value={formData.priority}
                  onChange={(e) => setFormData((prev) => ({ ...prev, priority: e.target.value as Priority }))}
                  aria-label="Not önceliği">
                  <option value="low">Düşük</option>
                  <option value="medium">Orta</option>
                  <option value="high">Yüksek</option>
                </select>
              </div>
              <div className="form-group form-group-half">
                <label className="form-label" htmlFor="note-folder">Klasör</label>
                <select id="note-folder" className="form-select" value={formData.folder}
                  onChange={(e) => setFormData((prev) => ({ ...prev, folder: e.target.value }))}
                  aria-label="Not klasörü">
                  {FOLDERS.map((f) => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="note-tags-input">Etiketler</label>
              <div className="tag-input-row">
                <input id="note-tags-input" className="form-input tag-input" type="text"
                  placeholder="Etiket ekle..." value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  aria-label="Etiket alanı" />
                <button className="tag-add-btn" onClick={handleAddTag} aria-label="Etiket ekle">
                  <span className="material-symbols-outlined">add</span>
                </button>
              </div>
              {formData.tags.length > 0 && (
                <div className="tag-list">
                  {formData.tags.map((tag) => (
                    <span key={tag} className="tag-chip">#{tag}
                      <button className="tag-remove" onClick={() => handleRemoveTag(tag)} aria-label={`${tag} etiketini kaldır`}>
                        <span className="material-symbols-outlined">close</span>
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="editor-footer">
            <button className="btn-ghost" onClick={() => setShowEditor(false)}>Vazgeç</button>
            <button className="btn-primary" onClick={handleSaveNote}>
              <span className="material-symbols-outlined">check</span>
              {editingNote ? 'Güncelle' : 'Kaydet'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (selectedNote) {
    return (
      <div className="app">
        {renderSidebar()}
        <main className="main-content">
          <article className="note-detail">
            <div className="note-detail-meta">
              <div className="note-detail-meta-left">
                <span className={`priority-chip ${getPriorityClass(selectedNote.priority)}`}>
                  <span className="material-symbols-outlined">priority_high</span>
                  {getPriorityLabel(selectedNote.priority)}
                </span>
                <span className="detail-date">SON DÜZENLEME: {formatDate(selectedNote.updatedAt).toUpperCase()}</span>
              </div>
              <div className="note-detail-actions">
                <button className="btn-edit" onClick={() => handleOpenEdit(selectedNote)}>
                  <span className="material-symbols-outlined">edit</span>Düzenle
                </button>
                <button className="btn-delete" onClick={() => handleDeleteNote(selectedNote.id)}>
                  <span className="material-symbols-outlined">delete</span>Sil
                </button>
              </div>
            </div>
            <header className="note-detail-header">
              <h2 className="note-detail-title">{selectedNote.title}</h2>
              <div className="note-detail-tags">
                {selectedNote.tags.map((tag) => <span key={tag} className="detail-tag">#{tag}</span>)}
              </div>
            </header>
            <section className="note-detail-body">
              <p className="note-detail-content">{selectedNote.content}</p>
            </section>
            <footer className="note-detail-footer">
              <div className="note-detail-stats">
                <span className="detail-stat"><span className="material-symbols-outlined">folder</span>{selectedNote.folder}</span>
                <span className="detail-stat"><span className="material-symbols-outlined">schedule</span>{formatDate(selectedNote.createdAt)}</span>
              </div>
              <div className="note-detail-footer-actions">
                <button className="icon-btn" aria-label="Paylaş"><span className="material-symbols-outlined">share</span></button>
                <button className="icon-btn" aria-label="Favorilere ekle"><span className="material-symbols-outlined">star</span></button>
              </div>
            </footer>
          </article>
        </main>
        <button className="fab" onClick={handleOpenCreate} aria-label="Yeni not oluştur">
          <span className="material-symbols-outlined">add</span>
        </button>
      </div>
    )
  }

  return (
    <div className="app">
      {renderSidebar()}
      <header className="top-header">
        <div className="top-header-left">
          <button className="header-filter-btn">Klasörler</button>
          <button className="header-filter-btn">Etiketler</button>
        </div>
        <div className="top-header-right">
          <button className="icon-btn" aria-label="Bildirimler"><span className="material-symbols-outlined">notifications</span></button>
          <button className="icon-btn" aria-label="Profil"><span className="material-symbols-outlined">account_circle</span></button>
        </div>
      </header>
      <main className="main-content main-content-list">
        <div className="list-header">
          <div className="search-row">
            <span className="material-symbols-outlined search-icon">search</span>
            <input className="search-input" type="text" placeholder="Notlarda ara..."
              value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} aria-label="Notlarda ara" />
          </div>
          <div className="priority-filters">
            {(['all', 'high', 'medium', 'low'] as const).map((p) => (
              <button key={p} className={`filter-btn ${priorityFilter === p ? 'active' : ''}`}
                onClick={() => setPriorityFilter(p)}>
                {p === 'all' ? 'Tümü' : getPriorityLabel(p)}
              </button>
            ))}
          </div>
        </div>
        <div className="notes-grid">
          {filteredNotes.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon"><span className="material-symbols-outlined">edit_note</span></div>
              <h3 className="empty-title">Henüz not yok</h3>
              <p className="empty-text">Yeni not oluşturmak için butona tıklayın</p>
            </div>
          ) : (
            filteredNotes.map((note) => (
              <article key={note.id} className="note-card" onClick={() => setSelectedNoteId(note.id)}>
                <div className="note-card-header">
                  <span className={`priority-chip ${getPriorityClass(note.priority)}`}>{getPriorityLabel(note.priority)}</span>
                  <span className="note-card-date">{formatDate(note.createdAt)}</span>
                </div>
                <h3 className="note-card-title">{note.title}</h3>
                <p className="note-card-content">{note.content}</p>
                <div className="note-card-footer">
                  <span className="note-card-folder"><span className="material-symbols-outlined">folder</span>{note.folder}</span>
                  {note.tags.length > 0 && (
                    <div className="note-card-tags">
                      {note.tags.slice(0, 2).map((tag) => <span key={tag} className="card-tag">#{tag}</span>)}
                      {note.tags.length > 2 && <span className="card-tag">+{note.tags.length - 2}</span>}
                    </div>
                  )}
                </div>
              </article>
            ))
          )}
        </div>
      </main>
      <button className="fab" onClick={handleOpenCreate} aria-label="Yeni not oluştur">
        <span className="material-symbols-outlined">add</span>
      </button>
    </div>
  )
}

export default App
