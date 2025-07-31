<template>
  <div class="flex flex-col gap-[32px] p-[16px] pt-[24px]">
    <div class="font-semibold text-xl leading-[28px] pt-[16px]">{{ $t('organization.orgInfo') }}</div>
    <el-form
      ref="dataFormRef"
      :model="organization"
      :rules="rules"
      label-position="top"
      class="mt-[48px] text-left"
      style="--el-border-radius-base: 8px"
      >
      <el-form-item :label="$t('organization.orgNameSpace')" prop="name">
        <el-input disabled v-model="organization.name" :placeholder="$t('rule.nameRule')">
          <template #prepend>{{getDomain()}}</template>
        </el-input>
      </el-form-item>
      <el-form-item :label="$t('organization.orgNickName')" prop="nickname">
        <el-input v-model="organization.nickname" :placeholder="$t('all.pleaseInput', {value: $t('organization.orgNickName')})"></el-input>
      </el-form-item>
      <el-form-item :label="$t('organization.orgType')" prop="org_type">
        <el-select
          v-model="organization.org_type"
          :placeholder="$t('all.pleaseSelect', {value: $t('organization.orgType')})"
          style="width: 100%;"
        >
          <el-option
            v-for="value in org_types"
            :key="value"
            :label="value"
            :value="value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('organization.orgHomepage')" prop="homepage">
        <el-input v-model="organization.homepage" placeholder="example.com">
          <template #prepend>
            <el-select v-model="selectedProtocol" style="width: 100px; border: none">
              <el-option label="https://" value="https://" />
              <el-option label="http://" value="http://" />
            </el-select>
          </template>
        </el-input>
      </el-form-item>

      <el-form-item :label="$t('organization.orgAvatar')" prop="logo_image">
        <el-upload
          :class="`w-full ${!organization.logo ? 'h-[229px]' : 'hide'}`"
          :limit="1"
          v-model:file-list="logo_images"
          drag
          list-type="picture"
          accept="image/png, image/jpeg, image/gif, image/svg+xml"
          :data="{
            namespace: 'org-logo',
            file_max_size: 1024*1024
          }"
          action="/internal_api/upload"
          :on-progress="handleUploadProgress"
          :on-remove="handleRemoveImage"
          :on-success="handleUploadSuccess"
          :on-error="handleUploadError"
        >
          <div>
            <div class="el-upload__text">
              <p>
                <span class="text-brand-700 font-[500]">
                  {{ $t('components.upload.click_to_upload') }}
                </span>
                {{ $t('components.upload.or_drag_file') }}
              </p>
              <p>{{ $t('components.upload.upload_type', {accept: 'SVG, PNG, JPG, GIF'}) }}</p>
            </div>
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
          </div>
        </el-upload>
      </el-form-item>

      <el-form-item>
        <button class="btn btn-primary btn-md" @click="handleSubmit">{{ $t('all.saveSetting') }}</button>
      </el-form-item>
    </el-form>

    <!-- 删除组织表单 -->
    <div v-if="isAdmin">
      <div class="font-semibold text-xl leading-[28px] text-gray-800 mb-4">{{ $t('organization.edit.deleteOrganization') }}</div>
      <div class="text-sm text-gray-700 mb-6">{{ $t('organization.edit.deleteOrganizationDesc') }}</div>
      <div class="text-sm text-gray-700 mb-4">{{ $t('organization.edit.deleteOrganizationConfirm', {orgName: organization.name}) }}</div>
      
      <el-form
        ref="deleteFormRef"
        :model="deleteForm"
        label-position="top"
        class="text-left"
        style="--el-border-radius-base: 8px"
      >
        <el-form-item :label="$t('organization.edit.deleteOrganizationName')" prop="confirmName">
          <el-input 
            v-model="deleteForm.confirmName" 
            :placeholder="$t('organization.edit.deleteOrganizationNamePlaceholder')"
            class="w-full"
          ></el-input>
        </el-form-item>
        
        <el-form-item>
          <CsgButton
            class="btn btn-danger btn-md"
            :disabled="isDeleteButtonDisabled"
            :name="$t('organization.edit.deleteOrganizationButton')"
            @click="handleDeleteOrganization"
          />
        </el-form-item>
      </el-form>
    </div>
    
  </div>
