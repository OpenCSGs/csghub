<template>
  <div class="flex flex-col gap-[32px] p-[16px] pt-[24px]">
    <div class="text-[20px] text-gray-700 font-[500] leading-[30px]">
      <div class="py-[16px]">
        {{ $t('organization.orgMembers') }}
      </div>
      <div
        class="flex flex-col items-start rounded-[12px] border border-[1px] border-gray-200 shadow-sm"
      >
        <div
          class="px-[24px] py-[20px] w-full flex justify-between border-b border-gray-200"
        >
          <div class="flex flex-col gap-[4px]">
            <div class="text-[18px] font-[500] leading-[28px] text-gray-900">
              {{ $t('organization.members.title') }}
            </div>
            <div class="text-[14px] font-[300] leading-[20px] text-gray-600">
              {{ $t('organization.members.description') }}
            </div>
          </div>
          <div class="flex gap-[16px]">
            <InviteMember
              :orgName="organization.name"
              :role="role"
              @resetMemberList="fetchMembers"
            />
          </div>
        </div>
        <div class="w-full z-0">
          <el-table
            :data="members"
            stripe
            v-loading="loading"
            style="width: 100%"
          >
            <el-table-column
              :label="$t('organization.members.username')"
              label-class-name="indent-3 text-[12px] font-[400] leading-[18px] text-gray-600"
            >
              <template #default="scope">
                <div class="flex gap-[12px] items-center pl-3">
                  <el-avatar
                    :size="40"
                    :src="scope.row.avatar"
                  ></el-avatar>
                  <div class="flex flex-col">
                    <div
                      class="text-[14px] font-[400] leading-[20px] text-gray-900"
                      v-if="!!scope.row.nickname"
                    >
                      {{ scope.row.nickname }}
                    </div>
                    <div
                      class="text-[14px] font-[300] leading-[20px] text-gray-600"
                      v-if="!!scope.row.name"
                    >
                      @{{ scope.row.name }}
                    </div>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('organization.members.role')"
              label-class-name="text-[12px] font-[400] leading-[18px] text-gray-600"
            >
              <template #default="scope">
                <div
                  class="text-[14px] font-[400] leading-[20px] text-gray-900"
                >
                  {{ scope.row.role }}
                </div>
              </template>
            </el-table-column>
            <!-- 上次登录时间 -->
            <el-table-column
              :label="$t('organization.members.last_login_at')"
              label-class-name="text-[12px] font-[400] leading-[18px] text-gray-600"
            >
              <template #default="scope">
                <div
                  class="text-[14px] font-[400] leading-[20px] text-gray-900"
                >
                  {{ formatDate(scope.row.last_login_at) }}
                </div>
              </template>
            </el-table-column>

            <el-table-column
              v-if="role === 'admin'"
              width="100"
              align="center"
              fixed="right"
            >
              <template #default="scope">
                <div class="flex gap-4 justify-end pr-4">
                  <el-icon
                    :size="16"
                    class="cursor-pointer"
                    @click="handleToRoleEdit(scope.row)"
                  >
                    <Edit />
                  </el-icon>
                  <el-popconfirm
                    :title="
                      $t('organization.members.deleteConfirmTitle', {
                        username: scope.row.nickname || scope.row.name,
                        orgName: organization.name
                      })
                    "
                    :confirm-button-text="$t('organization.members.confirm')"
                    :cancel-button-text="$t('organization.members.cancel')"
                    confirm-button-type="danger"
                    icon="el-icon-info"
                    :width="180"
                    @confirm="handleDelete(scope.row)"
                  >
                    <template #reference>
                      <el-icon
                        :size="16"
                        class="cursor-pointer"
                      >
                        <Delete />
                      </el-icon>
                    </template>
                  </el-popconfirm>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <div class="mt-[12px] mb-[16px] flex justify-center">
            <el-pagination
              background
              hide-on-single-page
              v-model:current-page="searchForm.page"
              :default-current-page="1"
              :page-size="searchForm.per"
              layout="prev, pager, next"
              :total="totalCount"
              @current-page="fetchMembers"
              @update:current-page="fetchMembers"
            />
          </div>
          <OrgMemberRoleEditDialog
            :visible="roleEditDialog"
            :formDataRaw="editRow"
            :organization="organization"
            @close="roleEditDialog = false"
            @submit="fetchMembers"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import useFetchApi from '../../packs/useFetchApi'
  import { ElMessage } from 'element-plus'
  import InviteMember from './InviteMember.vue'
  import OrgMemberRoleEditDialog from './OrgMemberRoleEditDialog.vue'
  import dayjs from 'dayjs'
  import { ref, onMounted } from 'vue'
  import { useCookies } from 'vue3-cookies'
  import { useI18n } from 'vue-i18n'

  const { cookies } = useCookies()
  const { t } = useI18n()

  const props = defineProps({
    organizationRaw: {
      type: Object,
      required: true
    },
    role: {
      type: String,
      default: ''
    }
  })

  const organization = ref(props.organizationRaw)
  const members = ref([])
  const loading = ref(false)
  const roleEditDialog = ref(false)
  const editRow = ref({})
  const totalCount = ref(0)
  const searchForm = ref({
    page: 1,
    per: 6
  })

  onMounted(() => {
    fetchMembers()
  })

  const fetchMembers = async () => {
    loading.value = true
    const params = new URLSearchParams()
    params.append('page', searchForm.value.page)
    params.append('per', searchForm.value.per)
    const orgMemberListEndpoint = `/organization/${organization.value.name}/members?${params.toString()}`

    const { data, error } = await useFetchApi(orgMemberListEndpoint).json()

    if (error.value) {
      ElMessage({ message: error.value.msg, type: 'warning' })
    } else {
      const body = data.value
      members.value = body.data.data
      totalCount.value = body.data.total
      loading.value = false
    }
  }

  const formatDate = (date) => {
    return dayjs(date).format('YYYY-MM-DD HH:mm:ss')
  }

  const handleDelete = async (member) => {
    const url = `/organization/${organization.value.name}/members/${member.username}`
    const options = {
      body: JSON.stringify({ role: member.role }),
      headers: { 'Content-Type': 'application/json' }
    }
    const { error } = await useFetchApi(url, options).delete().json()
    if (!error.value) {
      ElMessage({
        message: t('organization.members.deleteSuccess'),
        type: 'success'
      })
      fetchMembers()
    } else {
      ElMessage({
        message: error.value.msg,
        type: 'warning'
      })
    }
  }

  const handleToRoleEdit = (row) => {
    editRow.value = Object.assign({}, row)
    roleEditDialog.value = true
  }
</script>