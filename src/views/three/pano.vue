<template>
  <div class="w-full h-full select-none" ref="containerRef"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'
import texture1 from '../../assets/imgs/pano/pano1.jpg'

const containerRef = ref<HTMLDivElement | null>(null)

const sceneObj = ref<THREE.Scene | null>(null)
const cameraObj = ref<THREE.PerspectiveCamera | null>(null)
const rendererObj = ref<THREE.WebGLRenderer | null>(null)

let isUserInteracting = false,
  onPointerDownMouseX = 0,
  onPointerDownMouseY = 0,
  lon = 0,
  onPointerDownLon = 0,
  lat = 0,
  onPointerDownLat = 0,
  phi = 0,
  theta = 0

function onPointerDown(event) {
  if (event.isPrimary === false) return
  isUserInteracting = true
  onPointerDownMouseX = event.clientX
  onPointerDownMouseY = event.clientY
  onPointerDownLon = lon
  onPointerDownLat = lat
  document.addEventListener('pointermove', onPointerMove)
  document.addEventListener('pointerup', onPointerUp)
}

function onPointerMove(event) {
  if (event.isPrimary === false) return
  lon = (onPointerDownMouseX - event.clientX) * 0.1 + onPointerDownLon
  lat = (event.clientY - onPointerDownMouseY) * 0.1 + onPointerDownLat
}

function onPointerUp(event) {
  if (event.isPrimary === false) return
  isUserInteracting = false
  document.removeEventListener('pointermove', onPointerMove)
  document.removeEventListener('pointerup', onPointerUp)
}

const initScene = (containerRef: HTMLDivElement) => {
  const scene = new THREE.Scene()
  const width = containerRef.clientWidth
  const height = containerRef.clientHeight
  const camera = new THREE.PerspectiveCamera(75, width / height, 1, 1100)

  const geometry = new THREE.SphereGeometry(500, 60, 40)
  // invert the geometry on the x-axis so that all of the faces point inward
  geometry.scale(-1, 1, 1)

  const texture = new THREE.TextureLoader().load(texture1)
  const material = new THREE.MeshBasicMaterial({ map: texture })

  const mesh = new THREE.Mesh(geometry, material)

  scene.add(mesh)

  const renderer = new THREE.WebGLRenderer()
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(width, height)
  containerRef.appendChild(renderer.domElement)

  containerRef.style.touchAction = 'none'
  containerRef.addEventListener('pointerdown', onPointerDown)

  return { scene, camera, renderer }
}

// 获取点击事件
const getClickEvent = (event: MouseEvent) => {
  // console.log('event: ', event);
  // console.log('cameraObj: ', cameraObj.value);
}

// 浏览器大小变动时，触发引擎的重载状态
const onWindowResize = () => {
  const width = containerRef.value?.clientWidth
  const height = containerRef.value?.clientHeight
  if (!width || !height || !cameraObj.value || !rendererObj.value) return
  cameraObj.value.aspect = width / height
  cameraObj.value.updateProjectionMatrix()
  rendererObj.value.setSize(width, height)
}

onMounted(() => {
  if (!containerRef.value) return

  const { scene, camera, renderer } = initScene(containerRef.value)
  sceneObj.value = scene
  cameraObj.value = camera
  rendererObj.value = renderer

  // 循环渲染，性能最大每秒六十帧
  const animate = () => {
    requestAnimationFrame(animate)

    if (isUserInteracting === false) {
      lon += 0.1
    }
    lat = Math.max(-85, Math.min(85, lat))
    phi = THREE.MathUtils.degToRad(90 - lat)
    theta = THREE.MathUtils.degToRad(lon)
    const x = 500 * Math.sin(phi) * Math.cos(theta)
    const y = 500 * Math.cos(phi)
    const z = 500 * Math.sin(phi) * Math.sin(theta)
    camera.lookAt(x, y, z)

    renderer.render(scene, camera)
  }
  animate()

  // 点击监听
  containerRef.value.addEventListener('click', getClickEvent)
  // 窗口监听
  window.addEventListener('resize', onWindowResize)
})

onUnmounted(() => {
  if (!containerRef.value) return
  // 销毁点击监听
  containerRef.value.removeEventListener('click', getClickEvent)
  // 销毁窗口监听
  window.removeEventListener('resize', onWindowResize)
})
</script>
