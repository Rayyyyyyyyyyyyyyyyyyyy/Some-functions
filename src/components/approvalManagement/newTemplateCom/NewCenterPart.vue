<script setup lang="ts">
import { TCenterList, TVerifyComponent } from '@/types/baseType'
import { CopyDocument, Delete } from '@element-plus/icons-vue'
import draggable from 'vuedraggable'
import NewCenterComponent from '@/components/approvalManagement/newTemplateCom/NewCenterComponent.vue'
import { verifyTempStore } from '@/stores/verifyTemplateStore'
import AppUtils from '@/utils/appUtils'

const props = defineProps({
  element_detail: {
    type: Object,
    default: {} as TVerifyComponent
  },
  element_index: {
    type: Number,
    default: 0
  }
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

const isActive = computed(() => {
  return props.element_detail.isActive
})
const setPartDataIntoStoreSetting = () => {
  verifyTempStore.setSettingData({
    ...(props.element_detail as TCenterList),
    centerIndex: props.element_index
  })
}
</script>

<template>
  <div class="component" @click.stop.prevent="setPartDataIntoStoreSetting">
    <div :class="{ 'active-border': isActive }" class="card">
      <div class="card_title">{{ props.element_detail.titleValue }} :</div>
      <div class="drag-block">
        <draggable
          :list="props.element_detail.children"
          animation="150"
          group="people"
          class="part-content"
          :item-key="props.element_detail.type"
          :delay="200"
        >
          <template #item="{ element, index }">
            <NewCenterComponent
              :element_index_in_part="index"
              is_in_part
              class="my-2"
              :element_detail="element"
              :element_index="element_index"
            />
          </template>
        </draggable>
      </div>
    </div>

    <div class="outside-button">
      <div class="outside-button_option" v-show="isActive">
        <el-icon @click.stop="copyComponent"><CopyDocument /></el-icon>
        <el-icon @click.stop="removeComponent"><Delete /></el-icon>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.component {
  @apply flex items-start;

  .card {
    @apply bg-white rounded p-4 border w-full;

    &_title {
      @apply text-sm;
    }

    .drag-block {
      @apply w-full;

      .part-content {
        @apply rounded;

        &:after {
          content: '+ 拖曳左侧元件至此';
          @apply text-text-breadcrumb py-2 rounded;
          @apply text-sm w-full bg-menu-headerHoverBg;
          @apply h-24 mt-2;
          @apply flex items-center justify-center;
        }
      }
    }
  }
}
</style>
