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
            <component :is="subItem.component" />
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
      更多
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
              <component :is="subItem.component" />
            </el-menu-item>
          </a>
        </template>
      </el-sub-menu>
    </template>
  </el-sub-menu>

  <template v-if="!props.isLoggedInBoolean">
    <hr />
    <div class="px-[16px] py-[24px] flex flex-col gap-[12px]">
      <a
        href="/signup"
        class="hidden md:block btn-primary w-full px-[16px] py-[10px] text-[16px] font-500 leading-24 text-center">
        {{ $t('navbar.register') }}
      </a>
      <a
        href="/login"
        class="hidden md:block btn-outline text-black w-full px-[16px] py-[10px] text-[16px] font-500 leading-24 text-center">
        {{ $t('navbar.login') }}
      </a>
    </div>
  </template>
</template>

<script setup>
  import { ref, watch, onMounted, shallowRef } from 'vue'

  import ProductCsgHub from './menuItem/ProductCsgHub.vue'
  import StarShip from './menuItem/StarShip.vue'
  import EKB from './menuItem/EKB.vue'
  import StarAIO from './menuItem/StarAIO.vue'
  import Imagen from './menuItem/Imagen.vue'
  import StarCode from './menuItem/StarCode.vue'
  import AllSolution from './menuItem/AllSolution.vue'
  import CSGHub from './menuItem/CSGHub.vue'
  import Inference from './menuItem/Inference.vue'
  import LlmFinetune from './menuItem/LlmFinetune.vue'
  import OpenSourceStarCloud from './menuItem/OpenSourceStarCloud.vue'
  import StarChain from './menuItem/StarChain.vue'
  import Space from './menuItem/Space.vue'
  import DailyPapers from './menuItem/DailyPapers.vue'
  import Campaigns from './menuItem/Campaigns.vue'
  import Partners from './menuItem/Partners.vue'
  import Experts from './menuItem/Experts.vue'
  import News from './menuItem/News.vue'
  import Doc from './menuItem/Doc.vue'

  const ProductCsgHubRef = shallowRef(ProductCsgHub)
  const StarShipRef = shallowRef(StarShip)
  const EKBRef = shallowRef(EKB)
  const StarAIORef = shallowRef(StarAIO)
  const ImagenRef = shallowRef(Imagen)
  const StarCodeRef = shallowRef(StarCode)
  const AllSolutionRef = shallowRef(AllSolution)
  const CSGHubRef = shallowRef(CSGHub)
  const InferenceRef = shallowRef(Inference)
  const LlmFinetuneRef = shallowRef(LlmFinetune)
  const OpenSourceStarCloudRef = shallowRef(OpenSourceStarCloud)
  const StarChainRef = shallowRef(StarChain)
  const SpaceRef = shallowRef(Space)
  const DailyPapersRef = shallowRef(DailyPapers)
  const CampaignsRef = shallowRef(Campaigns)
  const PartnersRef = shallowRef(Partners)
  const ExpertsRef = shallowRef(Experts)
  const NewsRef = shallowRef(News)
  const DocRef = shallowRef(Doc)

  const csgHubUrl = 'https://github.com/OpenCSGs/CSGHub'
  const llmInference = 'https://github.com/OpenCSGs/llm-inference'
  const llmFinetune = 'https://github.com/OpenCSGs/llm-finetune'
  const OpenSourceStarCloudUrl = 'https://github.com/OpenCSGs/llm-scheduler-ui'

  import { useI18n } from 'vue-i18n'

  const { t } = useI18n()

  const props = defineProps({
    isLoggedInBoolean: Boolean,
    starChainUrl: String,
    mobileMenuVisibility: Boolean
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
      width += item.width
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
      width += item.width
      if (width > menuWidth) {
        const removedItem = items.value.pop()
        if (removedItem) {
          moreItems.value.unshift(removedItem)
        }
      }
    })

    // 将更多里面的菜单放回去
    moreItems.value.map((item, index) => {
      width += item.width
      if (width <= menuWidth) {
        const removedItem = moreItems.value.shift()
        if (removedItem) {
          items.value.push(removedItem)
        }
      }
    })
  }

  const menuItemClass = 'md:!px-[12px] md:!py-[16px] md:!h-auto'
  const subMenuClass = 'md:!h-auto md:!py-[16px]'
  const subMenuItemClass = 'mx-[12px] md:mx-0 md:!px-[12px]'
  const popperClass = 'popper-submenu'
  const menuItemWidth = 56
  const subMenuItemWidth = 76

  const items = ref([
    {
      title: t('navbar.models'),
      index: '/models',
      class: menuItemClass,
      style: 'border:none',
      width: menuItemWidth
    },
    {
      title: t('navbar.datasets'),
      index: '/datasets',
      class: menuItemClass,
      style: 'border:none',
      width: menuItemWidth
    },
    {
      title: t('navbar.spaces'),
      index: '/spaces',
      class: menuItemClass,
      style: 'border:none',
      width: menuItemWidth
    },
    {
      title: t('navbar.codes'),
      index: '/codes',
      class: menuItemClass,
      style: 'border:none',
      width: menuItemWidth
    },
    {
      title: t('collections.collection'),
      index: '/collections',
      class: menuItemClass,
      style: 'border:none',
      width: menuItemWidth
    },
    {
      title: t('navbar.computer'),
      index: '/computing',
      class: menuItemClass,
      style: 'border:none',
      width: menuItemWidth
    },
    {
      title: t('navbar.product'),
      index: 'product',
      class: subMenuClass,
      popperClass: popperClass,
      width: subMenuItemWidth,
      items: [
        {
          title: 'csghub',
          index: '/csghub',
          class: subMenuItemClass,
          style: 'height: auto;',
          component: ProductCsgHubRef,
          target: '',
          condition: true
        },
        {
          title: 'starship',
          index: '/starship',
          class: subMenuItemClass,
          style: 'height: auto;',
          component: StarShipRef,
          target: '',
          condition: true
        },
        {
          title: 'EKB',
          index: '/ekb',
          class: subMenuItemClass,
          style: 'height: auto;',
          component: EKBRef,
          target: '',
          condition: true
        },
        {
          title: 'StarAIO',
          index: '/solution?class=StarAIO',
          class: subMenuItemClass,
          style: 'height: auto;',
          component: StarAIORef,
          target: '',
          condition: true
        },
        {
          title: 'Imagen',
          index: '/solution?class=AIImg',
          class: subMenuItemClass,
          style: 'height: auto;',
          component: ImagenRef,
          target: '',
          condition: true
        },
        {
          title: 'StarCode',
          index: '/solution?class=Programming',
          class: subMenuItemClass,
          style: 'height: auto;',
          component: StarCodeRef,
          target: '',
          condition: true
        },
        {
          title: 'All Solution',
          index: '/solution',
          class: '!px-0 mb-[-12px] rounded-[0_0_12px_12px]',
          style: 'height: auto;',
          component: AllSolutionRef,
          target: '',
          condition: true
        }
      ]
    },
    {
      title: t('navbar.developer'),
      index: 'developer',
      class: subMenuClass,
      popperClass: popperClass,
      width: subMenuItemWidth,
      items: [
        {
          title: 'CSG Hub',
          index: csgHubUrl,
          class: subMenuItemClass,
          style: 'height: auto;',
          component: CSGHubRef,
          target: '_blank',
          condition: true
        },
        {
          title: 'Inference',
          index: llmInference,
          class: subMenuItemClass,
          style: 'height: auto;',
          component: InferenceRef,
          target: '_blank',
          condition: true
        },
        {
          title: 'Llm Finetune',
          index: llmFinetune,
          class: subMenuItemClass,
          style: 'height: auto;',
          component: LlmFinetuneRef,
          target: '_blank',
          condition: true
        },
        {
          title: 'Open Source Star Cloud',
          index: OpenSourceStarCloudUrl,
          class: subMenuItemClass,
          style: 'height: auto;',
          component: OpenSourceStarCloudRef,
          target: '_blank',
          condition: true
        },
        {
          title: 'Star Chain',
          index: props.starChainUrl,
          class: subMenuItemClass,
          style: 'height: auto;',
          component: StarChainRef,
          target: '_blank',
          condition: props.isLoggedInBoolean
        }
      ]
    },
    {
      title: t('navbar.community'),
      index: 'community',
      class: subMenuClass,
      popperClass: popperClass,
      width: subMenuItemWidth,
      items: [
        {
          title: 'Daily Papers',
          index: '/daily_papers',
          class: subMenuItemClass,
          style: 'height: auto;',
          component: DailyPapersRef,
          target: '',
          condition: true
        },
        {
          title: 'Campaigns',
          index: '/campaigns',
          class: subMenuItemClass,
          style: 'height: auto;',
          component: CampaignsRef,
          target: '',
          condition: true
        },
        {
          title: 'Partners',
          index: '/partners',
          class: subMenuItemClass,
          style: 'height: auto;',
          component: PartnersRef,
          target: '',
          condition: true
        },
        {
          title: 'Experts',
          index: '/experts',
          class: subMenuItemClass,
          style: 'height: auto;',
          component: ExpertsRef,
          target: '',
          condition: true
        },
        {
          title: 'News',
          index: 'https://blog.opencsg.com/',
          class: subMenuItemClass,
          style: 'height: auto;',
          component: NewsRef,
          target: '_blank',
          condition: true
        },
        {
          title: 'Doc',
          index: '/docs',
          class: subMenuItemClass,
          style: 'height: auto;',
          component: DocRef,
          target: '',
          condition: true
        }
      ]
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
