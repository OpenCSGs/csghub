<template>
  <div class="bg-white">
    <div class="m-auto w-[480px] md:w-full md:px-[20px]">
      <div class="py-[96px] text-center">
        <div class="text-[#223B99] text-[16px] font-[500] leading-[24px]">
          {{ $t('dailyPaper.paper') }}
        </div>
        <div class="mt-[12px] text-[48px] font-[500] leading-[60px] tracking-[-0.96px]">
          {{ $t('dailyPaper.goodpaper') }}
        </div>
        <div class="mt-[24px] text-[20px] font-[300] leading-[30px]">
          {{ $t('dailyPaper.recommendUser') }}
        </div>
        <el-form
          ref="dataForm"
          :model="dataForm"
          :rules="rules"
          label-position="top"
          class="mt-[48px] text-left">
          <el-form-item :label="$t('dailyPaper.title')" prop="title">
            <el-input v-model="dataForm.title" :placeholder="$t('dailyPaper.paperTitle')"></el-input>
          </el-form-item>
          <el-form-item :label="$t('dailyPaper.img')" prop="cover_image">
            <el-upload
              :class="`w-full ${this.showUpload ? 'h-[229px]' : 'hide'}`"
              :limit="1"
              v-model:file-list="dataForm.cover_image"
              drag
              list-type="picture-card"
              :headers="{ 'X-CSRF-TOKEN': csrf_token }"
              accept="image/png, image/jpeg, image/gif, image/svg+xml"
              :data="{namespace: 'daily_paper'}"
              action="/internal_api/upload"
              :on-progress="handleUploadProgress"
              :on-remove="handleRemoveImage"
              :on-success="handleUploadSuccess"
            >
              <div>
                <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                <div class="el-upload__text">
                  <p>
                    <span class="text-[#223B99] font-[500]">
                      {{ $t('dailyPaper.click') }}
                    </span>
                    {{ $t('dailyPaper.drug') }}
                  </p>
                  <p>{{ $t('dailyPaper.type') }}</p>
                </div>
              </div>
            </el-upload>
          </el-form-item>
          <el-form-item :label="$t('dailyPaper.link')" prop="article_link">
            <el-input v-model="dataForm.paper_link" :placeholder="$t('dailyPaper.paperLink')"></el-input>
          </el-form-item>
          <el-form-item :label="$t('dailyPaper.publishTime')" prop="published_at">
            <el-date-picker
              v-model="dataForm.published_at"
              type="date"
              style="width: 100%;"
              :placeholder="$t('dailyPaper.date')">
            </el-date-picker>
          </el-form-item>
          <el-form-item :label="$t('dailyPaper.pdfLink')" prop="pdf_link">
            <el-input v-model="dataForm.pdf_link" :placeholder="$t('dailyPaper.recommendPdfLink')"></el-input>
          </el-form-item>
          <el-form-item :label="$t('dailyPaper.recommendation')" prop="recommendation">
            <el-input :rows="5" type="textarea" v-model="dataForm.recommendation"></el-input>
          </el-form-item>

          <el-form-item :label="$t('dailyPaper.paperRemark')" prop="description">
            <el-input :rows="5" type="textarea" v-model="dataForm.description"></el-input>
          </el-form-item>

          <el-form-item :label="$t('dailyPaper.videoLin')" prop="video_link">
            <el-input v-model="dataForm.video_link"></el-input>
          </el-form-item>
          <el-form-item :label="$t('dailyPaper.paperModel')" prop="model_links">
            <el-input :rows="5" type="textarea" v-model="dataForm.model_links" :placeholder="$t('dailyPaper.linkDesc')"></el-input>
          </el-form-item>
          <el-form-item :label="$t('dailyPaper.paperDataset')" prop="dataset_links">
            <el-input :rows="5" type="textarea" v-model="dataForm.dataset_links" :placeholder="$t('dailyPaper.linkDesc')"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button class="w-full !text-center !h-[48px] !text-[16px] !text-white !bg-[#3250BD] !rounded-[8px] !border-[1px] !border-[#3250BD]" @click="handleSubmit">{{ $t('dailyPaper.submit') }}</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
  import csrfFetch from "../../packs/csrfFetch.js"

  export default {
    data() {
      return {
        csrf_token: document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
        showUpload: true,
        dataForm: {
        },
        rules: {
          title: [{ required: true, message: this.$t('dailyPaper.errorTitle'), trigger: 'blur' }],
          cover_image: [{ required: true, message: this.$t('dailyPaper.errorImg'), trigger: 'blur' }],
          paper_link: [
            { required: true, message: this.$t('dailyPaper.errorpaperLink'), trigger: 'blur' },
            { type: 'url', message: this.$t('dailyPaper.errorpaperLink-'), trigger: 'blur'}
          ],
          published_at: [{ required: true, message: this.$t('dailyPaper.errorPublish'), trigger: 'blur' }],
          pdf_link: [
            { required: true, message: this.$t('dailyPaper.errorPdf'), trigger: 'blur' },
            { type: 'url', message: this.$t('dailyPaper.errorPdf-'), trigger: 'blur'}
          ],
          recommendation: [{ required: true, message: this.$t('dailyPaper.errorRecommendation'), trigger: 'blur' }],
          description: [{ required: true, message: this.$t('dailyPaper.errorRemark'), trigger: 'blur' }],
        }
      }
    },
    methods: {
      handleUploadSuccess(res) {
        this.showUpload = false
        this.dataForm.cover_url = res.url
      },
      handleRemoveImage() {
        this.showUpload = true
        this.dataForm.cover_url = ""
      },
      handleUploadProgress() {
        this.showUpload = false
      },
      handleSubmit() {
        this.$refs['dataForm'].validate(async (valid) => {
          if (valid) {
            await this.createDailyPaper()
          } else {
            return false
          }
        })
      },
      async createDailyPaper() {
        const params = Object.assign({}, this.dataForm)
        delete params.cover_image
        if (params.model_links) {
          params.model_links = params.model_links.split("\n")
        }
        if (params.dataset_links) {
          params.dataset_links = params.dataset_links.split("\n")
        }
        const options = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(params)
        }
        const uploadEndpoint = '/internal_api/daily_papers'
        const response = await csrfFetch(uploadEndpoint, options)
        if (response.ok) {
          this.$message({
            message: this.$t('dailyPaper.createSuccess'),
            type: 'success'
          });
          window.location.href = "/daily_papers"
        } else {
          response.json()
            .then(res => {
              this.$message({
                message: this.$t('dailyPaper.createFail') + `: ${res.message}`,
                type: 'error'
              });
            })
        }
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
  :deep(.el-input__wrapper) {
    border-radius: 8px;
  }
  :deep(.el-textarea__inner) {
    border-radius: 8px;
  }
  :deep(.el-upload--picture-card) {
    border: 0px;
  }
  :deep(.hide .el-upload.el-upload--picture-card){
    display: none;
  }
</style>