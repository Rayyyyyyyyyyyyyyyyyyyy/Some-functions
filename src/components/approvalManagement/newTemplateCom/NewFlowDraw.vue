<script setup lang="ts">
import { reactive } from '@vue/reactivity'
import { gradeCountOptions } from '@/const/appConst'
import { TFlowITem, TStep3Verify, TVerifyPeoples } from '@/types/apiTypes'
import type { FormInstance } from 'element-plus'
import { verifyTempStore } from '@/stores/verifyTemplateStore'
import BaseDrawer from '@/components/baseCom/BaseDrawer.vue'
import NewVerifyMemberDialog from '@/components/approvalManagement/newTemplateCom/NewVerifyMemberDialog.vue'
import { TFooter } from '@/utils/setTreeHelper'
import AppUtils from '@/utils/appUtils'
import BaseButton from '@/components/baseCom/BaseButton.vue'
import { flowStore } from '@/stores/flowStore'

const props = defineProps({
  drawer_visible: {
    type: Boolean,
    default: false
  }
})
const emits = defineEmits(['closeVerifyDrawEmit'])

const form_state = reactive({
  verifyFrom: {
    autoAdmin: false,
    autoPass: '',
    gradeCount: '',
    onePass: '',
    positionId: '',
    selfOption: '',
    verifyFlow: '2',
    verifyNameList: [] as string[]
  },
  verifyRule: {
    verifyNameList: [{ required: true, message: '请选择成员' }],
    onePass: [{ required: true, message: '请选择' }],
    positionId: [{ required: true, message: '请选择岗位' }],
    autoPass: [{ required: true, message: '请选择' }],
    gradeCount: [{ required: true, message: '请选择审批层级数量' }],
    selfOption: [{ required: false, message: '请选择自选范围' }]
  }
})
const formRef = ref()

const state = reactive({
  memberDialogVisible: false
})

watch(
  () => props.drawer_visible,
  () => {
    if (!props.drawer_visible) {
      form_state.verifyFrom.verifyFlow = '2'
      resetForm()
    } else {
      setEditData()
    }
  }
)
const setEditData = async () => {
  const flowData = verifyTempStore.isWriteOffDraw
    ? verifyTempStore.offsettingFlow
    : verifyTempStore.settingFlow
  form_state.verifyFrom.verifyFlow = flowData.verifyFlow
  if (flowData.verifyFlow == '3') {
    if (verifyTempStore.position_option.length == 0) {
      await verifyTempStore.getPositOptions()
    }
    const hasNotPosition =
      verifyTempStore.position_option.findIndex(
        option => option.value == flowData.positionId!
      ) == -1
    if (hasNotPosition) {
      ElMessage.error('原岗位已被移除，请重新选择岗位')

      form_state.verifyFrom.positionId = ''
    } else {
      form_state.verifyFrom.positionId = flowData.positionId!
    }
  }
  form_state.verifyFrom.verifyNameList =
    flowData.verifyNameList || ([] as string[])
  form_state.verifyFrom.onePass = flowData.onePass!
  form_state.verifyFrom.autoPass = flowData.autoPass!
  form_state.verifyFrom.autoAdmin = flowData.autoAdmin == '1'
  form_state.verifyFrom.gradeCount =
    flowData['gradeCount'] !== undefined ? flowData.gradeCount.toString() : ''
  form_state.verifyFrom.selfOption = setSelfOption(flowData)
}
const setSelfOption = (formData: TStep3Verify) => {
  if (formData.selfOption && formData.selfOption != '') {
    return formData.selfOption
  } else {
    return formData.verifyPeople.length > 0 ? 'asign' : 'apply'
  }
}

const cancelFun = () => {
  resetForm()
  emits('closeVerifyDrawEmit', 'cancel')
}

const saveFun = (formName: FormInstance) => {
  if (!formName) return
  formName.validate(valid => {
    if (valid) {
      setFlowPayload(verifyTempStore.isWriteOffDraw)
      let cloneData
      if (verifyTempStore.step === 4) {
        cloneData = AppUtils.deepCloneData(verifyTempStore.offsettingFlow)
        flowStore.updateCloneFlowData(cloneData, true)
      } else {
        cloneData = AppUtils.deepCloneData(verifyTempStore.settingFlow)
        flowStore.updateCloneFlowData(cloneData, false)
      }

      emits('closeVerifyDrawEmit', 'submit')
    } else {
      return
    }
  })
}

