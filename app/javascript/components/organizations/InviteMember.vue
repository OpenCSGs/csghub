<template>
  <div class="InviteMember">
    <!-- org detail invite button -->
    <button
      v-if="role === 'admin'"
      @click="dialogVisible = true"
      class="px-[12px] py-[8px] flex gap-[4px] items-center rounded-md border border-gray-300 text-[14px]"
    >
      <SvgIcon name="invite_org_member" />
      <span>{{ $t('organization.invite.title') }}</span>
    </button>
    <!-- invite dialog -->
    <el-dialog
      v-model="dialogVisible"
      top="10vh"
      :style="{ borderRadius: '10px' }"
      width="450"
      class="invite_dialog"
    >
      <template #header>
        <div class="flex justify-between">
          <div
            class="px-[12px] py-[12px] rounded-[10px] border-[2px] border-[#EAECF0]"
          >
            <SvgIcon name="invite_org_member" />
          </div>
          <img
            src="/images/invite_bg.png"
            class="w-[200px] absolute top-0 left-0"
          />
        </div>
      </template>
      <!-- dialog content -->
      <div class="relative">
        <div class="text-[18px] leading-[28px] text-[#101828]">
          {{ $t('organization.invite.inviteNew') }}
        </div>
        <span class="text-[14px] leading-[20px] text-[#475467] font-light"
          >{{ $t('organization.invite.inviteDesc') }}
          <span class="font-bold">{{ orgName }}</span></span
        >
        <div class="mt-[20px]">
          <div>
            <div class="mb-[20px]">
              <p class="text-[#344054] text-[14px] mb-[6px]">
                {{ $t('all.role') }}
              </p>
              <el-select
                v-model="userRoleInput"
                :placeholder="this.$t('all.select')"
                size="large"
                class="w-full"
              >
                <el-option
                  v-for="item in roleMappings"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </div>
            <p class="text-[#344054] text-[14px] mb-[6px]">
              {{ $t('all.userName') }}
            </p>
            <div
              class="flex gap-[4px] flex-wrap items-center w-full border rounded-[4px] border-gray-300 min-h-[40px] p-[6px]"
            >
              <div
                class="scroll-container flex gap-[4px] flex-wrap max-h-[120px] overflow-y-auto"
              >
                <span
                  v-for="user in selectedUsers"
                  class="flex items-center gap-[5px] border rounded-[5px] border-gray-300 px-[5px] py-[2px]"
                >
                  <img
                    :src="user.avatar"
                    height="16"
                    width="16"
                  />
                  {{ user.name }}
                  <el-icon><Close @click="removeUser(user.name)" /></el-icon>
                </span>
              </div>
              <input
                class="w-full max-h-[36px] outline-none"
                v-model="userNameInput"
                @input="showUserList"
              />
            </div>
            <div
              v-show="shouldShowUserList"
              class="md:max-h-[110px] max-h-[210px] overflow-y-auto rounded-md border border-gray-200 bg-white shadow-lg py-[4px] px-[6px]"
            >
              <p
                v-for="user in userList"
                @click="selectUser(user)"
                class="flex gap-[8px] items-center cursor-pointer p-[10px]"
              >
                <img
                  :src="user.avatar"
                  height="16"
                  width="16"
                />
                {{ user.name }}
              </p>
            </div>
          </div>
        </div>
      </div>
      <template #footer>
        <span class="flex justify-between">
          <el-button
            class="w-[50%]"
            size="large"
            @click="dialogVisible = false"
            >{{ $t('all.cancel') }}</el-button
          >
          <el-button
            class="w-[50%]"
            size="large"
            type="primary"
            @click="confirmInviteNewMember"
          >
            {{ $t('all.confirm') }}
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
  import { ref, inject } from 'vue'
  import csrfFetch from '../../packs/csrfFetch.js'
  import jwtFetch from '../../packs/jwtFetch.js'
  import { ElMessage } from 'element-plus'
  import { useI18n } from 'vue-i18n'
  import { useCookies } from 'vue3-cookies'

  const { cookies } = useCookies()
  const csghubServer = inject('csghubServer')
  const emit = defineEmits(['resetMemberList'])

  const props = defineProps({
    orgName: String,
    role: String
  })

  const { t } = useI18n()
  const dialogVisible = ref(false)
  const userNameInput = ref('')
  const userRoleInput = ref('read')
  const selectedUsers = ref([])
  const userList = ref([])
  const shouldShowUserList = ref(false)
  const roleMappings = [
    {
      value: 'read',
      label: 'read'
    },
    {
      value: 'write',
      label: 'write'
    },
    {
      value: 'admin',
      label: 'admin'
    }
  ]

  const removeUser = (username) => {
    selectedUsers.value = selectedUsers.value.filter(
      (item) => item.name !== username
    )
  }

  const selectUser = (newUser) => {
    const findUser = selectedUsers.value.find(
      (user) => user.name === newUser.name
    )
    if (!findUser) {
      selectedUsers.value.push({ name: newUser.name, avatar: newUser.avatar })
    }
  }

  const showUserList = (e) => {
    if (e.target.value) {
      getUsers(userNameInput.value)
        .then((data) => {
          shouldShowUserList.value = data.users.length > 0
          userList.value = data.users.slice(0, 6)
        })
        .catch((err) => {
          ElMessage({
            message: err.message,
            type: 'warning'
          })
        })
    } else {
      shouldShowUserList.value = false
    }
  }

  async function getUsers(username) {
    const usersEndpoint = `/internal_api/users?name=${username}`
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }
    const response = await csrfFetch(usersEndpoint, options)
    if (!response.ok) {
      return response.json().then((data) => {
        throw new Error(data.message)
      })
    } else {
      return response.json()
    }
  }

  const confirmInviteNewMember = () => {
    inviteNewMember()
      .then(() => {
        emit('resetMemberList', selectedUsers.value, userRoleInput.value)
        dialogVisible.value = false
        ElMessage({
          message: t('organization.invite.addSuccess'),
          type: 'success'
        })
      })
      .catch((err) => {
        ElMessage({
          message: err.message,
          type: 'warning'
        })
      })
  }

  async function inviteNewMember() {
    const inviteNewMemberEndpoint = `${csghubServer}/api/v1/organization/${props.orgName}/members`
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        role: userRoleInput.value,
        users: selectedUsers.value.map((user) => user.name).join(',')
      })
    }
    const response = await jwtFetch(inviteNewMemberEndpoint, options)
    if (!response.ok) {
      return response.json().then((data) => {
        throw new Error(data.message)
      })
    } else {
      return response.json()
    }
  }
</script>

<style>
  @media (max-width: 768px) {
    .InviteMember .invite_dialog {
      width: 350px;
    }
  }
  .InviteMember .scroll-container::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 8px; /* 滚动条宽度 */
    background-color: #ccc; /* 滚动条颜色 */
    border-radius: 4px; /* 滚动条圆角 */
  }

  .InviteMember .scroll-container .content {
    padding-right: 8px; /* 留出滚动条的空间 */
  }

  .InviteMember .scroll-container::-webkit-scrollbar {
    width: 8px; /* 滚动条宽度 */
  }

  .InviteMember .scroll-container::-webkit-scrollbar-thumb {
    background-color: #888; /* 滚动条thumb颜色 */
    border-radius: 4px; /* 滚动条thumb圆角 */
  }
</style>
