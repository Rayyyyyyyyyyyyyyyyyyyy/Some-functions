<script setup lang="ts">
import { reactive } from '@vue/reactivity'
import { TGetUserTree } from '@/types/apiTypes'
import { approvalProps } from '@/const/appConst'
import { Search } from '@element-plus/icons-vue'
import { TFooter, treeHelper } from '@/utils/setTreeHelper'
import { verifyTempStore } from '@/stores/verifyTemplateStore'
import AppUtils from '@/utils/appUtils'
import { get } from 'lodash'
import { flowStore } from '@/stores/flowStore'

const props = defineProps({
  un_checked_dept: {
    type: String,
    default: ''
  },
  is_cc: {
    type: Boolean,
    default: false
  },
  search_placeholder: {
    type: String,
    default: '输入模糊搜索'
  },
  is_condition: {
    type: Boolean,
    default: false
  }
})
const treeRef = ref()
const state = reactive({
  treeData: [] as TGetUserTree[],
  deptSearchInput: ''
})

onMounted(() => {
  setTreeDataToState()
  setTreeCheck()
})
const setTreeDataToState = () => {
  const setDisabled = verifyTempStore.ccLimitIsMax
  const cloneList = AppUtils.deepCloneData(verifyTempStore.treeData)
  state.treeData = treeHelper.setTreeDataDisabled(cloneList, setDisabled)
}
const setTreeCheck = () => {
  let deptList: TFooter[]
  if (props.is_cc) {
    if (verifyTempStore.isOutSideCC) {
      deptList = AppUtils.deepCloneData(verifyTempStore.ccDeptList) as TFooter[]
    } else {
      deptList = AppUtils.deepCloneData(
        verifyTempStore.conditionCcDeptList
      ) as TFooter[]
    }
  } else {
    if (props.is_condition) {
      deptList = AppUtils.deepCloneData(flowStore.selectTreeDept)
    } else {
      deptList = AppUtils.deepCloneData(
        verifyTempStore.scopeDeptList
      ) as TFooter[]
    }
  }
  if (deptList.length > 0) {
    treeRef.value.setCheckedKeys([...deptList.map(_ => _.id)], false)
  } else {
    treeRef.value.setCheckedKeys([], false)
  }
}

watch(
  () => props.un_checked_dept,
  () => {
    setTreeDataToState()
    setTreeCheck()
  }
)

const emits = defineEmits(['selectDepartEmit'])

const handleCheckChange = (nodeData: TGetUserTree, isChecked: boolean) => {
  let selectDepart = treeRef.value.getCheckedNodes()
  if (props.is_condition) {
    if (!isChecked) {
      emits('selectDepartEmit', selectDepart, nodeData)
    } else {
      emits('selectDepartEmit', selectDepart, null)
    }
  } else {
    const doingSearch = state.deptSearchInput != ''

    if (!isChecked) {
      emits('selectDepartEmit', selectDepart, doingSearch, nodeData)
    } else {
      emits('selectDepartEmit', selectDepart, doingSearch, null)
    }
  }
  setTreeDataToState()
  setTreeCheck()
}

const doSearchTree = (keyword: string) => {
  let defaultTree = AppUtils.deepCloneData(verifyTempStore.fullTreeData)
  state.treeData = treeHelper.approvalFilterTree(defaultTree, keyword)
  setTreeCheck()
  if (state.deptSearchInput.length == 0) {
    state.treeData = defaultTree
  }
}
</script>

<template>
  <div class="option-body">
    <div class="left-depart">
      <el-input
        class="search-input"
        clearable
        v-model="state.deptSearchInput"
        :placeholder="search_placeholder"
        :prefix-icon="Search"
        @input="doSearchTree"
      />
      <el-tree
        ref="treeRef"
        :data="state.treeData"
        show-checkbox
        node-key="id"
        :props="approvalProps"
        @check-change="handleCheckChange"
        :check-strictly="true"
        :default-expand-all="true"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.option-body {
  @apply flex items-center h-80 w-full;
  @apply border-t-2 pt-4;

  .left-depart {
    @apply w-full;
  }
}

.el-checkbox + .el-checkbox {
  @apply mt-2;
}
</style>