const setFlowPayload = (isWriteOff: boolean) => {
  switch (form_state.verifyFrom.verifyFlow) {
    case '4':
      verifyTempStore.setStoreFlowData(
        form_state.verifyFrom.selfOption!,
        'selfOption',
        isWriteOff
      )
      break
    case '2':
      const flowData = isWriteOff
        ? verifyTempStore.offsettingFlow
        : verifyTempStore.settingFlow
      const payloadPass =
        flowData.verifyPeople.length > 1 ? form_state.verifyFrom.onePass! : ''
      verifyTempStore.setStoreFlowData(payloadPass!, 'onePass', isWriteOff)
      break
    case '3':
      verifyTempStore.setStoreFlowData(
        form_state.verifyFrom.onePass!,
        'onePass',
        isWriteOff
      )
      verifyTempStore.setStoreFlowData(
        form_state.verifyFrom.autoPass!,
        'autoPass',
        isWriteOff
      )
      verifyTempStore.setStoreFlowData(
        form_state.verifyFrom.positionId!,
        'positionId',
        isWriteOff
      )
      break
    case '1':
      let autoAdminStr = form_state.verifyFrom.autoAdmin ? '1' : '0'
      verifyTempStore.setStoreFlowData(autoAdminStr, 'autoAdmin', isWriteOff)
      verifyTempStore.setStoreFlowData(
        form_state.verifyFrom.autoPass!,
        'autoPass',
        isWriteOff
      )
      break
    case '0':
      verifyTempStore.setStoreFlowData(
        form_state.verifyFrom.gradeCount!,
        'gradeCount',
        isWriteOff
      )
      verifyTempStore.setStoreFlowData(
        form_state.verifyFrom.autoPass!,
        'autoPass',
        isWriteOff
      )
      break
    default:
      break
  }
}

const hasAdmin = computed(() => {
  // 主管
  const adminRadio = ['1']
  const flowData = flowStore.nodes
  return (
    flowData.filter(x => x.data && adminRadio.includes(x.data.verifyFlow))
      .length > 0
  )
})
const multiAdmin = computed(() => {
  // 連續多級主管
  const adminRadio = ['0']
  const flowData = flowStore.nodes

  return (
    flowData.filter(x => x.data && adminRadio.includes(x.data.verifyFlow))
      .length > 0
  )
})

const showVerifyName = computed(() => {
  return (
    form_state.verifyFrom.verifyFlow == '2' ||
    (form_state.verifyFrom.verifyFlow == '4' &&
      form_state.verifyFrom.selfOption == 'asign')
  )
})

const showOnePassItem = computed(() => {
  if (form_state.verifyFrom.verifyNameList) {
    return (
      (form_state.verifyFrom.verifyFlow == '2' &&
        form_state.verifyFrom.verifyNameList.length > 1) ||
      form_state.verifyFrom.verifyFlow == '3'
    )
  }
  return false
})

const showAutoPassRadio = computed(() => {
  return (
    form_state.verifyFrom.verifyFlow == '0' ||
    form_state.verifyFrom.verifyFlow == '1' ||
    form_state.verifyFrom.verifyFlow == '3'
  )
})

const verifyPersonLabel = computed(() => {
  return form_state.verifyFrom.verifyFlow == '0'
    ? '若所有层级审批人皆为空：'
    : '审批人为空：'
})

const changeSelfOption = (value: string) => {
  if (value == 'apply') {
    form_state.verifyFrom.verifyNameList = []
    verifyTempStore.setStoreFlowMemberSelect([], verifyTempStore.isWriteOffDraw)
  }
}

const resetForm = () => {
  formRef.value.resetFields()
  form_state.verifyFrom.autoAdmin = false
  form_state.verifyFrom.verifyNameList = []
  form_state.verifyFrom.onePass = ''
  form_state.verifyFrom.positionId = ''
  form_state.verifyFrom.autoPass = ''
  form_state.verifyFrom.gradeCount = ''
  form_state.verifyFrom.selfOption = ''
}

