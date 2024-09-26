<script setup lang="ts">
import AppUtils from '@/utils/appUtils'
import { verifyTempStore } from '@/stores/verifyTemplateStore'
import { TFooter } from '@/utils/setTreeHelper'

const props = defineProps({
  node_data: {
    type: Object,
    default: {}
  },
  is_write_off: {
    type: Boolean,
    default: false
  }
})

const state = reactive({
  activeCreate: false
})
const openDrawerFun = () => {
  const cloneData = AppUtils.deepCloneData(verifyTempStore.getFooterTagList())
  verifyTempStore.setScopeListToStore(cloneData)
  verifyTempStore.setPureScopeListToStore(cloneData)
  verifyTempStore.setCcScopeDrawVisible(true)
  verifyTempStore.setDialogTitle('发起人')
  verifyTempStore.setActiveCard('scope')
}

const doRemoveScopeTag = (tagName: string) => {
  verifyTempStore.removeScopeTagFromInput(tagName)
}
const clearScopeSelected = () => {
  verifyTempStore.clearScopeSelected()
}

const cardActive = computed(() => {
  return verifyTempStore.activeCardName == 'scope'
})
</script>

<template>
  <DefaultNodeCard
    card_type="start"
    @openDrawerEmit="openDrawerFun"
    :active_card="cardActive"
    :is_write_off="is_write_off"
  >
    <template #body>
      <template v-if="!is_write_off">
        <div
          class="text-arrow"
          v-if="verifyTempStore.scopeNameList.length == 0"
        >
          <p>請選擇</p>
          <el-icon class="cursor-pointer"><ArrowRight /></el-icon>
        </div>
        <el-select
          v-else
          :model-value="verifyTempStore.scopeNameList"
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
          @remove-tag="doRemoveScopeTag"
          @clear="clearScopeSelected"
        />
      </template>

      <p class="write-off_scope" v-if="is_write_off">提交核销人与发起人相同</p>
    </template>
  </DefaultNodeCard>
</template>

<style lang="scss" scoped>
.write-off_scope {
  @apply text-left text-text-subLabel;
}
</style>
