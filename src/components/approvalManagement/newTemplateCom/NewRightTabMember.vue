<script setup lang="ts">
import { reactive } from '@vue/reactivity'
import { TGetUserTree, TUserTreeVoList, TVerifyPeoples } from '@/types/apiTypes'
import { Search } from '@element-plus/icons-vue'
import { approvalProps } from '@/const/appConst'
import { treeHelper } from '@/utils/setTreeHelper'
import AppUtils from '@/utils/appUtils'
import { verifyTempStore } from '@/stores/verifyTemplateStore'
import _ from 'lodash'
import { platformStore } from '@/stores/platformStore'

const props = defineProps({
  un_checked_user: {
    type: String,
    default: ''
  },
  use_dialog_name: {
    type: String,
    default: 'export'
  },
  set_limit_max: {
    type: Boolean,
    default: false
  },
  limit_num: {
    type: Number,
    default: 10
  }
})
const defaultAvatarImg =
  import.meta.env.VITE_RES_URL + '/wap/imgOA/icon_default_avatar.png'
const errorHandler = () => true

const state = reactive({
  treeData: [] as TGetUserTree[],
  treeSearchInput: '',
  memberSearchInput: '',
  branchUser: [] as TUserTreeVoList[],
  fullBranchUser: [] as TUserTreeVoList[],

  checkedItems: [] as string[], // realName []
  allChecked: [] as string[], // 預先把所選樹枝內的 user 存起來 勾選全選時塞進 checkedItems
  checkAll: false,
  branchLoading: false
})

watch(
  () => props.un_checked_user,
  () => {
    let unCheckUserRealName = props.un_checked_user
    let removeIdx = state.checkedItems.indexOf(unCheckUserRealName)
    if (removeIdx != -1) {
      state.checkedItems.splice(removeIdx, 1)
    }
    handleCheckedItemChange(state.checkedItems)
  }
)

const debouncedFunction = _.debounce(
  () => ElMessage.warning(`最多只可选择${props.limit_num}人`),
  500
)
watch(
  () => state.checkedItems.length,
  () => {
    const cloneList = AppUtils.deepCloneData(state.checkedItems) as string[]
    if (verifyTempStore.setLimitMax) {
      if (state.checkedItems.length > 10) {
        debouncedFunction()
        handleCheckedItemChange(cloneList.slice(0, 10))
      }
    }
    if (props.set_limit_max) {
      if (state.checkedItems.length > props.limit_num) {
        debouncedFunction()
        handleCheckedItemChange(cloneList.slice(0, props.limit_num))
      }
    }
  }
)

onMounted(() => {
  if (verifyTempStore.treeData.length == 0) {
    verifyTempStore.getTreeData()
  }
  getDataListFromStore()
})

watch(
  () => props.use_dialog_name,
  () => {
    getDataListFromStore()
  }
)

watch(
  () => verifyTempStore.templateExportList.length,
  () => {
    getDataListFromStore()
  }
)
watch(
  () => verifyTempStore.templateAdmin.length,
  () => {
    getDataListFromStore()
  }
)
watch(
  () => verifyTempStore.scopeMemberList.length,
  () => {
    getDataListFromStore()
  }
)
watch(
  () => verifyTempStore.ccPersonList.length,
  () => {
    getDataListFromStore()
  }
)
watch(
  () => verifyTempStore.conditionCcPersonList.length,
  () => {
    getDataListFromStore()
  }
)
watch(
  () => verifyTempStore.peopleList.length,
  () => {
    getDataListFromStore()
  }
)
watch(
  () => platformStore.opUsers.length,
  () => {
    getDataListFromStore()
  }
)
watch(
  () => platformStore.dialogOpUsers.length,
  () => {
    getDataListFromStore()
  }
)
watch(
  () => verifyTempStore.isWriteOffDraw,
  () => {
    getDataListFromStore()
  }
)

watch(
  () => verifyTempStore.settingFlow.verifyFlow,
  () => {
    setEditData([])
  }
)
watch(
  () => verifyTempStore.offsettingFlow.verifyFlow,
  () => {
    setEditData([])
  }
)
const getDataListFromStore = async () => {
  switch (props.use_dialog_name) {
    case 'export':
      await setEditData(verifyTempStore.templateExportList)
      break
    case 'platform':
      if (platformStore.isDialog) {
        await setEditData(platformStore.dialogOpUsers)
      } else {
        await setEditData(platformStore.opUsers)
      }
      break
    case 'cc':
      let ccMember: TVerifyPeoples[]
      ccMember = []
      if (verifyTempStore.isOutSideCC) {
        ccMember = verifyTempStore.ccPersonList.map(_ => {
          return {
            userId: _.id,
            userName: _.label
          }
        })
      } else {
        ccMember = verifyTempStore.conditionCcPersonList.map(_ => {
          return {
            userId: _.id,
            userName: _.label
          }
        })
      }

      await setEditData(ccMember)
      break
    case 'people':
      if (verifyTempStore.isWriteOffDraw) {
        await setEditData(verifyTempStore.offPeopleList)
      } else {
        await setEditData(verifyTempStore.peopleList)
      }
      break
    case 'scope':
      const scopeMember = verifyTempStore.scopeMemberList.map(_ => {
        return {
          userId: _.id,
          userName: _.label
        }
      })
      await setEditData(scopeMember)
      break
    case 'admin':
      const adminList = AppUtils.deepCloneData(verifyTempStore.templateAdmin)
      if (adminList.length > 0) {
        await setEditData([adminList[0]])
      } else {
        await setEditData([])
      }
      break
  }
}
const setEditData = (dataList: TVerifyPeoples[]) => {
  if (dataList.length > 0) {
    const nameList = dataList.map((_: TVerifyPeoples) => _.userName) as string[]
    handleCheckedItemChange(nameList, true)
  } else {
    handleCheckedItemChange([])
  }
}

