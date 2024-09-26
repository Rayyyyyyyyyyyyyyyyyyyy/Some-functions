<script setup lang="ts">
import { reactive } from '@vue/reactivity'
import {
  defaultTargetOption,
  EQOption,
  feeTypeOption,
  matchOption,
  numberOption
} from '@/const/appConst'
import type { FormInstance } from 'element-plus'
import { verifyTempStore } from '@/stores/verifyTemplateStore'
import BaseDrawer from '@/components/baseCom/BaseDrawer.vue'
import { TFooter } from '@/utils/setTreeHelper'
import AppUtils from '@/utils/appUtils'
import { flowStore } from '@/stores/flowStore'
import {
  TCenterList,
  TFrontEndUseForm,
  TFrontEndUseSummaryForm
} from '@/types/baseType'
import { deptStore } from '@/stores/deptStore'
import BaseApi from '@/services/api'
import { StatusCodes } from 'http-status-codes'
import { TFlowITem } from '@/types/apiTypes'
import App from '@/App.vue'

const props = defineProps({
  drawer_visible: {
    type: Boolean,
    default: false
  }
})
const emits = defineEmits(['closeDrawEmit', 'submitDrawEmit'])

const form_state = reactive({
  from: {
    target: '999',
    medium: 'eq',
    deptName: '',
    singleSelect: '',
    multipleSelect: [] as number[],
    inputNum: ''
  },
  rule: {
    deptName: [
      {
        required: true,
        message: '请选择'
      }
    ],
    singleSelect: [
      {
        required: true,
        message: '请选择'
      }
    ],
    multipleSelect: [
      {
        required: true,
        message: '请选择'
      }
    ],
    inputNum: [
      {
        required: true,
        message: '请输入数字'
      }
    ]
  }
})
const formRef = ref()

const state = reactive({
  platFormOption: [] as { label: string; value: string }[],
  deptSelectVisible: false,
  selectDeptTFooter: {} as TFooter
})

watch(
  () => props.drawer_visible,
  () => {
    if (!props.drawer_visible) {
      resetForm()
    } else {
      const cloneData = AppUtils.deepCloneData(
        flowStore.settingCondition
      ) as TFlowITem
      if (cloneData.pathType && cloneData.pathType !== '') {
        setStoreDataToState(cloneData)
      }
    }
  }
)
const setStoreDataToState = (data: TFlowITem) => {
  form_state.from.medium = data.condition

  const cloneCenterList = AppUtils.deepCloneData(
    verifyTempStore.centerList
  ) as TCenterList[]
  const payloadCenterList = verifyTempStore.setPayloadCompList(cloneCenterList)

  const matchItemIndex = payloadCenterList.findIndex(
    item => item.itemId == data.path
  )
  if (matchItemIndex > -1) {
    if (payloadCenterList[matchItemIndex]) {
      if (payloadCenterList[matchItemIndex].type == 'part') {
        if (payloadCenterList[matchItemIndex].name == '费用明細') {
          form_state.from.target = matchItemIndex.toString()
        } else if (payloadCenterList[matchItemIndex].name == '基础信息') {
          const cloneChild = AppUtils.deepCloneData(
            payloadCenterList[matchItemIndex].children
          ) as TFrontEndUseForm[]
          const childMatchIndex = cloneChild.findIndex(
            item => item.type == data.pathType
          )
          if (childMatchIndex > -1) {
            form_state.from.target = `${matchItemIndex}-${childMatchIndex}`
          }
        } else {
          //確認一般明細內是否有金額 與對應path, item id
          const matchPart = payloadCenterList[matchItemIndex]
          const childAmountInd = matchPart.children.findIndex(
            item => item.type == 'amount' && item.itemId == data.path
          )
          if (childAmountInd > -1) {
            form_state.from.target = `${matchItemIndex}`
          }
        }
      } else {
        form_state.from.target = matchItemIndex.toString()
      }
    }
  }
  setFormDataFromCard(data)
}

