<template>
  <div class="videoDialog">
      <el-dialog v-model="dialogVisible"
                       @close="closeDialog"
                       :width="dialogWidth"
                       :style="{ borderRadius: '5px' }">
              <video ref="videoPlayer" style="width: 100%;" controls autoplay muted>
                <source :src="theVideoSrc" type="video/mp4" />
              </video>
         </el-dialog>
    </div>
</template>
  
<script>
export default {
  props: {
    videoSrc: String
  },
  data() {
    return {
      theVideoSrc:this.videoSrc,
      dialogVisible: false,
    };
  },
  
  components: {},
  computed: {
    dialogWidth() {
      if (window.innerWidth < 768) {
        return '90%';
      } else {
        return '50%';
      }
    }
  },
    mounted() {},
    methods: {
      openDialog() {
        this.dialogVisible = true;
      },
      closeDialog() {
        this.$refs.videoPlayer.pause();
        this.dialogVisible = false;
      }
    }
};
</script>
<style>
  .videoDialog {
    .el-dialog__header {
      display: none;
    }
    .el-dialog__body {
      padding: 10px !important;
    }
  }
</style>
  