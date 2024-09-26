<script setup lang="ts">
import AppUtils from '@/utils/appUtils'
import { TFlowITem, TFlowNode, TStep3Verify } from '@/types/apiTypes'
import { ArrowRight } from '@element-plus/icons-vue'
import { flowStore } from '@/stores/flowStore'
import { verifyTempStore } from '@/stores/verifyTemplateStore'
import { ENDPOINT, MEETPOINT } from '@/const/appConst'

const props = defineProps({
  node_data: {
    type: Object,
    default: {}
  }
})

const propData = computed(() => {
  if (JSON.stringify(props.node_data) !== '{}') {
    return AppUtils.deepCloneData(props.node_data) as TFlowNode<TStep3Verify>
  }
})
const emits = defineEmits(['openDrawEmit'])

const openDrawerFun = () => {
  const cloneData = AppUtils.deepCloneData(propData.value!.data) as TStep3Verify
  verifyTempStore.setActiveCard(props.node_data.id)
  verifyTempStore.setNowSettingFlowItem(
    cloneData,
    verifyTempStore.isWriteOffDraw
  )

  emits('openDrawEmit')
}

const getVerifyOptionName = (verifyItem: TStep3Verify) => {
  const flow = verifyItem.verifyFlow
  switch (flow) {
    case '0':
      return '连续多级主管'
    case '1':
      return '主管'
    case '2':
      return '指定成员'
    case '3':
      return '指定岗位'
    case '4':
      if (verifyItem.selfOption == '' || !verifyItem.selfOption) {
        return '发起人隶属部门成员'
      }
      return verifyItem.selfOption == 'asign'
        ? '指定成员'
        : '发起人隶属部门成员'
    case '6':
      return '发起人本人'
    default:
      return '请选择'
  }
}
const showArrow = computed(() => {
  if (['', '0', '1', '3', '6'].includes(propData.value!.data.verifyFlow)) {
    return true
  } else {
    return (
      ['2', '4'].includes(propData.value!.data.verifyFlow) &&
      propData.value!.data.verifyPeople.length == 0
    )
  }
})

const doRemoveFlowItemTag = (tagName: string) => {
  let afterSetFlowData: TStep3Verify
  const cloneData = AppUtils.deepCloneData(propData.value!.data) as TStep3Verify

  const afterFilterPeopleList = cloneData.verifyPeople!.filter(
    user => user.userName !== tagName
  )
  afterSetFlowData = {
    ...cloneData,
    verifyPeople: afterFilterPeopleList,
    verifyNameList: afterFilterPeopleList.map(user => user.userName) as string[]
  }

  flowStore.updateCloneFlowData(afterSetFlowData, verifyTempStore.step === 4)
}
const clearFlowItemSelected = () => {
  let afterSetFlowData: TStep3Verify
  const cloneData = AppUtils.deepCloneData(propData.value!.data) as TStep3Verify
  afterSetFlowData = {
    ...cloneData,
    verifyPeople: [],
    verifyNameList: []
  }
  flowStore.updateCloneFlowData(afterSetFlowData, verifyTempStore.step === 4)
}

const cardActive = computed(() => {
  return verifyTempStore.activeCardName == propData.value!.data.id
})

const delFlowITem = () => {
  flowStore.deleteFlowITem(propData.value!.data.id!, verifyTempStore.step === 4)
}
const isWriteOff = computed(() => {
  return verifyTempStore.step === 4
})
const addFlowInConditionFun = (isBottom: boolean = false) => {
  flowStore.addFlowInCondition(
    propData.value!.data.id!,
    isBottom,
    isWriteOff.value
  )
}
const showFlowBottomBtn = computed(() => {
  const itemId = propData.value!.data.id!
  const flowPathList = itemId.split('-').map(str => Number(str)) as number[]
  let cloneList
  if (!isWriteOff.value) {
    cloneList = AppUtils.deepCloneData(flowStore.storeFlowList) as TFlowITem[][]
  } else {
    cloneList = AppUtils.deepCloneData(
      flowStore.storeWriteOffFlowList
    ) as TFlowITem[][]
  }

  if (cloneList[flowPathList[0]][flowPathList[1]].isCondition!) {
    const condVFlow = cloneList[flowPathList[0]][flowPathList[1]].verifyFlowList

    let nextFlowCard =
      cloneList[flowPathList[0]][flowPathList[1]].verifyFlowList[
        flowPathList[2] + 1
      ]
    const nextCC = nextFlowCard && nextFlowCard.verifyFlow == 'cc'
    return (
      cloneList[flowPathList[0]][flowPathList[1]].verifyFlowList[
        condVFlow.length - 1
      ].id == itemId || nextCC
    )
  } else {
    if (cloneList[flowPathList[0] + 1]) {
      return [MEETPOINT, ENDPOINT].includes(
        cloneList[flowPathList[0] + 1][0].layer
      )
    }
  }
})

