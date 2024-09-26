<script setup lang="ts">
import BaseDrawer from '@/components/baseCom/BaseDrawer.vue'
import { verifyTempStore } from '@/stores/verifyTemplateStore'
import { flowStore } from '@/stores/flowStore'

const props = defineProps({
  draw_visible: {
    type: Boolean,
    default: false
  },
  draw_name: {
    type: String,
    default: '发起人'
  }
})

const state = reactive({
  ccDialogVisible: false,
  scopeDialogVisible: false
})
const emits = defineEmits(['saveDrawEmit', 'cancelDrawEmit'])
const closeDrawer = () => {
  emits('cancelDrawEmit')

  setTimeout(() => {
    verifyTempStore.clearConditionCCSelected()
  }, 200)
}
const doSaveDrawer = () => {
  emits('saveDrawEmit')
  if (!verifyTempStore.isOutSideCC && props.draw_name == '抄送人') {
    flowStore.setConditionCCData(
      verifyTempStore.getConditionCCFooterTagList(),
      verifyTempStore.step === 4
    )
  }
}

const clearScopeDialogList = () => {
  verifyTempStore.clearScopeSelected()
}
const doRemoveScopeTag = (tagName: string) => {
  verifyTempStore.removeScopeTagFromInput(tagName)
}

const clearCcPersonDialogList = () => {
  verifyTempStore.setCCListToStore([], verifyTempStore.isOutSideCC)
}
const removeCcPersonTag = (tagName: string) => {
  verifyTempStore.removeCcTagFromInput(tagName, verifyTempStore.isOutSideCC)
}

const openDialog = (dialogName: string) => {
  verifyTempStore.setInputReadonly()
  checkTreeDataInStore().then(() => {
    switch (dialogName) {
      case 'cc':
        state.ccDialogVisible = true
        verifyTempStore.setDialogTitle('抄送人')
        break
      case 'scope':
        state.scopeDialogVisible = true
        verifyTempStore.setDialogTitle('发起人')
        break
    }
  })
}

const checkTreeDataInStore = async () => {
  if (verifyTempStore.treeData.length == 0) {
    await verifyTempStore.getTreeData()
  }
}

const ccPersonModel = computed(() => {
  return verifyTempStore.isOutSideCC
    ? verifyTempStore.ccPersonNameList
    : verifyTempStore.ccPersonInConditionNameList
})
</script>

<template>
  <BaseDrawer
    :drawVisible="props.draw_visible"
    :draw_name="props.draw_name"
    @cancelEmit="closeDrawer"
    @saveEmit="doSaveDrawer"
  >
    <div class="input-box" v-if="props.draw_name == '发起人'">
      <div class="label">适用范围</div>
      <el-select
        class="hidden-input"
        multiple
        filterable
        remote
        clearable
        @clear="clearScopeDialogList"
        @remove-tag="doRemoveScopeTag"
        placeholder="请选择"
        @click="openDialog('scope')"
        :model-value="verifyTempStore.scopeNameList"
      />
      <div class="hint">如没有选择指定部门，系统将自动选择全部</div>
    </div>

    <div class="input-box" disabled v-if="props.draw_name == '抄送人'">
      <div class="label">适用范围</div>
      <el-select
        class="hidden-input"
        multiple
        filterable
        remote
        clearable
        @clear="clearCcPersonDialogList"
        @remove-tag="removeCcPersonTag"
        placeholder="请选择"
        @click="openDialog('cc')"
        :model-value="ccPersonModel"
      />
    </div>
  </BaseDrawer>

  <ScopeDialog
    :dialogVisible="state.scopeDialogVisible"
    @cancelEmit="state.scopeDialogVisible = false"
    @submitEmit="state.scopeDialogVisible = false"
  />

  <VerifyCCDialog
    :dialogVisible="state.ccDialogVisible"
    @cancelEmit="state.ccDialogVisible = false"
    @submitEmit="state.ccDialogVisible = false"
  />
</template>

<style lang="scss" scoped>
.input-box {
  @apply flex flex-col items-start;

  .label {
    @apply mb-4 text-sm;
  }
  .el-select {
    @apply w-2/3;
  }
  .hint {
    @apply text-sm mt-2;
  }
  .verify-radio {
    @apply border-b-2 pb-4 w-full;
  }
}
.hidden-input {
  ::v-deep() {
    .el-select__input {
      @apply hidden;
    }
  }
}
</style>
