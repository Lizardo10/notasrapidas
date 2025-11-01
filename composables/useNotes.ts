import { ref, computed } from 'vue'

export interface Note {
  id: string
  title: string
  content: string
  createdAt: number
  updatedAt: number
}

const notes = ref<Note[]>([])

// Cargar notas del localStorage al inicializar
const loadNotes = () => {
  try {
    const stored = localStorage.getItem('notes-pwa')
    if (stored) {
      notes.value = JSON.parse(stored)
    }
  } catch (error) {
    console.error('Error al cargar notas:', error)
    notes.value = []
  }
}

// Guardar notas en localStorage
const saveNotes = () => {
  try {
    localStorage.setItem('notes-pwa', JSON.stringify(notes.value))
  } catch (error) {
    console.error('Error al guardar notas:', error)
  }
}

// Inicializar al cargar el composable
loadNotes()

export const useNotes = () => {
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

