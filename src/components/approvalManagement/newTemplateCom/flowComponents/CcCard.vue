<script setup lang="ts">
import { verifyTempStore } from '@/stores/verifyTemplateStore'
import AppUtils from '@/utils/appUtils'
import { TConditionCC, TFlowITem } from '@/types/apiTypes'
import { flowStore } from '@/stores/flowStore'

const props = defineProps({
  node_data: {
    type: Object,
    default: {}
  }
})

const isOutSideCC = computed(() => {
  return props.node_data.id === '2'
})

const onlyCcInCondition = computed(() => {
  const ccId = props.node_data.id! as string
  if (ccId.length > 1) {
    const flowPathList = ccId.split('-').map(str => Number(str)) as number[]
    let cloneList
    if (verifyTempStore.step == 3) {
      cloneList = AppUtils.deepCloneData(
        flowStore.storeFlowList
      ) as TFlowITem[][]
    } else {
      cloneList = AppUtils.deepCloneData(
        flowStore.storeWriteOffFlowList
      ) as TFlowITem[][]
    }
    if (
      cloneList[flowPathList[0]][flowPathList[1]].verifyFlowList.length == 1
    ) {
      return (
        cloneList[flowPathList[0]][flowPathList[1]].verifyFlowList[0]
          .verifyFlow == 'cc'
      )
    }
  }

  return false
})

const openDrawerFun = () => {
  verifyTempStore.setDialogTitle('抄送人')
  verifyTempStore.setCCisOutSideVisible(isOutSideCC.value)

  verifyTempStore.nowSettingCCId(props.node_data.id)

  let cloneData
  if (isOutSideCC.value) {
    verifyTempStore.setActiveCard('cc')

    cloneData = AppUtils.deepCloneData(verifyTempStore.getCCFooterTagList())
    verifyTempStore.setCCListToStore(cloneData, true)
    verifyTempStore.setPureCCListToStore(cloneData)
  } else {
    verifyTempStore.clearConditionCCSelected()

    setTimeout(() => {
      const flowCCData = AppUtils.deepCloneData(
        props.node_data.data.copyFlow
      ) as TConditionCC
      verifyTempStore.setInsideCCToStore(flowCCData)
    }, 100)
  }

  verifyTempStore.setCcScopeDrawVisible(true)
}

const removeCcPersonTag = (tagName: string) => {
  verifyTempStore.nowSettingCCId(props.node_data.id)

  verifyTempStore.removeCcTagFromInput(tagName, verifyTempStore.isOutSideCC)

  if (!verifyTempStore.isOutSideCC) {
    flowStore.setConditionCCData(
      verifyTempStore.getConditionCCFooterTagList(),
      verifyTempStore.step === 4
    )
  }
  verifyTempStore.updateMaxStatus()
}
const clearCCSelected = () => {
  if (isOutSideCC.value) {
    verifyTempStore.clearCCSelected()
  } else {
    verifyTempStore.clearConditionCCSelected()
    verifyTempStore.nowSettingCCId(props.node_data.id)
    flowStore.setConditionCCData(
      verifyTempStore.getConditionCCFooterTagList(),
      verifyTempStore.step === 4
    )
  }
  verifyTempStore.updateMaxStatus()
}

const cardActive = computed(() => {
  if (isOutSideCC.value) {
    return verifyTempStore.activeCardName == 'cc'
  } else {
    return verifyTempStore.activeCardName == props.node_data.data.id
  }
})

const selectModelValue = computed(() => {
  if (isOutSideCC.value) {
    return verifyTempStore.ccPersonNameList
  } else {
    return flowStore.getNowConditionCCObj(
      props.node_data.data.id,
      verifyTempStore.step === 4
    )
  }
})
const delFlowITem = () => {
  flowStore.deleteFlowITem(props.node_data.data.id, verifyTempStore.step === 4)
}
const addFlowInConditionFun = (isBottom: boolean = false) => {
  flowStore.addFlowInCondition(
    props.node_data.data.id,
    isBottom,
    verifyTempStore.step === 4
  )
}
</script>

<template>
  <div class="arrow-card">
    <div class="cc-arrow" v-if="isOutSideCC">
      <div class="line"></div>
      <div class="arrow"></div>
    </div>

    <DefaultNodeCard
      card_type="cc"
      @openDrawerEmit="openDrawerFun"
      :active_card="cardActive"
      :is_condition_cc="!isOutSideCC"
      :show_cc_pre_btn="onlyCcInCondition"
      @removeVerifyCardEmit="delFlowITem"
      @addFlowInConditionEmit="addFlowInConditionFun"
    >
      <template #body>
        <div class="text-arrow" v-if="selectModelValue.length == 0">
          <p>請選擇</p>
          <el-icon class="cursor-pointer"><ArrowRight /></el-icon>
        </div>
        <el-select
          v-else
          class="card-select"
          multiple
          collapse-tags
          filterable
          remote
          placeholder="请选择"
          collapse-tags-tooltip
          :max-collapse-tags="2"
          :reserve-keyword="false"
          clearable
          @click="openDrawerFun"
          :model-value="selectModelValue"
          @remove-tag="removeCcPersonTag"
          @clear="clearCCSelected"
        />
      </template>
    </DefaultNodeCard>
  </div>
</template>

<style lang="scss" scoped>
.arrow-card {
  @apply flex items-center;
  @apply bg-bg border-none;
  @apply shadow-none;

  .cc-arrow {
    @apply w-16 h-24;
    @apply flex  justify-between items-center;

    .line {
      @apply w-full h-px border border-dashed border-secondary-dark/20;
    }

    .arrow {
      width: 0;
      height: 0;
      border-top: 6px solid transparent;
      border-bottom: 6px solid transparent;
      border-left: 12px solid rgba(112, 112, 112, 0.2);
    }
  }
}
</style>
