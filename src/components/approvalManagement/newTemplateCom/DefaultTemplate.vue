<script setup lang="ts">
import { CopyDocument, Delete } from '@element-plus/icons-vue'
import { TCenterList, TDefaultTemplate } from '@/types/baseType'
import { currencyOptions, feeTypeOption } from '@/const/appConst'
import { verifyTempStore } from '@/stores/verifyTemplateStore'
import AppUtils from '@/utils/appUtils'

const props = defineProps({
  element_detail: {
    type: Object,
    default: {} as TDefaultTemplate
  },
  element_index: {
    type: Number,
    default: 0
  }
})

const isActive = computed(() => {
  return props.element_detail.isActive
})

const copyComponent = () => {
  const copyData = AppUtils.deepCloneData(props.element_detail) as TCenterList
  copyData.isActive = false
  verifyTempStore.copyCenterItem(copyData, props.element_index)
}
const removeComponent = () => {
  const itemId = props.element_detail?.itemId!

  verifyTempStore.delCenterItem(props.element_index, 99999, itemId)
}
const setTemplateDataIntoStoreSetting = () => {
  verifyTempStore.setActiveBorder(props.element_index)

  verifyTempStore.setSettingData({
    ...(props.element_detail as TCenterList),
    centerIndex: props.element_index
  })
}

const childrenList = computed(() => {
  return props.element_detail.children
})
const canCopy = computed(() => {
  const defaultTemplateCount = verifyTempStore.centerList.filter(
    item => item.type == 'defaultTemplate'
  ).length
  const amountTemplateCount = verifyTempStore.centerList.filter(
    item => item.type == 'amountDetail'
  ).length
  return (
    (!(defaultTemplateCount > 1) || !(amountTemplateCount > 1)) &&
    !['defaultTemplate', 'amountDetail'].includes(props.element_detail.type)
  )
})
</script>

<template>
  <div
    class="default-component"
    @click.stop.prevent="setTemplateDataIntoStoreSetting"
  >
    <div class="card" :class="{ 'active-border': isActive }">
      <div class="card_title">
        {{ props.element_detail.name }}
      </div>

      <div class="item-box" v-for="child in childrenList">
        <div class="item-box_label">
          <div class="item-box_req">
            <span v-if="child.required"> * </span>
          </div>
          {{ child.itemName }}：
        </div>
        <div class="item-box_content">
          <el-select v-if="child.elementKey == 'feeType'">
            <el-option
              v-for="(item, index) in feeTypeOption"
              :label="item.label"
              :value="item.value"
              :key="index"
            ></el-option>
          </el-select>
          <div class="upload-comp" v-else-if="child.itemName == '附件'">
            <el-button>
              <el-icon><Upload /></el-icon>
              点击上传
            </el-button>
            <p class="hint">{{ child.placeholder }}</p>
          </div>

          <el-input
            class="currency-input"
            v-else-if="child.elementKey == 'amount'"
            :placeholder="child.placeholder"
            readonly
          >
            <template #append>
              <div class="detail">
                <p>元</p>
                <div class="detail-border"></div>
                <el-tooltip effect="light">
                  <template #content>
                    <p v-for="item in currencyOptions">{{ item }}</p>
                  </template>
                  <div class="currency-box">CNY-人民币</div>
                </el-tooltip>
              </div>
            </template>
          </el-input>
          <el-input
            v-else
            readonly
            :type="child.elementKey == 'staticText' ? 'textarea' : 'text'"
            rows="5"
            :show-word-limit="child.elementKey == 'staticText'"
            maxlength="1000"
            :resize="child.itemName == '說明' ? 'none' : 'vertical'"
            :placeholder="child.placeholder"
          ></el-input>
        </div>
      </div>
    </div>
    <div class="outside-button">
      <div class="outside-button_option" v-show="isActive">
        <el-icon v-if="canCopy" @click.stop="copyComponent"
          ><CopyDocument
        /></el-icon>
        <el-icon @click.stop="removeComponent"><Delete /></el-icon>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.default-component {
  @apply flex items-start;
}

.card {
  @apply bg-white rounded p-4 border w-full;
  @apply shadow;

  &_title {
    @apply font-bold text-sm;
  }

  .item-box {
    @apply flex items-start text-sm mt-4;

    &_req {
      @apply w-1 mr-1;
      @apply text-red text-xs mt-1;
    }

    &_label {
      @apply mr-2 leading-8 w-24;
      @apply flex items-start justify-end;
    }

    &_content {
      @apply flex-1;

      .el-select,
      .el-input {
        @apply w-full;
      }

      .upload-comp {
        @apply flex items-center;

        .hint {
          @apply ml-4 text-sm text-menu-arrowColor;
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
    }
  }
}
</style>
