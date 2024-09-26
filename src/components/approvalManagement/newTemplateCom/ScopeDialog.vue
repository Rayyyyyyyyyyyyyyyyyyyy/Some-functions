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
  activeName: 'department',
  checkMembers: [] as TFooter[],
  delTagID: '',
  delTagName: '',
  pureDeptCheck: [] as TFooter[],
  pureMemberCheck: [] as TFooter[],
  purePostCheck: [] as TFooter[]
})

watch(
  () => props.dialogVisible,
  async () => {
    if (props.dialogVisible) {
      await verifyTempStore.getTreeData()

      if (verifyTempStore.scopeDeptList.length > 0) {
        state.pureDeptCheck = AppUtils.deepCloneData(
          verifyTempStore.scopeDeptList
        )
      }
      if (verifyTempStore.scopeMemberList.length > 0) {
        state.pureMemberCheck = AppUtils.deepCloneData(
          verifyTempStore.scopeMemberList
        )
      }
      if (verifyTempStore.scopePostList.length > 0) {
        state.purePostCheck = AppUtils.deepCloneData(
          verifyTempStore.scopePostList
        )
      }
    }

    setCheckMembers()
  }
)

const setCheckMembers = () => {
  state.checkMembers = verifyTempStore.getFooterTagList()
}
const emits = defineEmits(['submitEmit', 'cancelEmit'])

const doSubmitFun = () => {
  verifyTempStore.setScopeListToStore(state.checkMembers)

  emits('submitEmit')
}

const doCancelFun = () => {
  const pureCheckList = [
    ...state.pureDeptCheck,
    ...state.pureMemberCheck,
    ...state.purePostCheck
  ]
  verifyTempStore.setScopeListToStore(pureCheckList)
  emits('cancelEmit')
}

const handleTagClose = (tag: TFooter) => {
  state.delTagID = tag.id
  state.delTagName = tag.label
  const cloneTags = AppUtils.deepCloneData(state.checkMembers) as TFooter[]
  const afterFilterSet = cloneTags.filter(tab => tab.id !== tag.id)

  verifyTempStore.setScopeListToStore(afterFilterSet)
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
  verifyTempStore.setStoreScopeMember(storeTypeMemberList)
  setCheckMembers()
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
  let deptFooterTags = verifyTempStore.scopeDeptList
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
  verifyTempStore.setStoreScopeDept(noRepeDeptList)
  setCheckMembers()
}
const setFooterPosts = (postList: TFooter[]) => {
  verifyTempStore.setStoreScopePost(postList)

  setCheckMembers()
}
</script>

<template>
  <BaseDialog
    :dialogVisible="props.dialogVisible"
    :dialogTitle="verifyTempStore.templateDialogTitle"
    @submitDialogEmit="doSubmitFun"
    @cancelDialogEmit="doCancelFun"
    width="60%"
    :needDestroy="true"
  >
    <div class="header-tab">
      <el-tabs v-model="state.activeName">
        <el-tab-pane label="指定部门" name="department">
          <NewLeftTabDepartment
            :un_checked_dept="state.delTagID"
            @selectDepartEmit="setFooterDepart"
            search_placeholder="输入部门搜寻"
          />
        </el-tab-pane>

        <el-tab-pane label="指定成员" name="member">
          <NewRightTabMember
            use_dialog_name="scope"
            :un_checked_user="state.delTagName"
            @checkMemberEmit="setFooterMembers"
          />
        </el-tab-pane>
        <el-tab-pane label="指定岗位" name="post">
          <PostTab
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
