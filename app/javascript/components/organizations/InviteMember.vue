<template>
  <div>
    <button @click="dialogVisible = true" class="px-[12px] py-[8px] my-[16px] flex gap-[4px] rounded-md border border-gray-300 text-[14px]">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M9.99984 12.9167H6.24984C5.08687 12.9167 4.50538 12.9167 4.03222 13.0602C2.96688 13.3834 2.1332 14.217 1.81004 15.2824C1.6665 15.7555 1.6665 16.337 1.6665 17.5M15.8332 17.5V12.5M13.3332 15H18.3332M12.0832 6.25C12.0832 8.32107 10.4042 10 8.33317 10C6.2621 10 4.58317 8.32107 4.58317 6.25C4.58317 4.17893 6.2621 2.5 8.33317 2.5C10.4042 2.5 12.0832 4.17893 12.0832 6.25Z" stroke="#344054" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <span>邀请</span>
    </button>
    <el-dialog
      v-model="dialogVisible"
      title="邀请新成员"
      width="350"
    >
      <div>
        <span>你正在邀请新成员到组织 <span class="font-bold">{{ orgName }}</span></span>
        <div class="mt-[20px]">
          <div class="mb-[20px]">
            <p class="text-[#344054] text-[14px] mb-[6px]">用户名</p>
            <div class="flex gap-[4px] items-center w-full border rounded-[4px] border-gray-300 h-[40px] p-[6px]">
              <div class="flex gap-[4px]">
                <span v-for="user in selectedUsers" class="flex items-center gap-[5px] border rounded-[5px] border-gray-300 px-[5px] py-[2px]">
                  <img :src="user.avatar" height="16" width="16">
                  {{ user.name }}
                  <el-icon><Close @click="removeUser(user.name)" /></el-icon>
                </span>
              </div>
              <input class="w-full h-[36px] outline-none" v-model="userNameInput" @change="showUserList" placeholder="" />
            </div>
          </div>
          <div>
            <p class="text-[#344054] text-[14px] mb-[6px]">角色</p>
            <el-select v-model="userRoleInput" placeholder="选择角色" class="w-full">
              <el-option
                v-for="item in roleMappings"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                :disabled="item.disabled"
              />
            </el-select>
          </div>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="dialogVisible = false">
            确认
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

  const emit = defineEmits(['resetMemberList'])

  const props = defineProps({
    orgName: String,
  })

  const dialogVisible = ref(false)
  const userNameInput = ref('')
  const userRoleInput = ref('')
  const selectedUsers = ref([
    {name: 'hiveer', avatar: "https://cdn.casbin.org/img/casbin.svg", url: "http://localhost:3000"},
    {name: 'hiveer2', avatar: "https://cdn.casbin.org/img/casbin.svg", url: "http://localhost:3000"}
  ])
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

  const showUserList = (value) => {
    getUsers(value).then(data => {
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
    const response = await csrfFetch(usersEndpoint)
    if (!response.ok) {
      return response.json().then(data => { throw new Error(data.message) })
    } else {
      return response.json();
    }
  }
</script>