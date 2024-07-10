<template>
  <div class="flex main-container">
    <BaseSide />
    <div w="full overflow-hidden">
      <button
        class="border-none w-40px !h-40px bg-transparent cursor-pointer position-absolute top-4 right-4"
        style="height: var(--ep-menu-item-height)"
        @click="toggleDark()"
      >
        <i inline-flex i="dark:ep-moon ep-sunny" class="text-white" />
      </button>
      <router-view />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { toggleDark } from "~/composables";
</script>
<style>
.main-container {
  height: calc(100vh);
}
</style>