const setFormDataFromCard = async (data: TFlowITem) => {
  if (['belongDept', 'useDept'].includes(data.pathType!)) {
    const strValue = AppUtils.deepCloneData(data.value) as string
    const objValue = JSON.parse(strValue) as TFooter
    form_state.from.deptName = objValue.label
    state.selectDeptTFooter = objValue
    form_state.from.target = data.pathType == 'useDept' ? '998' : '999'
    flowStore.conditionDeptTreeSelect([objValue])
  } else if (data.pathType == 'feeType') {
    const objValue = JSON.parse(data.value) as { label: string; value: string }
    form_state.from.singleSelect = objValue.value
  } else if (data.pathType == 'checkbox') {
    const strValue = AppUtils.deepCloneData(data.value) as string
    const objValue = JSON.parse(strValue) as string[]
    const cloneOptions = AppUtils.deepCloneData(selectOption.value) as {
      label: string
      value: number
    }[]
    const dataList = cloneOptions.filter(item => objValue.includes(item.label))
    if (dataList.length > 0) {
      form_state.from.multipleSelect = dataList.map(item => item.value)
    }
  } else if (data.pathType == 'platform') {
    const strValue = AppUtils.deepCloneData(data.value) as string
    const objValue = JSON.parse(strValue) as {
      label: string
      value: number
    }[]
    const idList = objValue.map(plat => plat.value)
    if (state.platFormOption.length == 0) {
      await fetchPlatForm()
    }
    const cloneOptions = AppUtils.deepCloneData(state.platFormOption) as {
      label: string
      value: number
    }[]
    const dataList = cloneOptions.filter(item => idList.includes(item.value))
    if (dataList.length > 0) {
      form_state.from.multipleSelect = dataList.map(item => item.value)
    }
  } else if (['select', 'radio'].includes(data.pathType!)) {
    const cloneOptions = AppUtils.deepCloneData(selectOption.value) as {
      label: string
      value: string
    }[]
    const dataOption = cloneOptions.find(item => item.label == data.value)
    if (dataOption) {
      form_state.from.singleSelect = dataOption.value!
    }
  } else {
    form_state.from.inputNum = data.value
  }
}

const resetForm = (isAll: boolean = true) => {
  if (isAll) {
    form_state.from.target = '999'
    form_state.from.medium = 'eq'
  }

  formRef.value.resetFields()

  form_state.from.deptName = ''
  form_state.from.singleSelect = ''
  form_state.from.multipleSelect = []
  form_state.from.inputNum = ''
  state.platFormOption = []
  state.selectDeptTFooter = {} as TFooter
  flowStore.conditionDeptTreeSelect([])
}

const cancelFun = () => {
  emits('closeDrawEmit')
}

const saveFun = (formName: FormInstance) => {
  if (!formName) return
  formName.validate(valid => {
    if (valid) {
      const emitPayload = setPayloadCondition()
      emits('submitDrawEmit', emitPayload)
    } else {
      return
    }
  })
}

const setPayloadCondition = () => {
  const payloadObj = {
    pathName: '',
    pathType: '',
    path: '',
    condition: '',
    value: ''
  }

  const cloneOptions = AppUtils.deepCloneData(
    targetOption.value
  ) as TTargetOption[]
  const submitOption = cloneOptions.find(
    item => item.value == form_state.from.target
  )
  if (submitOption) {
    payloadObj.condition = form_state.from.medium
    payloadObj.pathName = submitOption.label
    payloadObj.pathType = submitOption.type

    if (submitOption.value! == '999') {
      payloadObj.path = 'belongDept'
      payloadObj.value = AppUtils.deepCloneData(
        JSON.stringify(state.selectDeptTFooter)
      )
    } else if (submitOption.value! == '998') {
      payloadObj.path = 'useDept'
      payloadObj.value = AppUtils.deepCloneData(
        JSON.stringify(state.selectDeptTFooter)
      )
    } else if (submitOption.type == 'partAmount') {
      payloadObj.path = submitOption.singleData!.itemId!
      payloadObj.value = form_state.from.inputNum
    } else if (submitOption.type == 'feeType') {
      if (submitOption.value.includes('-')) {
        payloadObj.path = submitOption.singleData!.itemId!
      }
      const cloneOptions = AppUtils.deepCloneData(selectOption.value) as {
        label: string
        value: string
      }[]
      const optionSelected = cloneOptions.find(
        feeTypeItem => feeTypeItem.value == form_state.from.singleSelect
      )
      if (optionSelected) {
        payloadObj.value = JSON.stringify(optionSelected)
      }
    } else {
      const childOptionList = AppUtils.deepCloneData(
        submitOption.singleData?.options
      ) as string[]
      if (submitOption.type == 'checkbox') {
        let ops = []
        const cloneSelected = AppUtils.deepCloneData(
          form_state.from.multipleSelect
        ) as string[]
        for (let i = 0; i < cloneSelected.length; i++) {
          ops.push(childOptionList[Number(cloneSelected[i])])
        }
        payloadObj.value = JSON.stringify(ops)
      } else if (submitOption.type == 'platform') {
        if (submitOption.value.includes('-')) {
          payloadObj.path = submitOption.singleData!.itemId!
        }
        const cloneOptions = AppUtils.deepCloneData(selectOption.value) as {
          label: string
          value: string
        }[]
        const cloneSelected = AppUtils.deepCloneData(
          form_state.from.multipleSelect
        ) as string[]
        const optionSelected = cloneOptions.filter(feeTypeItem =>
          cloneSelected.includes(feeTypeItem.value)
        )
        if (optionSelected.length > 0) {
          payloadObj.value = JSON.stringify(optionSelected)
        }
      } else if (['radio', 'select'].includes(submitOption.type)) {
        payloadObj.value = childOptionList[Number(form_state.from.singleSelect)]
      } else {
        payloadObj.value = form_state.from.inputNum
      }
      payloadObj.path = submitOption.singleData!.itemId!
    }
  }
  return payloadObj
}

