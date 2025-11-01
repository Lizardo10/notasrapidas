import { ref, computed } from 'vue'

export interface Note {
  id: string
  title: string
  content: string
  createdAt: number
  updatedAt: number
}

// Estado global compartido
const state = {
  notes: ref<Note[]>([]),
  loaded: false
}

// Función para cargar notas del localStorage
const loadNotes = () => {
  if (typeof window === 'undefined' || state.loaded) return
  
  try {
    const stored = localStorage.getItem('notes-pwa')
    if (stored) {
      state.notes.value = JSON.parse(stored)
    }
    state.loaded = true
    console.log('Notas cargadas desde localStorage:', state.notes.value.length)
  } catch (error) {
    console.error('Error al cargar notas:', error)
    state.loaded = true
  }
}

// Función para guardar notas en localStorage
const saveNotes = () => {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.setItem('notes-pwa', JSON.stringify(state.notes.value))
    console.log('Notas guardadas en localStorage:', state.notes.value.length)
  } catch (error) {
    console.error('Error al guardar notas:', error)
  }
}

export const useNotes = () => {
  // Cargar notas solo si no se han cargado antes
  loadNotes()

  const totalNotes = computed(() => state.notes.value.length)

  const createNote = (title: string, content: string) => {
    const now = Date.now()
    const newNote: Note = {
      id: `note-${now}-${Math.random().toString(36).substr(2, 9)}`,
      title: title.trim(),
      content: content.trim(),
      createdAt: now,
      updatedAt: now
    }
    state.notes.value.unshift(newNote)
    saveNotes()
    console.log('Nota creada:', newNote.id)
    return newNote
  }

  const updateNote = (id: string, title: string, content: string) => {
    const index = state.notes.value.findIndex(note => note.id === id)
    if (index !== -1) {
      state.notes.value[index] = {
        ...state.notes.value[index],
        title: title.trim(),
        content: content.trim(),
        updatedAt: Date.now()
      }
      saveNotes()
      console.log('Nota actualizada:', id)
      return state.notes.value[index]
    }
    return null
  }

  const deleteNote = (id: string) => {
    const index = state.notes.value.findIndex(note => note.id === id)
    if (index !== -1) {
      state.notes.value.splice(index, 1)
      saveNotes()
      console.log('Nota eliminada:', id)
      return true
    }
    return false
  }

  const getNote = (id: string) => {
    return state.notes.value.find(note => note.id === id) || null
  }

  const clearAllNotes = () => {
    state.notes.value = []
    saveNotes()
  }

  return {
    notes: state.notes,
    totalNotes,
    createNote,
    updateNote,
    deleteNote,
    getNote,
    clearAllNotes
  }
}
