<template>
  <el-config-provider namespace="ep">
    <router-view />
  </el-config-provider>
</template>

<script lang="ts" setup>
// import { toggleDark } from "~/composables";
</script>
<style>
#app {
  text-align: center;
  color: var(--ep-text-color-primary);
}

.main-container {
  height: calc(100vh);
}
</style>
