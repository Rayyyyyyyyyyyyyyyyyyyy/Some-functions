<script setup lang="ts">
import { verifyTempStore } from '@/stores/verifyTemplateStore'
import { TCenterList, TCurrency } from '@/types/baseType'
import { QuestionFilled, MoreFilled, Delete } from '@element-plus/icons-vue'
import draggable from 'vuedraggable'
import _ from 'lodash'
import {
  currencyOptions,
  currencyTableData,
  payInDetailTable
} from '@/const/appConst'
import AppUtils from '@/utils/appUtils'

const state = reactive({
  inputValue: verifyTempStore.settingItem.titleValue,
  hintValue: verifyTempStore.settingItem.hintValue,
  staticText: verifyTempStore.settingItem.helpValue,
  isRequired: verifyTempStore.settingItem.required,
  switchValue: verifyTempStore.settingItem.defaultValue,
  optionList: verifyTempStore.settingItem.options,
  timerPlaceholder: verifyTempStore.settingItem.timerPlaceholder,
  currencyValue: verifyTempStore.settingItem.currencyValue,
  canSetMore: verifyTempStore.settingItem.canSetMore,

  displayRadio: '纵向明细',
  currencyStrValue: [] as string[]
})

watch(
  () => verifyTempStore.settingItem,
  () => {
    if (verifyTempStore.settingItem.titleValue) {
      state.inputValue = verifyTempStore.settingItem.titleValue
      state.hintValue = verifyTempStore.settingItem.hintValue
      state.staticText = verifyTempStore.settingItem.helpValue
      state.isRequired = verifyTempStore.settingItem.required
      state.switchValue = verifyTempStore.settingItem.defaultValue
      state.optionList = verifyTempStore.settingItem.options
      state.timerPlaceholder = verifyTempStore.settingItem.timerPlaceholder

      if (verifyTempStore.settingItem.type == 'amount') {
        state.currencyStrValue = currencyTableData.map((item, ind) =>
          ind.toString()
        )
        state.currencyValue = verifyTempStore.setTemplateCurrencyLValue()
      } else {
        state.currencyStrValue = []
        state.currencyValue = []
      }

      state.canSetMore = verifyTempStore.settingItem.canSetMore
    }
  }
)

const showFromItem = computed(() => {
  return (
    !_.isEmpty(verifyTempStore.settingItem) &&
    !['defaultTemplate', 'amountDetail', 'part'].includes(
      verifyTempStore.settingItem.type
    )
  )
})

const showPlaceholder = computed(() => {
  return ['input', 'staticText', 'number', 'amount', 'date_interval'].includes(
    verifyTempStore.settingItem.type
  )
})

const showOptionCom = computed(() => {
  return ['select', 'checkbox', 'radio'].includes(
    verifyTempStore.settingItem.type
  )
})

const showDatePicker = computed(() => {
  return verifyTempStore.settingItem.type == 'date_interval'
})

const showSwitch = computed(() => {
  return verifyTempStore.settingItem.type == 'switch'
})

const showCurrency = computed(() => {
  return verifyTempStore.settingItem.type == 'amount'
})
const showDetailSwitch = computed(() => {
  return verifyTempStore.settingItem.type == 'part'
})
const showTable = computed(() => {
  return verifyTempStore.settingItem.type == 'amountDetail'
})
const showTemplate = computed(() => {
  return verifyTempStore.settingItem.type == 'defaultTemplate'
})

const getValueSetStore = (
  value: string | boolean | string[] | TCurrency[],
  keyword: string
) => {
  const settingItem = AppUtils.deepCloneData(
    verifyTempStore.settingItem
  ) as TCenterList

  // @ts-ignore
  settingItem[keyword] = value

  verifyTempStore.setSettingData(settingItem)
  verifyTempStore.setSetDataInList(
    settingItem.centerIndex,
    settingItem.indexInPart,
    settingItem
  )
}

const removeOption = (idx: number) => {
  const lastLimit = verifyTempStore.settingItem.type == 'radio' ? 2 : 3
  if (state.optionList.length < lastLimit) {
    ElMessage.warning(`至少保留${lastLimit - 1}个选项`)
  } else {
    state.optionList.splice(idx, 1)
  }
}

const addOption = () => {
  state.optionList.push('新选项')
}

const getDateRangeValueSetStore = () => {
  getValueSetStore(state.timerPlaceholder, 'timerPlaceholder')
}

watch(
  () => state.optionList,
  () => {
    getValueSetStore(state.optionList, 'options')
  },
  { deep: true }
)

const showErrorTitleContent = computed(() => {
  return _.isEmpty(state.inputValue)
})
const showErrorAmountContent = computed(() => {
  return _.isEmpty(state.currencyValue)
})

