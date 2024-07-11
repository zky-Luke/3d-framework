<template>
  <canvas class="w-full h-full" ref="canvasRef"></canvas>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import * as BABYLON from '@babylonjs/core'
import { Mesh } from '@babylonjs/core'
import '@babylonjs/loaders'
import { createTree } from '~/utils/tree'
import texture from '@/assets/imgs/texture/wood2.jpg'

const canvasRef = ref<HTMLCanvasElement | null>(null)

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

const createScene = async (canvasRef: HTMLCanvasElement, engine: BABYLON.Engine) => {
  var scene = new BABYLON.Scene(engine)

  var camera = new BABYLON.ArcRotateCamera(
    'Camera',
    (-3 * Math.PI) / 8,
    (3 * Math.PI) / 8,
    80,
    BABYLON.Vector3.Zero(),
    scene
  )

  camera.attachControl(canvasRef, false)

  // lights
  var light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(50, 50, 0), scene)
  light.intensity = 0.8

  //leaf material
  var green = new BABYLON.StandardMaterial('green', scene)
  green.diffuseColor = new BABYLON.Color3(0, 1, 0)

  //trunk and branch material
  var bark = new BABYLON.StandardMaterial('bark', scene)
  bark.emissiveTexture = new BABYLON.Texture(texture, scene)
  bark.diffuseTexture = new BABYLON.Texture(texture, scene)
  bark.diffuseTexture.uScale = 2.0 //Repeat 5 times on the Vertical Axes
  bark.diffuseTexture.vScale = 2.0 //Repeat 5 times on the Horizontal Axes

  //Tree parameters
  var trunk_height = 20
  var trunk_taper = 0.6
  var trunk_slices = 5
  var boughs = 2 // 1 or 2
  var forks = 4
  var fork_angle = Math.PI / 4
  var fork_ratio = 2 / (1 + Math.sqrt(5)) //PHI the golden ratio
  var branch_angle = Math.PI / 3
  var bow_freq = 2
  var bow_height = 3.5
  var branches = 10
  var leaves_on_branch = 5
  var leaf_wh_ratio = 0.5

  // var tree = createTree(trunk_height, trunk_taper, trunk_slices, bark, boughs, forks, fork_angle, fork_ratio, branches, branch_angle, bow_freq, bow_height, leaves_on_branch, leaf_wh_ratio, green, scene);
  // tree.position.y = -10;

  let allMesh = []
  for (let i = 0; i < 1; i++) {
    let x = Math.floor(Math.random() * 1)
    let y = Math.floor(Math.random() * 1)
    var tree = createTree(
      trunk_height,
      trunk_taper,
      trunk_slices,
      bark,
      boughs,
      forks,
      fork_angle,
      fork_ratio,
      branches,
      branch_angle,
      bow_freq,
      bow_height,
      leaves_on_branch,
      leaf_wh_ratio,
      green,
      scene
    )
    tree.position.x = x
    tree.position.y = y
    console.log('tree: ', tree)
    allMesh.push(tree)
  }
  // fitToRender(camera, allMesh)

  return scene
}

onMounted(async () => {
  if (!canvasRef.value) return

  const engine = new BABYLON.Engine(canvasRef.value, true, undefined, true)
  const scene = await createScene(canvasRef.value, engine)

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
