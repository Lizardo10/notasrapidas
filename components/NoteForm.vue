<template>
  <div class="note-form">
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="title">Título</label>
        <input
          id="title"
          v-model="title"
          type="text"
          placeholder="Escribe un título..."
          maxlength="100"
          required
        />
      </div>

      <div class="form-group">
        <label for="content">Contenido</label>
        <textarea
          id="content"
          v-model="content"
          placeholder="Escribe tu nota aquí..."
          required
        ></textarea>
      </div>

      <div class="actions">
        <button type="submit" class="btn btn-primary">
          {{ isEditing ? 'Actualizar Nota' : 'Agregar Nota' }}
        </button>
        <button
          v-if="isEditing"
          type="button"
          class="btn btn-secondary"
          @click="handleCancel"
        >
          Cancelar
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

const props = defineProps<{
  editingNote?: { id: string; title: string; content: string } | null
}>()

const emit = defineEmits<{
  (e: 'submit', data: { title: string; content: string }): void
  (e: 'cancel'): void
}>()

const title = ref('')
const content = ref('')

const isEditing = computed(() => !!props.editingNote)

watch(() => props.editingNote, (newNote) => {
  if (newNote) {
    title.value = newNote.title
    content.value = newNote.content
  } else {
    title.value = ''
    content.value = ''
  }
}, { immediate: true })

const handleSubmit = () => {
  if (title.value.trim() && content.value.trim()) {
    emit('submit', {
      title: title.value,
      content: content.value
    })
    title.value = ''
    content.value = ''
  }
}

const handleCancel = () => {
  emit('cancel')
  title.value = ''
  content.value = ''
}
</script>

<style scoped>
.note-form {
  animation: fadeIn 0.3s ease;
}
</style>
