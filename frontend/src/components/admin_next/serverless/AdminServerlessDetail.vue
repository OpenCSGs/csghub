<template>
  <Container
    :title="$t('admin.serverless.detailTitle')"
    subtitle=""
    :showBack="true"
    :breadcrumbs="[
      {
        text: `Model #${route.params.name}`,
        to: `/admin_panel/models/${route.params.namespace}/${route.params.name}`
      },
      { text: `Serverless #${route.params.id}` }
    ]"
  >
    <Card :title="`Serverless #${route.params.id}`" :show-footer="true">
      <template #header>
        <div class="flex justify-between px-6 py-7 border-b border-gray-200">
          <h2 class="text-lg text-gray-900">
            {{ `Serverless #${route.params.id}` }}
          </h2>
        </div>
      </template>
      <ul class="">
        <li class="flex mb-4">
          <label class="admin-field-label">{{
            $t('admin.serverless.deployName')
          }}</label>
          <p class="admin-field">{{ serverlessInfo.deploy_name }}</p>
        </li>
        <li class="flex mb-4">
          <label class="admin-field-label">{{
            $t('admin.serverless.cluster')
          }}</label>
          <p class="admin-field">{{ serverlessInfo.cluster_id }}</p>
        </li>
        <li class="flex mb-4">
          <label class="admin-field-label">{{
            $t('admin.serverless.resource')
          }}</label>
          <p class="admin-field">{{ serverlessInfo.hardware }}</p>
        </li>
        <li class="flex mb-4">
          <label class="admin-field-label">{{
            $t('admin.serverless.runtimeFramework')
          }}</label>
          <p class="admin-field">{{ serverlessInfo.runtime_framework }}</p>
        </li>
        <li class="flex mb-4">
          <label class="admin-field-label">{{
            $t('admin.serverless.env')
          }}</label>
          <p class="admin-field">{{ serverlessInfo.env }}</p>
        </li>
        <li class="flex mb-4">
          <label class="admin-field-label"
            >{{ $t('admin.serverless.status') }}
          </label>
          <p class="admin-field">{{ serverlessInfo.status }}</p>
        </li>
      </ul>
      <div v-if="serverlessInfo.status !== 'Stopped'" class="py-2">
        <p>{{ $t('admin.serverless.runningLogs') }}</p>
        <AdminServerlessLogs
          :instances="serverlessInfo.instances"
          :modelId="serverlessInfo.model_id"
          :deployId="serverlessInfo.deploy_id"
        />
      </div>
      <template #footer>
        <div class="flex gap-[16px]">
          <div class="flex gap-4">
            <router-link
              :to="`/admin_panel/serverless/${route.params.namespace}/${route.params.name}/${route.params.id}/edit`"
            >
              <CsgButton
                class="btn btn-primary btn-md"
                :name="$t('admin.serverless.edit')"
              />
            </router-link>
            <CsgButton
              v-if="serverlessInfo.status && serverlessInfo.status !== 'Stopped'"
              class="btn btn-primary btn-md"
              :name="$t('admin.serverless.stop')"
              @click="stopServerless"
            />
            <CsgButton
              v-if="serverlessInfo.status && serverlessInfo.status === 'Stopped'"
              class="btn btn-primary btn-md"
              :name="$t('admin.serverless.restart')"
              @click="restartServerless"
            />
          </div>
        </div>
      </template>
    </Card>
  </Container>
</template>

<script setup>
  import { Container, Card } from '../admin_component'
  import { ref, onMounted } from 'vue'
  import { useRoute } from 'vue-router'
  import useFetchApi from '../../../packs/useFetchApi'
  import { ElMessage } from 'element-plus'
  import { useI18n } from 'vue-i18n'
  import AdminServerlessLogs from './AdminServerlessLogs.vue'

  const { t } = useI18n()

  const route = useRoute()

  const serverlessInfo = ref({})

  const fetchServerless = async () => {
    const { data } = await useFetchApi(
      `/models/${route.params.namespace}/${route.params.name}/serverless/${route.params.id}`
    ).json()
    if (data.value) {
      const result = data.value
      serverlessInfo.value = result.data
    } else {
      ElMessage.error('Failed to fetch serverless')
    }
  }

  const stopServerless = async () => {
    const { data } = await useFetchApi(
      `/models/${route.params.namespace}/${route.params.name}/serverless/${route.params.id}/stop`
    )
      .put()
      .json()
    if (data.value) {
      ElMessage.success(t('admin.serverless.stopSuccess'))
      fetchServerless()
    } else {
      ElMessage.error(t('admin.serverless.stopFailed'))
    }
  }

  const restartServerless = async () => {
    const { data } = await useFetchApi(
      `/models/${route.params.namespace}/${route.params.name}/serverless/${route.params.id}/start`
    ).put().json()
    if (data.value) {
      ElMessage.success(t('admin.serverless.restartSuccess'))
      fetchServerless()
    } else {
      ElMessage.error(t('admin.serverless.restartFailed'))
    }
  }

  onMounted(() => {
    fetchServerless()
  })
</script>
