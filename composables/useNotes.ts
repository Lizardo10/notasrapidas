import { ref, computed } from 'vue'

export interface Note {
  id: string
  title: string
  content: string
  createdAt: number
  updatedAt: number
}

// Estado global compartido
const notes = ref<Note[]>([])
let loaded = false

// Función para cargar notas del localStorage
const loadNotes = () => {
  if (typeof window === 'undefined' || loaded) return
  
  try {
    const stored = localStorage.getItem('notes-pwa')
    if (stored) {
      notes.value = JSON.parse(stored)
    }
    loaded = true
    console.log('Notas cargadas desde localStorage:', notes.value.length)
  } catch (error) {
    console.error('Error al cargar notas:', error)
    loaded = true
  }
}

// Función para guardar notas en localStorage
const saveNotes = () => {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.setItem('notes-pwa', JSON.stringify(notes.value))
    console.log('Notas guardadas en localStorage:', notes.value.length)
  } catch (error) {
    console.error('Error al guardar notas:', error)
  }
}

export const useNotes = () => {
  // Cargar notas solo si no se han cargado antes
  loadNotes()

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
    console.log('Nota creada:', newNote.id)
    return newNote
  }

  const updateNote = (id: string, title: string, content: string) => {
    const index = notes.value.findIndex(note => note.id === id)
    if (index !== -1) {
      notes.value[index] = {
        ...notes.value[index],
        title: title.trim(),
        content: content.trim(),
        updatedAt: Date.now()
      }
      saveNotes()
      console.log('Nota actualizada:', id)
      return notes.value[index]
    }
    return null
  }

  const deleteNote = (id: string) => {
    const index = notes.value.findIndex(note => note.id === id)
    if (index !== -1) {
      notes.value.splice(index, 1)
      saveNotes()
      console.log('Nota eliminada:', id)
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
    notes,
    totalNotes,
    createNote,
    updateNote,
    deleteNote,
    getNote,
    clearAllNotes
  }
}
