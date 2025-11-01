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
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11.05 3.00002L4.20831 10.2417C3.95002 10.5167 3.69998 11.0584 3.64998 11.4334L3.34164 14.1334C3.23331 15.1084 3.93331 15.775 4.89998 15.6084L7.58331 15.175C7.95831 15.1084 8.48331 14.8084 8.74164 14.525L15.5833 7.28335C16.7666 6.03335 17.3 4.60835 15.4583 2.86668C13.625 1.14168 12.2333 1.75002 11.05 3.00002Z" stroke="currentColor" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M9.90833 4.20831C10.2667 6.50831 12.1333 8.26665 14.45 8.49998M2.5 18.3333H17.5" stroke="currentColor" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        <button
          class="icon-btn icon-btn-delete"
          title="Eliminar nota"
          @click="$emit('delete')"
        >
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.5 4.98332C14.725 4.70832 11.9333 4.56665 9.15 4.56665C7.5 4.56665 5.85 4.64998 4.2 4.81665L2.5 4.98332M7.08333 4.14165L7.26667 3.04998C7.39999 2.25832 7.5 1.66665 8.90833 1.66665H11.0917C12.5 1.66665 12.6083 2.29165 12.7333 3.05832L12.9167 4.14165M15.7083 7.61665L15.1667 16.0083C15.075 17.3167 15 18.3333 12.675 18.3333H7.32501C5.00001 18.3333 4.92501 17.3167 4.83334 16.0083L4.29167 7.61665M8.60834 13.75H11.3833M7.91667 10.4167H12.0833" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
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

