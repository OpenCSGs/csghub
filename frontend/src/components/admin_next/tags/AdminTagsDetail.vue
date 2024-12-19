<template>
  <Container
    :title="$t('admin.tags.tagDetailTitle')"
    subtitle=""
    :showBack="true"
    :breadcrumbs="[
      {
        text: $t('admin.tags.title'),
        to: '/admin_panel/tags'
      },
      { text: `Tags #${tagInfo.name}` }
    ]">
    <Card :title="`Tags #${tagInfo.name}`">
      <ul class="">
        <li class="flex mb-4">
          <label class="admin-field-label">Name</label>
          <p class="admin-field">{{ tagInfo.username }}</p>
        </li>
        <li class="flex mb-4">
          <label class="admin-field-label">Show Name</label>
          <p class="admin-field">{{ tagInfo.show_name }}</p>
        </li>
        <li class="flex mb-4">
          <label class="admin-field-label">Category</label>
          <p class="admin-field">{{ tagInfo.category }}</p>
        </li>
        <li class="flex mb-4">
          <label class="admin-field-label">Scope</label>
          <p class="admin-field">{{ tagInfo.scope }}</p>
        </li>
        <li class="flex mb-4">
          <label class="admin-field-label">Group</label>
          <p class="admin-field">{{ tagInfo.group }}</p>
        </li>
        <li class="flex mb-4">
          <label class="admin-field-label">Created At</label>
          <p class="admin-field">
            {{ dayjs(tagInfo.created_at).format('YYYY-MM-DD HH:mm:ss') }}
          </p>
        </li>
      </ul>
      <template #footer>
        <div class="card-footer">
          <router-link :to="`/admin_panel/tags/${tagInfo.id}/edit`">
            <CsgButton
              class="btn btn-primary btn-md"
              :name="$t('admin.tags.editBtn')" />
          </router-link>
        </div>
      </template>
    </Card>
  </Container>
</template>

<script setup>
  import { Container, Card, Pagination, Table } from '../admin_component'
  import { ref, onMounted } from 'vue'
  import { useRoute } from 'vue-router'
  import dayjs from 'dayjs'
  import useFetchApi from '../../../packs/useFetchApi'

  const route = useRoute()

  const tagInfo = ref({})

  const fetchTag = async () => {
    const { data } = await useFetchApi(`/tags/${route.params.id}`).json()
    if (data.value) {
      const result = data.value
      tagInfo.value = result.data
    } else {
      ElMessage.error('Failed to fetch user')
    }
  }

  onMounted(() => {
    fetchTag()
  })
</script>
