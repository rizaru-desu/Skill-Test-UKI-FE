<script setup lang="ts">
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import type { CredentialGroup, GroupFormData, PaginatedResponse } from '~/types'

const { $api } = useNuxtApp()

const groups = ref<CredentialGroup[]>([])
const sidebarGroups = useState<CredentialGroup[]>('app-groups', () => [])
const loading = ref(false)
const total = ref(0)
const page = ref(1)
const pageSize = ref(10)
const search = ref('')

async function refreshSidebar() {
  try {
    const { data } = await $api.get('/groups', { params: { limit: 100 }, timeout: 5000 })
    sidebarGroups.value = data.data ?? data
  }
  catch {
  }
}

const modalOpen = ref(false)
const modalLoading = ref(false)
const editingId = ref<number | null>(null)
const form = reactive<GroupFormData>({
  name: '',
  description: '',
})

const deleteOpen = ref(false)
const deleteLoading = ref(false)
const deletingId = ref<number | null>(null)

const columns = [
  { title: 'Name', dataIndex: 'name', key: 'name' },
  { title: 'Description', dataIndex: 'description', key: 'description', ellipsis: true },
  { title: 'Created At', key: 'createdAt', width: 180 },
  { title: 'Actions', key: 'actions', width: 120 },
]

async function fetchGroups() {
  loading.value = true
  try {
    const params: Record<string, unknown> = {
      page: page.value,
      limit: pageSize.value,
    }
    if (search.value) params.search = search.value

    const { data } = await $api.get<PaginatedResponse<CredentialGroup>>('/groups', { params })
    groups.value = data.data
    total.value = data.meta.total
  }
  catch {
    message.error('Failed to load groups')
  }
  finally {
    loading.value = false
  }
}

function openCreateModal() {
  editingId.value = null
  Object.assign(form, { name: '', description: '' })
  modalOpen.value = true
}

function openEditModal(record: CredentialGroup) {
  editingId.value = record.id
  Object.assign(form, {
    name: record.name,
    description: record.description ?? '',
  })
  modalOpen.value = true
}

async function onModalSubmit() {
  modalLoading.value = true
  try {
    if (editingId.value) {
      await $api.patch(`/groups/${editingId.value}`, form)
      message.success('Group updated')
    }
    else {
      await $api.post('/groups', form)
      message.success('Group created')
      page.value = 1
    }
    modalOpen.value = false
    await Promise.all([fetchGroups(), refreshSidebar()])
  }
  catch (err: unknown) {
    const error = err as { response?: { data?: { message?: string } } }
    message.error(error.response?.data?.message || 'Operation failed')
  }
  finally {
    modalLoading.value = false
  }
}

function openDeleteModal(id: number) {
  deletingId.value = id
  deleteOpen.value = true
}

async function onDelete() {
  if (!deletingId.value) return
  deleteLoading.value = true
  try {
    await $api.delete(`/groups/${deletingId.value}`)
    message.success('Group deleted')
    deleteOpen.value = false
    await Promise.all([fetchGroups(), refreshSidebar()])
  }
  catch {
    message.error('Failed to delete group')
  }
  finally {
    deleteLoading.value = false
  }
}

function onSearch(value: string) {
  search.value = value
  page.value = 1
  fetchGroups()
}

function onPageChange(p: number, ps: number) {
  page.value = p
  pageSize.value = ps
  fetchGroups()
}

onMounted(fetchGroups)
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-xl font-semibold text-gray-800 m-0">
        Credential Groups
      </h2>
      <a-button type="primary" @click="openCreateModal">
        <PlusOutlined />
        Add Group
      </a-button>
    </div>

    <DataTable
      :columns="columns"
      :data-source="groups"
      :loading="loading"
      :total="total"
      :page="page"
      :page-size="pageSize"
      search-placeholder="Search groups..."
      @search="onSearch"
      @page-change="onPageChange"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'createdAt'">
          {{ $dayjs(record.createdAt).format('DD MMM YYYY, HH:mm') }}
        </template>

        <template v-if="column.key === 'actions'">
          <a-space>
            <a-button type="text" size="small" @click="openEditModal(record as CredentialGroup)">
              <EditOutlined />
            </a-button>
            <a-button type="text" size="small" danger @click="openDeleteModal(record.id as number)">
              <DeleteOutlined />
            </a-button>
          </a-space>
        </template>
      </template>
    </DataTable>

    <a-modal
      :open="modalOpen"
      :title="editingId ? 'Edit Group' : 'Add Group'"
      :confirm-loading="modalLoading"
      @ok="onModalSubmit"
      @cancel="modalOpen = false"
    >
      <a-form layout="vertical" class="mt-4">
        <a-form-item label="Name" required>
          <a-input v-model:value="form.name" placeholder="Group name" />
        </a-form-item>
        <a-form-item label="Description">
          <a-textarea v-model:value="form.description" placeholder="Description" :rows="3" />
        </a-form-item>
      </a-form>
    </a-modal>

    <ConfirmModal
      :open="deleteOpen"
      :loading="deleteLoading"
      content="Are you sure you want to delete this group?"
      @confirm="onDelete"
      @cancel="deleteOpen = false"
    />
  </div>
</template>