const isConditionEnd = computed(() => {
  const itemId = propData.value!.data.id!
  const flowPathList = itemId.split('-').map(str => Number(str)) as number[]
  let cloneList
  if (!isWriteOff.value) {
    cloneList = AppUtils.deepCloneData(flowStore.storeFlowList) as TFlowITem[][]
  } else {
    cloneList = AppUtils.deepCloneData(
      flowStore.storeWriteOffFlowList
    ) as TFlowITem[][]
  }
  if (cloneList[flowPathList[0]][flowPathList[1]].isCondition!) {
    const condVFlow = cloneList[flowPathList[0]][flowPathList[1]].verifyFlowList
    return (
      cloneList[flowPathList[0]][flowPathList[1]].verifyFlowList[
        condVFlow.length - 1
      ].id === itemId
    )
  } else {
    return false
  }
})
const isOutSideFlow = computed(() => {
  const itemId = propData.value!.data.id!
  const flowPathList = itemId.split('-').map(str => Number(str)) as number[]
  let cloneList
  if (!isWriteOff.value) {
    cloneList = AppUtils.deepCloneData(flowStore.storeFlowList) as TFlowITem[][]
  } else {
    cloneList = AppUtils.deepCloneData(
      flowStore.storeWriteOffFlowList
    ) as TFlowITem[][]
  }
  return !cloneList[flowPathList[0]][flowPathList[1]].isCondition
})
const nextIsCc = computed(() => {
  const itemId = propData.value!.data.id!
  const flowPathList = itemId.split('-').map(str => Number(str)) as number[]
  let cloneList
  if (!isWriteOff.value) {
    cloneList = AppUtils.deepCloneData(flowStore.storeFlowList) as TFlowITem[][]
  } else {
    cloneList = AppUtils.deepCloneData(
      flowStore.storeWriteOffFlowList
    ) as TFlowITem[][]
  }
  if (cloneList[flowPathList[0]][flowPathList[1]].isCondition!) {
    const condVFlow = cloneList[flowPathList[0]][flowPathList[1]].verifyFlowList
    return (
      condVFlow[flowPathList[2] + 1] &&
      condVFlow[flowPathList[2] + 1].verifyFlow == 'cc'
    )
  }
  return false
})

const isShortFlow = computed(() => {
  const itemId = propData.value!.data.id!
  const flowPathList = itemId.split('-').map(str => Number(str)) as number[]
  let cloneList
  if (!isWriteOff.value) {
    cloneList = AppUtils.deepCloneData(flowStore.storeFlowList) as TFlowITem[][]
  } else {
    cloneList = AppUtils.deepCloneData(
      flowStore.storeWriteOffFlowList
    ) as TFlowITem[][]
  }
  let isShort = false
  if (cloneList[flowPathList[0]] && cloneList[flowPathList[0]].length > 1) {
    const condVFlowLen =
      cloneList[flowPathList[0]][flowPathList[1]].verifyFlowList.length

    for (let i = 0; i < cloneList[flowPathList[0]].length; i++) {
      if (cloneList[flowPathList[0]][i].verifyFlowList.length > condVFlowLen) {
        isShort = true
        break
      }
    }
  }

  return isShort
})

const addCCInConditionFun = () => {
  flowStore.addCCInCondition(
    propData.value!.data.id!,
    verifyTempStore.step === 4
  )
}
</script>

<template>
  <DefaultNodeCard
    :flow_index="propData.data.indexInFlow"
    :show_flow_bottom_btn="showFlowBottomBtn"
    :active_card="cardActive"
    :radio_status="propData.data.verifyFlow"
    :is_condition_end="isConditionEnd"
    :out_of_condition="isOutSideFlow"
    :next_cc="nextIsCc"
    :is_short_flow="isShortFlow"
    @openDrawerEmit="openDrawerFun"
    @removeVerifyCardEmit="delFlowITem"
    @addFlowInConditionEmit="addFlowInConditionFun"
    @addCCInConditionEmit="addCCInConditionFun"
  >
    <template #body>
      <div class="text-arrow" v-if="showArrow">
        <p>{{ getVerifyOptionName(propData.data) }}</p>
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
        :model-value="propData.data.verifyNameList"
        @click="openDrawerFun"
        collapse-tags-tooltip
        :max-collapse-tags="1"
        :reserve-keyword="false"
        clearable
        @remove-tag="doRemoveFlowItemTag"
        @clear="clearFlowItemSelected"
      />
    </template>
  </DefaultNodeCard>
</template>

<style lang="scss" scoped></style>