</template>
<script setup>
  import useFetchApi from "../../packs/useFetchApi"
  import { ref, inject, computed, onMounted, watch } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import useUserStore from '../../stores/UserStore'
  const userStore = useUserStore()

  const props = defineProps({
    organizationRaw: {
      type: Object,
      required: true
    }
  })

  const { t } = useI18n()

  const organization = ref(Object.assign({}, props.organizationRaw))
  const nameRule = inject('nameRule')
  const selectedProtocol = ref('https://')
  const org_types = ['企业', '高校', '非营利组织', '社区组织']
  const dataFormRef = ref(null)
  const deleteFormRef = ref(null)

  const emit = defineEmits(['updateOrganization']);

  const logo_images = ref([])

  // 删除表单数据
  const deleteForm = ref({
    confirmName: ''
  })

  // 用户角色状态
  const isAdmin = ref(false)

  // 计算删除按钮是否禁用
  const isDeleteButtonDisabled = computed(() => {
    return !deleteForm.value.confirmName || deleteForm.value.confirmName.trim() === '' || deleteForm.value.confirmName !== organization.value.name
  })

  watch(props.organizationRaw, (newVal) => {
    // set logo
    if (newVal.logo) {
      logo_images.value = [{ url: newVal.logo, name: newVal.logo }]
    }
    //set organization value 
    organization.value = newVal
    // after organization value set, format homepage
    if (newVal.homepage) {
      formatHomepage(newVal.homepage)
    }
  })

  const rules = computed(() => {
    return { name: [
                { required: true, message: t('all.pleaseInput', {value: t('organization.orgNameSpace')}), trigger: 'blur' },
                { pattern: nameRule, message: t('rule.nameRule'), trigger: 'blur' },
              ],
              nickname: [
                { required: false, message: t('all.pleaseInput', {value: t('organization.orgNickName')}), trigger: 'blur' },
              ],
              logo: [
                { required: true, message: t('all.pleaseSelect', {value: t('organization.orgAvatar')}), trigger: 'blur' },
              ],
              org_type: [
                { required: true, message: t('all.pleaseSelect', {value: t('organization.orgType')}), trigger: 'blur' },
              ],
              homepage: [
                { required: false, message: t('all.pleaseInput', {value: t('organization.orgHomepage')}), trigger: 'blur' }
              ]
            }
  })

  const handleUploadSuccess = (res) => {
    organization.value.logo = res.url
  }

  const handleUploadError = (res) => {
    ElMessage({
      message: JSON.parse(res.message).message,
      type: 'error'
    });
  }

  const handleRemoveImage = () => {
    organization.value.logo = ""
  }

  const handleUploadProgress = () => {
  }

  const getDomain = () => {
    return `${window.location.hostname}/`
  }

  const formatHomepage = (homepage) => {
    if (homepage) {
      // 检查并移除 http:// 或 https://，同时更新 selectedProtocol
      const httpRegex = /^http:\/\//;
      const httpsRegex = /^https:\/\//;

      if (httpRegex.test(homepage)) {
        selectedProtocol.value = 'http://';
        organization.value.homepage = homepage.replace(httpRegex, '');
      } else if (httpsRegex.test(homepage)) {
        selectedProtocol.value = 'https://';
        organization.value.homepage = homepage.replace(httpsRegex, '');
      }
    }
  }

  const handleSubmit = () => {
    dataFormRef.value.validate(async (valid) => {
      if (valid) {
        updateOrganization()
      } else {
        return false
      }
    })
  }

  const updateOrganization = async () => {
    const params = Object.assign({}, organization.value)
    delete params.logo_image
    if (params.homepage) {
      params.homepage = selectedProtocol.value + params.homepage
    }
    const orgUpdateEndpoint = `/organization/${organization.value.name}`;
    const options = {
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    }

    const { error } = await useFetchApi(orgUpdateEndpoint, options).put().json()

    if (error.value) {
      ElMessage({
        message: error.value.msg,
        type: 'warning'
      });
    } else {
      ElMessage({
        message: t('organization.edit.updateSuccess'),
        type: 'success'
      });
      emit("updateOrganization", {
        logo: organization.value.logo,
        nickname: organization.value.nickname || organization.value.name,
        homepage: selectedProtocol.value + organization.value.homepage,
      })
    }
  }

  // 删除组织处理函数
  const handleDeleteOrganization = async () => {
    if (isDeleteButtonDisabled.value) {
      return
    }

    try {
      await ElMessageBox.confirm(
        t('organization.edit.deleteOrganizationConfirmTitle'),
        t('organization.edit.deleteOrganization'),
        {
          confirmButtonText: t('organization.edit.deleteOrganizationConfirmButton'),
          cancelButtonText: t('organization.edit.deleteOrganizationCancelButton'),
          type: 'warning',
        }
      )

      const deleteEndpoint = `/organization/${organization.value.name}`;
      const { error } = await useFetchApi(deleteEndpoint).delete().json()

      if (error.value) {
        ElMessage({
          message: error.value.msg,
          type: 'error'
        });
      } else {
        ElMessage({
          message: t('organization.edit.deleteOrganizationSuccess'),
          type: 'success'
        });
        
        // 更新用户信息以反映组织删除
        await userStore.fetchUserInfo()
        
        // 删除成功后跳转到首页或组织列表
        window.location.href = '/'
      }
    } catch (err) {
      // 用户取消删除
    }
  }

  const currentUserRole = async () => {
    if (!organization.value.name) return

    const orgIsAdminEndpoint = `/organization/${organization.value.name}/members/${userStore.username}`
    const { data, error } = await useFetchApi(orgIsAdminEndpoint).json()

    if (error.value) {
      ElMessage({ message: error.value.msg, type: 'warning' })
      isAdmin.value = false
    } else {
      const body = data.value
      if(!body.data){
        window.location.href = '/'
      } else {
        // 检查用户是否为管理员
        isAdmin.value = body.data === 'admin'
      }
    }
  }

  watch(
    () => userStore.isLoggedIn,
    () => {
      currentUserRole()
    }
  )

  onMounted(() => {
    if (userStore.isLoggedIn) {
      currentUserRole()
    }
  })
</script>

<style scoped>
  .el-form-item {
    margin-bottom: 24px;
  }
  .el-form-item__label {
    margin-bottom: 6px;
  }

  :deep(.el-textarea__inner) {
    padding-top: 10px;
    padding-bottom: 10px;
    height: 44px;
  }
  :deep(.el-input__inner) {
    height: 44px;
  }
  :deep(.el-select__wrapper) {
    height: 46px;
    box-shadow: none !important;
  }
  :deep(.el-upload--picture) {
    border: 0px;
  }
  :deep(.hide .el-upload.el-upload--picture){
    display: none;
  }
  :deep(.el-upload-list__item){
    transition: unset;
  }
  :deep(.el-input-group__prepend) {
    background-color: unset;
  }
  :deep(.el-form-item .el-input__validateIcon) {
    display: none;
  }
</style>
