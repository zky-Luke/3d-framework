<template>
  <div class="w-full h-full" ref="containerRef"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
import texture1 from "../../assets/imgs/texture/normalMap.jpg"
import texture2 from "../../assets/imgs/texture/bump_photo.png"
import texture3 from "../../assets/imgs/texture/grass.jpg"

const containerRef = ref<HTMLDivElement | null>(null);

const sceneObj = ref<THREE.Scene | null>(null);
const cameraObj = ref<THREE.PerspectiveCamera | null>(null);
const rendererObj = ref<THREE.WebGLRenderer | null>(null);

const initScene = (containerRef: HTMLDivElement) => {  
  // 创建场景
  const scene = new THREE.Scene();

  // 创建透视投影相机
  const width = containerRef.clientWidth;
  const height = containerRef.clientHeight;
  const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
  camera.position.set(0.08, 3.4, 4.05);

  // 创建WebGL渲染器
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.outputEncoding = THREE.sRGBEncoding;
  containerRef.appendChild(renderer.domElement);

  // 轨道控制器
  const controls = new OrbitControls(camera, containerRef);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.screenSpacePanning = false;
  controls.minDistance = 1;
  controls.maxDistance = 100;
  controls.maxPolarAngle = Math.PI / 2;

  const hemiLight = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
  hemiLight.position.set(0, 50, 0);
  scene.add(hemiLight);
  const dirLight = new THREE.DirectionalLight(0xffffff, 1);
  dirLight.position.set(0, 20, 10);
  scene.add(dirLight);

  const loader = new THREE.TextureLoader();

  const mat0 = new THREE.MeshStandardMaterial({
    color: 0xff0000,
    map: loader.load(texture1),
    normalMap: loader.load(texture1)
  });

  const mat1 = new THREE.MeshStandardMaterial({
    map: loader.load(texture2),
    normalMap: loader.load(texture1)
  });

  const mat2 = new THREE.MeshStandardMaterial({
    map: loader.load(texture3),
    normalMap: loader.load(texture1)
  });

  const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
  const sphere0 = new THREE.Mesh(sphereGeometry, mat0);
  sphere0.position.x = -2.5;
  scene.add(sphere0);

  const sphere1 = new THREE.Mesh(sphereGeometry, mat1);
  scene.add(sphere1);

  const sphere2 = new THREE.Mesh(sphereGeometry, mat2);
  sphere2.position.x = 2.5;
  scene.add(sphere2);

  return { scene, camera, renderer }
}

// 获取点击事件
const getClickEvent = (event: MouseEvent) => {
  // console.log('event: ', event);
  // console.log('cameraObj: ', cameraObj.value);
}

// 浏览器大小变动时，触发引擎的重载状态
const onWindowResize = () => {
  const width = containerRef.value?.clientWidth;
  const height = containerRef.value?.clientHeight;
  if (!width || !height || !cameraObj.value || !rendererObj.value) return;
  cameraObj.value.aspect = width / height;
  cameraObj.value.updateProjectionMatrix();
  rendererObj.value.setSize(width, height);
}

onMounted(() => {
  if (!containerRef.value) return;

  const { scene, camera, renderer } = initScene(containerRef.value)
  sceneObj.value = scene
  cameraObj.value = camera
  rendererObj.value = renderer

  // 循环渲染，性能最大每秒六十帧
  const animate = () => {
    requestAnimationFrame(animate);
    renderer.render( scene, camera );
  }
  animate();
  
  // 点击监听
  containerRef.value.addEventListener('click', getClickEvent)
  // 窗口监听
  window.addEventListener('resize', onWindowResize);
});

onUnmounted(() => {
  if (!containerRef.value) return;
  // 销毁点击监听
  containerRef.value.removeEventListener('click', getClickEvent)
  // 销毁窗口监听
  window.removeEventListener('resize', onWindowResize);
})
</script>