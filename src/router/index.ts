import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router'
import BaseLayout from '@/components/layouts/BaseLayout.vue';
import babylonTexture from '@/views/babylon/webgl/texture.vue';
import babylonTextureGPU from '@/views/babylon/webgpu/texture.vue';
import babylonShader from '@/views/babylon/webgl/shader.vue';
import babylonShaderGPU from '@/views/babylon/webgpu/shader.vue';
import babylonParticles from '@/views/babylon/webgl/particles.vue';
import babylonParticlesGPU from '@/views/babylon/webgpu/particles.vue';
import threeTexture from '@/views/three/texture.vue';
import threePano from '@/views/three/pano.vue';

const routes = [
  {
    path: '/',
    redirect: '/babylon/texture',
    name: 'Root',
  },
  {
    path: '/babylon',
    name: 'babylon',
    component: BaseLayout,
    children: [
      {
        path: 'texture',
        component: babylonTexture,
        name: 'babylonTexture'
      },
      {
        path: 'textureGPU',
        component: babylonTextureGPU,
        name: 'babylonTextureGPU'
      },
      {
        path: 'shader',
        component: babylonShader,
        name: 'babylonShader'
      },
      {
        path: 'shaderGPU',
        component: babylonShaderGPU,
        name: 'babylonShaderGPU'
      },
      {
        path: 'particles',
        component: babylonParticles,
        name: 'babylonParticles'
      },
      {
        path: 'particlesGPU',
        component: babylonParticlesGPU,
        name: 'babylonParticlesGPU'
      }
    ]
  },
  {
    path: '/three',
    name: 'three',
    component: BaseLayout,
    children: [
      {
        path: 'texture',
        component: threeTexture,
        name: 'threeTexture'
      },
      {
        path: 'pano',
        component: threePano,
        name: 'threePano'
      }
    ]
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes: routes as RouteRecordRaw[]
});

export default router;