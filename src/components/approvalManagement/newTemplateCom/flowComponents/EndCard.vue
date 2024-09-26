<script setup lang="ts">
import { verifyTempStore } from '@/stores/verifyTemplateStore'
</script>

<template>
  <div class="end-dot">
    <div class="line" />

    <svg-icon :width="24" :height="24" name="end-dot"></svg-icon>
    <p
      class="end-hint"
      v-if="verifyTempStore.step === 4 || !verifyTempStore.verifyTWriteOff"
    >
      系统结束审批流程
    </p>

    <p
      class="end-hint"
      v-if="verifyTempStore.step === 3 && verifyTempStore.verifyTWriteOff"
    >
      请于 Step 4 进行核销流程设置
    </p>
  </div>
</template>

<style lang="scss" scoped>
.end-dot {
  @apply flex flex-col;
  @apply items-center justify-center;
  @apply cursor-auto;

  .end-hint {
    @apply text-sm text-text-subLabel;
    @apply mt-3;
  }
}
</style>
