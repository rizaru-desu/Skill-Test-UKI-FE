<script setup lang="ts">
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, EyeInvisibleOutlined, CopyOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import type { Credential, CredentialFormData, CredentialCategory, CredentialGroup, PaginatedResponse } from '~/types'

const { $api } = useNuxtApp()
const route = useRoute()

const credentials = ref<Credential[]>([])
const categories = ref<CredentialCategory[]>([])
const groups = ref<CredentialGroup[]>([])
const loading = ref(false)
const total = ref(0)
const page = ref(1)
const pageSize = ref(10)
const search = ref('')
const categoryFilter = ref<number | null>(null)
const groupFilter = ref<number | null>(route.query.groupId ? Number(route.query.groupId) : null)

const modalOpen = ref(false)
const modalLoading = ref(false)
const editingId = ref<number | null>(null)
const form = reactive<CredentialFormData>({
  name: '',
  username: '',
  password: '',
  url: '',
  notes: '',
  categoryId: null,
  groupId: null,
})

const deleteOpen = ref(false)
const deleteLoading = ref(false)
const deletingId = ref<number | null>(null)

const visiblePasswords = ref<Record<number, boolean>>({})

const columns = [
  { title: 'Name', dataIndex: 'name', key: 'name', ellipsis: true },
  { title: 'Username', dataIndex: 'username', key: 'username', ellipsis: true },
  { title: 'Password', key: 'password', width: 200 },
  { title: 'Category', key: 'category', width: 140 },
  { title: 'Group', key: 'group', width: 140 },
  { title: 'Actions', key: 'actions', width: 140 },
]

async function fetchCredentials() {
  loading.value = true
  try {
    const params: Record<string, unknown> = {
      page: page.value,
      limit: pageSize.value,
    }
    if (search.value) params.search = search.value
    if (categoryFilter.value) params.categoryId = categoryFilter.value
    if (groupFilter.value) params.groupId = groupFilter.value

    const { data } = await $api.get<PaginatedResponse<Credential>>('/credentials', { params })
    credentials.value = data.data
    total.value = data.meta.total
    visiblePasswords.value = {}
  }
  catch {
    message.error('Failed to load credentials')
  }
  finally {
    loading.value = false
  }
}

async function fetchDropdowns() {
  try {
    const [catRes, grpRes] = await Promise.all([
      $api.get('/categories', { params: { limit: 100 } }),
      $api.get('/groups', { params: { limit: 100 } }),
    ])
    categories.value = catRes.data.data ?? catRes.data
    groups.value = grpRes.data.data ?? grpRes.data
  }
  catch {
  }
}

function openCreateModal() {
  editingId.value = null
  Object.assign(form, { name: '', username: '', password: '', url: '', notes: '', categoryId: null, groupId: null })
  modalOpen.value = true
}

function openEditModal(record: Credential) {
  editingId.value = record.id
  Object.assign(form, {
    name: record.name,
    username: record.username,
    password: record.password,
    url: record.url ?? '',
    notes: record.notes ?? '',
    categoryId: record.categoryId,
    groupId: record.groupId,
  })
  modalOpen.value = true
}

async function onModalSubmit() {
  modalLoading.value = true
  try {
    if (editingId.value) {
      await $api.patch(`/credentials/${editingId.value}`, form)
      message.success('Credential updated')
    }
    else {
      await $api.post('/credentials', form)
      message.success('Credential created')
      page.value = 1
    }
    modalOpen.value = false
    await fetchCredentials()
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
    await $api.delete(`/credentials/${deletingId.value}`)
    message.success('Credential deleted')
    deleteOpen.value = false
    await fetchCredentials()
  }
  catch {
    message.error('Failed to delete credential')
  }
  finally {
    deleteLoading.value = false
  }
}

function togglePassword(id: number) {
  if (visiblePasswords.value[id]) {
    delete visiblePasswords.value[id]
  }
  else {
    visiblePasswords.value[id] = true
  }
}

async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text)
    message.success('Copied to clipboard')
  }
  catch {
    message.error('Failed to copy')
  }
}

function onSearch(value: string) {
  search.value = value
  page.value = 1
  fetchCredentials()
}

