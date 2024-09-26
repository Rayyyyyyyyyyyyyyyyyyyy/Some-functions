<script setup lang="ts">
import AppUtils from '@/utils/appUtils'
import { flowStore } from '@/stores/flowStore'
import { TFlowITem } from '@/types/apiTypes'
import SvgIcon from '@/components/SvgIcon.vue'
import { ENDPOINT } from '@/const/appConst'
import { verifyTempStore } from '@/stores/verifyTemplateStore'

const props = defineProps({
  node_data: {
    type: Object,
    default: {}
  }
})

const state = reactive({
  hoverItem: ''
})

const isWriteOff = computed(() => {
  return verifyTempStore.step === 4
})
const showFlowTopBtn = computed(() => {
  let cloneArr
  if (!isWriteOff.value) {
    cloneArr = AppUtils.deepCloneData(flowStore.storeFlowList) as TFlowITem[][]
  } else {
    cloneArr = AppUtils.deepCloneData(
      flowStore.storeWriteOffFlowList
    ) as TFlowITem[][]
  }
  const cloneData = AppUtils.deepCloneData(props.node_data)
  const indexInFlow = cloneData.data.indexInFlow
  if (cloneArr[indexInFlow - 1]) {
    if (cloneArr[indexInFlow - 1].length == 1) {
      return false
    }
  }
  return true
})
const addNewCondition = () => {
  const cloneData = AppUtils.deepCloneData(props.node_data)
  const indexInFlow = cloneData.data.indexInFlow
  flowStore.addNewConditionFlow(indexInFlow, false, verifyTempStore.step === 4)
}
const addNewFlow = () => {
  const cloneData = AppUtils.deepCloneData(props.node_data)
  const indexInFlow = cloneData.data.indexInFlow
  flowStore.addNewFlowCard(indexInFlow, false, verifyTempStore.step === 4)
}

const addNewConditionItem = () => {
  const cloneData = AppUtils.deepCloneData(props.node_data)
  const indexInFlow = cloneData.data.indexInFlow
  const nearbyConditionIndex = indexInFlow + 1
  flowStore.addNewConditionItem(
    nearbyConditionIndex,
    verifyTempStore.step === 4
  )
}

const canAddNewCondition = computed(() => {
  let cloneArr
  if (!isWriteOff.value) {
    cloneArr = AppUtils.deepCloneData(flowStore.storeFlowList) as TFlowITem[][]
  } else {
    cloneArr = AppUtils.deepCloneData(
      flowStore.storeWriteOffFlowList
    ) as TFlowITem[][]
  }
  const cloneData = AppUtils.deepCloneData(props.node_data)
  const indexInFlow = cloneData.data.indexInFlow
  if (cloneArr[indexInFlow + 1]) {
    if (cloneArr[indexInFlow + 1][0].layer == ENDPOINT) {
      return false
    }
  }
  return true
})
</script>

<template>
  <div class="meet-item">
    <!--          meet point drop down-->

    <el-dropdown trigger="click" placement="bottom-start" v-if="showFlowTopBtn">
      <el-button class="abs-btn">
        <el-icon><CirclePlus /></el-icon>
      </el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item
            @click="addNewCondition"
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
            @click="addNewFlow"
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
      v-if="canAddNewCondition"
      @click="addNewConditionItem"
      class="abs-point"
      :style="{ top: showFlowTopBtn ? '56px' : '' }"
    >
      <el-icon class="btn-icon"><CirclePlus /></el-icon>
      <p>添加条件</p>
    </el-button>
  </div>
</template>

<style lang="scss" scoped>
.meet-item {
  @apply relative;

  .el-button + .el-button {
    @apply m-0;
  }

  .abs-btn {
    @apply absolute;
    @apply text-white bg-primary-dark w-10 h-10 text-2xl;
    min-width: 40px;
    left: calc(50% - 20px);
  }
  .abs-point {
    @apply absolute w-24 h-10;
    @apply text-white bg-primary-dark;
    left: calc(50% - 48px);

    .btn-icon {
      @apply text-base;
    }
    p {
      @apply text-sm ml-2;
    }
  }
}
</style>
