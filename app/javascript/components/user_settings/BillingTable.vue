<template>
  <div class="w-full mb-[37px]">
    <el-table
      class="billing-table"
      header-row-class-name="billing-table-header-row"
      header-cell-class-name="billing-table-header-cell"
      row-class-name="billing-table-row"
      cell-class-name="billing-table-row-cell"
      :data="billings"
      stripe
      v-loading="loading"
      style="width: 100%"
    >
      <!-- instance ID -->
      <el-table-column
        :label="$t('billing.instanceID')"
        label-class-name="indent-3 text-[12px] font-[400] leading-[18px] text-[#475467]"
      >
        <template #default="scope">
          <div class="flex gap-[12px] items-center pl-3">
            <div class="flex flex-col">
              <div
                class="text-[14px] font-[300] leading-[20px] text-[#475467]"
                v-if="!!scope.row.instance_name"
              >
                #{{ scope.row.instance_name }}
              </div>
            </div>
          </div>
        </template>
      </el-table-column>

      <!-- creation time -->
      <el-table-column
        :label="$t('billing.createTime')"
        label-class-name="text-[12px] font-[400] leading-[18px] text-[#475467]"
      >
        <template #default="scope">
          <div class="text-[14px] font-[400] leading-[20px] text-[#475467]">
            {{ formatDate(scope.row.created_at) }}
          </div>
        </template>
      </el-table-column>

      <!-- usage duration -->
      <el-table-column
        :label="$t('billing.usageTime')"
        label-class-name="text-[12px] font-[400] leading-[18px] text-[#475467]"
      >
        <template #default="scope">
          <div class="text-[14px] font-[400] leading-[20px] text-[#475467]">
            {{ scope.row.consumption }}
          </div>
        </template>
      </el-table-column>

      <!-- cost -->
      <el-table-column
        :label="$t('billing.cost')"
        label-class-name="text-[12px] font-[400] leading-[18px] text-[#475467]"
      >
        <template #default="scope">
          <div class="text-[14px] font-[400] leading-[20px] text-[#475467]">
            {{ scope.row.value }}
          </div>
        </template>
      </el-table-column>

      <!-- status -->
      <el-table-column
        :label="$t('billing.status')"
        label-class-name="text-[12px] font-[400] leading-[18px] text-[#475467]"
      >
        <template #default="scope">
          <div class="text-[14px] font-[400] leading-[20px] text-[#475467]">
            {{ scope.row.status }}
          </div>
        </template>
      </el-table-column>

      <!-- admin show detail -->
      <el-table-column
        v-if="admin"
        width="100"
        align="center"
        fixed="right"
      >
        <template #default>
          <a :href="detailLink" class="flex gap-4 justify-end pr-4">{{ $t('billing.details') }}</a>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
  import { formatDate } from '../../packs/datetimeUtils'
  import { computed } from 'vue'

  const props = defineProps({
    billings: Array,
    type:String
  })

  const detailLink = computed(() => {
    switch (props.type) {
      case 'space':
        return `/spaces/${props.billings.repo_path}`
      case 'inference':
        return `/endpoints/${props.billings.repo_path}`
      default:
        return ''
    }
  })
</script>