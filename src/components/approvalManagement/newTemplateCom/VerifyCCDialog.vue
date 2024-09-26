<script setup lang="ts">
import { reactive } from '@vue/reactivity'
import { TGetUserTree, TVerifyPeoples } from '@/types/apiTypes'
import BaseDialog from '@/components/baseCom/BaseDialog.vue'
import NewRightTabMember from '@/components/approvalManagement/newTemplateCom/NewRightTabMember.vue'
import NewLeftTabDepartment from '@/components/approvalManagement/newTemplateCom/NewLeftTabDepartment.vue'
import { verifyTempStore } from '@/stores/verifyTemplateStore'
import { TFooter } from '@/utils/setTreeHelper'
import AppUtils from '@/utils/appUtils'

const props = defineProps({
  dialogVisible: {
    type: Boolean,
    default: false
  }
})

const state = reactive({
  activeName: 'member',
  checkMembers: [] as TFooter[],
  delTagID: '',
  delTagName: '',
  pureDeptCheck: [] as TFooter[],
  pureMemberCheck: [] as TFooter[],
  purePostCheck: [] as TFooter[],
  afterMounted: false
})

watch(
  () => props.dialogVisible,
  async () => {
    if (props.dialogVisible) {
      await verifyTempStore.getTreeData()
      if (verifyTempStore.isOutSideCC) {
        state.pureDeptCheck = AppUtils.deepCloneData(verifyTempStore.ccDeptList)
        state.pureMemberCheck = AppUtils.deepCloneData(
          verifyTempStore.ccPersonList
        )
        state.purePostCheck = AppUtils.deepCloneData(verifyTempStore.ccPostList)
      } else {
        state.pureDeptCheck = AppUtils.deepCloneData(
          verifyTempStore.conditionCcDeptList
        )
        state.pureMemberCheck = AppUtils.deepCloneData(
          verifyTempStore.conditionCcPersonList
        )
        state.purePostCheck = AppUtils.deepCloneData(
          verifyTempStore.conditionCcPostList
        )
      }

      setTimeout(() => {
        state.afterMounted = true
      }, 200)
    } else {
      state.afterMounted = false
    }
    setCheckMembers()
  }
)

const emits = defineEmits(['submitEmit', 'cancelEmit'])

const doSubmitFun = () => {
  verifyTempStore.setCCListToStore(
    state.checkMembers,
    verifyTempStore.isOutSideCC
  )

  emits('submitEmit')
}

const doCancelFun = () => {
  const pureCheckList = [
    ...state.pureDeptCheck,
    ...state.pureMemberCheck,
    ...state.purePostCheck
  ]
  verifyTempStore.setCCListToStore(pureCheckList, verifyTempStore.isOutSideCC)

  emits('cancelEmit')
}

const handleTagClose = (tag: TFooter) => {
  state.delTagID = tag.id
  state.delTagName = tag.label
  const cloneTags = AppUtils.deepCloneData(state.checkMembers) as TFooter[]

  const afterFilterSet = cloneTags.filter(tab => tab.id !== tag.id)

  verifyTempStore.setCCListToStore(afterFilterSet, verifyTempStore.isOutSideCC)

  setCheckMembers()
}

const setFooterMembers = (memberList: TVerifyPeoples[]) => {
  const storeTypeMemberList = memberList.map(_ => {
    return {
      id: _.userId,
      label: _.userName,
      tabName: 'member'
    }
  }) as TFooter[]

  if (verifyTempStore.isOutSideCC) {
    verifyTempStore.setStoreCCMember(storeTypeMemberList)
  } else {
    verifyTempStore.setMemberCCIntoStore(storeTypeMemberList)
  }
  setCheckMembers()
}
const setCheckMembers = () => {
  state.checkMembers = verifyTempStore.isOutSideCC
    ? verifyTempStore.getCCFooterTagList()
    : verifyTempStore.getConditionCCFooterTagList()

  if (state.afterMounted) {
    const setDisabled = verifyTempStore.ccLimitIsMax
    if (setDisabled) {
      ElMessage.warning('抄送对象已达上限')
    }
  }
}
const setFooterDepart = (
  selectDepart: TGetUserTree[],
  isSearching: boolean,
  uncheckDept: TGetUserTree
) => {
  let noSearchSelected = [] as TFooter[]
  let searchingTreeTag = [] as TFooter[]
  if (isSearching) {
    searchingTreeTag = selectDepart.map(_ => {
      return {
        id: _.id,
        label: _.label,
        tabName: 'dept'
      }
    })
  } else {
    noSearchSelected = selectDepart.map(_ => {
      return {
        id: _.id,
        label: _.label,
        tabName: 'dept'
      }
    })
  }
  let deptFooterTags = verifyTempStore.isOutSideCC
    ? verifyTempStore.ccDeptList
    : verifyTempStore.conditionCcDeptList
  if (noSearchSelected.length > 0) {
    deptFooterTags = noSearchSelected
  }
  if (uncheckDept) {
    deptFooterTags = deptFooterTags.filter(_ => _.id != uncheckDept.id)
  }
  const fullDeptList = [...deptFooterTags, ...searchingTreeTag]
  const setObj = new Set()
  const noRepeDeptList = fullDeptList.filter(itm =>
    !setObj.has(itm.id) ? setObj.add(itm.id) : false
  )
  if (verifyTempStore.isOutSideCC) {
    verifyTempStore.setStoreCCDept(noRepeDeptList)
  } else {
    verifyTempStore.setDeptCCIntoStore(noRepeDeptList)
  }
  setCheckMembers()
}
const setFooterPosts = (postList: TFooter[]) => {
  if (verifyTempStore.isOutSideCC) {
    verifyTempStore.setStoreCCPost(postList)
  } else {
    verifyTempStore.setPostCCIntoStore(postList)
  }
  setCheckMembers()
}
</script>

<template>
  <BaseDialog
    :dialogVisible="props.dialogVisible"
    dialogTitle="抄送人"
    @submitDialogEmit="doSubmitFun"
    @cancelDialogEmit="doCancelFun"
    width="60%"
    :needDestroy="true"
  >
    <div class="header-tab">
      <el-tabs v-model="state.activeName">
        <el-tab-pane label="指定部门" name="department">
          <NewLeftTabDepartment
            :is_cc="true"
            :un_checked_dept="state.delTagID"
            @selectDepartEmit="setFooterDepart"
            search_placeholder="输入部门搜寻"
          />
        </el-tab-pane>

        <el-tab-pane label="指定成员" name="member">
          <NewRightTabMember
            use_dialog_name="cc"
            :un_checked_user="state.delTagName"
            @checkMemberEmit="setFooterMembers"
          />
        </el-tab-pane>
        <el-tab-pane label="指定岗位" name="post">
          <PostTab
            :is_cc="true"
            :un_checked_post="state.delTagName"
            @checkPostEmit="setFooterPosts"
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
