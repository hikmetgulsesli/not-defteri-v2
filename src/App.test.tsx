import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import App from './App'

describe('US-003: Note list search and priority filter', () => {
  describe('Search Functionality', () => {
    it('renders search input', () => {
      render(<App />)
      const searchInput = screen.getByPlaceholderText('Notlarda ara...')
      expect(searchInput).toBeTruthy()
    })

    it('filters notes by title', () => {
      render(<App />)
      const searchInput = screen.getByPlaceholderText('Notlarda ara...')
      fireEvent.change(searchInput, { target: { value: 'Tasarım' } })
      expect(screen.getByText('Yeni Tasarım Fikirleri')).toBeTruthy()
    })

    it('filters notes by content', () => {
      render(<App />)
      const searchInput = screen.getByPlaceholderText('Notlarda ara...')
      fireEvent.change(searchInput, { target: { value: 'Atomic Habits' } })
      expect(screen.getByText('Kitap Listesi')).toBeTruthy()
    })

    it('is case insensitive', () => {
      render(<App />)
      const searchInput = screen.getByPlaceholderText('Notlarda ara...')
      fireEvent.change(searchInput, { target: { value: 'tasarım' } })
      expect(screen.getByText('Yeni Tasarım Fikirleri')).toBeTruthy()
    })

    it('shows all notes when search is empty', () => {
      render(<App />)
      const searchInput = screen.getByPlaceholderText('Notlarda ara...')
      fireEvent.change(searchInput, { target: { value: '' } })
      expect(screen.getByText('Yeni Tasarım Fikirleri')).toBeTruthy()
      expect(screen.getByText('Haftalık Rapor')).toBeTruthy()
      expect(screen.getByText('Kitap Listesi')).toBeTruthy()
    })
  })

  describe('Priority Filter Functionality', () => {
    it('renders all priority filter buttons', () => {
      render(<App />)
      expect(screen.getByRole('button', { name: /Tümü/ })).toBeTruthy()
      expect(screen.getByRole('button', { name: /Yüksek/ })).toBeTruthy()
      expect(screen.getByRole('button', { name: /Orta/ })).toBeTruthy()
      expect(screen.getByRole('button', { name: /Düşük/ })).toBeTruthy()
    })

    it('shows only high priority notes when filtered', () => {
      render(<App />)
      const highFilterBtn = screen.getByRole('button', { name: /Yüksek/ })
      fireEvent.click(highFilterBtn)
      expect(screen.getByText('Yeni Tasarım Fikirleri')).toBeTruthy()
      expect(screen.queryByText('Haftalık Rapor')).toBeNull()
    })

    it('shows only medium priority notes when filtered', () => {
      render(<App />)
      const mediumFilterBtn = screen.getByRole('button', { name: /Orta/ })
      fireEvent.click(mediumFilterBtn)
      expect(screen.getByText('Haftalık Rapor')).toBeTruthy()
      expect(screen.queryByText('Yeni Tasarım Fikirleri')).toBeNull()
    })

    it('shows only low priority notes when filtered', () => {
      render(<App />)
      const lowFilterBtn = screen.getByRole('button', { name: /Düşük/ })
      fireEvent.click(lowFilterBtn)
      expect(screen.getByText('Kitap Listesi')).toBeTruthy()
      expect(screen.queryByText('Haftalık Rapor')).toBeNull()
    })

    it('shows all notes when "Tümü" is selected', () => {
      render(<App />)
      const allBtn = screen.getByRole('button', { name: /Tümü/ })
      fireEvent.click(allBtn)
      expect(screen.getByText('Yeni Tasarım Fikirleri')).toBeTruthy()
      expect(screen.getByText('Haftalık Rapor')).toBeTruthy()
      expect(screen.getByText('Kitap Listesi')).toBeTruthy()
    })
  })

  describe('Combined Search and Filter', () => {
    it('filters by both search and priority', () => {
      render(<App />)
      const searchInput = screen.getByPlaceholderText('Notlarda ara...')
      const highFilterBtn = screen.getByRole('button', { name: /Yüksek/ })
      
      fireEvent.change(searchInput, { target: { value: 'Tasarım' } })
      fireEvent.click(highFilterBtn)
      
      expect(screen.getByText('Yeni Tasarım Fikirleri')).toBeTruthy()
    })
  })

  describe('Priority Display', () => {
    it('displays priority chip with correct label', () => {
      render(<App />)
      expect(screen.getAllByText('Yüksek').length).toBeGreaterThan(0)
      expect(screen.getAllByText('Orta').length).toBeGreaterThan(0)
      expect(screen.getAllByText('Düşük').length).toBeGreaterThan(0)
    })
  })

  describe('Note Count', () => {
    it('displays correct note count', () => {
      render(<App />)
      expect(screen.getByText('3 not')).toBeTruthy()
    })

    it('updates note count when filtered', () => {
      render(<App />)
      const highFilterBtn = screen.getByRole('button', { name: /Yüksek/ })
      fireEvent.click(highFilterBtn)
      expect(screen.getByText('1 not')).toBeTruthy()
    })

    it('updates note count when search is applied', () => {
      render(<App />)
      const searchInput = screen.getByPlaceholderText('Notlarda ara...')
      fireEvent.change(searchInput, { target: { value: 'Rapor' } })
      expect(screen.getByText('1 not')).toBeTruthy()
    })
  })

  describe('Empty State', () => {
    it('shows empty state when no notes match search', () => {
      render(<App />)
      const searchInput = screen.getByPlaceholderText('Notlarda ara...')
      fireEvent.change(searchInput, { target: { value: 'xyznonexistent' } })
      expect(screen.getByText('Henüz not yok')).toBeTruthy()
    })
  })
})