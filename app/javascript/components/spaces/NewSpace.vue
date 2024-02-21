<template>
  <div class="w-[640px] m-auto flex flex-col items-center md:w-full md:p-5">
    <div>
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g opacity="0.12">
          <path
              d="M3 9C3 7.13623 3 6.20435 3.30448 5.46927C3.71046 4.48915 4.48915 3.71046 5.46927 3.30448C6.20435 3 7.13623 3 9 3V3C10.8638 3 11.7956 3 12.5307 3.30448C13.5108 3.71046 14.2895 4.48915 14.6955 5.46927C15 6.20435 15 7.13623 15 9V9C15 10.8638 15 11.7956 14.6955 12.5307C14.2895 13.5108 13.5108 14.2895 12.5307 14.6955C11.7956 15 10.8638 15 9 15V15C7.13623 15 6.20435 15 5.46927 14.6955C4.48915 14.2895 3.71046 13.5108 3.30448 12.5307C3 11.7956 3 10.8638 3 9V9Z"
              fill="#7B58CF"/>
          <path
              d="M3 27C3 25.1362 3 24.2044 3.30448 23.4693C3.71046 22.4892 4.48915 21.7105 5.46927 21.3045C6.20435 21 7.13623 21 9 21V21C10.8638 21 11.7956 21 12.5307 21.3045C13.5108 21.7105 14.2895 22.4892 14.6955 23.4693C15 24.2044 15 25.1362 15 27V27C15 28.8638 15 29.7956 14.6955 30.5307C14.2895 31.5108 13.5108 32.2895 12.5307 32.6955C11.7956 33 10.8638 33 9 33V33C7.13623 33 6.20435 33 5.46927 32.6955C4.48915 32.2895 3.71046 31.5108 3.30448 30.5307C3 29.7956 3 28.8638 3 27V27Z"
              fill="#7B58CF"/>
          <path
              d="M21 27C21 25.1362 21 24.2044 21.3045 23.4693C21.7105 22.4892 22.4892 21.7105 23.4693 21.3045C24.2044 21 25.1362 21 27 21V21C28.8638 21 29.7956 21 30.5307 21.3045C31.5108 21.7105 32.2895 22.4892 32.6955 23.4693C33 24.2044 33 25.1362 33 27V27C33 28.8638 33 29.7956 32.6955 30.5307C32.2895 31.5108 31.5108 32.2895 30.5307 32.6955C29.7956 33 28.8638 33 27 33V33C25.1362 33 24.2044 33 23.4693 32.6955C22.4892 32.2895 21.7105 31.5108 21.3045 30.5307C21 29.7956 21 28.8638 21 27V27Z"
              fill="#7B58CF"/>
        </g>
        <path
            d="M3 9C3 7.13623 3 6.20435 3.30448 5.46927C3.71046 4.48915 4.48915 3.71046 5.46927 3.30448C6.20435 3 7.13623 3 9 3V3C10.8638 3 11.7956 3 12.5307 3.30448C13.5108 3.71046 14.2895 4.48915 14.6955 5.46927C15 6.20435 15 7.13623 15 9V9C15 10.8638 15 11.7956 14.6955 12.5307C14.2895 13.5108 13.5108 14.2895 12.5307 14.6955C11.7956 15 10.8638 15 9 15V15C7.13623 15 6.20435 15 5.46927 14.6955C4.48915 14.2895 3.71046 13.5108 3.30448 12.5307C3 11.7956 3 10.8638 3 9V9Z"
            stroke="#7B58CF" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
        <path
            d="M21 9C21 7.13623 21 6.20435 21.3045 5.46927C21.7105 4.48915 22.4892 3.71046 23.4693 3.30448C24.2044 3 25.1362 3 27 3V3C28.8638 3 29.7956 3 30.5307 3.30448C31.5108 3.71046 32.2895 4.48915 32.6955 5.46927C33 6.20435 33 7.13623 33 9V9C33 10.8638 33 11.7956 32.6955 12.5307C32.2895 13.5108 31.5108 14.2895 30.5307 14.6955C29.7956 15 28.8638 15 27 15V15C25.1362 15 24.2044 15 23.4693 14.6955C22.4892 14.2895 21.7105 13.5108 21.3045 12.5307C21 11.7956 21 10.8638 21 9V9Z"
            stroke="#7B58CF" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
        <path
            d="M3 27C3 25.1362 3 24.2044 3.30448 23.4693C3.71046 22.4892 4.48915 21.7105 5.46927 21.3045C6.20435 21 7.13623 21 9 21V21C10.8638 21 11.7956 21 12.5307 21.3045C13.5108 21.7105 14.2895 22.4892 14.6955 23.4693C15 24.2044 15 25.1362 15 27V27C15 28.8638 15 29.7956 14.6955 30.5307C14.2895 31.5108 13.5108 32.2895 12.5307 32.6955C11.7956 33 10.8638 33 9 33V33C7.13623 33 6.20435 33 5.46927 32.6955C4.48915 32.2895 3.71046 31.5108 3.30448 30.5307C3 29.7956 3 28.8638 3 27V27Z"
            stroke="#7B58CF" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
        <path
            d="M21 27C21 25.1362 21 24.2044 21.3045 23.4693C21.7105 22.4892 22.4892 21.7105 23.4693 21.3045C24.2044 21 25.1362 21 27 21V21C28.8638 21 29.7956 21 30.5307 21.3045C31.5108 21.7105 32.2895 22.4892 32.6955 23.4693C33 24.2044 33 25.1362 33 27V27C33 28.8638 33 29.7956 32.6955 30.5307C32.2895 31.5108 31.5108 32.2895 30.5307 32.6955C29.7956 33 28.8638 33 27 33V33C25.1362 33 24.2044 33 23.4693 32.6955C22.4892 32.2895 21.7105 31.5108 21.3045 30.5307C21 29.7956 21 28.8638 21 27V27Z"
            stroke="#7B58CF" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>
    <h3 class="text-[#303133] text-xl font-semibold mt-6 mb-3">新建应用空间</h3>
    <p class="text-[#606266] text-base font-medium md:text-center">应用空间是托管机器学习演示应用代码的 Git 仓库</p>
    <p class="text-[#606266] text-base font-medium md:text-center">你可以使用不同的 SDK 构建应用空间</p>
    <div class="mt-9">
      <!-- 模型名称选择 -->
      <div class="w-full flex sm:flex-col gap-2 mb-9 md:gap-9">
        <div>
          <p class="text-[#303133] text-sm mb-2">所有者</p>
          <el-select v-model="owner" placeholder="选择" size="large">
            <el-option
                v-for="item in namespaces"
                :key="item[0]"
                :label="item[1]"
                :value="item[0]"
            />
          </el-select>
        </div>
        <div class="md:hidden">
          <p class="h-8"></p>
          <p class="text-[#909399] text-xl font-light">/</p>
        </div>
        <div class="flex-1">
          <p class="text-[#303133] text-sm mb-2">空间英文名称</p>
          <el-input v-model="spaceName" placeholder="2-70个字母数字_.-的字符串，_.-不能并列出现" input-style="width: 100%"/>
        </div>
      </div>

      <div class="w-full flex sm:flex-col gap-2 mb-9 md:gap-9">
        <div class="flex-1">
          <p class="text-[#303133] text-sm mb-2">中文名称</p>
          <el-input v-model="spaceNickName" placeholder="请输入别名"/>
        </div>
        <div>
          <p class="text-[#303133] text-sm mb-2">License</p>
          <el-select v-model="license" placeholder="选择" size="large">
            <el-option
                v-for="item in licenses"
                :key="item[0]"
                :label="item[1]"
                :value="item[0]"
            />
          </el-select>
        </div>
      </div>

      <div class="w-full flex sm:flex-col mb-9">
        <div class="flex-1">
          <p class="text-[#303133] text-sm mb-2">应用空间介绍</p>
          <el-input v-model="spaceDesc"
                    :rows="6"
                    type="textarea"
                    placeholder="请输入简介"/>
        </div>
      </div>

      <div class="w-full flex sm:flex-col mb-9">
        <div class="flex-1">
          <p class="text-[#303133] text-sm mb-2">封面图片</p>
          <el-upload
              ref="uploadRef"
              class="upload-demo"
              drag
              multiple
              :headers="{ 'X-CSRF-TOKEN': csrf_token }"
              :data="{ owner_id: owner.split('_')[0], owner_type: owner.split('_')[1], name: spaceName, nickname: spaceNickName, license: license, desc: spaceDesc, sdk: SDK, cloud_resource: spaceResource, visibility: visibility}"
              :auto-upload="false"
              :action="`/internal_api/spaces`"
              :limit="1"
              @change="handleFileChange"
              :on-success="handleSuccess"
              :on-error="handleError"
              :before-upload="handleBeforeUpload"
              accept="image/jpeg,image/png"
          >
            <el-icon>
              <svg width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M6.66663 12.3333L9.99996 9M9.99996 9L13.3333 12.3333M9.99996 9V16.5M16.6666 12.9524C17.6845 12.1117 18.3333 10.8399 18.3333 9.41667C18.3333 6.88536 16.2813 4.83333 13.75 4.83333C13.5679 4.83333 13.3975 4.73833 13.3051 4.58145C12.2183 2.73736 10.212 1.5 7.91663 1.5C4.46485 1.5 1.66663 4.29822 1.66663 7.75C1.66663 9.47175 2.36283 11.0309 3.48908 12.1613"
                    stroke="#475467" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </el-icon>
            <div class="el-upload__text py-[16px] px-[24px]">
              <div><em>点击上传</em>，或将文件拖到此处</div>
              <div class="font-light text-[12px]">支持 PNG, JPG 格式，高宽比5:2</div>
            </div>
          </el-upload>
        </div>
      </div>

      <hr class="mb-9"/>

      <div class="mb-9 text-sm w-full">
        <p class="mb-2 text-[#303133] font-medium">选择应用空间SDK</p>
        <p class="text-[#475467] mt-2 font-light">你可以Gradio作为你的空间。后续将开放 Streamlit、 Static、 Docker 等来托管应用。</p>
        <div class="flex gap-[24px] mt-9">
          <div class="flex items-center justify-center flex-col border-[2px] rounded-[8px] p-[36px] cursor-pointer"
               :class="SDK === 'Gradio' ? 'border-[#3250BD] text-[#344054]' : 'text-[#D0D5DD]'">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.0344 2.97314L20.9997 7.89004V10.7548L12.0344 5.8379V2.97314Z" fill="#FF7C00"
                    fill-opacity="0.75"/>
              <path d="M20.9962 7.88867L11.998 12.8241V15.7073L20.9962 10.7719V7.88867Z" fill="#FF7C00"/>
              <path d="M3 7.88867L11.999 12.8241V15.7073L3 10.7719V7.88867Z" fill="#FF7C00" fill-opacity="0.75"/>
              <path d="M12.0347 2.95508L3.00195 7.89042V10.7736L12.0347 5.8383V2.95508Z" fill="#FF7C00"/>
              <path d="M12.0344 7.94482L20.9997 12.8617V15.7264L12.0344 10.8096V7.94482Z" fill="#FF7C00"
                    fill-opacity="0.75"/>
              <path d="M20.9967 12.8618L11.9985 17.7972V20.6804L20.9967 15.7451V12.8618Z" fill="#FF7C00"/>
              <path d="M3 12.8618L11.999 17.7972V20.6804L3 15.7451V12.8618Z" fill="#FF7C00" fill-opacity="0.75"/>
              <path d="M12.0347 7.92578L3.00195 12.8611V15.7443L12.0347 10.809V7.92578Z" fill="#FF7C00"/>
            </svg>
            <p class="font-semibold text-[16px]">Gradio</p>
          </div>
          <div class="flex items-center justify-center flex-col border-[2px] rounded-[8px] p-[36px] cursor-pointer"
               :class="SDK === 'Streamlit' ? 'border-[#3250BD] text-[#344054]': 'text-[#D0D5DD]'">
            <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clip-path="url(#clip0_6793_265571)">
                <path
                    d="M12.5185 13.5188L8.32512 11.3022L1.04602 7.45502C1.03933 7.4484 1.02609 7.4484 1.01939 7.4484C0.753638 7.3221 0.481186 7.58793 0.580854 7.85369L4.28985 17.3135L4.29049 17.3155C4.29447 17.3248 4.29782 17.3341 4.30181 17.3434C4.45402 17.6962 4.7862 17.9142 5.14771 17.9999C5.17825 18.0066 5.2001 18.0125 5.23677 18.0199C5.27337 18.028 5.32448 18.0391 5.36834 18.0424C5.37551 18.0431 5.38221 18.0431 5.38954 18.0437H5.39489C5.40015 18.0444 5.40549 18.0444 5.41083 18.0451H5.41809C5.42279 18.0457 5.42806 18.0457 5.43276 18.0457H5.44137C5.44671 18.0464 5.45198 18.0464 5.45732 18.0464C10.1546 18.5586 14.8936 18.5586 19.5909 18.0464C19.6474 18.0464 19.7026 18.0437 19.7557 18.0385L19.8062 18.0325C19.8082 18.0318 19.8108 18.0318 19.8128 18.0311C19.8242 18.0298 19.8354 18.0278 19.8467 18.0258C19.8633 18.0238 19.88 18.0205 19.8965 18.0172C19.9298 18.0098 19.9449 18.0046 19.99 17.989C20.035 17.9736 20.1099 17.9464 20.1567 17.9239C20.2036 17.9013 20.2361 17.8796 20.2753 17.8551C20.3237 17.8247 20.3709 17.7923 20.4167 17.7581C20.4369 17.7426 20.4507 17.7328 20.4653 17.7188L20.4573 17.7142L12.5185 13.5188Z"
                    fill="#D0D5DD"/>
                <path
                    d="M24.003 7.45495H23.9964L16.7146 11.3021L20.7625 17.3308L24.4621 7.85362V7.84031C24.5552 7.56124 24.2695 7.3088 24.003 7.45495Z"
                    fill="#D0D5DD"/>
                <path
                    d="M12.9064 5.62574C12.7203 5.35392 12.315 5.35392 12.1356 5.62574L8.32495 11.3022L12.5183 13.5188L20.4652 17.7187C20.5151 17.6698 20.5551 17.6222 20.5974 17.5719C20.6593 17.4965 20.7144 17.4158 20.7622 17.3307L16.7143 11.3022L12.9064 5.62574Z"
                    fill="#D0D5DD"/>
              </g>
              <defs>
                <clipPath id="clip0_6793_265571">
                  <rect width="24" height="24" fill="white" transform="translate(0.5)"/>
                </clipPath>
              </defs>
            </svg>
            <p class="font-semibold text-[16px]">Streamlit</p>
          </div>
          <div class="flex items-center justify-center flex-col border-[2px] rounded-[8px] p-[36px] cursor-pointer"
               :class="SDK === 'Docker' ? 'border-[#3250BD] text-[#344054]': 'text-[#D0D5DD]'">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                  d="M4.3652 10.6875H2.25161C2.15149 10.6875 2.07363 10.6096 2.0625 10.4984V8.60709C2.0625 8.49583 2.15149 8.41797 2.25161 8.41797H4.3652C4.47644 8.41797 4.5543 8.50697 4.5543 8.60709V10.4984C4.5543 10.6096 4.4653 10.6875 4.3652 10.6875ZM7.27971 10.6875H5.16613C5.06601 10.6875 4.98815 10.6096 4.97702 10.4984V8.60709C4.97702 8.49583 5.06601 8.41797 5.16613 8.41797H7.27971C7.39095 8.41797 7.46883 8.50697 7.46883 8.60709V10.4984C7.46883 10.6096 7.37983 10.6875 7.27971 10.6875ZM10.2499 10.6875H8.13627C8.02503 10.6875 7.94717 10.6096 7.94717 10.4984V8.60709C7.94717 8.49583 8.03616 8.41797 8.13627 8.41797H10.2499C10.3611 8.41797 10.439 8.50697 10.439 8.60709V10.4984C10.439 10.6096 10.35 10.6875 10.2499 10.6875ZM13.1755 10.6875H11.0619C10.9618 10.6875 10.8728 10.6096 10.8728 10.4984V8.60709C10.8728 8.49583 10.9618 8.41797 11.0619 8.41797H13.1755C13.2867 8.41797 13.3646 8.50697 13.3646 8.60709V10.4984C13.3646 10.6096 13.2756 10.6875 13.1755 10.6875ZM7.27971 7.98408H5.16613C5.06601 7.98408 4.98815 7.89508 4.97702 7.79496V5.90367C4.97702 5.79243 5.06601 5.71455 5.16613 5.71455H7.27971C7.39095 5.71455 7.46883 5.80354 7.46883 5.90367V7.79496C7.46883 7.89508 7.37983 7.98408 7.27971 7.98408ZM10.2499 7.98408H8.13627C8.02503 7.98408 7.94717 7.89508 7.94717 7.79496V5.90367C7.94717 5.79243 8.03616 5.71455 8.13627 5.71455H10.2499C10.3611 5.71455 10.439 5.80354 10.439 5.90367V7.79496C10.439 7.89508 10.35 7.98408 10.2499 7.98408ZM13.1755 7.98408H11.0619C10.9618 7.98408 10.8728 7.89508 10.8728 7.79496V5.90367C10.8728 5.79242 10.9618 5.71455 11.0619 5.71455H13.1755C13.2756 5.71455 13.3646 5.80354 13.3646 5.90367V7.79496C13.3646 7.89508 13.2756 7.98408 13.1755 7.98408ZM13.1755 5.26953H11.0619C10.9618 5.26953 10.8728 5.18054 10.8728 5.08041V3.18913C10.8728 3.07788 10.9618 3 11.0619 3L13.1755 3C13.2756 3 13.3646 3.089 13.3646 3.18913V5.08041C13.3646 5.19166 13.2756 5.26953 13.1755 5.26953ZM16.1234 10.6875H14.0098C13.9097 10.6875 13.8318 10.6096 13.8207 10.4984V8.60709C13.8207 8.49583 13.9097 8.41797 14.0098 8.41797H16.1234C16.2347 8.41797 16.3125 8.50697 16.3125 8.60709V10.4984C16.3125 10.6096 16.2236 10.6875 16.1234 10.6875ZM21.8071 8.97658C23.0984 8.97658 23.6994 9.43512 23.7663 9.49104L24 9.6588L23.8998 9.94959C23.7328 10.3522 23.4991 10.7101 23.1875 11.0009C22.7199 11.4706 21.8739 12.0186 20.5049 12.0186H20.2822C19.7368 13.4278 18.991 15.0159 17.7332 16.4363C16.9875 17.2863 16.108 18.0132 15.1285 18.5837C13.9375 19.2659 12.6463 19.7355 11.2995 19.9817C10.3311 20.1606 9.35154 20.25 8.37201 20.25C6.20145 20.25 4.27578 19.8361 3.09588 19.1092C2.04957 18.4605 1.237 17.3981 0.691578 15.9666C0.212943 14.658 -0.0208092 13.2712 0.00145278 11.8844C0.00145274 11.4706 0.335385 11.1351 0.747232 11.1351H16.5534C16.7536 11.1239 17.7109 11.0456 18.3009 10.7101C17.8111 9.92721 17.6664 9.01014 17.9002 8.03714C18.0226 7.53385 18.2341 7.04176 18.5124 6.60558L18.735 6.28125L19.0802 6.48257C19.0837 6.48554 19.0935 6.49194 19.1084 6.50182C19.3182 6.64099 20.5656 7.46843 20.7942 9.06606C21.1283 9.01014 21.4732 8.97658 21.8071 8.97658Z"
                  fill="#D0D5DD"/>
            </svg>
            <p class="font-semibold text-[16px]">Docker</p>
            <p class="text-[12px]">11 templates</p>
          </div>
          <div class="flex items-center justify-center flex-col border-[2px] rounded-[8px] p-[36px] cursor-pointer"
               :class="SDK === 'Static' ? 'border-[#3250BD] text-[#344054]': 'text-[#D0D5DD]'">
            <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                  d="M12.5001 17.56L16.5701 16.43L17.1201 10.33H9.88007L9.70007 8.3H17.3001L17.5001 6.31H7.50007L8.06007 12.32H14.9501L14.7201 14.9L12.5001 15.5L10.2801 14.9L10.1401 13.24H8.14007L8.43007 16.43L12.5001 17.56ZM4.57007 3H20.4301L19.0001 19.2L12.5001 21L6.00007 19.2L4.57007 3Z"
                  fill="#D0D5DD"/>
            </svg>
            <p class="font-semibold text-[16px]">Static</p>
            <p class="text-[12px]">3 templates</p>
          </div>
        </div>
      </div>

      <div class="mb-9 text-sm w-full">
        <p class="mb-2 text-[#303133]">空间云资源</p>
        <el-select v-model="spaceResource" placeholder="选择" size="large" style="width: 100%;">
          <el-option
              v-for="item in spaceResources"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              :disabled="disabledOptions.includes(item.value)"
          />
        </el-select>
        <p class="text-[#475467] mt-2 font-light">您可以随时在空间设置中切换到不同的空间云资源。</p>
        <p class="text-[#475467] font-light">切换到付费资源后，将根据使用时长向您收取费用。</p>
      </div>

      <hr class="mb-9"/>

      <div class="mb-9">
        <el-radio-group v-model="visibility" class="!block">
          <el-radio class="w-full mr-0 mb-9 !rounded-xl !h-auto !items-start !p-4" label="public" size="large" border>
            公开
            <p class="whitespace-normal text-[#475467] font-light">任何互联网上的人都可以看到这个仓库。只有你（个人）或你所在组织的成员可以提交。</p>
          </el-radio>
          <el-radio class="w-full mr-0 !rounded-xl !h-auto !items-start !p-4" label="private" size="large" border>
            私有
            <p class="whitespace-normal text-[#475467] font-light">只有你（个人）或你所在组织的成员可以看到并提交到这个仓库。</p>
          </el-radio>
        </el-radio-group>
      </div>
      <hr class="mb-9"/>
      <p class="mb-9 rounded bg-[#F0F3FF] text-[#4D6AD6] text-[13px] py-[9px] px-4">
        创建应用空间后，你可以使用网页或 Git 上传你的文件。
      </p>
      <div class="flex justify-end">
        <button
            class="bg-[#3250BD] w-[118px] ml-[10px] h-9 rounded-lg text-white flex items-center justify-center border disabled:text-[#98A2B3] disabled:bg-[#F2F4F7] disabled:border-[#EAECF0]"
            @click="createSpace"
            :disabled="!canCreateModel"
        >
          创建应用空间
        </button>
      </div>
    </div>
  </div>
