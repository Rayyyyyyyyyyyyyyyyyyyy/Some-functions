<script setup lang="ts">
import { Search } from '@element-plus/icons-vue'
import { reactive } from '@vue/reactivity'
import { verifyTempStore } from '@/stores/verifyTemplateStore'
import { TOptionItemType } from '@/types/baseType'
import { TFooter } from '@/utils/setTreeHelper'
import AppUtils from '@/utils/appUtils'

const props = defineProps({
  un_checked_post: {
    type: String,
    default: ''
  },
  is_cc: {
    type: Boolean,
    default: false
  }
})
const emits = defineEmits(['checkPostEmit'])

const state = reactive({
  deptSearchInput: '',
  checkPostList: [] as string[],
  postOptions: [] as TOptionItemType[]
})

watch(
  () => props.un_checked_post,
  () => {
    let cloneChecked = AppUtils.deepCloneData(state.checkPostList) as string[]

    state.checkPostList = cloneChecked.filter(
      name => name !== props.un_checked_post
    )
    handleCheckedItemChange(state.checkPostList)
  }
)
const doSearch = (keyword: string) => {
  if (keyword !== '') {
    const lowerKey = keyword.toLowerCase()
    const cloneList = AppUtils.deepCloneData(
      state.postOptions
    ) as TOptionItemType[]
    if (cloneList.length > 0) {
      state.postOptions = cloneList.filter(item =>
        item.label.toLowerCase().includes(lowerKey)
      )
    }
  } else {
    state.postOptions = AppUtils.deepCloneData(verifyTempStore.position_option)
  }
}

onMounted(async () => {
  await setOptions()
  await setCheckPost()
})
const setCheckPost = () => {
  let cloneStorePost: TFooter[]
  if (props.is_cc) {
    if (verifyTempStore.isOutSideCC) {
      cloneStorePost = AppUtils.deepCloneData(
        verifyTempStore.ccPostList
      ) as TFooter[]
    } else {
      cloneStorePost = AppUtils.deepCloneData(
        verifyTempStore.conditionCcPostList
      ) as TFooter[]
    }
  } else {
    cloneStorePost = AppUtils.deepCloneData(
      verifyTempStore.scopePostList
    ) as TFooter[]
  }
  if (cloneStorePost.length > 0) {
    state.checkPostList = cloneStorePost.map(post => post.label)
  } else {
    state.checkPostList = []
  }
}

const setOptions = async () => {
  await verifyTempStore.getPositOptions()
  state.postOptions = AppUtils.deepCloneData(verifyTempStore.position_option)
}

const handleCheckedItemChange = (nameList: string[]) => {
  let prototypeList = verifyTempStore.position_option.filter(item =>
    nameList.includes(item.label)
  )
  let emitList: TFooter[]
  emitList = prototypeList.map(option => {
    return {
      id: option.value,
      label: option.label,
      tabName: 'post'
    }
  })
  emits('checkPostEmit', emitList)
}

const isMaxLimit = computed(() => {
  if (props.is_cc) {
    return verifyTempStore.ccLimitIsMax
  } else {
    return false
  }
})
</script>

<template>
  <div class="option-body">
    <div class="left-depart">
      <el-input
        class="search-input"
        clearable
        v-model="state.deptSearchInput"
        placeholder="输入岗位搜寻"
        :prefix-icon="Search"
        @input="doSearch"
      />
      <el-checkbox-group
        class="post-check-list"
        v-model="state.checkPostList"
        @change="handleCheckedItemChange"
        :disabled="isMaxLimit"
      >
        <el-checkbox
          v-for="item in state.postOptions"
          :label="item.label"
          :value="item.value"
          :key="item.value"
      /></el-checkbox-group>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.option-body {
  @apply flex items-center h-80 w-full;
  @apply border-t-2 pt-4;
}
.left-depart {
  ::v-deep() {
    .el-checkbox__label {
      max-width: 100%;
      @apply truncate;
    }
  }
}
.post-check-list {
  @apply flex flex-col;
}
</style>
