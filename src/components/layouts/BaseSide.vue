<template>
  <div class="w-300px border-r-[1px] border-r-solid border-r-[rgba(0,_0,_0,_0.07)]">
    <el-row class="p-5px">
      <el-input v-model="input" class="w-full border-none" placeholder="搜索" />
      <el-divider class="mt-5px mb-5px" />
    </el-row>
    <el-menu
      default-active="1-1"
      :default-openeds="['1', '2']"
      class="el-menu-vertical-demo"
      :collapse="isCollapse"
      @open="handleOpen"
      @close="handleClose"
    >
      <el-sub-menu index="1">
        <template #title>
          <el-icon><PriceTag /></el-icon>
          <span>BabylonJS</span>
        </template>
        <el-menu-item-group title="WebGPU">
          <router-link to="/babylon/textureGPU">
            <el-menu-item index="1-1">材质</el-menu-item>
          </router-link>
          <router-link to="/babylon/shaderGPU">
            <el-menu-item index="1-2">着色器</el-menu-item>
          </router-link>
          <router-link to="/babylon/particlesGPU">
            <el-menu-item index="1-3">渲染树</el-menu-item>
          </router-link>
        </el-menu-item-group>
        <el-menu-item-group title="WebGL">
          <router-link to="/babylon/texture">
            <el-menu-item index="1-10">材质</el-menu-item>
          </router-link>
          <router-link to="/babylon/shader">
            <el-menu-item index="1-11">着色器</el-menu-item>
          </router-link>
          <router-link to="/babylon/particles">
            <el-menu-item index="1-12">渲染树</el-menu-item>
          </router-link>
        </el-menu-item-group>
        <!-- <el-menu-item index="1-3">光照</el-menu-item> -->
      </el-sub-menu>
      <el-sub-menu index="2">
        <template #title>
          <el-icon><PriceTag /></el-icon>
          <span>ThereJS</span>
        </template>
        <router-link to="/three/texture">
          <el-menu-item index="2-1">材质</el-menu-item>
        </router-link>
        <router-link to="/three/pano">
          <el-menu-item index="2-2">全景图</el-menu-item>
        </router-link>
        <!-- <el-menu-item index="2-2">光照</el-menu-item> -->
      </el-sub-menu>
    </el-menu>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { PriceTag } from '@element-plus/icons-vue'

const input = ref('')

const isCollapse = ref(false)
const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
</script>

<style lang="scss" scoped>
.border-none {
  :deep(.ep-input__wrapper) {
    box-shadow: none;
  }
}
.el-menu-vertical-demo {
  border: none;
  text-align: left;
  a {
    text-decoration: none;
  }
}
</style>
