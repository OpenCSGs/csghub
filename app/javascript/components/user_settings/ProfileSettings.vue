<template>
  <div
    class="flex justify-center md:flex-col px-[24px] rounded-[8px] md:px-[50px] sm:px-[20px] max-w-[1280px] m-auto bg-white"
  >
    <Menu
      class="max-w-[411px] md:mb-[24px]"
      :name="profileData.profileName"
      :email="profileData.profileEmail"
      :displayName="profileData.profileNickname"
      :avatar="profileData.profileAvatar"
    >
    </Menu>
    <ProfileEdit class="grow" />
  </div>
</template>

<script setup>
  import Menu from './Menu.vue'
  import ProfileEdit from './ProfileEdit.vue'
  import { ref, onMounted, inject, provide } from 'vue'
  import jwtFetch from '../../packs/jwtFetch.js'

  const props = defineProps({
    name: String
  })

  const csghubServer = inject('csghubServer')

  const profileData = ref({
    profileName: props.name,
    profileNickname: '',
    profileAvatar: '',
    profileEmail: '',
    profilePhone: '',
    profileHomepage: '',
    profileBio: ''
  });

  provide('profileData', profileData);

  onMounted(() => {
    jwtFetch(`${csghubServer}/api/v1/user/${props.name}`, {
      method: 'GET',
    })
      .then((res) => res.json())
      .then((body) => {
        profileData.value.profileName = body.data.username
        profileData.value.profileNickname = body.data.nickname
        profileData.value.profileAvatar = body.data.avatar
        profileData.value.profileEmail = body.data.email
        profileData.value.profilePhone = body.data.phone
        profileData.value.profileHomepage = body.data.homepage
        profileData.value.profileBio = body.data.bio
      })
  })
</script>
