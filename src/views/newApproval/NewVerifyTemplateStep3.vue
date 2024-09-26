<script setup lang="ts">
import { useVueFlow, VueFlow } from '@vue-flow/core'
import SvgIcon from '@/components/SvgIcon.vue'
import { verifyTempStore } from '@/stores/verifyTemplateStore.ts'
import { flowStore } from '@/stores/flowStore.ts'
import { MEETPOINT } from '@/const/appConst.ts'
import AppUtils from '@/utils/appUtils.ts'
import { TFooter } from '@/utils/setTreeHelper.ts'
import NewVerifyDrawer from '@/components/approvalManagement/newTemplateCom/NewVerifyDrawer.vue'
import NewFlowDraw from '@/components/approvalManagement/newTemplateCom/NewFlowDraw.vue'
import { TFlowITem } from '@/types/apiTypes.ts'
import { approvalStore } from '@/stores/approvalStore.ts'
import { useRouter } from 'vue-router'
import RouterNames from '@/router/name.ts'

watch(
  () => verifyTempStore.jumpStep,
  () => {
    if (
      verifyTempStore.step != verifyTempStore.jumpStep &&
      verifyTempStore.jumpStep != 0
    ) {
      if (verifyTempStore.checkFlowValueEmpty(false)) {
        verifyTempStore.goStepFromSpecify(3)
        verifyTempStore.jumpStepCheckForm(3)
        return
      }
      verifyTempStore.goStepFromSpecify(verifyTempStore.jumpStep)
    }
  }
)

const router = useRouter()

watch(
  () => approvalStore.addVerifyTemplate,
  () => {
    if (approvalStore.addVerifyTemplate) {
      router.push({
        name: RouterNames.approvalManagement
      })

      verifyTempStore.$reset()
      flowStore.$reset()
    }
  }
)

watch(
  () => verifyTempStore.nextClickedVisible,
  () => {
    if (verifyTempStore.nextClickedVisible) {
      if (verifyTempStore.verifyTWriteOff) {
        nextStep()
      } else {
        if (!verifyTempStore.checkStep2List()) {
          verifyTempStore.updateNextClickedStatus(false)
          return
        }
        if (verifyTempStore.checkFlowValueEmpty(false)) {
          verifyTempStore.updateNextClickedStatus(false)
          return
        }

        verifyTempStore.setSubmitPayload()
        if (approvalStore.nowStatus == 'add') {
          verifyTempStore.createVerifyTemplate()
        } else {
          verifyTempStore.editVerifyTemplate()
        }
      }

      setTimeout(() => {
        verifyTempStore.updateNextClickedStatus(false)
      }, 300)
    }
  }
)

const nextStep = () => {
  if (!verifyTempStore.checkStep2List()) return

  if (verifyTempStore.checkFlowValueEmpty(false)) {
    verifyTempStore.jumpStepCheckForm(3)
    verifyTempStore.updateNextClickedStatus(false)
    return
  }
  if (verifyTempStore.verifyTWriteOff) {
    verifyTempStore.goStepFromSpecify(4)
    verifyTempStore.jumpStepCheckForm(4)
  } else {
    ElMessage.warning('请先开启核销机制')
    return
  }
}

const state = reactive({
  nowZoom: 1,
  zoomNum: 100,

  pureScopeList: [] as TFooter[],
  pureCcList: [] as TFooter[],
  verifyDrawerVisible: false,
  activeCreate: false,
  activeCcCard: false,
  activeIndex: -1,
  drawName: '',

  flowDrawVisible: false,
  conditionDrawVisible: false
})

const resetBtnTop = computed(() => {
  const winH = window.innerHeight
  return winH - 48
})

const { setViewport, zoomIn, zoomOut, getViewport, onPaneScroll } = useVueFlow()
const resetTransform = () => {
  setViewport({ x: 0, y: 0, zoom: state.nowZoom })
}
const onMinusClick = () => {
  setStateZoom()
  zoomOut()
}
const onPlusClick = () => {
  setStateZoom()
  zoomIn()
}
const setStateZoom = () => {
  const { zoom } = getViewport()
  state.nowZoom = zoom
  state.zoomNum = Math.round(zoom * 100)
}

onPaneScroll(() => {
  setStateZoom()
})

const cancelDrawFun = () => {
  if (verifyTempStore.templateDialogTitle == '发起人') {
    verifyTempStore.setScopeListToStore(verifyTempStore.pureScopeList)
  }
  if (verifyTempStore.templateDialogTitle == '抄送人') {
    if (verifyTempStore.isOutSideCC) {
      verifyTempStore.setCCListToStore(verifyTempStore.pureCcList, true)
    }
  }
  verifyTempStore.setCcScopeDrawVisible(false)
}

