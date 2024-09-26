<script setup lang="ts">
import { reactive } from 'vue'
import { verifyComponent, verifyTemplateComponent } from '@/const/verifyWidget.ts'
import draggable from 'vuedraggable'
import DefaultTemplate from '@/components/approvalManagement/newTemplateCom/DefaultTemplate.vue'
import NewCenterComponent from '@/components/approvalManagement/newTemplateCom/NewCenterComponent.vue'
import NewCenterPart from '@/components/approvalManagement/newTemplateCom/NewCenterPart.vue'
import { verifyTempStore } from '@/stores/verifyTemplateStore.ts'
import { TCenterList } from '@/types/baseType.ts'
import NewRightOption from '@/components/approvalManagement/newTemplateCom/NewRightOption.vue'
import _ from 'lodash'
import SvgIcon from '@/components/SvgIcon.vue'
import AppUtils from '@/utils/appUtils.ts'

const state = reactive({
  centerList: [] as TCenterList[]
})

onMounted(() => {
  state.centerList = verifyTempStore.centerList
})

const doCloneItem = (element: TCenterList) => {
  element.itemId = AppUtils.getRandomId()
  return AppUtils.deepCloneData(element)
}
const movingTemplateTo = (event: any) => {
  // 範本
  const toEl = event.to['className']
  // 範本不能移動到明細裡面
  if (toEl.includes('part-content')) {
    return false
  }
  if (event.draggedContext && event.draggedContext.element) {
    if (state.centerList.length > 0) {
      const defaultTemplateCount = state.centerList.filter(
        item => item.type == 'defaultTemplate'
      ).length
      const amountTemplateCount = state.centerList.filter(
        item => item.type == 'amountDetail'
      ).length
      if (
        defaultTemplateCount > 0 &&
        event.draggedContext.element.type == 'defaultTemplate'
      ) {
        return false
      }
      if (
        amountTemplateCount > 0 &&
        event.draggedContext.element.type == 'amountDetail'
      ) {
        return false
      }
    }
  }

  return true
}
const movingComponentTo = (event: any) => {
  // 元件
  // 明細不能移動到明細裡面
  const content = event.draggedContext
  if (content.element) {
    const toEl = event.to['className']
    if (content.element.type == 'part' && toEl.includes('part-content')) {
      return false
    }
    if (toEl.includes('part-content')) {
      if (content.element.type == 'amount') {
        const itemIndex = event.relatedContext.list.findIndex(
          (item: TCenterList) => item.type == 'amount'
        )
        return itemIndex == -1
      }

      if (content.element.type == 'number') {
        const itemIndex = event.relatedContext.list.findIndex(
          (item: TCenterList) => item.type == 'number'
        )
        return itemIndex == -1
      }
    }
  }
  if (!content.element) return false

  return true
}

const movingTo = (event: any) => {
  const centerItemType = event.draggedContext.element.type
  const toEl = event.to['className']
  const content = event.draggedContext

  // note 元件拖曳進入明細後不允許拖曳回總列表
  if (centerItemType == 'part') {
    if (toEl.includes('part-content')) {
      return false
    }
  }
  if (toEl.includes('part-content')) {
    // 拉進明細內的 金額 數字 只能各一
    if (content.element.type == 'amount') {
      const itemIndex = event.relatedContext.list.findIndex(
        (item: TCenterList) => item.type == 'amount'
      )
      return itemIndex == -1
    }

    if (content.element.type == 'number') {
      const itemIndex = event.relatedContext.list.findIndex(
        (item: TCenterList) => item.type == 'number'
      )
      return itemIndex == -1
    }
  }

  return true
}

const updateCenterList = () => {
  verifyTempStore.updateCenterListInStore(state.centerList)
}

watch(
  () => [...verifyTempStore.centerList],
  () => {
    state.centerList = verifyTempStore.centerList
  },
  { deep: true }
)

watch(
  () => verifyTempStore.nextClickedVisible,
  () => {
    if (verifyTempStore.nextClickedVisible) {
      nextStep(true)

      setTimeout(() => {
        verifyTempStore.updateNextClickedStatus(false)
      }, 300)
    }
  }
)

const nextStep = (isButtonClick: boolean = false) => {
  function showMessage(messageText: string = '请先配置模板信息') {
    ElMessage.error(messageText)
    verifyTempStore.jumpStepCheckForm(2)
  }
  if (state.centerList.length == 0) {
    showMessage()
    return
  }
  if (state.centerList.findIndex(item => _.isEmpty(item.titleValue)) != -1) {
    showMessage()
    return
  }
  if (
    state.centerList.findIndex(
      item => item.type == 'amount' && item.currencyValue.length == 0
    ) != -1
  ) {
    showMessage()
    return
  }
  const partTypeStrArr = ['amountDetail', 'defaultTemplate', 'part']
  const partList = state.centerList.filter(_ => partTypeStrArr.includes(_.type))
  if (partList.length > 0) {
    let emptyArr = [] as boolean[]
    partList.forEach(item => {
      item.children.forEach(child => {
        emptyArr.push(
          _.isEmpty(child.titleValue ? child.titleValue : child.itemName)
        )
        emptyArr.push(child.type == 'amount' && child.currencyValue.length == 0)
      })
    })
    if (emptyArr.findIndex(item => item) != -1) {
      showMessage()
      return
    }
  }
  let emptyPart = state.centerList.filter(
    item => item.type == 'part' && item.children.length == 0
  )
  if (emptyPart.length > 0) {
    showMessage('明细内不可无元件')
    return
  }

  if (isButtonClick) {
    verifyTempStore.goStepFromSpecify(3)
    verifyTempStore.jumpStepCheckForm(3)
  } else {
    verifyTempStore.goStepFromSpecify(verifyTempStore.jumpStep)
  }
}

