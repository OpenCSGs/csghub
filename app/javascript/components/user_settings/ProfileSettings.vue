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
    <ProfileEdit
      class="grow"
      :name="profileData.profileName"
      :nickname="profileData.profileNickname"
      :avatar="profileData.profileAvatar"
      :phone="profileData.profilePhone"
      :email="profileData.profileEmail"
      :homepage="profileData.profileHomepage"
      :bio="profileData.profileBio"
      @updateUserInfo="updateUserInfo"
    >
    </ProfileEdit>
  </div>
</template>

<script setup>
  import Menu from './Menu.vue'
  import ProfileEdit from './ProfileEdit.vue'
  import { ref, onMounted, inject, provide, reactive } from 'vue'
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

  // const profileName = ref(props.name)
  // const profileNickname = ref('')
  // const profileAvatar = ref('')
  // const profileEmail = ref('')
  // const profilePhone = ref('')
  // const profileHomepage = ref('')
  // const profileBio = ref('')

  const updateUserInfo = (data) => {
    const { nickname, name, avatar } = data
    if (name) {
      profileData.value.profileName = name
    }
    if (nickname) {
      profileData.value.profileNickname = nickname
    }
    if (avatar) {
      profileData.value.profileAvatar = avatar
    }
  }

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

        // profileName.value = body.data.username
        // profileAvatar.value = body.data.avatar
        // profileEmail.value = body.data.email
        // profileNickname.value = body.data.nickname
        // profilePhone.value = body.data.phone
        // profileHomepage.value = body.data.homepage
        // profileBio.value = body.data.bio
      })
  })
</script>
