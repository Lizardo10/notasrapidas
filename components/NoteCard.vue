<template>
  <div class="note-card">
    <h3>
      <span>{{ note.title }}</span>
    </h3>
    <p>{{ note.content }}</p>
    <div class="note-card-footer">
      <span class="note-date">{{ formattedDate }}</span>
      <div class="note-actions">
        <button
          class="icon-btn icon-btn-edit"
          title="Editar nota"
          @click="$emit('edit')"
        >
          ✏️
        </button>
        <button
          class="icon-btn icon-btn-delete"
          title="Eliminar nota"
          @click="$emit('delete')"
        >
          🗑️
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Note } from '~/composables/useNotes'

const props = defineProps<{
  note: Note
}>()

defineEmits<{
  (e: 'edit'): void
  (e: 'delete'): void
}>()

const formattedDate = computed(() => {
  const date = new Date(props.note.updatedAt)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - date.getTime())
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 0) {
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60))
    if (diffHours === 0) {
      const diffMinutes = Math.floor(diffTime / (1000 * 60))
      return diffMinutes <= 1 ? 'Ahora' : `Hace ${diffMinutes} min`
    }
    return `Hace ${diffHours}h`
  } else if (diffDays === 1) {
    return 'Ayer'
  } else if (diffDays < 7) {
    return `Hace ${diffDays} días`
  } else {
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    })
  }
})
</script>

<style scoped>
.note-card {
  animation: fadeIn 0.3s ease;
}
</style>