const currOptions = currencyOptions.map((_, ind) => {
  return {
    label: _,
    value: ind.toString()
  }
})
</script>

<template>
  <div class="title">
    {{ verifyTempStore.settingItem.name || '字段属性' }}
  </div>
  <div
    class="sub-title sub-number"
    v-if="verifyTempStore.settingItem.type == 'number'"
  >
    身份证、银行卡等超过15位数的情境，建议使用单行输入框
  </div>

  <div class="option-content">
    <div
      class="form-box"
      v-if="showFromItem || showDetailSwitch || showTemplate || showTable"
    >
      <div class="tooltip-box">
        <div class="label">
          <span class="text-red-require mr-1">*</span>标题:
        </div>
      </div>
      <el-input
        :disabled="showTemplate || showTable"
        maxlength="16"
        :placeholder="verifyTempStore.settingItem.titlePlaceholder"
        v-model="state.inputValue"
        @input="getValueSetStore(state.inputValue, 'titleValue')"
        clearable
        :class="{ 'require-title': showErrorTitleContent }"
      />
      <span v-if="showErrorTitleContent" class="text-red text-xs"
        >标题不可为空</span
      >
    </div>

    <div class="form-box" v-if="showPlaceholder">
      <div class="tooltip-box">
        <div class="label">提示:</div>
        <el-tooltip
          effect="light"
          content="输入框为空值时，则于框内呈现此资讯"
          placement="bottom-start"
        >
          <el-icon><QuestionFilled /></el-icon>
        </el-tooltip>
      </div>
      <div v-if="showDatePicker">
        <el-input
          @input="getDateRangeValueSetStore"
          v-model="state.timerPlaceholder[0]"
        />
        <el-input
          @input="getDateRangeValueSetStore"
          class="mt-2"
          v-model="state.timerPlaceholder[1]"
        />
      </div>

      <el-input
        v-else
        maxlength="12"
        :placeholder="verifyTempStore.settingItem.hintPlaceholder"
        v-model="state.hintValue"
        @input="getValueSetStore(state.hintValue, 'hintValue')"
        clearable
      />
    </div>

    <div class="form-box" v-if="showCurrency">
      <div class="tooltip-box">
        <div class="label">币种: <span class="text-red">*</span></div>
        <el-tooltip
          effect="light"
          content="选择多币种后，提交人可在该范围内自选"
          placement="bottom-start"
        >
          <el-icon><QuestionFilled /></el-icon>
        </el-tooltip>
      </div>
      <el-select
        class="w-full"
        :class="{ 'require-title': showErrorAmountContent }"
        multiple
        clearable
        collapse-tags
        collapse-tags-tooltip
        :max-collapse-tags="2"
        v-model="state.currencyStrValue"
        disabled
      >
        <el-option
          v-for="(item, index) in currOptions"
          :value="item.value"
          :label="item.label"
          :key="index"
        >
        </el-option>
      </el-select>
      <span v-if="showErrorAmountContent" class="text-red text-xs"
        >币种不可为空</span
      >

      <div class="hint flex flex-wrap items-center" v-else>
        <p>金额显示千位分隔符及小数点后 2 位数，</p>
        <p>如：123,456.12 金额显示</p>
      </div>
    </div>

    <div class="form-box" v-if="showOptionCom">
      <div class="label">选项:</div>
      <draggable
        :list="state.optionList"
        :group="{ name: 'options' }"
        ghostClass="ghost"
        :delay="200"
        item-key="id"
      >
        <template #item="{ element, index }">
          <div class="option-box">
            <el-icon class="drag-icon"><MoreFilled /></el-icon>
            <el-input maxlength="10" v-model="state.optionList[index]">
            </el-input>
            <el-icon class="del-icon" @click.stop="removeOption(index)"
              ><Delete
            /></el-icon>
          </div>
        </template>
      </draggable>

      <el-button @click="addOption" class="add-option"> 添加选项 </el-button>
    </div>

    <div class="form-box" v-if="showSwitch">
      <div class="label">默认选中:</div>
      <el-switch
        active-text="开"
        inactive-text="关"
        @change="getValueSetStore(state.switchValue, 'defaultValue')"
        v-model="state.switchValue"
      />
    </div>

    <div class="form-box" v-if="showFromItem">
      <div class="tooltip-box">
        <div class="label">辅助说明:</div>
        <el-tooltip
          effect="light"
          content="输入框下方将呈现此资讯"
          placement="bottom-start"
        >
          <el-icon><QuestionFilled /></el-icon>
        </el-tooltip>
      </div>
      <el-input
        v-model="state.staticText"
        resize="none"
        type="textarea"
        :placeholder="verifyTempStore.settingItem.helpPlaceholder"
        @input="getValueSetStore(state.staticText, 'helpValue')"
        show-word-limit
        maxlength="50"
        :max="50"
        :rows="5"
        :disabled="
          ['file', 'amount'].includes(verifyTempStore.settingItem.type)
        "
      />
    </div>

    <div
      class="form-box"
      v-if="showFromItem && verifyTempStore.settingItem.type != 'switch'"
    >
      <div class="label">必填:</div>
      <el-switch
        active-text="开"
        inactive-text="关"
        v-model="state.isRequired"
        @change="getValueSetStore(state.isRequired, 'required')"
      />
    </div>

    <div class="form-box" v-if="showDetailSwitch || showTemplate">
      <div class="label">排列方式:</div>
      <el-radio-group v-model="state.displayRadio">
        <el-radio label="纵向明细">纵向明细</el-radio>
        <el-radio disabled label="横向明细">横向明细</el-radio>
      </el-radio-group>
    </div>

    <div class="form-box" v-if="showDetailSwitch || showTemplate">
      <div class="tooltip-box">
        <div class="label">
          {{ showDetailSwitch ? '添加明细设置' : '添加更多' }}:
        </div>
        <el-tooltip
          effect="light"
          content="最多可添加至50笔"
          placement="bottom-start"
        >
          <el-icon><QuestionFilled /></el-icon>
        </el-tooltip>
      </div>
      <el-switch
        :disabled="showTemplate"
        active-text="开"
        inactive-text="关"
        v-model="state.canSetMore"
        @change="getValueSetStore(state.canSetMore, 'canSetMore')"
      />
    </div>
    <div class="form-box" v-if="showTable">
      <div class="tooltip-box">
        <div class="label">币种:</div>
      </div>

      <div class="sub-label">
        <p>币种支援如下表呈现，若需扩增币种项目，</p>
        <p>请反馈系统管理员</p>
      </div>
      <el-table :data="currencyTableData" class="currency-table">
        <el-table-column type="index" width="50" label="No." align="left">
          <template #default="{ row, column, $index }">
            {{ $index + 1 < 10 ? `0${$index + 1}` : $index + 1 }}
          </template>
        </el-table-column>
        <el-table-column prop="cn" label="币种" align="left" />
        <el-table-column prop="en" label="缩写" align="left" />
      </el-table>
    </div>
    <div class="form-box" v-if="showTable">
      <div class="tooltip-box">
        <div class="label">收款资讯:</div>
      </div>
      <el-table :data="payInDetailTable" class="currency-table">
        <el-table-column prop="currency" label="币种" align="left" />
        <el-table-column prop="detail" label="收款资讯" align="left" />
      </el-table>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.title {
  @apply text-center text-sm mb-1 text-text-breadcrumb;
}
.sub-title {
  @apply text-xs text-center mb-4;
}
.sub-number {
  @apply text-text-subLabel;
}

