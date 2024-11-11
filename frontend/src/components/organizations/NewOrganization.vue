<template>
  <div class="rounded-2xl bg-white p-[36px] w-[655px] md:w-full border border-[1px] border-gray-200 shadow-sm">
    <h3 class="text-gray-700 text-xl font-[600]">{{ $t('organization.newOrganization.title') }}</h3>
    <el-form
      ref="dataFormRef"
      :model="dataForm"
      :rules="rules"
      label-position="top"
      class="mt-[48px] text-left"
      style="--el-border-radius-base: 8px"
      >
      <!-- name -->
      <el-form-item :label="$t('organization.orgNameSpace')" prop="name">
        <el-input v-model="dataForm.name" :placeholder="$t('rule.nameRule')">
          <template #prepend>{{getDomain()}}</template>
        </el-input>
        <div class="mt-[6px]">
          <p class="text-gray-600 text-sm font-[300] leading-[20px]">{{ $t('organization.orgSpaceTips') }}</p>
        </div>
      </el-form-item>

      <!-- nickname -->
      <el-form-item :label="$t('organization.orgNickName')" prop="nickname">
        <el-input v-model="dataForm.nickname" :placeholder="$t('all.pleaseInput', {value: $t('organization.orgNickName')})"></el-input>
      </el-form-item>

      <!-- org_type -->
      <el-form-item :label="$t('organization.orgType')" prop="org_type">
        <el-select
          v-model="dataForm.org_type"
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

      <!-- homepage -->
      <el-form-item :label="$t('organization.orgHomepage')" prop="homepage">
        <el-input v-model="dataForm.homepage" placeholder="example.com" @blur="formatHomepage">
          <template #prepend>
            <el-select v-model="selectedProtocol" style="width: 100px">
              <el-option label="https://" value="https://" />
              <el-option label="http://" value="http://" />
            </el-select>
          </template>
        </el-input>
      </el-form-item>

      <!-- avatar -->
      <el-form-item :label="$t('organization.orgAvatar')" prop="logo_image">
        <el-upload
          :class="`w-full ${showUpload ? 'h-[229px]' : 'hide'}`"
          :limit="1"
          v-model:file-list="dataForm.logo_image"
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
        <el-button
          class="w-full !text-center !h-[48px] !text-md !text-white !bg-brand-600 !rounded-md !border-[1px] !border-brand-600"
          @click="handleSubmit"
          :disabled="submitting"
        >
          {{ $t('organization.newOrganization.createOrg') }}
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import useFetchApi from "../../packs/useFetchApi"
  import { inject } from 'vue'

  export default {
    props: {
      currentUserProfile: String,
    },
    data() {
      return {
        nameRule: inject('nameRule'),
        showUpload: true,
        selectedProtocol: 'https://',
        dataForm: {},
        org_types: ['企业', '高校', '非营利组织', '社区组织'],
        submitting: false,
      }
    },
    computed: {
      rules() {
        return { name: [
                   { required: true, message: this.$t('all.pleaseInput', {value: this.$t('organization.orgNameSpace')}), trigger: 'blur' },
                   { pattern: this.nameRule, message: this.$t('rule.nameRule'), trigger: 'blur' },
                 ],
                 nickname: [
                   { required: false, message: this.$t('all.pleaseInput', {value: this.$t('organization.orgNickName')}), trigger: 'blur' },
                 ],
                 org_type: [
                   { required: true, message: this.$t('all.pleaseSelect', {value: this.$t('organization.orgType')}), trigger: 'blur' },
                 ],
                 homepage: [
                   { required: false, message: this.$t('all.pleaseInput', {value: this.$t('organization.orgHomepage')}), trigger: 'blur' }
                 ]
               }
      }
    },
    methods: {
      handleUploadSuccess(res) {
        this.dataForm.logo = res.url
        this.showUpload = false
      },
      handleUploadError(res) {
        this.showUpload = true
        this.$message({
          message: JSON.parse(res.message).message,
          type: 'error'
        });
      },
      handleRemoveImage() {
        this.showUpload = true
        this.dataForm.logo = ""
      },
      handleUploadProgress() {
        this.showUpload = false
      },
      getDomain() {
        const domain = window.location.hostname;
        return `${domain}/`
      },
      formatHomepage() {
        if (this.dataForm.homepage) {
          // 检查并移除 http:// 或 https://，同时更新 selectedProtocol
          const httpRegex = /^http:\/\//;
          const httpsRegex = /^https:\/\//;

          if (httpRegex.test(this.dataForm.homepage)) {
            this.selectedProtocol = 'http://';
            this.dataForm.homepage = this.dataForm.homepage.replace(httpRegex, '');
          } else if (httpsRegex.test(this.dataForm.homepage)) {
            this.selectedProtocol = 'https://';
            this.dataForm.homepage = this.dataForm.homepage.replace(httpsRegex, '');
          }
        }
      },
      handleSubmit() {
        this.$refs['dataFormRef'].validate(async (valid) => {
          if (valid) {
            this.createOrganization()
          } else {
            return false
          }
        })
      },
      async createOrganization() {
        this.submitting = true
        const params = Object.assign({}, this.dataForm)
        delete params.logo_image
        if (params.homepage) {
          params.homepage = this.selectedProtocol + params.homepage
        }
        // const orgCreateEndpoint = `/internal_api/organizations`;
        const orgCreateEndpoint = '/organizations';
        const options = {
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(params)
        }

        const { error } = await useFetchApi(orgCreateEndpoint, options).post().json()

        if (error.value) {
          this.$message({
            message: error.value.msg,
            type: 'warning'
          });
        } else {
          this.$message({
            message: this.$t('organization.newOrganization.createSuccess'),
            type: 'success'
          });
          setTimeout(() => {
            window.location.href = "/organizations/" + this.dataForm.name
          }, 500)
        }

        this.submitting = false
      }
    }
  }
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
    height: 44px;
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