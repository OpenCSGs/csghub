<template>
  <div class="bg-white">
    <div class="m-auto w-[480px] md:w-full md:px-[20px]">
      <div class="py-[96px] text-center">
        <div class="text-[#223B99] text-[16px] font-[500] leading-[24px]">
          社区文章
        </div>
        <div class="mt-[12px] text-[48px] font-[500] leading-[60px] tracking-[-0.96px]">
          贡献优质社区文章
        </div>
        <div class="mt-[24px] text-[20px] font-[300] leading-[30px]">
          将您发现的优质文章推荐给 OpenCSG 社区用户
        </div>
        <el-form
          ref="dataForm"
          :model="dataForm"
          :rules="rules"
          label-position="top"
          class="mt-[48px] text-left">
          <el-form-item label="标题" prop="title">
            <el-input v-model="dataForm.title" placeholder="推荐文章标题"></el-input>
          </el-form-item>
          <el-form-item label="文章图片" prop="cover_image">
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
                      点击上传，
                    </span>
                    或将文件拖到此处
                  </p>
                  <p>SVG, PNG, JPG 或 GIF</p>
                </div>
              </div>
            </el-upload>
          </el-form-item>
          <el-form-item label="文章链接" prop="article_link">
            <el-input v-model="dataForm.article_link" placeholder="推荐文章链接"></el-input>
          </el-form-item>
          <el-form-item label="原文发布时间" prop="published_at">
            <el-date-picker
              v-model="dataForm.published_at"
              type="date"
              style="width: 100%;"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="文章 PDF 链接" prop="pdf_link">
            <el-input v-model="dataForm.pdf_link" placeholder="推荐文章 PDF 链接"></el-input>
          </el-form-item>
          <el-form-item label="推荐语" prop="recommendation">
            <el-input :rows="5" type="textarea" v-model="dataForm.recommendation"></el-input>
          </el-form-item>

          <el-form-item label="文章摘要" prop="description">
            <el-input :rows="5" type="textarea" v-model="dataForm.description"></el-input>
          </el-form-item>

          <el-form-item label="文章关联视频链接" prop="video_link">
            <el-input v-model="dataForm.video_link"></el-input>
          </el-form-item>
          <el-form-item label="文章关联的模型 选填" prop="model_links">
            <el-input :rows="5" type="textarea" v-model="dataForm.model_links" placeholder="输入关联模型的链接，通过换行区分不同模型链接"></el-input>
          </el-form-item>
          <el-form-item label="文章关联的数据集 选填" prop="dataset_links">
            <el-input :rows="5" type="textarea" v-model="dataForm.dataset_links" placeholder="输入关联数据集的链接，通过换行区分不同数据集链接"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button class="w-full !text-center !h-[48px] !text-[16px] !text-white !bg-[#3250BD] !rounded-[8px] !border-[1px] !border-[#3250BD]" @click="handleSubmit">发布文章推荐</el-button>
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
          title: [{ required: true, message: '请输入标题名称', trigger: 'blur' }],
          cover_image: [{ required: true, message: '请上传文章图片', trigger: 'blur' }],
          article_link: [
            { required: true, message: '请输入文章链接', trigger: 'blur' },
            { type: 'url', message: '请输入正确的文章链接', trigger: 'blur'}
          ],
          published_at: [{ required: true, message: '请选择文章发布时间', trigger: 'blur' }],
          pdf_link: [
            { required: true, message: '请输入文章 PDF 链接', trigger: 'blur' },
            { type: 'url', message: '请输入正确的文章 PDF 链接', trigger: 'blur'}
          ],
          recommendation: [{ required: true, message: '请输入文章推荐语', trigger: 'blur' }],
          description: [{ required: true, message: '请输入文章摘要', trigger: 'blur' }],
          video_link: [{ required: true, message: '请输入文章关联视频链接', trigger: 'blur' }],
        }
      }
    },
    methods: {
      handleUploadSuccess(res) {
        this.showUpload = false
        this.dataForm.cover_url = res.url
      },
      handleRemoveImage() {
        console.log("handleRemoveImage");
        this.showUpload = true
        this.dataForm.cover_url = ""
      },
      handleUploadProgress() {
        this.showUpload = false
      },
      handleSubmit() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            const params = Object.assign({}, this.dataForm)
            delete params.cover_image
            if (params.model_links) {
              params.model_links = params.model_links.split("\n")
            }
            if (params.dataset_links) {
              params.dataset_links = params.dataset_links.split("\n")
            }
            csrfFetch('/daily_papers', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(params)
            }).then(res => res.json())
              .then(res => {
              console.log("res", res);
              if (res.success) {
                this.$message({
                  message: '创建成功',
                  type: 'success'
                });
                window.location.href = "/daily_papers"
              } else {
                this.$message({
                  message: `创建失败: ${res.message}`,
                  type: 'error'
                });
              }
            })
          } else {
            return false
          }
        })
      },
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