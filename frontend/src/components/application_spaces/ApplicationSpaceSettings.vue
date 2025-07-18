<template>
  <div
    v-if="deployFailed"
    class="flex gap-2 mt-8 mb-6 p-4 border border-gray-300 rounded-xl shadow-xs">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none">
      <g clip-path="url(#clip0_8886_11536)">
        <path
          d="M9.99984 6.66699V10.0003M9.99984 13.3337H10.0082M18.3332 10.0003C18.3332 14.6027 14.6022 18.3337 9.99984 18.3337C5.39746 18.3337 1.6665 14.6027 1.6665 10.0003C1.6665 5.39795 5.39746 1.66699 9.99984 1.66699C14.6022 1.66699 18.3332 5.39795 18.3332 10.0003Z"
          stroke="#D92D20"
          stroke-width="1.66667"
          stroke-linecap="round"
          stroke-linejoin="round" />
      </g>
      <defs>
        <clipPath id="clip0_8886_11536">
          <rect
            width="20"
            height="20"
            fill="white" />
        </clipPath>
      </defs>
    </svg>
    <div>
      <h3 class="text-gray-600 text-sm font-medium">
        {{ $t('application_spaces.errorPage.errorAlert') }}
      </h3>
      <p class="text-gray-600 text-sm">
        {{ $t('application_spaces.errorPage.errorAlertDesc') }}
      </p>
      <p
        class="text-brand-700 font-normal text-xs mt-3 cursor-pointer"
        @click="showErrorLogs">
        {{ $t('application_spaces.errorPage.showErrorLogs') }}
      </p>
    </div>
  </div>

  <div
    class="border border-gray-200 rounded-md my-8 md:my-0 md:border-none px-6 py-6">
    <!-- cloud resource -->
    <div class="flex xl:flex-col gap-8">
      <div class="w-[380px] sm:w-full flex flex-col">
        <div class="text-sm text-gray-700 leading-5 font-medium">
          {{ $t('application_spaces.edit.cloudResource') }}
        </div>
        <div class="text-sm text-gray-600 leading-5">
          {{ $t('application_spaces.edit.cloudResourceDesc') }}
        </div>
      </div>
      <div class="flex flex-col gap-1.5">
        <p class="text-gray-700 text-sm">
          {{ $t('application_spaces.edit.currentCloudResource') }}
        </p>
        <el-select
          v-model="theCloudResource"
          placeholder="选择"
          size="large"
          class="!w-[512px] sm:!w-full"
          @change="updateApplicationSpaceCloudResource">
          <el-option
            v-for="item in spaceResources"
            :key="item.name"
            :label="item.name"
            :value="item.id"
            :disabled="!item.is_available"
          />
        </el-select>
      </div>
    </div>

    <el-divider />

    <!-- 暂停 Space -->
    <div class="flex xl:flex-col gap-8">
      <div class="w-[380px] sm:w-full flex flex-col">
        <div class="text-sm text-gray-700 leading-5 font-medium">
          {{ $t('application_spaces.stopSpace') }}
        </div>
      </div>
      <div class="flex flex-col gap-1.5">
        <div class="flex flex-col gap-1.5">
          <CsgButton
            @click="stopSpace"
            class="btn btn-secondary-gray btn-sm"
            style="width:fit-content"
            :disabled="!initialized || isSpaceStopped"
            :name="$t('application_spaces.stop')"
          />
        </div>
        <!-- <el-switch
          v-model="isSpaceStopped"
          size="large"
          :before-change="toggleSpaceStatus"
          :active-text="$t('application_spaces.status.running')"
          :inactive-text="$t('application_spaces.status.stopped')"
        /> -->
      </div>
    </div>

    <el-divider />

    <!-- 重启 Space -->
    <div class="flex xl:flex-col gap-[32px]">
      <div class="w-[380px] sm:w-full flex flex-col">
        <div class="text-sm text-gray-700 leading-5 font-medium">
          {{ $t('application_spaces.restartSpace') }}
        </div>
      </div>
      <div class="flex flex-col gap-1.5">
        <CsgButton
          @click="restartSpace"
          class="btn btn-secondary-gray btn-sm"
          style="width:fit-content"
          :disabled="notInitialized"
          :name="$t('application_spaces.restart')"
        />
      </div>
    </div>

    <el-divider />

    <!-- 展示英文名 -->
    <div class="flex xl:flex-col gap-[32px]">
      <div class="w-[380px] sm:w-full flex flex-col">
        <div class="text-sm text-gray-700 leading-5 font-medium">
          {{ $t('application_spaces.name') }}
        </div>
        <div class="text-sm text-gray-600 leading-5">
          {{ $t('application_spaces.nameTips') }}
        </div>
      </div>
      <div class="flex flex-col gap-1.5">
        <p class="text-gray-700 text-sm">
          {{ $t('application_spaces.namespaceName') }}
        </p>
        <div
          class="w-[512px] sm:w-full rounded-md bg-gray-50 px-3.5 py-2.5 border">
          {{ applicationSpacePath }}
        </div>
      </div>
    </div>

    <el-divider />

    <!-- 更新应用空间别名 -->
    <div class="flex xl:flex-col gap-[32px]">
      <div class="w-[380px] sm:w-full flex flex-col">
        <div class="text-sm text-gray-700 leading-5 font-medium">
          {{ $t('application_spaces.nickname') }}
        </div>
        <div class="text-sm text-gray-600 leading-5">
          {{ $t('application_spaces.edit.tips') }}
        </div>
      </div>
      <div class="flex flex-col gap-1.5">
        <el-input
          v-model="theApplicationSpaceNickname"
          clearable
          size="large"
          class="!w-[512px] sm:!w-full" />
        <CsgButton
          @click="updateNickname"
          class="btn btn-secondary-gray btn-sm"
          style="width:fit-content"
          data-test="update-nickname"
          :name="$t('all.update')"
        />
      </div>
    </div>

    <el-divider />

    <!-- 更新应用空间简介 -->
    <div class="flex xl:flex-col gap-[32px]">
      <div class="w-[380px] sm:w-full flex flex-col">
        <div class="text-sm text-gray-700 leading-5 font-medium">
          {{ $t('application_spaces.desc') }}
        </div>
        <div class="text-sm text-gray-600 leading-5">
          {{ $t('application_spaces.edit.tips2') }}
        </div>
      </div>
      <div class="flex flex-col gap-1.5">
        <el-input
          v-model="theApplicationSpaceDesc"
          clearable
          size="large"
          type="textarea"
          class="!w-[512px] sm:!w-full" />
        <CsgButton
          @click="updateApplicationSpaceDesc"
          class="btn btn-secondary-gray btn-sm"
          style="width:fit-content"
          data-test="update-description"
          :name="$t('all.update')"
        />
      </div>
    </div>

    <!-- docker space variables -->
    <el-divider v-if="theSdk === 'docker'"/>
    <div v-if="theSdk === 'docker'">
      <div class="flex xl:flex-col gap-8">
        <div class="w-[380px] sm:w-full flex flex-col">
          <div class="text-sm text-gray-700 leading-5 font-medium">
            {{ $t('application_spaces.edit.spaceVariables') }}
          </div>
          <div class="text-sm text-gray-600 leading-5">
            {{ $t('application_spaces.edit.spaceVariablesDesc') }}
          </div>
        </div>
        <div class="flex flex-col gap-1.5">
          <div v-for="(_, name) in theVariables" :key="name" class="flex flex-col mb-2">
            <label :for="name" class="text-gray-700 text-sm self-start">{{ name }}</label>
            <el-input v-model="theVariables[name]" size="large" class="!w-[400px] sm:!w-full"></el-input>
          </div>
          <CsgButton
            @click="updateVaribles"
            class="btn btn-secondary-gray btn-sm"
            style="width:fit-content"
            data-test="update-varibles"
            :name="$t('all.update')"
          />
        </div>
      </div>
    </div>

    <!-- env -->
    <el-divider/>
    <div>
      <div class="flex xl:flex-col gap-8">
        <div class="w-[380px] sm:w-full flex flex-col">
          <div class="text-sm text-gray-700 leading-5 font-medium">
            {{ $t('application_spaces.env.title') }}
          </div>
          <div class="text-sm font-light text-gray-600">
            {{ $t('application_spaces.env.placeholder2') }}
          </div>
        </div>
        <div class="flex flex-col gap-2 !w-[512px] sm:!w-full">
          <ApplicationSpaceEnvEditor v-model="envJSON" :hideTitle="true" />
          <CsgButton
            @click="updateEnv"
            class="btn btn-secondary-gray btn-sm"
            style="width:fit-content"
            data-test="update-mcp-env"
            :name="$t('all.update')"
          />
        </div>
      </div>
    </div>

    <!-- mcp space env -->
    <el-divider v-if="theSdk === 'mcp_server' && Object.keys(mcpEnv).length > 0"/>
    <div v-if="theSdk === 'mcp_server' && Object.keys(mcpEnv).length > 0">
      <div class="flex xl:flex-col gap-8">
        <div class="w-[380px] sm:w-full flex flex-col">
          <div class="text-sm text-gray-700 leading-[20px] font-medium">
            {{ $t('mcps.deploy.envDesc') }}
          </div>
        </div>
        <div class="flex flex-col gap-[6px]">
          <div v-for="(_, envKey) in mcpEnv" :key="envKey" class="mb-3">
            <label
              :for="envKey"
              class="text-gray-600 text-sm block mb-1"
            >
              {{ envKey }}
            </label>
            <el-input
              v-model="mcpEnv[envKey]"
              size="large"
              class="!w-[400px] sm:!w-full"
            />
          </div>
          <el-button @click="updateEnv" class="w-[100px]" data-test="update-mcp-env">
            {{ $t('all.update') }}
          </el-button>
        </div>
      </div>
    </div>

    <el-divider />

    <!-- 修改可见性 -->
    <div class="flex xl:flex-col gap-[32px]">
      <div class="w-[380px] sm:w-full flex flex-col">
        <div class="text-sm text-gray-700 leading-5 font-medium">
          {{ $t('application_spaces.edit.changeVisibility') }}
        </div>
        <div class="text-sm text-gray-600 leading-5">
          {{ $t('application_spaces.edit.statusText') }}
          <span class="text-black font-semibold"
            >[{{
              isPrivate ? $t('all.private') : $t('all.public')
            }}]</span
          >
          {{ $t('application_spaces.edit.status') }} {{
            isPrivate
              ? $t('application_spaces.edit.privateVis')
              : $t('application_spaces.edit.publicVis')
          }}
        </div>
      </div>
      <div class="flex flex-col gap-1.5">
        <p class="text-gray-700 text-sm">
          {{ $t('application_spaces.edit.visibility') }}
        </p>
        <el-select
          v-model="visibilityName"
          @change="changeVisibility"
          placeholder="Select"
          size="large"
          class="!w-[512px] sm:!w-full">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value" />
        </el-select>
      </div>
    </div>

    <el-divider />

    <!-- cover image feature temporarily disabled
    <div class="flex xl:flex-col gap-[32px]">
      <div class="w-[380px] sm:w-full flex flex-col">
        <div class="text-sm text-gray-700 leading-5 font-medium">
          {{ $t('application_spaces.edit.replaceCoverImage') }}
        </div>
      </div>
      <div class="flex flex-col gap-1.5 w-[400px] sm:w-[98%]">
        <el-upload
          :class="`${hideImageUploadElement ? 'hide' : 'h-auto'}`"
          :limit="1"
          v-model:file-list="images"
          list-type="picture-card"
          accept="image/png, image/jpeg, image/gif, image/svg+xml"
          :data="{ namespace: 'application_space' }"
          action="/internal_api/upload"
          :before-upload="handleBeforeUpload"
          :on-remove="handleRemoveImage"
          :on-success="handleUploadSuccess">
          <div class="flex flex-col items-center">
            <SvgIcon
              name="el_upload"
              width="20"
              height="18" />
            <div class="el-upload__text">
              <div>
                {{ $t('application_spaces.new.coverImageDesc1') }}
              </div>
              <div class="font-light text-xs">
                {{ $t('application_spaces.new.coverImageDesc2') }}
              </div>
            </div>
          </div>
        </el-upload>
        <CsgButton
          @click="updateApplicationSpaceCoverImage"
          class="btn btn-secondary-gray btn-sm w-fit"
          :name="$t('all.update')"
        />
      </div>
    </div>

    <el-divider />
    -->

    <!-- 删除应用空间 -->
    <div class="flex xl:flex-col gap-8">
      <div class="w-[380px] sm:w-full flex flex-col gap-1.5">
        <div class="text-sm text-gray-700 leading-5 font-medium">
          {{ $t('application_spaces.edit.del') }}
        </div>
        <div class="text-sm text-gray-600 leading-5">
          {{ $t('application_spaces.edit.delTips') }}
          <span class="text-black font-medium">{{ $t('application_spaces.edit.canNot') }}</span>
          {{ $t('application_spaces.edit.delTips2') }}
          <span class="text-black font-medium break-words">{{ path }}</span>
          {{ $t('application_spaces.edit.delTips3') }}
        </div>
        <div class="text-sm text-gray-600 leading-5">
          {{ $t('application_spaces.edit.enterPls') }}
          <span class="text-black font-medium break-words">{{ path }}</span>
          {{ $t('application_spaces.edit.sureDel') }}
        </div>
      </div>
      <div class="flex flex-col gap-2">
        <p class="text-gray-700 text-sm">
          {{ $t('application_spaces.namespaceName') }}
        </p>
        <el-input
          v-model="delDesc"
          clearable
          size="large"
          class="!w-[512px] sm:!w-full" />
        <div class="flex">
          <CsgButton
            id="confirmDelete"
            @click="clickDelete"
            class="btn btn-danger btn-sm"
            style="width:fit-content"
            :disabled="delDesc !== applicationSpacePath"
            :name="$t('application_spaces.edit.confirmDel')"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { h, inject } from 'vue'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { useCookies } from 'vue3-cookies'
  import refreshJWT from '../../packs/refreshJWT.js'
  import useFetchApi from '../../packs/useFetchApi'
  import useRepoDetailStore from '../../stores/RepoDetailStore'
  import { mapState, mapWritableState, mapActions } from 'pinia'
  import { useI18n } from 'vue-i18n'
  import ApplicationSpaceEnvEditor from './ApplicationSpaceEnvEditor.vue'

  export default {
    props: {
      path: String,
      applicationSpaceNickname: String,
      applicationSpaceDesc: String,
      default_branch: String,
      appStatus: String,
      cloudResource: String,
      coverImage: String,
      sdk: String,
      variables: Object
    },

    components: { ApplicationSpaceEnvEditor },

    data() {
      return {
        delDesc: '',
        applicationSpacePath: this.path,
        theApplicationSpaceNickname: this.applicationSpaceNickname || '',
        theApplicationSpaceDesc: this.applicationSpaceDesc || '',
        theSdk: this.sdk || '',
        theVariables: this.variables || {},
        theCloudResource: /^\d+$/.test(this.cloudResource)
          ? Number(this.cloudResource)
          : this.cloudResource,
        options: [
          { value: 'Private', label: this.$t('all.private') },
          { value: 'Public', label: this.$t('all.public') }
        ],
        spaceResources: [],
        cookies: useCookies().cookies,
        csghubServer: inject('csghubServer'),
        images: [
          {
            name: 'default',
            url: this.coverImage || '/images/default_cover_image.png'
          }
        ],
        uploadCoverImageUrl: '/images/default_cover_image.png',
        imageUploaded: false,
        envJSON:'',
        t: useI18n()
      }
    },

    computed: {
      ...mapState(useRepoDetailStore, ['isPrivate', 'clusterId']),
      ...mapWritableState(useRepoDetailStore, ['privateVisibility']),
      hideImageUploadElement() {
        return this.imageUploaded || this.images.length !== 0
      },
      visibilityName: {
        get() {
          return !!this.privateVisibility ? 'Private' : 'Public'
        },
        set(newValue) {
          this.privateVisibility = newValue === 'Private'
        }
      },
      isSpaceStopped() {
        return this.appStatus === 'Stopped' ? true : false
      },
      deployFailed() {
        return [
          'BuildingFailed',
          'DeployFailed',
          'RuntimeError'
        ].includes(this.appStatus)
      },
      initialized() {
        return [
          'Building',
          'Deploying',
          'Startup',
          'Running',
          'Stopped',
          'Sleeping',
          'BuildingFailed',
          'DeployFailed',
          'RuntimeError'
        ].includes(this.appStatus)
      },
      notInitialized() {
        return this.appStatus === 'NoAppFile'
      }
    },

    watch: {
      applicationSpaceNickname(newNickname, _) {
        this.theApplicationSpaceNickname = newNickname
      },
      applicationSpaceDesc(newDesc, _) {
        this.theApplicationSpaceDesc = newDesc
      },
      cloudResource(newResource, _) {
        this.theCloudResource = /^\d+$/.test(newResource) ? Number(newResource) : this.cloudResource
      },
      variables(newVariables, _) {
        this.theVariables = newVariables
      }
    },
    emits: ['showSpaceLogs'],
    mounted() {
      this.fetchSpaceResources()
      this.fetchSpaceDetail()
    },
    inject: ['fetchRepoDetail'],
    methods: {
      ...mapActions(useRepoDetailStore, ['updateVisibility']),

      handleBeforeUpload(file) {
        if (file.size / 1024 <= 2000) {
          return true
        } else {
          ElMessage({ message: this.t('all.fileTooLarge'), type: 'warning' })
          return false
        }
      },

      handleRemoveImage() {
        this.uploadCoverImageUrl = ''
        this.imageUploaded = false
      },

      handleUploadSuccess(res) {
        this.uploadCoverImageUrl = res.url
        this.imageUploaded = true
      },

      clickDelete() {
        if (this.delDesc === this.applicationSpacePath) {
          this.deleteApplicationSpace().catch((err) => {
            ElMessage({
              message: err.message,
              type: 'warning'
            })
          })
        }
      },

      async fetchSpaceResources() {
        const { data, error } = await useFetchApi(`/space_resources?cluster_id=${this.clusterId}&deploy_type=0`).json()

        if (!data.value) {
          ElMessage({
            message: error.value.msg || t('application_spaces.new.failedFetchResources'),
            type: 'warning'
          })
        } else {
          this.spaceResources = data.value.data
        }
      },

      async stopSpace() {
        const stopUrl = `/spaces/${this.path}/stop`
        const { response, error } = await useFetchApi(stopUrl).post().json()

        if (response.value.ok) {
          ElMessage({
            message: this.$t('application_spaces.toggleStatusSuccess'),
            type: 'success'
          })
          return true
        } else {
          if (response.value.status === 401) {
            refreshJWT()
          } else {
            ElMessage({
              message: error.value.msg,
              type: 'warning'
            })
          }
        }
      },

      async restartSpace() {
        const restartUrl = `/spaces/${this.path}/run`
        const { response, error } = await useFetchApi(restartUrl).post().json()

        if (response.value.ok) {
          ElMessage({
            message: this.$t('application_spaces.toggleStatusSuccess'),
            type: 'success'
          })
          return true
        } else {
          if (response.value.status === 401) {
            refreshJWT()
          } else {
            ElMessage({
              message: error.value.msg,
              type: 'warning'
            })
          }
        }
      },

      // async toggleSpaceStatus() {
      //   let toggleUrl = ''
      //   if (this.appStatus === 'Stopped') {
      //     toggleUrl = `${this.csghubServer}/api/v1/spaces/${this.path}/run`
      //   } else {
      //     toggleUrl = `${this.csghubServer}/api/v1/spaces/${this.path}/stop`
      //   }
      //   const response = await fetch(toggleUrl, {
      //     method: 'POST',
      //     headers: {
      //       Authorization: `Bearer ${this.cookies.get('user_token')}`
      //     }
      //   })

      //   if (response.ok) {
      //     ElMessage({
      //       message: this.$t('application_spaces.toggleStatusSuccess'),
      //       type: 'success'
      //     })
      //     return true
      //   } else {
      //     response.json().then((data) => {
      //       ElMessage({
      //         message: data.msg,
      //         type: 'warning'
      //       })
      //     })
      //   }
      // },

      async deleteApplicationSpace() {
        const applicationSpaceDeleteEndpoint = `/spaces/${this.path}`
        const { error } = await useFetchApi(applicationSpaceDeleteEndpoint).delete().json()

        if (error.value) {
          ElMessage({ message: error.value.msg, type: 'warning' })
        } else {
          ElMessage({ message: this.$t('all.delSuccess'), type: 'success' })
          setTimeout(() => {
            window.location.href = document.referrer || '/spaces'
          }, 1000)
          return true
        }
      },

      async fetchSpaceDetail () {
        const { data, error } = await useFetchApi(
          `/spaces/${this.path}`
        ).json()
        if (error.value) {
          console.log(error.value.msg)
        } else {
          const body = data.value
          const envJSON = body?.data?.env ?? ''
          if (envJSON) {
            try {
              this.envJSON = envJSON
            } catch (error) {
              console.log(error)
            }
          }
        }
      },

      updateEnv() {
        const payload = { env: this.envJSON }
        this.updateApplicationSpace(payload,this.$t('application_spaces.env.title'))
      },

      changeVisibility(value) {
        ElMessageBox({
          title: this.$t('application_spaces.edit.changeVisibility'),
          message: h('p', null, [
            h('span', null, this.$t('all.changeVis')),
            h(
              'span',
              null,
              value === 'Private'
                ? this.$t('all.private')
                : this.$t('all.public')
            ),
            h(
              'span',
              null,
              value === 'Private'
                ? this.$t('application_spaces.edit.privateInfo')
                : this.$t('application_spaces.edit.publicInfo')
            )
          ]),
          showCancelButton: true,
          confirmButtonText: this.$t('all.confirm'),
          cancelButtonText: this.$t('all.cancel')
        })
          .then(() => {
            this.changeVisibilityCall(value)
          })
          .catch(() => {
            ElMessage({
              type: 'warning',
              message: this.$t('all.changeCancel')
            })
          })
      },

      changeVisibilityCall(value) {
        const isprivateSelected = value === 'Private' ? true : false
        const payload = { private: isprivateSelected }
        this.updateApplicationSpace(payload,this.$t('application_spaces.edit.visibility'))
      },

      updateNickname() {
        if (!!this.theApplicationSpaceNickname.trim()) {
          const payload = { nickname: this.theApplicationSpaceNickname }
          this.updateApplicationSpace(payload,this.$t('application_spaces.nickname'))
        } else {
          ElMessage({
            message: this.$t('application_spaces.edit.needName'),
            type: 'warning'
          })
        }
      },

      updateApplicationSpaceDesc() {
        if (!!this.theApplicationSpaceDesc.trim()) {
          const payload = { description: this.theApplicationSpaceDesc }
          this.updateApplicationSpace(payload,this.$t('application_spaces.desc'))
        } else {
          ElMessage({
            message: this.$t('application_spaces.edit.needDesc'),
            type: 'warning'
          })
        }
      },

      updateApplicationSpaceCloudResource() {
        const payload = { resource_id: this.theCloudResource }
        this.updateApplicationSpace(payload,this.$t('application_spaces.edit.cloudResource'))
      },

      updateApplicationSpaceCoverImage() {
        const payload = { cover_image_url: this.uploadCoverImageUrl }
        this.updateApplicationSpace(payload)
      },

      updateVaribles() {
        const payload = { variables: JSON.stringify(this.theVariables) }
        this.updateApplicationSpace(payload,this.$t('application_spaces.edit.spaceVariables'))
      },

      async updateApplicationSpace(payload,field) {
        const applicationSpaceUpdateEndpoint = `/spaces/${this.path}`
        const options = {
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        }
        const { data, error } = await useFetchApi(
          applicationSpaceUpdateEndpoint,
          options
        ).put().json()
        if (error.value) {
          ElMessage.warning(error.value.msg)
        } else {
          const msg = this.$t('application_spaces.edit.updateSuccess',{field:field})
          ElMessage.success(msg)
          if (payload.hasOwnProperty('private')) {
            this.updateVisibility(payload.private)
          }
          await this.fetchRepoDetail()
        }
      },

      handleMouseOver() {
        if (this.delDesc !== '') {
          document
            .getElementById('confirmDelete')
            .classList.replace('bg-error-600', 'bg-error-700')
        }
      },

      handleMouseLeave() {
        document
          .getElementById('confirmDelete')
          .classList.replace('bg-error-700', 'bg-error-600')
      },

      showErrorLogs() {
        this.$emit('showSpaceLogs')
      }
    }
  }
</script>

<style scoped>
  :deep(.hide .el-upload.el-upload--picture-card) {
    display: none;
  }
</style>