watch(
  () => verifyTempStore.jumpStep,
  () => {
    if (verifyTempStore.step != verifyTempStore.jumpStep) {
      if (verifyTempStore.jumpStep == 3) {
        nextStep(false)
      } else {
        verifyTempStore.goStepFromSpecify(verifyTempStore.jumpStep)
      }
    }
  }
)
</script>

<template>
  <div class="create-container">
    <div class="aside-box aside-box_left">
      <div class="content-box">
        <div class="title">范本</div>
        <div class="component-list">
          <el-row :gutter="10" class="w-full">
            <draggable
              ghostClass="ghost"
              class="drag"
              :list="verifyTemplateComponent"
              :group="{ name: 'people', pull: 'clone', put: false }"
              :sort="false"
              :clone="doCloneItem"
              :move="movingTemplateTo"
              item-key="name"
            >
              <template #item="{ element }">
                <el-col :span="12">
                  <div class="item-box">
                    <p>
                      {{ element.name }}
                    </p>
                    <svg-icon
                      :name="element.type"
                      color="#dcdfe6"
                      :width="14"
                      :height="14"
                    ></svg-icon>
                  </div>
                </el-col>
              </template>
            </draggable>
          </el-row>
        </div>
      </div>

      <el-divider class="content-hr" />

      <div class="content-box">
        <div class="title">元件</div>
        <div class="component-list">
          <div v-for="(com, idx) in verifyComponent" :key="idx">
            <div>
              <p class="component-list-title">{{ com.category }} :</p>
              <div class="component-list-item">
                <el-row :gutter="8" class="w-full mb-6">
                  <draggable
                    ghostClass="ghost"
                    class="drag"
                    :list="com.children"
                    :group="{ name: 'people', pull: 'clone', put: false }"
                    :sort="false"
                    :clone="doCloneItem"
                    :move="movingComponentTo"
                    item-key="name"
                  >
                    <template #item="{ element }">
                      <el-col :span="12">
                        <div class="item-box">
                          <p>
                            {{ element.name }}
                          </p>
                          <svg-icon
                            :name="element.type"
                            color="#dcdfe6"
                            :width="14"
                            :height="14"
                          ></svg-icon>
                        </div>
                      </el-col>
                    </template>
                  </draggable>
                </el-row>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      @click.stop.prevent="verifyTempStore.clearStep2ActiveAndData()"
      class="center-box"
    >
      <draggable
        :list="state.centerList"
        ghostClass="center-ghost"
        group="people"
        item-key="name"
        class="center-drag"
        :move="movingTo"
        @change="updateCenterList"
      >
        <template #item="{ element, index }">
          <NewCenterPart
            class="my-2"
            v-if="element.type == 'part'"
            :element_detail="element"
            :element_index="index"
            @click.stop.prevent="verifyTempStore.setActiveBorder(index)"
          />

          <div
            class="my-2"
            v-else-if="
              ['amountDetail', 'defaultTemplate'].includes(element.type)
            "
          >
            <DefaultTemplate :element_index="index" :element_detail="element" />
          </div>

          <NewCenterComponent
            v-else
            class="my-2"
            @click.stop.prevent="verifyTempStore.setActiveBorder(index)"
            :element_detail="element"
            :element_index="index"
          />
        </template>
      </draggable>
    </div>
    <div class="aside-box aside-box_right">
      <NewRightOption />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.drag {
  @apply w-full flex items-center flex-wrap;
}
.item-box {
  @apply cursor-move w-full;
  @apply border mb-3 rounded text-sm;
  @apply flex items-center justify-between whitespace-nowrap;
  @apply px-2 py-1 border-secondary-borderColor;

  .el-icon {
    @apply text-secondary-borderColor;
  }
}

.create-container {
  @apply h-full w-full;
  @apply flex items-start;
  max-height: calc(100vh - 112px);

  .aside-box {
    @apply h-full bg-white;
    @apply overflow-hidden overflow-y-auto w-1/4;

    &_left {
      @apply p-4;
    }

    &_right {
      @apply px-5 py-4;
      @apply flex flex-col;
    }

    .content-box {
      @apply flex flex-col;

      .title {
        @apply text-text-breadcrumb text-center  text-sm  mb-4;
      }
      .component-list {
        @apply flex flex-col;

        &-title {
          @apply mb-2 text-sm text-text-labelText;
        }
      }
    }
    .content-hr {
      @apply mt-6 mb-4;
    }
  }
  .center-box {
    @apply overflow-y-scroll flex-1;
    @apply bg-bg w-full  pt-2 pl-4 h-full;

    .center-drag {
      @apply overflow-y-auto h-full pr-4;
      max-height: calc(100vh - 128px);
    }
  }
}

.footer {
  @apply flex justify-center w-full pt-6;
}
.ghost {
  &::after {
    @apply bg-bg;
  }
}
</style>
