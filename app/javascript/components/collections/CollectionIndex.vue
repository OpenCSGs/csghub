<template>
  <div class="flex flex-col gap-[24px] w-full max-w-[1280px] m-auto min-h-[calc(100vh-153px)] md:min-h-0">
    <!-- header -->
    <div class="flex w-full justify-between mb-[36px]">
      <div class="flex flex-col">
        <div class="flex gap-2 text-[20px] leading-[30px]">
          <SvgIcon
            name="collection_icon"
            width="18"
            height="18"
          />
          <span> 合集 </span>
        </div>
        <div class="text-[16px] leading-[24px] text-[#667085]">探索社区中的精选热门合集</div>
      </div>
      <div>搜索条搜索条搜索条</div>
    </div>
    <div class="flex gap-1 max-w-[max-content] px-2 rounded-[6px] border border-[#D5D9EB] text-[14px] leading-[20px] bg-[#D5D9EB] text-[#363F72]">
      <SvgIcon name="star" />
      本周热门合集
    </div>
  </div>
</template>

<script setup></script>
