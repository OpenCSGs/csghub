<template>
  <el-form
    :model="dataForm"
    label-position="top"
    label-width="auto"
    style="max-width: 600px"
    >
    <el-form-item label="Name">
      <el-input v-model="dataForm.name" />
    </el-form-item>
    <el-form-item label="Upload Email List (Only CSV supported)">
      <el-upload
        v-model:file-list="dataForm.emailList"
        class="upload-demo w-[600px]"
        :auto-upload="false"
        drag
        :limit="1"
      >
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">
          Drop file here or <em>click to upload</em>
        </div>
      </el-upload>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="createEmailGroup">Create</el-button>
    </el-form-item>
  </el-form>

  <!-- email group list -->
  <el-table
    :stripe="true"
    :data="emailGroups"
    style="width: 100%"
    class="mt-[40px]"
  >
    <el-table-column
      prop="name"
      label="Name"
    />
    <el-table-column
      prop="email_list"
      label="EmailList"
    />
    <el-table-column
      prop="created_at"
      label="Created At"
    />
  </el-table>
  <el-pagination
    v-model:current-page="currentPage"
    :page-size="per"
    layout="prev, pager, next"
    :total="total"
    @current-change="refreshEmailGroups"
    class="my-[52px] flex justify-center"
  />
</template>

<script setup>
  import { ref, onMounted } from 'vue'
  import Papa from 'papaparse'
  import csrfFetch from "../../packs/csrfFetch"
  import { ElMessage } from 'element-plus'

  const dataForm = ref({
    name: '',
    emailList: []
  })

  const emailGroups = ref([])
  const currentPage = ref(1)
  const per = ref(4)
  const total = ref(0)

  const createEmailGroup = () => {
    const file = dataForm.value.emailList[0].raw
    try {
      Papa.parse(file, {
        preview: 0,
        complete: (results, file) => {
          postEmailGroup(results.data.join(','))
        }
      })
    } catch (error) {
      ElMessage({
        message: "File parse error",
        type: 'error'
      })
    }
  }

  const postEmailGroup = async(emailListStr) => {
    const options = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        name: dataForm.value.name,
        email_list: emailListStr
      })
    }
    const response = await csrfFetch('/internal_api/admin/email_groups', options)
    if (response.ok) {
      ElMessage({
        message: 'Email group created successfully!',
        type: 'success'
      })
      dataForm.value = {}
      refreshEmailGroups()
    } else {
      ElMessage({
        message: 'Failed to create email group.',
        type: 'error'
      })
    }
  }

  const refreshEmailGroups = async() => {
    const response = await csrfFetch(`/internal_api/admin/email_groups?per_page=${per.value}&page=${currentPage.value}`, { method: 'GET' })
    if (response.ok) {
      response.json().then(data => {
        total.value = data.total
        emailGroups.value = data.email_groups
      })
    } else {
      console.log('Failed to fetch email groups')
    }
  }

  onMounted(() => {
    refreshEmailGroups()
  })
</script>