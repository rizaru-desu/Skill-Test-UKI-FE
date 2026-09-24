<script setup lang="ts">
import type { TablePaginationConfig } from 'ant-design-vue'

interface Column {
  title: string
  dataIndex?: string
  key: string
  width?: string | number
  ellipsis?: boolean
}

interface Props {
  columns: Column[]
  dataSource: Record<string, unknown>[]
  loading?: boolean
  total?: number
  page?: number
  pageSize?: number
  searchPlaceholder?: string
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  total: 0,
  page: 1,
  pageSize: 10,
  searchPlaceholder: 'Search...',
})

const emit = defineEmits<{
  search: [value: string]
  pageChange: [page: number, pageSize: number]
}>()

const searchText = ref('')

function onSearch() {
  emit('search', searchText.value)
}

function onTableChange(pagination: TablePaginationConfig) {
  emit('pageChange', pagination.current ?? 1, pagination.pageSize ?? 10)
}
</script>

<template>
  <!-- Search Input Container -->
  <div class="mb-5">
    <a-input-search
      v-model:value="searchText"
      :placeholder="searchPlaceholder"
      allow-clear
      style="max-width: 320px"
      @search="onSearch"
      @change="searchText === '' && onSearch()"
    />
  </div>

  <a-table
    :columns="columns"
    :data-source="dataSource"
    :loading="loading"
    :pagination="{
      current: page,
      pageSize: pageSize,
      total: total,
      showSizeChanger: true,
      showTotal: (total: number, range: [number, number]) => `${range[0]}-${range[1]} of ${total}`,
    }"
    row-key="id"
    size="middle"
    @change="onTableChange"
  >
    <template v-for="(_, name) in $slots" #[name]="slotData">
      <slot :name="name" v-bind="slotData ?? {}" />
    </template>
  </a-table>
</template>
