<template>
  <template
    :key="item.index"
    v-for="item in allNavItems">
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
    <div class="hidden md:flex px-4 py-6 flex-col gap-3">
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
  import { ref, watch, onMounted, onUnmounted, shallowRef } from 'vue'
  import Mcp from './menuItem/Mcp.vue'
  import McpTools from './menuItem/McpTools.vue'
  import { useI18n } from 'vue-i18n'

  const { t } = useI18n()

  const McpRef = shallowRef(Mcp)
  const McpToolsRef = shallowRef(McpTools)

  const props = defineProps({
    isLoggedInBoolean: Boolean,
    starChainUrl: String,
    hasEmail: Boolean
  })

  const rawNavItems = [
    {
      title: t('navbar.models'),
      index: '/models',
      class: menuItemClass,
      style: 'border:none; height: 48px; border-radius: 4px; padding: 12px 16px;',
    },
    {
      title: t('navbar.datasets'),
      index: '/datasets',
      class: menuItemClass,
      style: 'border:none; height: 48px; border-radius: 4px; padding: 12px 16px;',
    },
    {
      title: t('navbar.mcp'),
      index: '/mcp/servers',
      class: menuItemClass,
      style:
        'border:none; height: 48px; border-radius: 4px; padding: 12px 16px;',
      edition: ['saas', 'ee'],
      items: [
        {
          title: t('navbar.mcp'),
          index: '/mcp/servers',
          class: subMenuItemClass,
          style: 'height: auto;',
          component: McpRef,
          target: '',
          condition: true,
          edition: ['saas', 'ee']
        },
        {
          title: t('navbar.mcpTools'),
          index: '/mcp/servers/tools',
          class: subMenuItemClass,
          style: 'height: auto;',
          component: McpToolsRef,
          target: '',
          condition: true,
          edition: ['saas', 'ee']
        }
      ]
    },
    {
      title: t('navbar.spaces'),
      index: '/spaces',
      class: menuItemClass,
      style: 'border:none; height: 48px; border-radius: 4px; padding: 12px 16px;',
    },
    {
      title: t('navbar.codes'),
      index: '/codes',
      class: menuItemClass,
      style: 'border:none; height: 48px; border-radius: 4px; padding: 12px 16px;',
    },
    {
      title: t('collections.collection'),
      index: '/collections',
      class: menuItemClass,
      style: 'border:none; height: 48px; border-radius: 4px; padding: 12px 16px;',
    },
    {
      title: t('prompts.promptLibrary'),
      index: '/prompts/library',
      class: menuItemClass,
      style: 'border:none; height: 48px; border-radius: 4px; padding: 12px 16px;',
    }
  ]

  const allNavItems = ref(rawNavItems)

  const moreItems = ref([])
  const currentScreenWidth = ref(window.innerWidth)

  const handleResize = () => {
    currentScreenWidth.value = window.innerWidth
  }

  onMounted(() => {
    window.addEventListener('resize', handleResize)
    if (window.innerWidth > 768) {
      initMenuItems()
    }
  })

  onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
  })

  watch(currentScreenWidth, (newVal) => {
    if (window.innerWidth > 768) {
      initMenuItems()
    }
  })

  const initMenuItems = () => {
    // const menuWidth = document.querySelector('#pc-menu')?.offsetWidth

    if (768 < window.innerWidth && window.innerWidth <= 1024) {
      allNavItems.value = rawNavItems.slice(0, 3)
      moreItems.value = rawNavItems.slice(3)
    }

    if (1024 < window.innerWidth && window.innerWidth <= 1280) {
      allNavItems.value = rawNavItems.slice(0, 5)
      moreItems.value = rawNavItems.slice(5)
    }

    if (window.innerWidth > 1280) {
      allNavItems.value = rawNavItems
      moreItems.value = []
    }
  }

  const menuItemClass =
    'md:!px-[12px] md:!py-[16px] md:!h-auto js-menu-item-width'
  const subMenuClass = 'md:!h-auto md:!py-[16px] js-menu-item-width'
  const subMenuItemClass = 'mx-[12px] md:mx-0 md:!px-[12px]'
  const popperClass = 'popper-submenu'
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
    height: 46px;
    line-height: 24px;
  }
  :deep(.el-menu-item):hover {
    background-color: var(--Gray-50) !important;
  }
</style>