.option-content {
  @apply flex flex-col w-full h-full;
  @apply overflow-y-auto mt-4;

  .form-box {
    .label {
      @apply text-sm text-text-labelText;
    }
    .sub-label {
      @apply text-xs mt-1 mb-2;
      @apply flex flex-wrap items-center;
      @apply text-text-subLabel;

      .bold-label {
        @apply font-semibold text-text;
      }
    }
    .add-option {
      @apply mt-4;
    }

    .tooltip-box {
      @apply flex items-center mb-2;

      .el-icon {
        @apply ml-2 text-bg-messagePop cursor-pointer text-sm;

        &:hover {
          @apply text-primary;
        }
      }
    }
  }

  .form-box + .form-box {
    @apply mt-4;
  }
}

.option-box {
  @apply flex items-center mt-2;

  .drag-icon {
    @apply text-text-breadcrumb mr-2;
    @apply origin-center rotate-90;

    &:hover {
      @apply cursor-grab text-text;
    }
  }

  .del-icon {
    @apply text-text-breadcrumb cursor-pointer ml-2;

    &:hover {
      @apply text-red;
    }
  }
}
.hint {
  @apply text-xs text-text/30 mt-1;

  &_bold {
    @apply font-bold underline;
  }
}

.require-title {
  ::v-deep() {
    .el-input__wrapper {
      @apply border border-red shadow-none;
    }
  }
}
.currency-table {
  @apply border-l-0;

  ::v-deep() {
    .el-table__cell {
      @apply py-1 leading-5;
    }
    .el-table__header {
      .el-table__cell {
        @apply text-text-tabText font-medium text-sm;
      }
    }
    .el-table__row {
      .el-table__cell {
        @apply text-sm text-text-labelText;
      }
    }
  }
}
</style>
