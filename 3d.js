/**
 * 3D Car Viewer for Lexus LC 500
 * Uses Three.js to load and display the GLB model
 */

import * as THREE from "three"
import { OrbitControls } from "three/addons/controls/OrbitControls.js"
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js"

// DOM Elements
const modal = document.getElementById("modal3D")
const view3DBtn = document.getElementById("view3DBtn")
const closeModalBtn = document.getElementById("closeModal")
const canvasContainer = document.getElementById("canvas-container")
const loadingSpinner = document.getElementById("loadingSpinner")
const colorPicker = document.getElementById("colorPicker3D")
const colorPickerBtns = document.querySelectorAll(".picker-btn")
const pickerColorName = document.getElementById("pickerColorName")

// Three.js variables
let scene, camera, renderer, controls, carModel
let animationId = null
let carBodyMeshes = []

// Color mapping
const colorMap = {
  red: { hex: 0xc41e3a, name: "Infrared" },
  blue: { hex: 0x1e3a5f, name: "Structural Blue" },
  black: { hex: 0x1a1a1a, name: "Caviar Black" },
  white: { hex: 0xf5f5f5, name: "Ultra White" },
}

/**
 * Initialize the 3D scene
 */
function initScene() {
  // Create scene
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0x0a0a0b)

  // Create camera
  const aspect = canvasContainer.clientWidth / canvasContainer.clientHeight
  camera = new THREE.PerspectiveCamera(40, aspect, 0.1, 1000)
  camera.position.set(8, 3, 8)

  // Create renderer
  renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
  })
  renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.2
  canvasContainer.appendChild(renderer.domElement)

  // Add orbit controls
  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.dampingFactor = 0.05
  controls.enablePan = false
  controls.minDistance = 4
  controls.maxDistance = 20
  controls.maxPolarAngle = Math.PI / 2.1
  controls.target.set(0, 1, 0)
  controls.update()

  // Add lights
  setupLights()

  // Add ground plane
  addGround()

  // Load the car model
  loadCarModel()
}

/**
 * Setup scene lighting
 */
function setupLights() {
  // Ambient light
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.4)
  scene.add(ambientLight)

  // Main directional light (key light)
  const mainLight = new THREE.DirectionalLight(0xffffff, 1.5)
  mainLight.position.set(5, 10, 5)
  mainLight.castShadow = true
  mainLight.shadow.mapSize.width = 2048
  mainLight.shadow.mapSize.height = 2048
  mainLight.shadow.camera.near = 0.5
  mainLight.shadow.camera.far = 50
  mainLight.shadow.camera.left = -10
  mainLight.shadow.camera.right = 10
  mainLight.shadow.camera.top = 10
  mainLight.shadow.camera.bottom = -10
  scene.add(mainLight)

  // Fill light
  const fillLight = new THREE.DirectionalLight(0xffffff, 0.5)
  fillLight.position.set(-5, 5, -5)
  scene.add(fillLight)

  // Rim light (back light for highlights)
  const rimLight = new THREE.DirectionalLight(0xc41e3a, 0.3)
  rimLight.position.set(0, 5, -10)
  scene.add(rimLight)

  // Front light
  const frontLight = new THREE.DirectionalLight(0xffffff, 0.4)
  frontLight.position.set(0, 3, 10)
  scene.add(frontLight)

  // Hemisphere light for soft ambient
  const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.3)
  scene.add(hemiLight)
}

/**
 * Add ground plane with reflection
 */
function addGround() {
  const groundGeometry = new THREE.CircleGeometry(20, 64)
  const groundMaterial = new THREE.MeshStandardMaterial({
    color: 0x111113,
    roughness: 0.8,
    metalness: 0.2,
  })
  const ground = new THREE.Mesh(groundGeometry, groundMaterial)
  ground.rotation.x = -Math.PI / 2
  ground.position.y = 0
  ground.receiveShadow = true
  scene.add(ground)

  // Add subtle grid
  const gridHelper = new THREE.GridHelper(20, 40, 0x222222, 0x1a1a1a)
  gridHelper.position.y = 0.01
  scene.add(gridHelper)
}

/**
 * Load the GLB car model
 */
