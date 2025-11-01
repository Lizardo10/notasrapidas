import { ref, computed } from 'vue'

export interface Note {
  id: string
  title: string
  content: string
  createdAt: number
  updatedAt: number
}

// Estado global
const notes = ref<Note[]>([])
let loaded = false

export const useNotes = () => {
  // Cargar notas solo una vez
  if (!loaded && typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('notes-pwa')
      if (stored) {
        notes.value = JSON.parse(stored)
      }
      loaded = true
    } catch (error) {
      console.error('Error cargando notas:', error)
      loaded = true
    }
  }

  // Guardar
  const save = () => {
    if (typeof window === 'undefined') return
    try {
      localStorage.setItem('notes-pwa', JSON.stringify(notes.value))
    } catch (error) {
      console.error('Error guardando notas:', error)
    }
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
    save()
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
      save()
      return notes.value[index]
    }
    return null
  }

  const deleteNote = (id: string) => {
    const index = notes.value.findIndex(note => note.id === id)
    if (index !== -1) {
      notes.value.splice(index, 1)
      save()
      return true
    }
    return false
  }

  const getNote = (id: string) => {
    return notes.value.find(note => note.id === id) || null
  }

  const clearAllNotes = () => {
    notes.value = []
    save()
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