function onPageChange(p: number, ps: number) {
  page.value = p
  pageSize.value = ps
  fetchCredentials()
}

watch(() => route.query.groupId, (val) => {
  groupFilter.value = val ? Number(val) : null
  page.value = 1
  fetchCredentials()
})

onMounted(() => {
  fetchCredentials()
  fetchDropdowns()
})
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-xl font-semibold text-gray-800 m-0">
        Credentials
      </h2>
      <div class="flex items-center gap-3">
        <a-select
          v-model:value="categoryFilter"
          placeholder="Filter category"
          allow-clear
          style="width: 160px"
          @change="() => { page = 1; fetchCredentials() }"
        >
          <a-select-option v-for="cat in categories" :key="cat.id" :value="cat.id">
            {{ cat.name }}
          </a-select-option>
        </a-select>
        <a-select
          v-model:value="groupFilter"
          placeholder="Filter group"
          allow-clear
          style="width: 160px"
          @change="() => { page = 1; fetchCredentials() }"
        >
          <a-select-option v-for="grp in groups" :key="grp.id" :value="grp.id">
            {{ grp.name }}
          </a-select-option>
        </a-select>
        <a-button type="primary" @click="openCreateModal">
          <PlusOutlined />
          Add Credential
        </a-button>
      </div>
    </div>

    <DataTable
      :columns="columns"
      :data-source="credentials"
      :loading="loading"
      :total="total"
      :page="page"
      :page-size="pageSize"
      search-placeholder="Search credentials..."
      @search="onSearch"
      @page-change="onPageChange"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'password'">
          <div class="flex items-center gap-1">
            <span class="font-mono text-sm">
              {{ visiblePasswords[record.id] ? record.password : '••••••••' }}
            </span>
            <a-button type="text" size="small" @click="togglePassword(record.id)">
              <EyeOutlined v-if="!visiblePasswords[record.id]" />
              <EyeInvisibleOutlined v-else />
            </a-button>
            <a-button type="text" size="small" @click="copyToClipboard(record.password)">
              <CopyOutlined />
            </a-button>
          </div>
        </template>

        <template v-if="column.key === 'category'">
          <a-tag v-if="record.category" color="blue">
            {{ record.category.name }}
          </a-tag>
          <span v-else class="text-gray-400">—</span>
        </template>

        <template v-if="column.key === 'group'">
          <a-tag v-if="record.group" color="green">
            {{ record.group.name }}
          </a-tag>
          <span v-else class="text-gray-400">—</span>
        </template>

        <template v-if="column.key === 'actions'">
          <a-space>
            <a-button type="text" size="small" @click="openEditModal(record as Credential)">
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
      :title="editingId ? 'Edit Credential' : 'Add Credential'"
      :confirm-loading="modalLoading"
      @ok="onModalSubmit"
      @cancel="modalOpen = false"
    >
      <a-form layout="vertical" class="mt-4">
        <a-form-item label="Name" required>
          <a-input v-model:value="form.name" placeholder="Name" />
        </a-form-item>
        <a-form-item label="Username" required>
          <a-input v-model:value="form.username" placeholder="Username / Email" />
        </a-form-item>
        <a-form-item label="Password" required>
          <a-input-password v-model:value="form.password" placeholder="Password" />
        </a-form-item>
        <a-form-item label="URL">
          <a-input v-model:value="form.url" placeholder="https://" />
        </a-form-item>
        <a-form-item label="Category">
          <a-select v-model:value="form.categoryId" placeholder="Select category" allow-clear>
            <a-select-option v-for="cat in categories" :key="cat.id" :value="cat.id">
              {{ cat.name }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="Group">
          <a-select v-model:value="form.groupId" placeholder="Select group" allow-clear>
            <a-select-option v-for="grp in groups" :key="grp.id" :value="grp.id">
              {{ grp.name }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="Notes">
          <a-textarea v-model:value="form.notes" placeholder="Notes" :rows="3" />
        </a-form-item>
      </a-form>
    </a-modal>

    <ConfirmModal
      :open="deleteOpen"
      :loading="deleteLoading"
      content="Are you sure you want to delete this credential?"
      @confirm="onDelete"
      @cancel="deleteOpen = false"
    />
  </div>
</template>
