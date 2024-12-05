<template>
  <template
    :key="item.index"
    v-for="item in items">
    <a
      v-if="!item.items"
      :href="item.index">
      <el-menu-item
        :index="item.index"
        :class="item.class"
        :style="item.style">
        {{ item.title }}
      </el-menu-item>
    </a>
    <el-sub-menu
      v-else
      :index="item.index"
      :popper-class="item.popperClass"
      :class="item.class">
      <template #title>
        {{ item.title }}
      </template>
      <template
        :key="subItem.index"
        v-for="subItem in item.items">
        <!-- <a :href="llmFinetune" target="_blank"></a> -->
        <a
          :href="subItem.index"
          :target="subItem.target"
          v-if="subItem.condition">
          <el-menu-item
            :class="subItem.class"
            :style="subItem.style"
            :index="subItem.index">
            <!-- subItem.component -->
              {{ item.title }}
          </el-menu-item>
        </a>
      </template>
    </el-sub-menu>
  </template>

  <!-- 更多里面的内容 -->
  <el-sub-menu
    v-if="moreItems.length > 0"
    :popper-class="popperClass"
    :class="subMenuClass"
    expand-close-icon="null"
    expand-open-icon="null"
    style="--el-menu-icon-width: 0px">
    <template #title>
      <SvgIcon
        name="more_menu"
        class="p-[4px]" />
      {{ $t('navbar.more') }}
    </template>

    <template
      :key="item.index"
      v-for="item in moreItems">
      <a
        v-if="!item.items"
        :href="item.index">
        <el-menu-item
          :index="item.index"
          :class="item.class"
          :style="item.style">
          {{ item.title }}
        </el-menu-item>
      </a>
      <el-sub-menu
        v-else
        :index="item.index"
        :popper-class="item.popperClass"
        :class="item.class">
        <template #title>
          {{ item.title }}
        </template>
        <template
          :key="subItem.index"
          v-for="subItem in item.items">
          <!-- <a :href="llmFinetune" target="_blank"></a> -->
          <a
            :href="subItem.index"
            :target="subItem.target"
            v-if="subItem.condition">
            <el-menu-item
              :class="subItem.class"
              :style="subItem.style"
              :index="subItem.index">
              <!-- subItem.component -->
                {{ item.title }}
            </el-menu-item>
          </a>
        </template>
      </el-sub-menu>
    </template>
  </el-sub-menu>

  <template v-if="!props.isLoggedInBoolean">
    <hr />
    <div class="hidden md:block px-4 py-6 flex flex-col gap-3">
      <a
        href="/signup"
        class="btn btn-primary btn-lg">
        {{ $t('navbar.register') }}
      </a>
      <a
        href="/login"
        class="btn btn-secondary-gray btn-lg">
        {{ $t('navbar.login') }}
      </a>
    </div>
  </template>
</template>

<script setup>
  import { ref, watch, onMounted } from 'vue'
  import { useI18n } from 'vue-i18n'

  const { t } = useI18n()

  const props = defineProps({
    isLoggedInBoolean: Boolean,
    starChainUrl: String,
    hasEmail: Boolean
  })

  const moreItems = ref([])
  const currentScreenWidth = ref(window.innerWidth)
  const safePadding = props.isLoggedInBoolean ? 63 : 100
  const moreMenuWidth = 107

  const handleResize = () => {
    currentScreenWidth.value = window.innerWidth
  }

  onMounted(() => {
    window.addEventListener('resize', handleResize)
    if (window.innerWidth > 768) {
      initMenuItems()
    }
  })

  watch(currentScreenWidth, (newVal) => {
    if (window.innerWidth > 768) {
      adjustMenuItems()
    }
  })

  const initMenuItems = () => {
    const menuWidth = document.querySelector('#pc-menu').offsetWidth
    let width = moreMenuWidth + safePadding
    items.value.forEach((item, index) => {
      width += document.querySelectorAll(".js-menu-item-width")[index].offsetWidth
      if (width > menuWidth) {
        moreItems.value = items.value.splice(index, items.value.length - index)
        return
      }
    })
  }

  const adjustMenuItems = () => {
    const menuWidth = document.querySelector('#pc-menu').offsetWidth
    let width = moreMenuWidth + safePadding // 更多按钮加上安全距离

    // 超出宽度的菜单放到更多里面
    items.value.map((item, index) => {
      width += document.querySelectorAll(".js-menu-item-width")[index].offsetWidth
      if (width > menuWidth) {
        const removedItem = items.value.pop()
        if (removedItem) {
          moreItems.value.unshift(removedItem)
        }
      }
    })

    // 将更多里面的菜单放回去
    moreItems.value.map((item, index) => {
      width += document.querySelectorAll(".js-menu-item-width")[index].offsetWidth
      if (width <= menuWidth) {
        const removedItem = moreItems.value.shift()
        if (removedItem) {
          items.value.push(removedItem)
        }
      }
    })
  }

  const menuItemClass = 'md:!px-[12px] md:!py-[16px] md:!h-auto js-menu-item-width'
  const subMenuClass = 'md:!h-auto md:!py-[16px] js-menu-item-width'
  const popperClass = 'popper-submenu'

  const items = ref([
    {
      title: t('navbar.models'),
      index: '/models',
      class: menuItemClass,
      style: 'border:none',
    },
    {
      title: t('navbar.datasets'),
      index: '/datasets',
      class: menuItemClass,
      style: 'border:none',
    },
    {
      title: t('navbar.spaces'),
      index: '/spaces',
      class: menuItemClass,
      style: 'border:none',
    },
    {
      title: t('navbar.codes'),
      index: '/codes',
      class: menuItemClass,
      style: 'border:none',
    },
    {
      title: t('collections.collection'),
      index: '/collections',
      class: menuItemClass,
      style: 'border:none',
    },
    {
      title: t('prompts.promptLibrary'),
      index: '/prompts/library',
      class: menuItemClass,
      style: 'border:none',
    }
  ])
</script>

<style scoped>
  :deep(.el-sub-menu__title) {
    /* padding: 16px; */
  }
  :deep(.popper-submenu .el-menu) {
    min-width: 200px;
    padding: var(--el-menu-base-level-padding);
  }
  :deep(.popper-submenu .el-menu .el-menu-item) {
    font-size: 16px;
    height: auto;
    line-height: 24px;
  }
</style>