const radioChange = async (value: string, doReset: boolean = true) => {
  verifyTempStore.setStoreFlowRadio(value, verifyTempStore.isWriteOffDraw)
  if (value == '3') {
    if (verifyTempStore.position_option.length == 0) {
      await verifyTempStore.getPositOptions()
    }
  }
  form_state.verifyFrom.verifyNameList = []
  verifyTempStore.setStoreFlowMemberSelect([], verifyTempStore.isWriteOffDraw)
  if (doReset) {
    resetForm()
  }
}

const openVerifyDialog = () => {
  verifyTempStore.setInputReadonly()
  verifyTempStore.setDialogTitle('审批人', true)
  state.memberDialogVisible = true
}
const clearMemberTags = () => {
  verifyTempStore.setStoreFlowMemberSelect([], verifyTempStore.isWriteOffDraw)
}
const removeMemberTag = (tagName: string) => {
  verifyTempStore.removeStoreFlowMemberTag(
    tagName,
    verifyTempStore.isWriteOffDraw
  )
}
const submitEmitFun = (memberData: TVerifyPeoples[]) => {
  let cloneData
  if (verifyTempStore.step === 4) {
    cloneData = AppUtils.deepCloneData(
      verifyTempStore.offsettingFlow
    ) as TStep3Verify
  } else {
    cloneData = AppUtils.deepCloneData(
      verifyTempStore.settingFlow
    ) as TStep3Verify
  }

  cloneData.verifyPeople = memberData
  cloneData.verifyNameList = memberData.map(user => user.userName) as string[]
  verifyTempStore.setNowSettingFlowItem(
    cloneData,
    verifyTempStore.isWriteOffDraw
  )
  form_state.verifyFrom.verifyNameList =
    verifyTempStore.flowNameList as string[]
  state.memberDialogVisible = false
}

const sendFlowToCC = (isOutSide: boolean) => {
  if (verifyTempStore.ccLimitIsMax) {
    ElMessage.warning('抄送对象已达上限')
    return
  }

  setCcFromFlowSelected(isOutSide)
  ElMessage.success('添加成功')
}

const setCcFromFlowSelected = (isOutSide: boolean) => {
  const flowData = verifyTempStore.isWriteOffDraw
    ? verifyTempStore.offsettingFlow
    : verifyTempStore.settingFlow

  const condiCC = findConditionCC() as TStep3Verify

  if (form_state.verifyFrom.verifyFlow == '3') {
    //崗位
    const selectedPosi = verifyTempStore.position_option.find(
      posi => posi.value == form_state.verifyFrom.positionId
    )
    if (selectedPosi) {
      const posiPayload = {
        id: selectedPosi.value,
        label: selectedPosi.label,
        tabName: 'post',
        layer: flowData.layer
      } as TFooter
      let clonePostList: TFooter[]

      if (isOutSide) {
        clonePostList = AppUtils.deepCloneData(verifyTempStore.ccPostList)
      } else {
        verifyTempStore.setInsideCCToStore(condiCC.copyFlow!)

        clonePostList = AppUtils.deepCloneData(
          verifyTempStore.conditionCcPostList
        )
      }

      const fullMemberList = [posiPayload, ...clonePostList]
      const setObj = new Set()
      const noRepeatList = fullMemberList.filter(itm =>
        !setObj.has(itm.id) ? setObj.add(itm.id) : false
      )
      if (isOutSide) {
        verifyTempStore.setStoreCCPost(noRepeatList)
      } else {
        verifyTempStore.setPostCCIntoStore(noRepeatList)
      }
    }
  }
  if (form_state.verifyFrom.verifyFlow == '2') {
    //人
    const selectedMember = flowData.verifyPeople.map(member => {
      return {
        id: member.userId,
        label: member.userName,
        tabName: 'member',
        layer: flowData.layer
      }
    }) as TFooter[]

    let cloneMemberList: TFooter[]
    if (isOutSide) {
      cloneMemberList = AppUtils.deepCloneData(verifyTempStore.ccPersonList)
    } else {
      verifyTempStore.setInsideCCToStore(condiCC.copyFlow!)

      cloneMemberList = AppUtils.deepCloneData(
        verifyTempStore.conditionCcPersonList
      )
    }

    const fullMemberList = [...selectedMember, ...cloneMemberList]
    const setObj = new Set()
    const noRepeatList = fullMemberList.filter(itm =>
      !setObj.has(itm.id) ? setObj.add(itm.id) : false
    )

    if (isOutSide) {
      verifyTempStore.setStoreCCMember(noRepeatList)
    } else {
      verifyTempStore.setMemberCCIntoStore(noRepeatList)
    }
  }
  if (!isOutSide) {
    verifyTempStore.nowSettingCCId(condiCC.id!)

    if (JSON.stringify(condiCC) !== '{}') {
      flowStore.setConditionCCData(
        verifyTempStore.getConditionCCFooterTagList(),
        verifyTempStore.step === 4
      )
    }
  }
}

