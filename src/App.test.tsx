import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'

describe('US-004: Note editor create and edit', () => {
  describe('Create Note', () => {
    it('shows create button in sidebar', () => {
      render(<App />)
      expect(screen.getByText('Yeni Not')).toBeTruthy()
    })

    it('shows FAB button for creating notes', () => {
      render(<App />)
      expect(screen.getByLabelText('Yeni not oluştur')).toBeTruthy()
    })

    it('opens editor modal when Yeni Not button is clicked', async () => {
      render(<App />)
      await userEvent.click(screen.getByText('Yeni Not'))
      expect(screen.getByLabelText('Not başlığı')).toBeTruthy()
      expect(screen.getByLabelText('Not içeriği')).toBeTruthy()
    })

    it('creates a new note with title and content', async () => {
      render(<App />)
      await userEvent.click(screen.getByText('Yeni Not'))
      await userEvent.type(screen.getByLabelText('Not başlığı'), 'Test Not Başlığı')
      await userEvent.type(screen.getByLabelText('Not içeriği'), 'Test not içeriği.')
      await userEvent.click(screen.getByText('Kaydet'))
      expect(screen.getByText('Test Not Başlığı')).toBeTruthy()
      expect(screen.getByText('Test not içeriği.')).toBeTruthy()
    })

    it('validates required fields when creating note', async () => {
      render(<App />)
      await userEvent.click(screen.getByText('Yeni Not'))
      await userEvent.click(screen.getByText('Kaydet'))
      expect(screen.getByText('Başlık zorunludur')).toBeTruthy()
      expect(screen.getByText('İçerik zorunludur')).toBeTruthy()
    })

    it('sets priority for new note', async () => {
      render(<App />)
      await userEvent.click(screen.getByText('Yeni Not'))
      await userEvent.type(screen.getByLabelText('Not başlığı'), 'Acil Görev')
      await userEvent.type(screen.getByLabelText('Not içeriği'), 'Acil içerik.')
      await userEvent.selectOptions(screen.getByLabelText('Not önceliği'), 'high')
      await userEvent.click(screen.getByText('Kaydet'))
      expect(screen.getByText('Yüksek')).toBeTruthy()
    })

    it('adds tags to new note', async () => {
      render(<App />)
      await userEvent.click(screen.getByText('Yeni Not'))
      await userEvent.type(screen.getByLabelText('Not başlığı'), 'Etiketli Not')
      await userEvent.type(screen.getByLabelText('Not içeriği'), 'Etiket testi.')
      await userEvent.type(screen.getByLabelText('Etiket alanı'), 'önemli')
      await userEvent.click(screen.getByLabelText('Etiket ekle'))
      await userEvent.click(screen.getByText('Kaydet'))
      expect(screen.getByText('#önemli')).toBeTruthy()
    })

    it('closes editor modal on cancel', async () => {
      render(<App />)
      await userEvent.click(screen.getByText('Yeni Not'))
      expect(screen.getByText('Vazgeç')).toBeTruthy()
      await userEvent.click(screen.getByText('Vazgeç'))
      expect(screen.getByPlaceholderText('Notlarda ara...')).toBeTruthy()
    })

    it('closes editor modal on backdrop click', async () => {
      render(<App />)
      await userEvent.click(screen.getByText('Yeni Not'))
      const backdrop = document.querySelector('.modal-backdrop') as HTMLElement
      expect(backdrop).toBeTruthy()
      await userEvent.click(backdrop)
      expect(screen.getByPlaceholderText('Notlarda ara...')).toBeTruthy()
    })
  })

  describe('Edit Note', () => {
    it('navigates to note detail when clicking a note card', async () => {
      render(<App />)
      await userEvent.click(screen.getByText('Yeni Tasarım Fikirleri'))
      expect(screen.getByText('Düzenle')).toBeTruthy()
      expect(screen.getByText('Sil')).toBeTruthy()
    })

    it('opens editor modal when Düzenle button is clicked', async () => {
      render(<App />)
      await userEvent.click(screen.getByText('Yeni Tasarım Fikirleri'))
      await userEvent.click(screen.getByText('Düzenle'))
      const titleInput = screen.getByLabelText('Not başlığı') as HTMLInputElement
      const contentInput = screen.getByLabelText('Not içeriği') as HTMLTextAreaElement
      expect(titleInput.value).toBe('Yeni Tasarım Fikirleri')
      expect(contentInput.value).toContain('Uygulama için yeni bir renk paleti')
    })

    it('updates note title and content after editing', async () => {
      render(<App />)
      await userEvent.click(screen.getByText('Yeni Tasarım Fikirleri'))
      await userEvent.click(screen.getByText('Düzenle'))
      const titleInput = screen.getByLabelText('Not başlığı')
      await userEvent.clear(titleInput)
      await userEvent.type(titleInput, 'Güncellenen Başlık')
      const contentInput = screen.getByLabelText('Not içeriği')
      await userEvent.clear(contentInput)
      await userEvent.type(contentInput, 'Güncellenen içerik.')
      await userEvent.click(screen.getByText('Güncelle'))
      expect(screen.getByText('Güncellenen Başlık')).toBeTruthy()
      expect(screen.getByText('Güncellenen içerik.')).toBeTruthy()
    })

    it('shows Güncelle button when editing existing note', async () => {
      render(<App />)
      await userEvent.click(screen.getByText('Yeni Tasarım Fikirleri'))
      await userEvent.click(screen.getByText('Düzenle'))
      expect(screen.getByText('Güncelle')).toBeTruthy()
      expect(screen.queryByText('Kaydet')).toBeNull()
    })

    it('navigates back to list from detail view', async () => {
      render(<App />)
      await userEvent.click(screen.getByText('Yeni Tasarım Fikirleri'))
      await userEvent.click(screen.getByText('Notlarım'))
      expect(screen.getByPlaceholderText('Notlarda ara...')).toBeTruthy()
    })
  })

  describe('Delete Note', () => {
    it('deletes note from detail view', async () => {
      render(<App />)
      await userEvent.click(screen.getByText('Kitap Listesi'))
      await userEvent.click(screen.getByText('Sil'))
      expect(screen.queryByText('Kitap Listesi')).toBeNull()
    })
  })

  describe('Search still works', () => {
    it('filters notes by search query', async () => {
      render(<App />)
      await userEvent.type(screen.getByPlaceholderText('Notlarda ara...'), 'Tasarım')
      expect(screen.getByText('Yeni Tasarım Fikirleri')).toBeTruthy()
      expect(screen.queryByText('Haftalık Rapor')).toBeNull()
    })
  })

  describe('Priority filter still works', () => {
    it('filters notes by priority', async () => {
      render(<App />)
      const buttons = screen.getAllByRole('button')
      const highBtn = buttons.find(b => b.textContent === 'Yüksek')
      expect(highBtn).toBeTruthy()
      await userEvent.click(highBtn!)
      expect(screen.getByText('Yeni Tasarım Fikirleri')).toBeTruthy()
      expect(screen.queryByText('Haftalık Rapor')).toBeNull()
    })
  })
})
