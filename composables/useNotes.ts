import { ref, computed } from 'vue'

export interface Note {
  id: string
  title: string
  content: string
  createdAt: number
  updatedAt: number
}

// Estado global de notas
const notes = ref<Note[]>([])

// Verificar si ya se cargaron las notas
let loaded = false

// Cargar notas del localStorage
const loadNotes = () => {
  if (typeof window === 'undefined' || loaded) return
  
  try {
    const stored = localStorage.getItem('notes-pwa')
    if (stored) {
      notes.value = JSON.parse(stored)
    }
    loaded = true
  } catch (error) {
    console.error('Error al cargar notas:', error)
    notes.value = []
    loaded = true
  }
}

// Guardar notas en localStorage
const saveNotes = () => {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem('notes-pwa', JSON.stringify(notes.value))
  } catch (error) {
    console.error('Error al guardar notas:', error)
  }
}

export const useNotes = () => {
  // Cargar notas solo una vez
  if (typeof window !== 'undefined' && !loaded) {
    loadNotes()
  }

  const totalNotes = computed(() => notes.value.length)

  const createNote = (title: string, content: string) => {
    const now = Date.now()
    const newNote: Note = {
      id: `note-${now}-${Math.random().toString(36).substr(2, 9)}`,
      title: title.trim(),
      content: content.trim(),
      createdAt: now,
      updatedAt: now
    }
    notes.value.unshift(newNote)
    saveNotes()
    return newNote
  }

  const updateNote = (id: string, title: string, content: string) => {
    const noteIndex = notes.value.findIndex(note => note.id === id)
    if (noteIndex !== -1) {
      notes.value[noteIndex] = {
        ...notes.value[noteIndex],
        title: title.trim(),
        content: content.trim(),
        updatedAt: Date.now()
      }
      saveNotes()
      return notes.value[noteIndex]
    }
    return null
  }

  const deleteNote = (id: string) => {
    const index = notes.value.findIndex(note => note.id === id)
    if (index !== -1) {
      notes.value.splice(index, 1)
      saveNotes()
      return true
    }
    return false
  }

  const getNote = (id: string) => {
    return notes.value.find(note => note.id === id) || null
  }

  const clearAllNotes = () => {
    notes.value = []
    saveNotes()
  }

  return {
    notes: computed(() => notes.value),
    totalNotes,
    createNote,
    updateNote,
    deleteNote,
    getNote,
    clearAllNotes
  }
}