const isWriteOff = computed(() => {
  return verifyTempStore.step === 4
})
const findConditionCC = () => {
  const flowData = verifyTempStore.isWriteOffDraw
    ? verifyTempStore.offsettingFlow
    : verifyTempStore.settingFlow
  const flowPathList = flowData
    .id!.split('-')
    .map(str => Number(str)) as number[]
  let cloneList
  if (!isWriteOff.value) {
    cloneList = AppUtils.deepCloneData(flowStore.storeFlowList) as TFlowITem[][]
  } else {
    cloneList = AppUtils.deepCloneData(
      flowStore.storeWriteOffFlowList
    ) as TFlowITem[][]
  }
  let condiObj = cloneList[flowPathList[0]][flowPathList[1]]
  const conditionCC = condiObj.verifyFlowList.find(item => item.layer === 'cc')
  if (conditionCC) {
    return conditionCC
  } else {
    return {}
  }
}

const disableSendToCC = computed(() => {
  if (verifyTempStore.ccLimitIsMax) {
    return true
  }
  if (form_state.verifyFrom.verifyFlow == '2') {
    return form_state.verifyFrom.verifyNameList.length == 0
  }
  if (form_state.verifyFrom.verifyFlow == '3') {
    return form_state.verifyFrom.positionId == ''
  }
})
const disableSendToConditionCC = computed(() => {
  const flowData = verifyTempStore.isWriteOffDraw
    ? verifyTempStore.offsettingFlow
    : verifyTempStore.settingFlow
  const flowPathList = flowData
    .id!.split('-')
    .map(str => Number(str)) as number[]
  let cloneList
  if (!isWriteOff.value) {
    cloneList = AppUtils.deepCloneData(flowStore.storeFlowList) as TFlowITem[][]
  } else {
    cloneList = AppUtils.deepCloneData(
      flowStore.storeWriteOffFlowList
    ) as TFlowITem[][]
  }
  let condiObj = cloneList[flowPathList[0]][flowPathList[1]]
  if (condiObj) {
    const prodHasCC =
      condiObj.verifyFlowList.filter(item => item.layer === 'cc').length > 0

    if (verifyTempStore.ccLimitIsMax) {
      return true
    }
    if (!condiObj.isCondition) {
      return true
    } else if (!prodHasCC) {
      return true
    } else {
      return disableSendToCC.value && prodHasCC
    }
  }
})
</script>