function loadCarModel() {
  const loader = new GLTFLoader()

  loader.load(
    "lc500.glb",
    (gltf) => {
      carModel = gltf.scene

      const box = new THREE.Box3().setFromObject(carModel)
      const center = box.getCenter(new THREE.Vector3())
      const size = box.getSize(new THREE.Vector3())

      // Target a realistic car length of about 4.5 units (represents ~4.5 meters)
      const targetLength = 4.5
      const maxDim = Math.max(size.x, size.y, size.z)
      const scale = targetLength / maxDim
      carModel.scale.setScalar(scale)

      // Recalculate bounding box after scaling
      const scaledBox = new THREE.Box3().setFromObject(carModel)
      const scaledCenter = scaledBox.getCenter(new THREE.Vector3())
      const scaledSize = scaledBox.getSize(new THREE.Vector3())

      // Position car so it sits on the ground (y=0) and is centered on x/z
      carModel.position.x = -scaledCenter.x
      carModel.position.y = -scaledBox.min.y
      carModel.position.z = -scaledCenter.z

      const carHeight = scaledSize.y
      const carLength = scaledSize.z

      // Position camera at a good viewing distance based on car size
      const viewDistance = Math.max(carLength, scaledSize.x) * 2.5
      camera.position.set(viewDistance * 0.7, carHeight * 1.5, viewDistance * 0.7)

      // Update controls target to car center height
      controls.target.set(0, carHeight * 0.4, 0)
      controls.minDistance = viewDistance * 0.4
      controls.maxDistance = viewDistance * 2
      controls.update()

      carBodyMeshes = []
      carModel.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true
          child.receiveShadow = true

          // Enhance materials
          if (child.material) {
            child.material.envMapIntensity = 1

            // Identify body paint meshes (typically the largest colored surfaces)
            const meshName = child.name.toLowerCase()
            const isBodyMesh =
              meshName.includes("body") ||
              meshName.includes("paint") ||
              meshName.includes("exterior") ||
              meshName.includes("shell") ||
              meshName.includes("hull") ||
              meshName.includes("door") ||
              meshName.includes("hood") ||
              meshName.includes("trunk") ||
              meshName.includes("fender") ||
              meshName.includes("bumper") ||
              meshName.includes("roof") ||
              meshName.includes("quarter") ||
              meshName.includes("panel")

            // Also check by material color
            if (child.material.color) {
              const color = child.material.color
              const isColored = color.r > 0.1 || color.g > 0.1 || color.b > 0.1
              const isNotBlackOrWhite = !(
                (color.r < 0.15 && color.g < 0.15 && color.b < 0.15) ||
                (color.r > 0.9 && color.g > 0.9 && color.b > 0.9)
              )

              if (isBodyMesh || (isColored && isNotBlackOrWhite && child.material.metalness < 0.9)) {
                child.material = child.material.clone()
                carBodyMeshes.push(child)
              }
            }
          }
        }
      })

      scene.add(carModel)

      // Hide loading spinner and show color picker
      loadingSpinner.classList.add("hidden")
      colorPicker.classList.add("visible")

      console.log("[v0] Car model loaded successfully!")
      console.log(
        `[v0] Model size after scaling: ${scaledSize.x.toFixed(2)} x ${scaledSize.y.toFixed(2)} x ${scaledSize.z.toFixed(2)}`,
      )
      console.log(`[v0] Found ${carBodyMeshes.length} body meshes for color changing`)
    },
    (progress) => {
      const percent = ((progress.loaded / progress.total) * 100).toFixed(0)
      console.log(`Loading: ${percent}%`)
    },
    (error) => {
      console.error("Error loading model:", error)
      loadingSpinner.innerHTML = `
        <span style="color: #c41e3a;">Error loading 3D model</span>
        <span style="font-size: 0.8rem; margin-top: 0.5rem;">Make sure lc500.glb is in the same folder</span>
      `
    },
  )
}

/**
 * Change the car's body color
 */
function changeCarColor(colorKey) {
  if (!carBodyMeshes.length) return

  const colorData = colorMap[colorKey]
  if (!colorData) return

  const newColor = new THREE.Color(colorData.hex)

  carBodyMeshes.forEach((mesh) => {
    if (mesh.material && mesh.material.color) {
      // Animate color transition
      gsapColorTransition(mesh.material.color, newColor)
    }
  })

  // Update color name display
  if (pickerColorName) {
    pickerColorName.textContent = colorData.name
  }
}

/**
 * Simple color transition (no GSAP dependency)
 */
function gsapColorTransition(fromColor, toColor) {
  const startR = fromColor.r
  const startG = fromColor.g
  const startB = fromColor.b
  const endR = toColor.r
  const endG = toColor.g
  const endB = toColor.b

  const duration = 500 // ms
  const startTime = performance.now()

  function animateColor(currentTime) {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)

    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3)

    fromColor.r = startR + (endR - startR) * eased
    fromColor.g = startG + (endG - startG) * eased
    fromColor.b = startB + (endB - startB) * eased

    if (progress < 1) {
      requestAnimationFrame(animateColor)
    }
  }

  requestAnimationFrame(animateColor)
}

/**
 * Animation loop
 */
function animate() {
  animationId = requestAnimationFrame(animate)

  // Update controls
  controls.update()

  // Slowly rotate the car for showcase effect
  if (carModel) {
    carModel.rotation.y += 0.002
  }

  renderer.render(scene, camera)
}

/**
 * Handle window resize
 */
function onWindowResize() {
  if (!camera || !renderer || !canvasContainer) return

  const width = canvasContainer.clientWidth
  const height = canvasContainer.clientHeight

  camera.aspect = width / height
  camera.updateProjectionMatrix()

  renderer.setSize(width, height)
}

/**
 * Open the 3D modal
 */
function openModal() {
  modal.classList.add("active")
  document.body.style.overflow = "hidden"

  // Initialize scene if not already
  if (!scene) {
    setTimeout(() => {
      initScene()
      animate()
    }, 100)
  } else {
    // Resume animation
    animate()
  }

  // Add resize listener
  window.addEventListener("resize", onWindowResize)
}

/**
 * Close the 3D modal
 */
function closeModal() {
  modal.classList.remove("active")
  document.body.style.overflow = ""
  colorPicker.classList.remove("visible")

  // Cancel animation
  if (animationId) {
    cancelAnimationFrame(animationId)
    animationId = null
  }

  // Remove resize listener
  window.removeEventListener("resize", onWindowResize)
}

// Event Listeners
view3DBtn.addEventListener("click", openModal)
closeModalBtn.addEventListener("click", closeModal)

colorPickerBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    // Update active state
    colorPickerBtns.forEach((b) => b.classList.remove("active"))
    btn.classList.add("active")

    // Change car color
    const colorKey = btn.dataset.color
    changeCarColor(colorKey)
  })
})

// Close modal on overlay click
modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    closeModal()
  }
})

// Close modal on Escape key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modal.classList.contains("active")) {
    closeModal()
  }
})