const submitConditionDrawFun = (conditionObj: {
  path: string
  pathName: string
  pathType: string
  condition: string
  value: string
}) => {
  const cloneCondition = AppUtils.deepCloneData(
    flowStore.settingCondition
  ) as TFlowITem
  cloneCondition.condition = conditionObj.condition
  cloneCondition.path = conditionObj.path
  cloneCondition.value = conditionObj.value
  cloneCondition.pathName = conditionObj.pathName
  cloneCondition.pathType = conditionObj.pathType

  flowStore.updateConditionDataIntoList(
    cloneCondition,
    verifyTempStore.step === 4
  )
  state.conditionDrawVisible = false
}
</script>

<template>
  <div class="step3" v-loading="flowStore.flowNodeLoading">
    <VueFlow
      :nodes="flowStore.nodes"
      :edges="flowStore.edges"
      :nodesDraggable="false"
      :nodesConnectable="false"
      :zoomOnScroll="false"
      :panOnScroll="true"
      :zoomOnDoubleClick="false"
    >
      <template #node-input="data">
        <ScopeCard :node_data="data" />
      </template>
      <template #node-default="data">
        <MeetPoint
          :node_data="data"
          v-if="data.data.verifyFlow === MEETPOINT"
        />
        <template v-else>
          <FlowCard
            :node_data="data"
            v-if="!data.data.isCondition"
            @openDrawEmit="state.flowDrawVisible = true"
          />
          <ConditionCard
            :node_data="data"
            @openConditionDrawEmit="state.conditionDrawVisible = true"
            v-if="data.data.isCondition"
          />
        </template>
      </template>
      <template #node-output="data">
        <CcCard :node_data="data" v-if="!data.data.is_end" />
        <EndCard v-if="data.data.is_end" />
      </template>

      <template #edge-custom="customEdgeProps">
        <g>
          <path
            fill="none"
            stroke="#70707099"
            stroke-width="1"
            :d="`M${customEdgeProps.sourceX} ${customEdgeProps.sourceY} V${
              customEdgeProps.targetY - 55
            } H${customEdgeProps.targetX} V${customEdgeProps.targetY}`"
          />
        </g>
      </template>

      <div class="operate-bar" :style="{ top: `${resetBtnTop}px` }">
        <svg-icon
          name="minus"
          :width="16"
          :height="16"
          class="nodrag nopan operate-icon"
          @click="onMinusClick"
        />

        <p class="percent">{{ state.zoomNum }}%</p>
        <svg-icon
          name="plus"
          :width="16"
          :height="16"
          class="nodrag nopan operate-icon"
          @click="onPlusClick"
        />

        <svg-icon
          name="fitview"
          :width="16"
          :height="16"
          class="nodrag nopan operate-icon"
          @click="resetTransform"
        />
      </div>
    </VueFlow>

    <NewVerifyDrawer
      :draw_visible="verifyTempStore.scopeCCDrawVisible"
      @saveDrawEmit="verifyTempStore.setCcScopeDrawVisible(false)"
      @cancelDrawEmit="cancelDrawFun"
      :draw_name="verifyTempStore.templateDialogTitle"
    />

    <NewFlowDraw
      :drawer_visible="state.flowDrawVisible"
      @closeVerifyDrawEmit="state.flowDrawVisible = false"
    />
    <ConditionDraw
      :drawer_visible="state.conditionDrawVisible"
      @closeDrawEmit="state.conditionDrawVisible = false"
      @submitDrawEmit="submitConditionDrawFun"
    />
  </div>
</template>

<style lang="scss" scoped>
.step3 {
  @apply w-full overflow-auto;
  height: calc(100vh - 113px);
  @apply relative;

  .operate-bar {
    @apply fixed z-20;
    left: 176px;

    @apply flex items-center;
    @apply bg-white p-2;

    .percent {
      @apply w-11 mx-2 text-center text-sm text-secondary-dark;
      user-select: none; /* 現代瀏覽器 */
      -webkit-user-select: none; /* Safari */
      -moz-user-select: none; /* Firefox */
      -ms-user-select: none; /* Internet Explorer/Edge */
    }
    .operate-icon + .operate-icon {
      @apply ml-2;
    }
    .operate-icon {
      @apply cursor-pointer;
    }
  }
}
</style>