</template>
<script setup>
import {ref, computed} from 'vue'
import {ElInput, ElMessage} from 'element-plus'

const props = defineProps({
  licenses: Array,
  namespaces: Array,
})

const license = ref(props.licenses[0][0])
const owner = ref(props.namespaces[0][0])
const spaceName = ref('')
const spaceNickName = ref('')
const spaceDesc = ref('')
const visibility = ref('private')
const SDK = ref('Gradio')
const uploadRef = ref()
const filesList = ref([])
const prefixPath = document.location.pathname.split('/')[1]
const csrf_token = document.querySelector('meta[name="csrf-token"]').getAttribute('content')

const canCreateModel = computed(() => {
  return /^(?=.{2,70}$)(?!.*[_]{2})(?!.*[-]{2})(?!.*[.]{2})[a-zA-Z0-9_.-]+$/.test(spaceName.value)
})

const spaceResources = ref([
  {label: "CPU basic · 2 vCPU · 16GB ·免费", value: "CPU basic · 2 vCPU · 16GB"},
  {label: "NVIDIA T4 · 4 vCPU · 15 GB ·即将推出", value: "NVIDIA T4 · 4 vCPU · 15 GB"},
  {label: "NVIDIA A10G · 4 vCPU · 15 GB ·即将推出", value: "NVIDIA A10G · 4 vCPU · 15 GB"},
  {label: "NVIDIA A10G · 12 vCPU · 46 GB ·即将推出", value: "NVIDIA A10G · 12 vCPU · 46 GB"}
])
const spaceResource = ref('CPU basic · 2 vCPU · 16GB')
const disabledOptions = ref([
  "NVIDIA T4 · 4 vCPU · 15 GB",
  "NVIDIA A10G · 4 vCPU · 15 GB",
  "NVIDIA A10G · 12 vCPU · 46 GB"
])

