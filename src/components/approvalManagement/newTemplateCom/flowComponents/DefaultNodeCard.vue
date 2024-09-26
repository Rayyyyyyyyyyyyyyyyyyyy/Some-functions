<script setup lang="ts">
import SvgIcon from '@/components/SvgIcon.vue'
import { flowStore } from '@/stores/flowStore'
import AppUtils from '@/utils/appUtils'
import { TFlowITem } from '@/types/apiTypes'
import { verifyTempStore } from '@/stores/verifyTemplateStore'
import { ENDPOINT, MEETPOINT } from '@/const/appConst'

const props = defineProps({
  card_type: {
    type: String,
    default: 'verify'
  },

  radio_status: {
    type: String,
    default: ''
  },

  active_card: {
    type: Boolean,
    default: false
  },

  is_condition: {
    type: Boolean,
    default: false
  },
  condition_ind: {
    type: Number,
    default: 0
  },
  is_else: {
    type: Boolean,
    default: false
  },

  flow_index: {
    type: Number,
    default: 0
  },
  show_flow_bottom_btn: {
    type: Boolean,
    default: false
  },
  is_condition_end: {
    type: Boolean,
    default: false
  },
  out_of_condition: {
    type: Boolean,
    default: false
  },

  is_short_flow: {
    type: Boolean,
    default: false
  },
  is_write_off: {
    type: Boolean,
    default: false
  },
  is_condition_cc: {
    type: Boolean,
    default: false
  },
  show_cc_pre_btn: {
    type: Boolean,
    default: false
  },
  next_cc: {
    type: Boolean,
    default: false
  }
})

const bgStyle = computed(() => {
  switch (props.card_type) {
    case 'start':
      return 'start-person'
    case 'cc':
      return 'cc-peron'
    case 'condition':
      return 'condition-bg'
    default:
      return 'verify-person'
  }
})
const cardHeaderText = computed(() => {
  switch (props.card_type) {
    case 'start':
      if (props.is_write_off) {
        return '发起人-提交核销'
      } else {
        if (verifyTempStore.verifyTWriteOff) {
          return '发起人-提交申请'
        } else {
          return '发起人'
        }
      }
    case 'cc':
      return '抄送人'
    case 'condition':
      return !props.is_else ? `优先条件 ${props.condition_ind}` : '默认条件'
    case 'verify':
      return props.radio_status == '4' ? '审批人-发起人自选' : '审批人'
    default:
      return ''
  }
})
const isVerifyCard = computed(() => {
  return props.card_type == 'verify'
})

const emits = defineEmits([
  'addVerifyEmit',
  'removeVerifyCardEmit',
  'openDrawerEmit',
  'addFlowInConditionEmit',
  'addCCInConditionEmit',
  'deleteConditionEmit'
])

const removeCard = () => {
  emits('removeVerifyCardEmit')
}
const openDrawer = () => {
  emits('openDrawerEmit')
}

const isWriteOff = computed(() => {
  return verifyTempStore.step === 4
})

const cardInCondition = computed(() => {
  let cloneArr
  if (!isWriteOff.value) {
    cloneArr = AppUtils.deepCloneData(flowStore.storeFlowList) as TFlowITem[][]
  } else {
    cloneArr = AppUtils.deepCloneData(
      flowStore.storeWriteOffFlowList
    ) as TFlowITem[][]
  }
  return (
    cloneArr[props.flow_index] &&
    (cloneArr[props.flow_index].length > 1 || // 這層是條件
      (cloneArr[props.flow_index - 1] &&
        cloneArr[props.flow_index - 1].length == 1) || // 上一層 不是條件
      !cloneArr[props.flow_index - 1]) // 第一層 index-1 會找不到東西
  )
})
const showDelText = computed(() => {
  let cloneArr
  if (!isWriteOff.value) {
    cloneArr = AppUtils.deepCloneData(flowStore.storeFlowList) as TFlowITem[][]
  } else {
    cloneArr = AppUtils.deepCloneData(
      flowStore.storeWriteOffFlowList
    ) as TFlowITem[][]
  }
  const flowList = cloneArr.filter(
    condL => ![MEETPOINT, ENDPOINT].includes(condL[0].layer)
  )
  const gotConditionLayerIndex = flowList.findIndex(condL => condL.length > 1)

  if (cloneArr.length == 3) {
    return (
      gotConditionLayerIndex > -1 || flowList.every(item => item.length == 1)
    )
  } else {
    return cloneArr.length > 3
  }
})

