<template>
  <div class="flex flex-col gap-[32px] p-[16px] pt-[24px]">
    <div class="text-[20px] text-[#344054] font-[500] leading-[30px]">
      <div class="py-[16px]">
        {{ $t('organization.orgMembers') }}
      </div>
      <div
        class="flex flex-col items-start rounded-[12px] border border-[1px] border-[#EAECF0] shadow-sm"
      >
        <div
          class="px-[24px] py-[20px] w-full flex justify-between border-b border-[#EAECF0]"
        >
          <div class="flex flex-col gap-[4px]">
            <div class="text-[18px] font-[500] leading-[28px] text-[#101828]">
              {{ $t('organization.members.title') }}
            </div>
            <div class="text-[14px] font-[300] leading-[20px] text-[#475467]">
              {{ $t('organization.members.description') }}
            </div>
          </div>
          <div class="flex gap-[16px]">
            <InviteMember
              :org-name="organization.name"
              @resetMemberList="fetchMembers"
              :admin="admin"
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
              label-class-name="indent-3 text-[12px] font-[400] leading-[18px] text-[#475467]"
            >
              <template #default="scope">
                <div class="flex gap-[12px] items-center pl-3">
                  <el-avatar
                    :size="40"
                    :src="scope.row.avatar"
                  ></el-avatar>
                  <div class="flex flex-col">
                    <div
                      class="text-[14px] font-[400] leading-[20px] text-[#101828]"
                      v-if="!!scope.row.nickname"
                    >
                      {{ scope.row.nickname }}
                    </div>
                    <div
                      class="text-[14px] font-[300] leading-[20px] text-[#475467]"
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
              label-class-name="text-[12px] font-[400] leading-[18px] text-[#475467]"
            >
              <template #default="scope">
                <div
                  class="text-[14px] font-[400] leading-[20px] text-[#101828]"
                >
                  {{ scope.row.role }}
                </div>
              </template>
            </el-table-column>
            <!-- 上次登录时间 -->
            <el-table-column
              :label="$t('organization.members.last_login_at')"
              label-class-name="text-[12px] font-[400] leading-[18px] text-[#475467]"
            >
              <template #default="scope">
                <div
                  class="text-[14px] font-[400] leading-[20px] text-[#101828]"
                >
                  {{ formatDate(scope.row.last_login_at) }}
                </div>
              </template>
            </el-table-column>

            <el-table-column
              v-if="admin"
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
  import csrfFetch from '../../packs/csrfFetch.js'
  import jwtFetch from '../../packs/jwtFetch.js'
  import { ElMessage } from 'element-plus'
  import InviteMember from './InviteMember.vue'
  import OrgMemberRoleEditDialog from './OrgMemberRoleEditDialog.vue'
  import dayjs from 'dayjs'
  import { inject } from 'vue'

  // import Member from './Member.vue'

  export default {
    props: {
      organization: Object,
      admin: Boolean
    },
    components: {
      InviteMember,
      OrgMemberRoleEditDialog
    },
    data() {
      return {
        members: [],
        loading: false,
        roleEditDialog: false,
        editRow: {},
        totalCount: 0,
        searchForm: {
          page: 1,
          per: 8
        },
        csghubServer: inject('csghubServer')
      }
    },
    mounted() {
      this.fetchMembers()
    },
    methods: {
      fetchMembers() {
        this.loading = true
        const params = new URLSearchParams()
        params.append('page', this.searchForm.page)
        params.append('per', this.searchForm.per)
        const url = `/internal_api/organizations/${
          this.organization.name
        }/members?${params.toString()}`
        const options = { method: 'GET' }
        csrfFetch(url, options)
          .then((res) => res.json())
          .then((res) => {
            this.members = res.members
            this.totalCount = res.total_count
          })
          .catch((error) => {
            console.error('Error:', error)
          })
          .finally(() => {
            this.loading = false
          })
      },
      formatDate(date) {
        if (!date) return '-'
        return dayjs(date).format('YYYY-MM-DD HH:mm:ss')
      },
      handleDelete(member) {
        const url = `${this.csghubServer}/api/v1/organizations/${this.organization.name}/members/${member.name}`
        const options = {
          method: 'DELETE',
          body: JSON.stringify({ role: member.role }),
          headers: { 'Content-Type': 'application/json' }
        }
        jwtFetch(url, options)
          .then((res) => {
            if (res.ok) {
              res.json().then((data) => {
                this.$message.success(
                  this.$t('organization.members.deleteSuccess')
                )
                this.fetchMembers()
              })
            } else {
              res.json().then((data) => {
                this.$message.error(data.message)
              })
            }
          })
          .catch((error) => {
            console.error('Error:', error)
          })
      },
      handleToRoleEdit(row) {
        this.editRow = Object.assign({}, row)
        this.roleEditDialog = true
      }
    }
  }
</script>
