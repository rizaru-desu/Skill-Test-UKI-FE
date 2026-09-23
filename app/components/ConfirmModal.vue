<script setup lang="ts">
interface Props {
  open: boolean
  title?: string
  content?: string
  loading?: boolean
}

withDefaults(defineProps<Props>(), {
  title: 'Confirm Delete',
  content: 'Are you sure you want to delete this item?',
  loading: false,
})

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()
</script>

<template>
  <a-modal
    :open="open"
    :title="title"
    :confirm-loading="loading"
    ok-text="Delete"
    ok-type="danger"
    cancel-text="Cancel"
    @ok="emit('confirm')"
    @cancel="emit('cancel')"
  >
    <p class="py-2 text-gray-600 m-0">{{ content }}</p>
  </a-modal>
</template>