const condition_priority = computed(() => {
  return flowStore.settingCondition.xIndex
})

const onTargetChange = (value: string) => {
  if (findOptionType(value) !== 'platform') {
    state.platFormOption = []
  }

  form_state.from.medium = conditionOption.value[0].value

  resetForm(false)
}
const onMediumChange = () => {}

type TTargetOption = {
  label: string
  value: string
  type: string
  singleData?: TFrontEndUseSummaryForm & { listInd: number }
}
const targetOption = computed(() => {
  let options = [...AppUtils.deepCloneData(defaultTargetOption)]
  const cloneList = AppUtils.deepCloneData(
    verifyTempStore.centerList
  ) as TCenterList[]
  const payloadCenterList = verifyTempStore.setPayloadCompList(cloneList)
  payloadCenterList.forEach((item, ind) => {
    if (item.type === 'radio') {
      options.push({
        label: item.name,
        value: ind.toString(),
        type: 'radio',
        singleData: { ...item, listInd: ind }
      })
    }
    if (item.type === 'select') {
      options.push({
        label: item.name,
        value: ind.toString(),
        type: 'select',
        singleData: { ...item, listInd: ind }
      })
    }
    if (item.type === 'checkbox') {
      options.push({
        label: item.name,
        value: ind.toString(),
        type: 'checkbox',
        singleData: { ...item, listInd: ind }
      })
    }
    if (item.type === 'number') {
      options.push({
        label: item.name,
        value: ind.toString(),
        type: 'number',
        singleData: { ...item, listInd: ind }
      })
    }
    if (item.type === 'amount') {
      options.push({
        label: item.name,
        value: ind.toString(),
        type: 'amount',
        singleData: { ...item, listInd: ind }
      })
    }
    if (item.type === 'part') {
      if (item.name == '基础信息') {
        const feeTypeChilInd = item.children.findIndex(
          chil => chil.type === 'feeType'
        )
        const platformChil = item.children.findIndex(
          chil => chil.type === 'platform'
        )
        if (feeTypeChilInd > -1) {
          options.push({
            label: '基础信息/费用类型',
            value: `${ind}-${feeTypeChilInd}`,
            type: 'feeType',
            singleData: { ...item, listInd: ind }
          })
        }
        if (platformChil > -1) {
          options.push({
            label: '基础信息/归属平台',
            value: `${ind}-${platformChil}`,
            type: 'platform',
            singleData: { ...item, listInd: ind }
          })
        }
      } else if (item.name == '费用明細') {
        options.push({
          label: '费用明細/汇总 (金额)',
          value: ind.toString(),
          type: 'amountDetail',
          singleData: { ...item, listInd: ind }
        })
      } else {
        const findAmount = item.children.find(chil => chil.type === 'amount')
        if (findAmount && item.canSetMore) {
          options.push({
            label: `${item.name}/汇总 (金额)`,
            value: ind.toString(),
            type: 'partAmount',
            singleData: { ...item, listInd: ind }
          })
        }
      }
    }
  })
  return options
})

const conditionOption = computed(() => {
  const eqList = ['belongDept', 'useDept', 'radio', 'select', 'feeType']
  if (eqList.includes(findOptionType(form_state.from.target))) {
    return EQOption
  }
  if (['checkbox', 'platform'].includes(findOptionType(form_state.from.target)))
    return matchOption

  return numberOption
})

const findOptionType = (strIndex: string) => {
  const cloneTargetOptions = AppUtils.deepCloneData(
    targetOption.value
  ) as TTargetOption[]
  const option = cloneTargetOptions.find(item => item.value == strIndex)
  if (option) {
    return option.type
  } else {
    return ''
  }
}
const showDeptChooser = computed(() => {
  const typeList = ['belongDept', 'useDept']
  return typeList.includes(findOptionType(form_state.from.target))
})
const showMultipleChooser = computed(() => {
  const typeList = ['checkbox', 'platform']
  return typeList.includes(findOptionType(form_state.from.target))
})
const showSingleChooser = computed(() => {
  const typeList = ['radio', 'select', 'feeType']
  return typeList.includes(findOptionType(form_state.from.target))
})
const showNumberInput = computed(() => {
  const typeList = ['partAmount', 'amountDetail', 'amount', 'number']
  return typeList.includes(findOptionType(form_state.from.target))
})
const fetchPlatForm = async () => {
  const result = await BaseApi.getDeptPlatForm()
  if (result.code == StatusCodes.OK && result.data.length > 0) {
    const activePlatform = result.data.filter(item => item.enabledStatus == '0')
    state.platFormOption = deptStore.mapPlatformOption(activePlatform)
  }
}

