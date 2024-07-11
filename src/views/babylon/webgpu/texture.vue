<template>
  <canvas class="w-full h-full" ref="canvasRef"></canvas>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import * as BABYLON from '@babylonjs/core'
import { Mesh } from '@babylonjs/core'
import '@babylonjs/loaders'
import texture1 from '@/assets/imgs/texture/normalMap.jpg'
import texture2 from '@/assets/imgs/texture/bump_photo.png'
import texture3 from '@/assets/imgs/texture/grass.jpg'

const canvasRef = ref<HTMLCanvasElement | null>(null)

const count = 1000

// 自适应视角
const fitToRender = (camera, allSpheres: Mesh[]) => {
  // 计算所有球体位置的平均值作为目标点
  let target = new BABYLON.Vector3(0, 0, 0)
  allSpheres.forEach((sphere) => {
    target.addInPlace(sphere.position)
  })
  target.scaleInPlace(1 / allSpheres.length)
  // 调整相机位置和目标
  camera.setTarget(target)
  camera.setPosition(new BABYLON.Vector3(target.x, target.y, target.z + 15)) // 增加Z坐标以远离物体群
}

const createScene = (canvasRef: HTMLCanvasElement, engine: BABYLON.Engine) => {
  var scene = new BABYLON.Scene(engine)
  var camera = new BABYLON.ArcRotateCamera(
    'Camera',
    -Math.PI / 2,
    Math.PI / 4,
    5,
    BABYLON.Vector3.Zero(),
    scene
  )
  camera.attachControl(canvasRef, true)

  //左上方放置平行光
  var light = new BABYLON.HemisphericLight('hemiLight', new BABYLON.Vector3(-1, 1, 0), scene)
  light.diffuse = new BABYLON.Color3(1, 1, 1)

  var mat0 = new BABYLON.StandardMaterial('mat0', scene)
  mat0.diffuseColor = new BABYLON.Color3(1, 0, 0)
  mat0.bumpTexture = new BABYLON.Texture(texture1, scene) //设置凹凸纹理

  var mat1 = new BABYLON.StandardMaterial('mat1', scene)
  mat1.diffuseTexture = new BABYLON.Texture(texture2, scene)
  mat1.bumpTexture = new BABYLON.Texture(texture1, scene) //设置凹凸纹理

  var mat2 = new BABYLON.StandardMaterial('mat2', scene)
  mat2.diffuseTexture = new BABYLON.Texture(texture3, scene)
  mat2.bumpTexture = new BABYLON.Texture(texture1, scene) //设置凹凸纹理

  //颜色和凹凸纹理
  var sphere0 = BABYLON.MeshBuilder.CreateSphere('sphere0', {}, scene)
  sphere0.position.x = -1.5
  sphere0.material = mat0

  //正确图片和凹凸纹理
  var sphere1 = BABYLON.MeshBuilder.CreateSphere('sphere1', {}, scene)
  sphere1.material = mat1

  //其它图片和凹凸纹理
  var sphere2 = BABYLON.MeshBuilder.CreateSphere('sphere2', {}, scene)
  sphere2.material = mat2
  sphere2.position.x = 1.5

  // let allSpheres = [];
  // for (let i = 0; i < count; i++) {
  //   let x = Math.floor(Math.random() * 10);
  //   let y = Math.floor(Math.random() * 10);
  //   //其它图片和凹凸纹理
  //   var sphere = BABYLON.MeshBuilder.CreateSphere(`sphere${i}`, {}, scene);
  //   sphere.material = mat2;
  //   sphere.position.x = x;
  //   sphere.position.y = y;
  //   allSpheres.push(sphere);
  // }

  // fitToRender(camera, allSpheres)

  return scene
}

onMounted(async () => {
  if (!canvasRef.value) return

  const engine = new BABYLON.WebGPUEngine(canvasRef.value, { antialias: true })
  await engine.initAsync()
  const scene = createScene(canvasRef.value, engine)

  // 循环渲染，性能最大每秒六十帧
  engine.runRenderLoop(() => {
    scene.render()
  })

  // 浏览器大小变动时，触发引擎的重载状态
  window.addEventListener('resize', function () {
    engine.resize()
  })
})
</script>
