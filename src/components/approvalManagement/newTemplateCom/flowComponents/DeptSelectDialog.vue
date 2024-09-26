<script setup lang="ts">
import { reactive } from '@vue/reactivity'
import { TGetUserTree, TVerifyPeoples } from '@/types/apiTypes'
import BaseDialog from '@/components/baseCom/BaseDialog.vue'
import NewRightTabMember from '@/components/approvalManagement/newTemplateCom/NewRightTabMember.vue'
import NewLeftTabDepartment from '@/components/approvalManagement/newTemplateCom/NewLeftTabDepartment.vue'
import { verifyTempStore } from '@/stores/verifyTemplateStore'
import { TFooter, treeHelper } from '@/utils/setTreeHelper'
import AppUtils from '@/utils/appUtils'
import { flowStore } from '@/stores/flowStore'

const props = defineProps({
  dialogVisible: {
    type: Boolean,
    default: false
  },
  check_data: {
    type: Object,
    default: () => {}
  }
})

const state = reactive({
  activeName: 'department',
  checkMembers: [] as TFooter[],
  delTagID: '',
  afterMounted: false
})

watch(
  () => props.dialogVisible,
  async () => {
    if (props.dialogVisible) {
      await verifyTempStore.getTreeData()
      if (JSON.stringify(props.check_data) !== '{}') {
        const cloneData = AppUtils.deepCloneData(props.check_data) as TFooter
        setCheckMembers([cloneData])
      } else {
        setCheckMembers()
      }

      setTimeout(() => {
        state.afterMounted = true
      }, 200)
    } else {
      state.afterMounted = false
    }
  }
)

const emits = defineEmits(['submitEmit', 'cancelEmit'])

const doSubmitFun = () => {
  emits('submitEmit', state.checkMembers)
}

const doCancelFun = () => {
  setCheckMembers([])
  state.delTagID = ''

  emits('cancelEmit')
}

const handleTagClose = (tag: TFooter) => {
  state.delTagID = tag.id
  setCheckMembers([])
}

const setCheckMembers = (selectDept: TFooter[] = []) => {
  if (selectDept.length > 0) {
    if (selectDept.length == 1) {
      state.checkMembers = selectDept
      flowStore.conditionDeptTreeSelect(selectDept)
    } else {
      const deptFooterTags = AppUtils.deepCloneData(flowStore.selectTreeDept)
      const delID = deptFooterTags[0].id
      const cloneList = AppUtils.deepCloneData(selectDept) as TFooter[]
      const checkDept = cloneList.filter(item => item.id !== delID)
      flowStore.conditionDeptTreeSelect(checkDept)
      state.checkMembers = checkDept
    }
  } else {
    state.checkMembers = []
    flowStore.conditionDeptTreeSelect([])
  }
}
const setFooterDepart = (selectDepartList: TGetUserTree[]) => {
  const footTypeList = selectDepartList.map(_ => {
    return {
      id: _.id,
      label: _.label,
      tabName: 'dept'
    }
  })

  setCheckMembers(footTypeList)
}
</script>

<template>
  <BaseDialog
    :dialogVisible="props.dialogVisible"
    dialogTitle="请选择"
    @submitDialogEmit="doSubmitFun"
    @cancelDialogEmit="doCancelFun"
    width="60%"
    :needDestroy="true"
  >
    <div class="header-tab">
      <el-tabs v-model="state.activeName">
        <el-tab-pane label="指定部门" name="department">
          <NewLeftTabDepartment
            :is_condition="true"
            :un_checked_dept="state.delTagID"
            @selectDepartEmit="setFooterDepart"
            search_placeholder="输入部门搜寻"
          />
        </el-tab-pane>
      </el-tabs>
    </div>

    <div class="option-footer">
      <div class="title">已选择：</div>
      <div class="footer-tag">
        <el-tag
          v-for="tag in state.checkMembers"
          :key="tag"
          class="ml-2 mt-2"
          type="info"
          closable
          :disable-transitions="false"
          @close="handleTagClose(tag)"
        >
          {{ tag.label }}
        </el-tag>
      </div>
    </div>
  </BaseDialog>
</template>

<style lang="scss" scoped>
.header-tab {
  margin-top: -30px;
}

::v-deep() {
  .el-tabs {
    &__header {
      @apply flex justify-center;
    }
  }
}
</style>
