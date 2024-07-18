<template>
  <div
    class="flex justify-center md:flex-col px-[24px] rounded-[8px] md:px-[50px] sm:px-[20px] max-w-[1280px] m-auto bg-white"
  >
    <Menu
      class="max-w-[411px] md:mb-[24px]"
      :name="profileName"
      :email="profileEmail"
      :displayName="profileDisplayName"
      :avatar="profileAvatar"
    >
    </Menu>
    <ProfileEdit
      class="grow"
      :name="profileName"
      :nickname="profileNickname"
      :avatar="profileAvatar"
      :phone="profilePhone"
      :email="profileEmail"
      :homepage="profileHomepage"
      :bio="profileBio"
      :displayName="profileDisplayName"
      @updateUserInfo="updateUserInfo"
    >
    </ProfileEdit>
  </div>
</template>

<script setup>
  import Menu from './Menu.vue'
  import ProfileEdit from './ProfileEdit.vue'
  import { ref, onMounted, inject } from 'vue'
  import jwtFetch from '../../packs/jwtFetch.js'

  const props = defineProps({
    name: String
  })

  const csghubServer = inject('csghubServer')

  const profileName = ref(props.name)
  const profileDisplayName = ref('')
  const profileAvatar = ref('')
  const profileEmail = ref('')
  const profileNickname = ref('')
  const profilePhone = ref('')
  const profileHomepage = ref('')
  const profileBio = ref('')

  const updateUserInfo = (data) => {
    const { nickname, name, avatar } = data
    profileName.value = name || profileName.value
    profileDisplayName.value = nickname || profileDisplayName.value
    profileAvatar.value = avatar || profileAvatar.value
  }

  onMounted(() => {
    jwtFetch(`${csghubServer}/api/v1/users/${props.name}`, {
      method: 'GET',
    })
      .then((res) => res.json())
      .then((data) => {
        profileName.value = data.username
        profileDisplayName.value = data.name
        profileAvatar.value = data.avatar
        profileEmail.value = data.email
        profileNickname.value = data.nickname
        profilePhone.value = data.phone
        profileHomepage.value = data.homepage
        profileBio.value = data.bio
      })
  })
</script>
