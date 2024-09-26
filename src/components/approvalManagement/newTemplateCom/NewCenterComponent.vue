<script setup lang="ts">
import { TCenterList, TVerifyComponent } from '@/types/baseType'
import {
  CopyDocument,
  Delete,
  Calendar,
  Upload,
  ArrowDown
} from '@element-plus/icons-vue'
import { verifyTempStore } from '@/stores/verifyTemplateStore'
import AppUtils from '@/utils/appUtils'

const props = defineProps({
  element_detail: {
    type: Object,
    default: {} as TVerifyComponent
  },
  element_index_in_part: {
    type: Number,
    default: 0
  },
  element_index: {
    type: Number,
    default: 0
  },
  is_in_part: {
    type: Boolean,
    default: false
  }
})

const elementType = computed(() => {
  return props.element_detail.type
})
const isActive = computed(() => {
  return props.element_detail.isActive
})
const comRequire = computed(() => {
  return props.element_detail.required
})
const inputPlaceholder = computed(() => {
  return elementType.value == 'date_interval'
    ? `${props.element_detail.timerPlaceholder[0]} ~ ${props.element_detail.timerPlaceholder[1]}`
    : props.element_detail.hintValue
})

const showCopyIcon = computed(() => {
  if (props.is_in_part) {
    return !['amount', 'number'].includes(props.element_detail.type)
  }
  return true
})
const copyComponent = () => {
  const copyData = AppUtils.deepCloneData(props.element_detail) as TCenterList
  copyData.isActive = false
  if (props.is_in_part) {
    verifyTempStore.copyCenterItem(
      copyData,
      props.element_index,
      props.element_index_in_part
    )
  } else {
    verifyTempStore.copyCenterItem(copyData, props.element_index)
  }
}
const removeComponent = () => {
  const itemId = props.element_detail?.itemId!
  if (props.is_in_part) {
    verifyTempStore.delCenterItem(
      props.element_index,
      props.element_index_in_part,
      itemId
    )
  } else {
    verifyTempStore.delCenterItem(props.element_index, 99999, itemId)
  }
}
const setActiveBorderInPart = () => {
  if (props.is_in_part) {
    verifyTempStore.setSettingData({
      ...(props.element_detail as TCenterList),
      centerIndex: props.element_index,
      indexInPart: props.element_index_in_part
    })
  } else {
    verifyTempStore.setSettingData({
      ...(props.element_detail as TCenterList),
      centerIndex: props.element_index
    })
  }
  verifyTempStore.setStoreActiveBorderInPart(
    props.element_index,
    props.element_index_in_part
  )
}
</script>

<template>
  <div class="component" @click.stop.prevent="setActiveBorderInPart">
    <div
      class="component-box"
      :class="{
        'active-border': isActive,
        'border-inPart': props.is_in_part
      }"
    >
      <div class="component-box_title">
        <div class="component-box_req">
          <span v-if="comRequire"> * </span>
        </div>
        {{ props.element_detail.titleValue }} :
      </div>
      <div class="component-box_content">
        <el-input
          class="currency-input"
          readonly
          v-if="
            [
              'input',
              'number',
              'amount',
              'staticText',
              'date_interval'
            ].includes(elementType)
          "
          :placeholder="inputPlaceholder"
          rows="3"
          :type="elementType == 'staticText' ? 'textarea' : 'text'"
          resize="none"
        >
          <template #append>
            <div class="detail" v-if="elementType == 'amount'">
              <div class="detail-border"></div>
              <el-tooltip
                v-if="props.element_detail?.currencyValue.length > 0"
                effect="light"
              >
                <template #content>
                  <p v-for="item in props.element_detail?.currencyValue">
                    {{
                      item.enName != item.cnName
                        ? `${item.enName}-${item.cnName}`
                        : item.enName
                    }}
                  </p>
                </template>
                <div class="text-primary">币别</div>
              </el-tooltip>
              <p v-else>币别</p>
            </div>
          </template>
        </el-input>

        <el-input
          v-if="['select', 'date'].includes(elementType)"
          readonly
          :suffix-icon="elementType == 'select' ? ArrowDown : Calendar"
          :placeholder="inputPlaceholder"
        />

        <el-radio-group v-if="elementType == 'radio'">
          <el-radio
            v-for="item in props.element_detail.options"
            :label="item"
          />
        </el-radio-group>
        <el-checkbox-group :max="0" v-if="elementType == 'checkbox'">
          <el-row>
            <el-col :span="12" v-for="item in props.element_detail.options">
              <el-checkbox :label="item" />
            </el-col>
          </el-row>
        </el-checkbox-group>

        <el-button v-if="elementType == 'file'" plain :icon="Upload"
          >点击上传</el-button
        >
        <el-switch
          disabled
          v-model="props.element_detail.defaultValue"
          v-if="elementType == 'switch'"
        ></el-switch>
      </div>
    </div>

    <div class="outside-button">
      <div class="outside-button_option" v-show="isActive">
        <el-icon v-if="showCopyIcon" @click.stop="copyComponent"
          ><CopyDocument
        /></el-icon>
        <el-icon @click.stop="removeComponent"><Delete /></el-icon>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.component {
  @apply flex items-start;

  &-box {
    @apply text-sm bg-white  rounded shadow;
    @apply p-4 w-full flex items-start;

    &_title {
      @apply flex items-start justify-end mr-4 w-max;
      line-height: 30px;
    }
    &_req {
      @apply w-1 mr-1;
      @apply text-red text-xs mt-1;
    }

    &_content {
      @apply w-full flex-1;

      .el-input,
      .el-textarea {
        @apply w-4/5;
      }
      .el-checkbox-group {
        @apply w-4/5;
      }
    }
  }
}

.currency-input {
  ::v-deep() {
    .el-input__wrapper {
      @apply border-r-0 border shadow-none border-secondary-borderColor;
    }
    .is-focus {
      @apply border-primary-focusBorder;
    }
    .is-focus ~ .el-input-group__append {
      @apply border-primary-focusBorder border border-l-0;
      @apply shadow-none;
    }
    .el-input-group__append {
      @apply bg-white px-2;

      .detail {
        @apply flex items-center;

        &-border {
          @apply mx-2 w-px bg-bg-messagePop h-6;
        }
      }
    }
  }
}
.border-inPart {
  @apply bg-bg-light;
}
</style>