const doSearchTree = (keyword: string) => {
  verifyTempStore.filterTreeData(keyword)
  if (state.treeSearchInput.length == 0) {
    verifyTempStore.getTreeData()
  }
}

const searchMember = (keyword: string, setCheckAll: boolean = true) => {
  state.branchLoading = true
  const defaultBranchUser = AppUtils.deepCloneData(state.fullBranchUser)
  const searchUsers = defaultBranchUser.filter((_: TUserTreeVoList) =>
    _.realName.toLowerCase().includes(keyword.toLowerCase())
  )

  debouncedSetUserFunction(searchUsers)

  if (props.use_dialog_name !== 'admin') {
    state.checkAll =
      state.branchUser.length > 0 &&
      state.allChecked.length > 0 &&
      state.branchUser.length == state.allChecked.length &&
      setCheckAll
  }
}
watch(
  () => state.memberSearchInput,
  () => {
    const defaultBranchUser = AppUtils.deepCloneData(state.fullBranchUser)
    if (state.memberSearchInput.length == 0) {
      state.branchLoading = true

      debouncedSetUserFunction(defaultBranchUser)
    }
  }
)

const debouncedSetUserFunction = _.debounce((users: TUserTreeVoList[]) => {
  if (users.length > 100) {
    state.branchUser = users.slice(0, 100)
  } else if (users.length == 0) {
    state.branchUser = []
  } else {
    state.branchUser = users
  }
  state.branchLoading = false
}, 500)

const handleNodeClick = (userOnTree: TGetUserTree) => {
  state.memberSearchInput = ''
  let nameListInBranch = [] as string[]
  const userTreeVOList = userOnTree.userTreeVOList
  userTreeVOList.forEach(_ => {
    _.avatarUrl = AppUtils.handleShowAvatar(_.avatarUrl)
    nameListInBranch.push(_.realName)
  })
  state.fullBranchUser = userTreeVOList
  state.allChecked = nameListInBranch

  searchMember('', false)
}

watch(
  () => [...state.fullBranchUser],
  () => {
    const fullList = AppUtils.deepCloneData(
      state.fullBranchUser
    ) as TUserTreeVoList[]
    state.branchUser = fullList.slice(0, 100)
  }
)

watch(
  () => state.branchUser,
  () => {
    const checkedNameList = []
    state.branchUser.forEach(_ => {
      state.checkedItems.forEach(name => {
        if (_.realName == name) {
          checkedNameList.push(name)
        }
      })
    })
    state.checkAll =
      state.branchUser.length > 0 &&
      checkedNameList.length > 0 &&
      state.branchUser.length == checkedNameList.length
  }
)

const emits = defineEmits(['checkMemberEmit'])

const handleCheckAllChange = (value: boolean) => {
  if (value) {
    setCheckAll()
  } else {
    setUnCheckAll()
  }
}

const setCheckAll = () => {
  state.allChecked.length = 0
  if (state.memberSearchInput == '') {
    state.allChecked = state.fullBranchUser.map(user => user.realName)
    state.checkAll =
      state.branchUser.length > 0 &&
      state.allChecked.length > 0 &&
      state.fullBranchUser.length == state.allChecked.length
  } else {
    state.allChecked = state.branchUser.map(user => user.realName)
    state.checkAll =
      state.branchUser.length > 0 &&
      state.allChecked.length > 0 &&
      state.branchUser.length == state.allChecked.length
  }
  if (state.checkedItems.length == 0) {
    state.checkedItems = state.allChecked
  } else {
    const defaultNames = AppUtils.deepCloneData(state.checkedItems)
    const setObj = new Set()
    state.checkedItems = [...defaultNames, ...state.allChecked].filter(itm =>
      !setObj.has(itm) ? setObj.add(itm) : false
    )
  }
  setEmitData()
}