const onTopBtnClick = (isBottom: boolean = false) => {
  emits('addFlowInConditionEmit', isBottom)
}

const showDrawSelect = computed(() => {
  let cloneArr
  if (!isWriteOff.value) {
    cloneArr = AppUtils.deepCloneData(flowStore.storeFlowList) as TFlowITem[][]
  } else {
    cloneArr = AppUtils.deepCloneData(
      flowStore.storeWriteOffFlowList
    ) as TFlowITem[][]
  }
  return cloneArr[props.flow_index].length === 1
})

const addNewCondition = (addAfter: boolean) => {
  flowStore.addNewConditionFlow(
    props.flow_index,
    addAfter,
    verifyTempStore.step === 4
  )
}
const addNewFlow = (addAfter: boolean) => {
  flowStore.addNewFlowCard(
    props.flow_index,
    addAfter,
    verifyTempStore.step === 4
  )
}

const state = reactive({
  hoverItem: ''
})

const addNewFlowInCondition = () => {
  emits('addFlowInConditionEmit', true)
}
const addNewCcInCondition = () => {
  if (verifyTempStore.ccLimitIsMax) {
    ElMessage.warning('抄送对象已达上限')

    return
  }
  emits('addCCInConditionEmit')
}
const delCondition = () => {
  emits('deleteConditionEmit')
}
</script>