const createSpace = () => {
  if (filesList.value.length === 0) {
    ElMessage({message: "请选择封面图片", type: "warning"})
    return
  }
  uploadRef.value.submit()
}

const handleBeforeUpload = (file) => {
  if (file.size / 1024 <= 2000) {
    return true
  } else {
    ElMessage({message: "文件过大", type: "warning"})
    return false
  }
}

const handleFileChange = (file) => {
  filesList.value.push(file.raw)
}

const handleSuccess = (response, file, fileList) => {
  ElMessage({message: "上传完成", type: "success"})
  filesList.value = []
  // window.location.href = `/${prefixPath}/${props.namespacePath}/blob/main/${file.name}`
};

const handleError = (err, file, fileList) => {
  ElMessage({message: err.message, type: "warning"})
  console.log(err)
  filesList.value.splice(-1, 1)
}
</script>
<style scoped>
:deep(.el-input) {
  height: 40px;

@media screen and (max-width: 768px) {
  width:

100%;
}

}

:deep(.el-radio__input) {
  margin-top: 4px;
}

:deep(.el-radio__label) {
  color: #344054 !important;
  font-weight: 400;
}

:deep(.el-radio.is-bordered.is-checked ) {
  border: 2px solid #3250BD;
}

:deep(.el-radio__input.is-checked .el-radio__inner) {
  background: #3250BD;
  border-color: #3250BD;
}

:deep(.el-select) {
  width: 240px;
  height: 40px;

@media screen and (max-width: 768px) {
  width:

100%;
}

}
</style>

