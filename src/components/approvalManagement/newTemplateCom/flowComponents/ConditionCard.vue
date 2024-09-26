<script setup lang="ts">
import AppUtils from '@/utils/appUtils'
import { TFlowITem, TFlowNode } from '@/types/apiTypes'
import { flowStore } from '@/stores/flowStore'
import { verifyTempStore } from '@/stores/verifyTemplateStore'
import { ECondition } from '@/const/appConst'

const props = defineProps({
  node_data: {
    type: Object,
    default: {}
  }
})
const propData = computed(() => {
  if (JSON.stringify(props.node_data) !== '{}') {
    return AppUtils.deepCloneData(props.node_data) as TFlowNode<TFlowITem>
  }
})

const deleteConditionFun = () => {
  flowStore.delConditionFlow(propData.value!.id, verifyTempStore.step === 4)
}

const emits = defineEmits(['openConditionDrawEmit'])
const openDrawerFun = () => {
  if (propData.value!.data.isElse) return
  flowStore.nowSettingCondition(propData.value!.id, verifyTempStore.step === 4)
  verifyTempStore.setActiveCard(propData.value!.id)

  emits('openConditionDrawEmit')
}

const cardActive = computed(() => {
  return verifyTempStore.activeCardName == propData.value!.data.id
})
const conditionValue = computed(() => {
  const cloneData = AppUtils.deepCloneData(propData.value!.data) as TFlowITem
  const showLabelType = ['feeType', 'belongDept', 'useDept']
  if (showLabelType.includes(cloneData.pathType!)) {
    return JSON.parse(cloneData.value).label
  }

  if (cloneData.pathType == 'checkbox') {
    return JSON.parse(cloneData.value).join(',')
  }
  if (cloneData.pathType == 'platform') {
    const arrValue = JSON.parse(cloneData.value) as {
      label: string
      value: string
    }[]
    if (arrValue) {
      const nameList = arrValue.map(item => item.label)
      return nameList.join(',')
    }
  }
  return cloneData.value
})
const showAddFlowBtn = computed(() => {
  const cloneData = AppUtils.deepCloneData(propData.value!.data) as TFlowITem
  return cloneData.verifyFlowList.length == 0
})
const addFlowInConditionFun = (isBottom: boolean = false) => {
  flowStore.addFlowInCondition(
    propData.value!.data.id!,
    isBottom,
    verifyTempStore.step == 4
  )
}
const addCCInConditionFun = () => {
  flowStore.addCCInCondition(
    propData.value!.data.id!,
    verifyTempStore.step === 4
  )
}
</script>

<template>
  <DefaultNodeCard
    card_type="condition"
    :condition_ind="propData.data.xIndex"
    :priority_ind="propData.data.priority"
    :is_else="propData.data.isElse"
    :flow_index="propData.data.indexInFlow"
    :is_condition="true"
    :active_card="cardActive"
    :show_flow_bottom_btn="showAddFlowBtn"
    :is_condition_end="showAddFlowBtn"
    @deleteConditionEmit="deleteConditionFun"
    @openDrawerEmit="openDrawerFun"
    @addFlowInConditionEmit="addFlowInConditionFun"
    @addCCInConditionEmit="addCCInConditionFun"
  >
    <template #body>
      <p class="condition-else" v-if="propData.data.isElse">
        未满足其他条件时，将进入默认流程
      </p>

      <div v-else class="text-arrow">
        <p v-if="!propData.data.pathName || propData.data.pathName == ''">
          请设置条件
        </p>

        <div class="condition-title" v-else>
          <p>
            当 <span class="mx-px"></span>{{ propData.data.pathName }}
            <span class="mx-px"></span
            >{{ ECondition[propData.data.condition] }}
            <span class="mx-px"></span>{{ conditionValue }}
          </p>
        </div>
        <el-icon class="cursor-pointer"><ArrowRight /></el-icon>
      </div>
    </template>
  </DefaultNodeCard>
</template>

<style lang="scss" scoped>
.condition-else {
  @apply text-left cursor-auto leading-8;
}
.condition-title {
  @apply flex items-center;

  p {
    @apply w-52 text-left;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
