<template>
  <div class="menuItem min-h-max flex gap-[16px] py-[10px]">
    <div class="pt-[6px]">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
      >
        <path
          d="M7.5 7H7C4.23858 7 2 9.23858 2 12C2 14.7614 4.23858 17 7 17H9C11.7614 17 14 14.7614 14 12M16.5 17H17C19.7614 17 22 14.7614 22 12C22 9.23858 19.7614 7 17 7H15C12.2386 7 10 9.23858 10 12"
          stroke="#3250BD"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </div>
    <div class="max-w-[247px] flex flex-col whitespace-normal">
      <div id="nav_title">StarChain 星链平台</div>
      <div
        id="nav_text"
        class="text-[14px] bg-red text-[#475467] font-light leading-[20px] md:hidden"
      >
        开源开放的多模态LLM应用构建、测试、托管运行和分享平台。
      </div>
    </div>
  </div>
</template>
<style scoped>
.menuItem #nav_title {
  color: #101828;
}
.menuItem #nav_text {
  color: #475467;
}
</style>
