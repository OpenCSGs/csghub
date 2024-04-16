<template>
  <div class="InviteMember">
    <button v-if="admin" @click="dialogVisible = true" class="px-[12px] py-[8px] flex gap-[4px] items-center rounded-md border border-gray-300 text-[14px]">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M9.99984 12.9167H6.24984C5.08687 12.9167 4.50538 12.9167 4.03222 13.0602C2.96688 13.3834 2.1332 14.217 1.81004 15.2824C1.6665 15.7555 1.6665 16.337 1.6665 17.5M15.8332 17.5V12.5M13.3332 15H18.3332M12.0832 6.25C12.0832 8.32107 10.4042 10 8.33317 10C6.2621 10 4.58317 8.32107 4.58317 6.25C4.58317 4.17893 6.2621 2.5 8.33317 2.5C10.4042 2.5 12.0832 4.17893 12.0832 6.25Z" stroke="#344054" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/></svg>
      <span>{{ $t('organization.invite.title') }}</span>
    </button>
    <el-dialog v-model="dialogVisible" top="10vh" :style="{ borderRadius: '10px' }" width="450" class="invite_dialog">
      <template #header="{ close }">
        <div class="flex justify-between">
          <div class="px-[12px] py-[12px] rounded-[10px] border-[2px] border-[#EAECF0]">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M19 21V15M16 18H22M12 15H8C6.13623 15 5.20435 15 4.46927 15.3045C3.48915 15.7105 2.71046 16.4892 2.30448 17.4693C2 18.2044 2 19.1362 2 21M15.5 3.29076C16.9659 3.88415 18 5.32131 18 7C18 8.67869 16.9659 10.1159 15.5 10.7092M13.5 7C13.5 9.20914 11.7091 11 9.5 11C7.29086 11 5.5 9.20914 5.5 7C5.5 4.79086 7.29086 3 9.5 3C11.7091 3 13.5 4.79086 13.5 7Z" stroke="#344054" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
          <img src="/images/invite_bg.png" class="w-[200px] absolute top-0 left-0" />
        </div>
      </template>
      <div class="relative">
        <div class="text-[18px] leading-[28px] text-[#101828]">{{ $t('organization.invite.inviteNew') }}</div>
        <span class="text-[14px] leading-[20px] text-[#475467] font-light">{{ $t('organization.invite.inviteDesc') }}  <span class="font-bold">{{ orgName }}</span></span>
        <div class="mt-[20px]">
          <div>
            <div class="mb-[20px]">
              <p class="text-[#344054] text-[14px] mb-[6px]">{{ $t('all.role') }}</p>
              <el-select v-model="userRoleInput" :placeholder="this.$t('all.select')" size="large" class="w-full">
                <el-option
                  v-for="item in roleMappings"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </div>
            <p class="text-[#344054] text-[14px] mb-[6px]">{{ $t('all.userName') }}</p>
            <div class="flex gap-[4px] flex-wrap items-center w-full border rounded-[4px] border-gray-300 min-h-[40px] p-[6px]">
              <div class="scroll-container flex gap-[4px] flex-wrap max-h-[120px] overflow-y-auto">
                <span v-for="user in selectedUsers" class="flex items-center gap-[5px] border rounded-[5px] border-gray-300 px-[5px] py-[2px]">
                  <img :src="user.avatar" height="16" width="16">
                  {{ user.name }}
                  <el-icon><Close @click="removeUser(user.name)" /></el-icon>
                </span>
              </div>
              <input class="w-full max-h-[36px] outline-none"
                     v-model="userNameInput"
                     @input="showUserList" />
            </div>
            <div v-show="shouldShowUserList" class="rounded-md border border-gray-200 bg-white shadow-lg py-[4px] px-[6px]">
              <p v-for="user in userList"
                 @click="selectUser(user)"
                 class="flex gap-[8px] items-center cursor-pointer p-[10px]"
              >
                <img :src="user.avatar" height="16" width="16">
                {{ user.name }}
              </p>
            </div>
          </div>
        </div>
      </div>
      <template #footer>
        <span class="flex justify-between">
          <el-button class="w-[50%]" size="large" @click="dialogVisible = false">{{ $t('all.cancel') }}</el-button>
          <el-button class="w-[50%]" size="large" type="primary" @click="confirmInviteNewMember">
            {{ $t('all.confirm') }}
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue'
  import csrfFetch from '../../packs/csrfFetch.js';
  import { ElMessage } from 'element-plus'
  import { useI18n } from 'vue-i18n'

  const emit = defineEmits(['resetMemberList'])

  const props = defineProps({
    orgName: String,
    admin: Boolean
  })

  const { t } = useI18n();
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
    selectedUsers.value = selectedUsers.value.filter( item => item.name !== username )
  }

  const selectUser = (newUser) => {
    const findUser = selectedUsers.value.find(user => user.name === newUser.name)
    if (!findUser) {
      selectedUsers.value.push({name: newUser.name, avatar: newUser.avatar})
    }
  }

  const showUserList = (e) => {
    getUsers(userNameInput.value).then(data => {
      shouldShowUserList.value = data.users.length > 0
      userList.value = data.users.slice(0, 6);
    })
    .catch(err => {
      ElMessage({
        message: err.message,
        type: 'warning'
      })
    })
  }

  async function getUsers(username) {
    const usersEndpoint = `/internal_api/users?name=${username}`;
    const options = {
      method:'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    }
    const response = await csrfFetch(usersEndpoint, options)
    if (!response.ok) {
      return response.json().then(data => { throw new Error(data.message) })
    } else {
      return response.json();
    }
  }

  const confirmInviteNewMember = () => {
    inviteNewMember().then(() => {
      emit('resetMemberList', selectedUsers.value, userRoleInput.value)
      dialogVisible.value = false
      ElMessage({
        message: t('organization.invite.addSuccess'),
        type: 'success'
      })
    })
    .catch(err => {
      ElMessage({
        message: err.message,
        type: 'warning'
      })
    })
  }

  async function inviteNewMember() {
    const inviteNewMemberEndpoint = '/internal_api/organizations/new-members';
    const options = {
      method:'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        org_name: props.orgName,
        user_names: selectedUsers.value.map(user => user.name).join(','),
        user_role: userRoleInput.value
      })
    }
    const response = await csrfFetch(inviteNewMemberEndpoint, options)
    if (!response.ok) {
      return response.json().then(data => { throw new Error(data.message) })
    } else {
      return response.json();
    }
  }
</script>
<style>
  @media (max-width: 768px) {
    .InviteMember .invite_dialog{
      width:350px;
    }
  }
  .InviteMember .scroll-container::after {
    content: "";
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