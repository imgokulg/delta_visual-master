import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";


let group;
let container;

let camera, scene, renderer;
let positions;
let particles;
let pointCloud;

const CUBE_SIDE_LENGTH = 50;
const CAMERA_MAX_DISTANCE = 6;
const NO_OF_POINTS_FOR_LINE = 10;
let linesMesh;
let coordinateVectors = [];
const limit = 0.2;
//Check distance and ignore if distance is less than 0.1
let coordinatePointsData = [];
let prev = coordinatePoints[0];
coordinatePointsData.push(prev);
for (let i = 1; i < coordinatePoints.length; i++) {
  let curr = coordinatePoints[i];
  let dist = distance(curr, prev);
  if (dist > 0.1) {
    prev = curr;
    coordinatePointsData.push(curr);
  }

}
coordinatePointsData.forEach(e => {
  coordinateVectors.push(new THREE.Vector3(e[0] * limit, e[1] * limit, e[2] * limit));
});



function init() {
  container = document.getElementById("container");
  camera = new THREE.PerspectiveCamera(
    30,
    window.innerWidth / window.innerHeight,
    1,
    4000
  );
  camera.position.z = 200;

  const controls = new OrbitControls(camera, container);
  controls.minDistance = CUBE_SIDE_LENGTH;
  controls.maxDistance = CUBE_SIDE_LENGTH * CAMERA_MAX_DISTANCE;


  scene = new THREE.Scene();
  //Change background of the scene
  scene.background = new THREE.Color(0xd3d3d3);

  group = new THREE.Group();
  scene.add(group);

  let boxgeo = new THREE.BoxGeometry(CUBE_SIDE_LENGTH, CUBE_SIDE_LENGTH, CUBE_SIDE_LENGTH)

  let boxMesh = new THREE.Mesh(boxgeo);
  const helper = new THREE.BoxHelper(
    boxMesh
  );
  scene.add(new THREE.AxesHelper(CUBE_SIDE_LENGTH / 2));
  //Box Gemoetry Color
  helper.material.color.setHex(0x000000);
  //helper.material.blending = THREE.AdditiveBlending;
  helper.material.transparent = true;
  group.add(helper);

  const segments = CUBE_SIDE_LENGTH * CUBE_SIDE_LENGTH * CUBE_SIDE_LENGTH;
  positions = new Float32Array(segments * 3);

  const pMaterial = new THREE.PointsMaterial({
    color: 0xff0000,
    size: 3,
    transparent: true,
    sizeAttenuation: false,
  });

  particles = new THREE.BufferGeometry().setFromPoints(coordinateVectors);

  // create the particle system
  pointCloud = new THREE.Points(particles, pMaterial);
  group.add(pointCloud);

  const geometry = new THREE.BufferGeometry();

  geometry.setAttribute(
    "position",
    new THREE.BufferAttribute(positions, 3).setUsage(
      THREE.DynamicDrawUsage
    )
  );

  geometry.computeBoundingSphere();

  const lineMaterial = new THREE.LineBasicMaterial({
    color: 0x000000,
    linewidth: 1
  });
  linesMesh = new THREE.LineSegments(geometry, lineMaterial);
  group.add(linesMesh);


  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputEncoding = THREE.sRGBEncoding;


  container.appendChild(renderer.domElement);

  window.addEventListener("resize", onWindowResize);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  let vertexpos = 0;
   
    for (let i = coordinateVectors.length - NO_OF_POINTS_FOR_LINE; i < coordinateVectors.length - 1; i++) {
      const particleDataA = coordinateVectors[i];
      const particleDataB = coordinateVectors[i + 1];
      if (particleDataB != undefined) {
  
        positions[vertexpos++] = particleDataA.x;
        positions[vertexpos++] = particleDataA.y;
        positions[vertexpos++] = particleDataA.z;
  
        positions[vertexpos++] = particleDataB.x;
        positions[vertexpos++] = particleDataB.y;
        positions[vertexpos++] = particleDataB.z;
      }
    } 
  requestAnimationFrame(animate);
  render();
}
function render() {
  //const time = Date.now() * 0.001;
  //group.rotation.y = time * 0.1;
  renderer.render(scene, camera);
}

init();
animate();
//Function to find distance between two vertice points
function distance(curr, prev) {
  var a = prev[0] - curr[0];
  var b = prev[1] - curr[1];
  var c = prev[2] - curr[2];
  return Math.sqrt(a * a + b * b + c * c);
}