const setUnCheckAll = () => {
  const alreadyChecked = AppUtils.deepCloneData(state.checkedItems)
  alreadyChecked.forEach((_: string, idx: number) => {
    state.allChecked.forEach(name => {
      if (_ == name) {
        alreadyChecked[idx] = ''
      }
    })
  })
  state.checkedItems = alreadyChecked.filter((_: string) => _ != '')
  setEmitData()
}

const handleCheckedItemChange = (
  value: string[],
  isFromStore: boolean = false
) => {
  if (props.use_dialog_name == 'admin') {
    const name = value.pop()
    state.checkedItems = [name!]
  } else {
    state.checkedItems = value
    const checkedNameList = state.branchUser.flatMap(_ =>
      value.filter(name => _.realName === name)
    )
    state.checkAll =
      state.branchUser.length > 0 &&
      checkedNameList.length > 0 &&
      state.branchUser.length == checkedNameList.length
  }

  if (!isFromStore) {
    setEmitData()
  }
}

const setEmitData = async () => {
  const checkedItems = AppUtils.deepCloneData(state.checkedItems)
  if (
    verifyTempStore.treeData.length == 0 &&
    verifyTempStore.templateDialogTitle != ''
  ) {
    await verifyTempStore.getTreeData()
  }
  const allVOList = treeHelper.approvalFilterTreeGetVOList(
    verifyTempStore.fullTreeData
  )

  let defaultData = allVOList.filter(_ => checkedItems.includes(_.realName))

  const setObj = new Set()
  const noRepeatList = defaultData.filter(itm =>
    !setObj.has(itm.userId) ? setObj.add(itm.userId) : false
  )

  const emitData = noRepeatList.map(_ => {
    return {
      userId: _.userId,
      userName: _.realName
    }
  })
  emits('checkMemberEmit', emitData)
}

const load = () => {
  const fullList = AppUtils.deepCloneData(
    state.fullBranchUser
  ) as TUserTreeVoList[]
  const loadList = fullList.slice(
    state.branchUser.length,
    state.branchUser.length + 100
  )
  if (state.memberSearchInput) {
    searchMember(state.memberSearchInput)
  } else {
    state.branchUser.push(...loadList)
  }
}
const resetTreeData = async () => {
  await verifyTempStore.getTreeData()
}
const clearMemberSearch = () => {
  searchMember('')
}

const isMaxLimit = computed(() => {
  if (props.use_dialog_name == 'cc') {
    return verifyTempStore.ccLimitIsMax
  } else {
    return false
  }
})
</script>

<template>
  <div class="option-body">
    <!-- 指定成员-->
    <div class="left-depart">
      <el-input
        class="search-input"
        v-model="state.treeSearchInput"
        placeholder="输入模糊搜索"
        :prefix-icon="Search"
        @input="doSearchTree"
        clearable
        @clear="resetTreeData"
      />
      <el-tree-v2
        ref="memberTreeRef"
        class="dept-tree"
        :data="verifyTempStore.treeData"
        :props="approvalProps"
        @node-click="handleNodeClick"
        :height="250"
      />
    </div>
    <div class="right-member" v-loading="state.branchLoading">
      <div class="search-member">
        <el-input
          class="search-input"
          v-model="state.memberSearchInput"
          @keyup.enter="searchMember(state.memberSearchInput)"
          placeholder="输入 姓名 模糊搜索"
          :prefix-icon="Search"
          clearable
          @clear="clearMemberSearch"
        />
        <el-button
          class="search-btn"
          type="primary"
          @click="searchMember(state.memberSearchInput)"
        >
          搜索
        </el-button>
      </div>
      <el-checkbox
        v-if="state.branchUser.length > 0 && props.use_dialog_name != 'admin'"
        v-model="state.checkAll"
        @change="handleCheckAllChange"
        :disabled="isMaxLimit"
        >全选</el-checkbox
      >
      <el-checkbox-group
        :disabled="isMaxLimit"
        v-infinite-scroll="load"
        :infinite-scroll-distance="100"
        :infinite-scroll-immediate="false"
        v-model="state.checkedItems"
        @change="handleCheckedItemChange"
        class="user-checkBox"
      >
        <el-checkbox
          v-for="item in state.branchUser"
          :key="item"
          :label="item.realName"
          :checked="item.checked"
        >
          <div class="user-img">
            <el-avatar :size="32" @error="errorHandler" :src="item.avatarUrl">
              <img :src="defaultAvatarImg" alt="defaultAvatarImg" />
            </el-avatar>
            <p>
              {{ item.realName }}
            </p>
          </div>
        </el-checkbox>
      </el-checkbox-group>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.option-body {
  @apply flex items-center h-80 w-full;
  @apply border-t-2 pt-4;

  .dept-tree {
    height: calc(100% - 48px);

    ::v-deep() {
      .el-vl__wrapper {
        @apply h-full;
      }
    }
  }
  .right-member {
    .search-member {
      @apply flex items-start;
      .search-btn {
        @apply ml-2 mb-4;
      }
    }
  }
}

.el-checkbox + .el-checkbox {
  @apply mt-2;
}
</style>
