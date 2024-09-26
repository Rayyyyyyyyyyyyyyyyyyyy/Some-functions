<script setup lang="ts">
import { reactive } from '@vue/reactivity'
import { TVerifyPeoples } from '@/types/apiTypes'
import { verifyTempStore } from '@/stores/verifyTemplateStore'
import NewRightTabMember from '@/components/approvalManagement/newTemplateCom/NewRightTabMember.vue'
import BaseDialog from '@/components/baseCom/BaseDialog.vue'
import { platformStore } from '@/stores/platformStore'

const props = defineProps({
  dialogVisible: {
    type: Boolean,
    default: false
  },
  max_limit: {
    type: Number,
    default: 20
  }
})
const state = reactive({
  activeName: 'member',
  checkMembers: [] as TVerifyPeoples[],
  delTag: ''
})

watch(
  () => props.dialogVisible,
  () => {
    setFooterFromStore()
  }
)

const setFooterFromStore = () => {
  if (verifyTempStore.templateDialogTitle == '数据汇出') {
    setFooterList(verifyTempStore.templateExportList)
  }
  if (verifyTempStore.templateDialogTitle == '管理员') {
    setFooterList(verifyTempStore.templateAdmin)
  }

  if (verifyTempStore.templateDialogTitle == '审批人') {
    if (verifyTempStore.isWriteOffDraw) {
      setFooterList(verifyTempStore.writeOffPeopleList)
    } else {
      setFooterList(verifyTempStore.peopleList)
    }
  }

  if (verifyTempStore.templateDialogTitle == '负责运营') {
    if (platformStore.isDialog) {
      setFooterList(platformStore.dialogOpUsers)
    } else {
      setFooterList(platformStore.opUsers)
    }
  }
}
watch(
  () => props.dialogVisible,
  () => {
    if (!props.dialogVisible) {
      setFooterList([])
    } else {
      setFooterFromStore()
    }
  }
)

const emits = defineEmits(['submitEmit', 'cancelEmit'])

const doSubmitFun = () => {
  emits('submitEmit', state.checkMembers)
}
const doCancelFun = () => {
  verifyTempStore.setDialogTitle('')
  emits('cancelEmit')
}

const handleTagClose = (tag: string) => {
  state.delTag = tag
  const nameList = state.checkMembers.map(_ => _.userName)
  state.checkMembers.splice(nameList.indexOf(tag), 1)
}

const setFooterList = (selectMember: TVerifyPeoples[]) => {
  state.checkMembers = selectMember
}
const usingDialogName = computed(() => {
  switch (verifyTempStore.templateDialogTitle) {
    case '数据汇出':
      return 'export'
    case '审批人':
      return 'people'
    case '负责运营':
      return 'platform'
    default:
      return 'admin'
  }
})
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
        <el-tab-pane label="指定成员" name="member">
          <NewRightTabMember
            :use_dialog_name="usingDialogName"
            @checkMemberEmit="setFooterList"
            :un_checked_user="state.delTag"
            :set_limit_max="['people', 'export'].includes(usingDialogName)"
            :limit_num="max_limit"
          />
        </el-tab-pane>
      </el-tabs>
    </div>

    <div class="option-footer">
      <div class="title">已选择部门及成员：</div>
      <div class="footer-tag">
        <el-tag
          v-for="tag in state.checkMembers"
          :key="tag"
          class="ml-2 mt-2"
          type="info"
          closable
          :disable-transitions="false"
          @close="handleTagClose(tag.userName!)"
        >
          {{ tag.userName }}
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