<template>
  <div class="col-item">
    <div class="abs-dom" :style="{ top: cardInCondition ? '-70px' : '-48px' }">
      <!--            default node card drop down-->

      <el-dropdown
        trigger="click"
        placement="bottom-start"
        v-if="showDrawSelect && isVerifyCard"
      >
        <el-button class="pre-btn btn-size">
          <el-icon><CirclePlus /></el-icon>
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item
              @click="addNewCondition(false)"
              @mouseover="state.hoverItem = 'share'"
              @mouseout="state.hoverItem = ''"
            >
              <svg-icon
                name="share"
                :width="16"
                :height="16"
                :color="state.hoverItem === 'share' ? '#fff' : '#000'"
              />
              <p class="ml-3">条件</p></el-dropdown-item
            >
            <el-dropdown-item
              @click="addNewFlow(false)"
              @mouseover="state.hoverItem = 'verify'"
              @mouseout="state.hoverItem = ''"
            >
              <svg-icon
                name="verify"
                :width="16"
                :height="16"
                :color="state.hoverItem === 'verify' ? '#fff' : '#000'"
              />
              <p class="ml-3">审批人</p>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>

      <el-button
        v-if="(!showDrawSelect && isVerifyCard) || show_cc_pre_btn"
        class="pre-btn btn-size"
        @click="onTopBtnClick(false)"
      >
        <el-icon><CirclePlus /></el-icon>
      </el-button>
    </div>

    <div class="node-card" :class="{ 'active-card': active_card }">
      <div class="node-card_header" :class="bgStyle">
        <p>{{ cardHeaderText }}</p>
        <p
          class="del-card"
          @click="removeCard"
          v-if="(isVerifyCard && showDelText) || is_condition_cc"
        >
          删除
        </p>

        <div
          v-if="is_condition && !is_else"
          class="priority-close"
          @click="delCondition"
        >
          <svg-icon
            class="close-icon"
            name="close"
            color="#909399"
            :width="14"
            :height="14"
          ></svg-icon>
        </div>
      </div>
      <div class="node-card_body" @click="openDrawer">
        <div class="node-card_body-item">
          <slot name="body" />
        </div>
      </div>
    </div>

    <template v-if="show_flow_bottom_btn">
      <el-dropdown
        v-if="is_condition_end"
        trigger="click"
        placement="bottom-start"
        class="abs-dom"
        :class="{
          'next-btn-before-cc': is_short_flow,
          'next-btn': !is_short_flow
        }"
      >
        <el-button class="btn-size">
          <el-icon><CirclePlus /></el-icon>
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item
              @click="addNewFlowInCondition"
              @mouseover="state.hoverItem = 'verify'"
              @mouseout="state.hoverItem = ''"
            >
              <svg-icon
                name="verify"
                :width="16"
                :height="16"
                :color="state.hoverItem === 'verify' ? '#fff' : '#000'"
              />
              <p class="ml-3">审批人</p>
            </el-dropdown-item>

            <el-dropdown-item
              v-if="verifyTempStore.step == 3"
              @click="addNewCcInCondition"
              @mouseover="state.hoverItem = 'cc'"
              @mouseout="state.hoverItem = ''"
            >
              <svg-icon
                name="ccMember"
                :width="16"
                :height="16"
                :color="state.hoverItem === 'cc' ? '#fff' : '#000'"
              />
              <p class="ml-3">抄送人</p></el-dropdown-item
            >
          </el-dropdown-menu>
        </template>
      </el-dropdown>

      <el-dropdown
        class="abs-dom next-btn-before-cc"
        trigger="click"
        placement="bottom-start"
        v-if="out_of_condition"
      >
        <el-button class="btn-size">
          <el-icon><CirclePlus /></el-icon>
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item
              @click="addNewCondition(true)"
              @mouseover="state.hoverItem = 'share'"
              @mouseout="state.hoverItem = ''"
            >
              <svg-icon
                name="share"
                :width="16"
                :height="16"
                :color="state.hoverItem === 'share' ? '#fff' : '#000'"
              />
              <p class="ml-3">条件</p></el-dropdown-item
            >
            <el-dropdown-item
              @click="addNewFlow(true)"
              @mouseover="state.hoverItem = 'verify'"
              @mouseout="state.hoverItem = ''"
            >
              <svg-icon
                name="verify"
                :width="16"
                :height="16"
                :color="state.hoverItem === 'verify' ? '#fff' : '#000'"
              />
              <p class="ml-3">审批人</p>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>

      <el-button
        v-if="next_cc"
        class="abs-dom next-btn-before-cc btn-size"
        @click="onTopBtnClick(true)"
      >
        <el-icon><CirclePlus /></el-icon>
      </el-button>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.col-item {
  @apply relative;

  .abs-dom {
    @apply absolute;

    left: calc(50% - 20px);
  }
  .btn-size {
    @apply text-white bg-primary-dark w-10 h-10 text-2xl;
    min-width: 40px;
  }
  .next-btn {
    bottom: -52px;
  }
  .next-btn-before-cc {
    bottom: -72px;
  }
}

.node-card {
  @apply text-sm;
  min-height: 96px;
  min-width: 318px;

  &_header {
    @apply h-7 p-6 text-white;
    @apply flex items-center justify-between;
    @apply cursor-auto;

    .del-card {
      @apply cursor-pointer;
    }

    .priority-close {
      @apply flex items-center;

      .close-icon {
        @apply ml-2 cursor-pointer;
      }
    }
  }
  &_body {
    @apply py-4 px-6 bg-white;
    @apply flex items-center justify-between;
    min-height: 24px;
  }
}

.start-person {
  @apply bg-bg-cardHeader;
}
.verify-person {
  @apply bg-warning-orange;
}
.cc-peron {
  @apply bg-primary-ccPerson;
}
.condition-bg {
  @apply bg-bg-conditionBG;
}
.active-card {
  @apply ring-2 ring-blue-500;
}
</style>
