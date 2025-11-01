<template>
  <div>
    <header class="header">
      <h1>Notas</h1>
      <p>{{ totalNotes }} {{ totalNotes === 1 ? 'nota guardada' : 'notas guardadas' }}</p>
    </header>

    <main class="container">
      <NoteForm
        :editing-note="editingNote"
        @submit="handleSubmit"
        @cancel="handleCancel"
      />

      <div v-if="notesList.length > 0" class="notes-grid">
        <NoteCard
          v-for="note in notesList"
          :key="note.id"
          :note="note"
          @edit="handleEdit(note)"
          @delete="handleDelete(note.id)"
        />
      </div>

      <EmptyState v-else />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const { notes, totalNotes, createNote, updateNote, deleteNote } = useNotes()

// Computed para acceder correctamente al valor del ref
const notesList = computed(() => notes.value)

const editingNote = ref<{ id: string; title: string; content: string } | null>(null)

const handleSubmit = (data: { title: string; content: string }) => {
  console.log('handleSubmit recibido en app.vue:', data)
  if (editingNote.value) {
    console.log('Actualizando nota:', editingNote.value.id)
    updateNote(editingNote.value.id, data.title, data.content)
    editingNote.value = null
  } else {
    console.log('Creando nueva nota')
    createNote(data.title, data.content)
  }
}

const handleEdit = (note: { id: string; title: string; content: string }) => {
  editingNote.value = note
  // Scroll suave al formulario
  const form = document.querySelector('.note-form')
  if (form) {
    form.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

const handleCancel = () => {
  editingNote.value = null
}

const handleDelete = (id: string) => {
  if (confirm('¿Estás seguro de que quieres eliminar esta nota?')) {
    deleteNote(id)
  }
}
</script>

<style>
@import '~/assets/css/main.css';
</style>