<template>
  <BaseDrawer
    :drawVisible="props.drawer_visible"
    draw_name="审批人"
    @cancelEmit="cancelFun"
    @saveEmit="saveFun(formRef)"
  >
    <div class="input-box">
      <div class="label">审批人类型</div>
      <el-radio-group
        @change="radioChange"
        class="verify-radio"
        v-model="form_state.verifyFrom.verifyFlow"
      >
        <el-radio label="2">指定成员</el-radio>
        <el-radio label="3">指定岗位</el-radio>
        <el-radio label="1" :disabled="hasAdmin">主管</el-radio>
        <el-radio label="0" :disabled="multiAdmin">连续多级主管</el-radio>
        <el-radio label="4">发起人自选</el-radio>
        <el-radio label="6">发起人本人</el-radio>
      </el-radio-group>
    </div>
    <p v-if="form_state.verifyFrom.verifyFlow == '6'" class="mt-4 text-sm">
      可用于需要发起人进行信息复核的情境
    </p>

    <el-form
      :model="form_state.verifyFrom"
      :rules="form_state.verifyRule"
      ref="formRef"
      label-position="top"
      label-width="80px"
      class="verify-form"
    >
      <el-form-item
        label="指定自选范围："
        prop="selfOption"
        v-if="form_state.verifyFrom.verifyFlow == '4'"
      >
        <el-select
          v-model="form_state.verifyFrom.selfOption"
          @change="changeSelfOption"
          placeholder="请选择"
        >
          <el-option label="发起人隶属部门成员" value="apply" />
          <el-option label="指定成员" value="asign" />
        </el-select>
      </el-form-item>

      <el-form-item prop="verifyNameList" v-if="showVerifyName">
        <template #label>
          <div class="tooltips-label">
            <p>选择成员：</p>
            <el-tooltip effect="light" placement="bottom">
              <template #content>最多可选择10人</template>
              <el-icon><InfoFilled /></el-icon>
            </el-tooltip></div
        ></template>
        <el-select
          class="select-item"
          multiple
          filterable
          remote
          placeholder="请选择"
          clearable
          collapse-tags
          collapse-tags-tooltip
          :max-collapse-tags="4"
          @clear="clearMemberTags"
          @click="openVerifyDialog"
          @remove-tag="removeMemberTag"
          v-model="form_state.verifyFrom.verifyNameList"
        />
      </el-form-item>

      <el-form-item
        label="选择岗位："
        prop="positionId"
        v-if="form_state.verifyFrom.verifyFlow == '3'"
      >
        <el-select
          v-model="form_state.verifyFrom.positionId"
          placeholder="请选择"
        >
          <el-option
            v-for="item in verifyTempStore.position_option"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item
        label="多人审批模式设置："
        prop="onePass"
        v-if="showOnePassItem"
      >
        <el-radio-group v-model="form_state.verifyFrom.onePass">
          <div class="flex flex-col">
            <el-radio label="1">或签（一名审批人同意即可)</el-radio>
            <el-radio label="0">会签（需所有审批人同意)</el-radio>
          </div>
        </el-radio-group>
      </el-form-item>

      <el-form-item
        v-if="form_state.verifyFrom.verifyFlow == '1'"
        label="部门领导为空："
        prop="autoAdmin"
      >
        <el-checkbox
          v-model="form_state.verifyFrom.autoAdmin"
          label="自动转交上级部门领导"
        />
      </el-form-item>

      <el-form-item
        v-if="form_state.verifyFrom.verifyFlow == '0'"
        label="指定连续审批层级数量："
        prop="gradeCount"
      >
        <el-select
          v-model="form_state.verifyFrom.gradeCount"
          placeholder="请选择"
        >
          <el-option
            v-for="item in gradeCountOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item
        v-if="showAutoPassRadio"
        :label="verifyPersonLabel"
        prop="autoPass"
      >
        <el-radio-group v-model="form_state.verifyFrom.autoPass">
          <el-radio label="1">自动同意</el-radio>
          <el-radio label="0">自动转交审批管理员</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item
        v-if="['2', '3'].includes(form_state.verifyFrom.verifyFlow)"
      >
        <div class="connect-btn">
          <BaseButton
            :button_disabled="disableSendToCC"
            button_content="同步为所有条件抄送人"
            @submitEmit="sendFlowToCC(true)"
          />
          <BaseButton
            :button_disabled="disableSendToConditionCC"
            button_content="同步为当前条件抄送人"
            @submitEmit="sendFlowToCC(false)"
          />
        </div>
      </el-form-item>
    </el-form>
  </BaseDrawer>

  <NewVerifyMemberDialog
    :dialogVisible="state.memberDialogVisible"
    @cancelEmit="state.memberDialogVisible = false"
    @submitEmit="submitEmitFun"
    :max_limit="10"
  />
</template>

<style lang="scss" scoped>
.verify-form {
  @apply w-full mt-4 ml-2;

  .el-select {
    @apply w-8/12;
  }
}

.el-select-dropdown__item {
  max-width: 500px;
}
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
.tooltips-label {
  display: inline-flex;
  @apply items-center;
}

.select-item {
  ::v-deep() {
    .el-select__input {
      @apply hidden;
    }
  }
}

.connect-btn {
  @apply flex flex-col;
  .el-button + .el-button {
    @apply mt-4;
  }
  .el-button {
    @apply ml-0;
  }
}
</style>