const selectOption = computed(() => {
  if (findOptionType(form_state.from.target) == 'feeType') {
    return feeTypeOption
  }
  if (findOptionType(form_state.from.target) == 'platform') {
    if (state.platFormOption.length == 0) {
      fetchPlatForm().then(() => {
        return state.platFormOption
      })
    } else {
      return state.platFormOption
    }
  }
  if (
    ['radio', 'select', 'checkbox'].includes(
      findOptionType(form_state.from.target)
    )
  ) {
    const cloneOption = AppUtils.deepCloneData(targetOption.value) as {
      label: string
      value: string
      singleData?: TCenterList
    }[]
    const selectValue = cloneOption.find(
      item => item.value == form_state.from.target
    )
    if (selectValue) {
      const cloneStrOptions = AppUtils.deepCloneData(
        selectValue.singleData!.options
      ) as string[]
      return cloneStrOptions.map((str, indee) => {
        return {
          label: str,
          value: indee.toString()
        }
      })
    }
  }
  return []
})
const openDeptSelectDialog = () => {
  state.deptSelectVisible = true
}

const deptSelectSubmitFun = (deptArr: TFooter[]) => {
  state.selectDeptTFooter = deptArr[0]
  form_state.from.deptName = deptArr[0].label
  state.deptSelectVisible = false
}

const exChangeNum = () => {
  if (form_state.from.inputNum) {
    const cloneValue = AppUtils.deepCloneData(form_state.from.inputNum)
    form_state.from.inputNum = cloneValue.replace(/\D/g, '')
  }
}
</script>

<template>
  <BaseDrawer
    :drawVisible="props.drawer_visible"
    :draw_name="`条件${condition_priority}`"
    @cancelEmit="cancelFun"
    @saveEmit="saveFun(formRef)"
  >
    <p class="sub-text">满足以下条件时进入当前分支</p>

    <div class="condition-box">
      <div class="condition-title">条件组</div>
      <div class="sub-text">当</div>
      <el-form
        ref="formRef"
        :model="form_state.from"
        :rules="form_state.rule"
        class="condition-form"
      >
        <!--          對象-->
        <el-form-item>
          <el-select
            v-model="form_state.from.target"
            placeholder="请选择"
            @change="onTargetChange"
            class="w-full"
          >
            <el-option
              v-for="item in targetOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <!--          條件 介質-->
        <el-form-item>
          <el-select
            v-model="form_state.from.medium"
            placeholder="请选择"
            @change="onMediumChange"
            class="w-full"
          >
            <el-option
              v-for="item in conditionOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <!--          條件內容 -->
        <el-form-item v-if="showDeptChooser" prop="deptName">
          <!--            部門選擇-->
          <el-input
            class="w-full"
            readonly
            @click="openDeptSelectDialog"
            placeholder="请选择"
            v-model="form_state.from.deptName"
          />
        </el-form-item>

        <el-form-item v-if="showSingleChooser" prop="singleSelect">
          <!--            選項選擇  單選-->
          <el-select class="w-full" v-model="form_state.from.singleSelect">
            <el-option
              v-for="item in selectOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item v-if="showMultipleChooser" prop="multipleSelect">
          <!--            選項選擇  多選-->
          <el-select
            class="w-full"
            multiple
            v-model="form_state.from.multipleSelect"
            collapse-tags
            :max-collapse-tags="2"
            collapse-tags-tooltip
          >
            <el-option
              v-for="item in selectOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item v-if="showNumberInput" prop="inputNum">
          <!--          輸入數字-->
          <el-input
            class="w-full"
            placeholder="请输入数字"
            v-model="form_state.from.inputNum"
            @blur="exChangeNum"
          />
        </el-form-item>
      </el-form>
    </div>
  </BaseDrawer>

  <DeptSelectDialog
    :dialogVisible="state.deptSelectVisible"
    :check_data="state.selectDeptTFooter"
    @cancelEmit="state.deptSelectVisible = false"
    @submitEmit="deptSelectSubmitFun"
  ></DeptSelectDialog>
</template>

<style lang="scss" scoped>
.sub-text {
  @apply text-xs text-text-subLabel;
  @apply mb-3;
}

.condition-box {
  @apply bg-bg-tree rounded;
  @apply p-3;

  .condition-title {
    @apply mb-3 text-sm;
    @apply text-text-labelText;
  }

  .condition-form {
    ::v-deep() {
      .el-form-item {
        @apply mb-3;
      }
    }
  }
}
</style>
