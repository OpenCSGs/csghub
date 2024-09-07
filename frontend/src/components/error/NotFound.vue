<template>
  <div class="h-[calc(100vh-80px)] min-h-[500px] flex items-center justify-center m-auto">
  <div class="flex flex-col items-center" style="position: relative; display: flex; flex-direction: column; justify-content: center; text-align: center; padding: 40px;">
    <div class="flex flex-col gap-[8px] items-center text-center mt-[24px] px-[16px]">
      <h1 id="error-code" class="error-code" style="position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%); z-index: -1; font-size: 400px; color: #F2F4F7; margin: 0; line-height: 1; font-weight: 600;">404</h1>
      <h1 id="error-header" class="error-header" style="font-size: 60px; font-weight: 500; margin-top: -60px;margin-bottom: 24px; color: #101828;">{{$t('errors_page.not_found.title')}}</h1>
      <p id="error-description" class="error-description" style="font-size: 20px; margin-bottom: 48px; color: #475467;"> {{$t('errors_page.not_found.desc')}} </p>
      <div id="error-button" class="error-button" style="display: flex; gap: 20px;">
        <a href="javascript:history.back();" class="btn btn-secondary" style="background-color: #fff; padding: 16px 24px; font-weight: 500; color: #344054; border: 1px solid #D0D5DD;" onmouseover="this.style.backgroundColor='#F9FAFB'; this.style.color='#344054';" onmouseout="this.style.backgroundColor='#fff'; this.style.color='#344054';"> 
          {{ $t('errors_page.not_found.back')}}
        </a>
        <a href="/" class="btn btn-primary" style="background-color: #3250BD; font-weight: 500; color: #fff; padding: 16px 24px;" onmouseover="this.style.backgroundColor='#223B99'; this.style.color='white';" onmouseout="this.style.backgroundColor='#3250BD'; this.style.color='#fff';">
          {{ $t('errors_page.not_found.home') }}
        </a>
      </div>
    </div>
  </div>
</div>
</template>

<script setup>

</script>
