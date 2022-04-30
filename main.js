import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";


let group;
let container;

let camera, scene, renderer;
let positions;
let particles;
let pointCloud;
let linesMesh;
let coordinateVectors = [];

//Check distance and ignore if distance is less than 0.1
let coordinatePointsData = removePointsWithLessDistance(coordinatePoints, 0.1);
coordinatePointsData.forEach(e => {
  coordinateVectors.push(new THREE.Vector3(e[0], e[1], e[2]));
});

function init() {
  container = document.getElementById("container");
  camera = new THREE.PerspectiveCamera(
    30,
    window.innerWidth / window.innerHeight,
    1,
    4000
  );
  camera.position.z = CUBE_SIDE_LENGTH * 3;

  const controls = new OrbitControls(camera, container);
  controls.minDistance = CUBE_SIDE_LENGTH;
  controls.maxDistance = CUBE_SIDE_LENGTH * CAMERA_MAX_DISTANCE;


  scene = new THREE.Scene();
  //Change background of the scene
  scene.background = new THREE.Color(GRAY_COLOR);

  group = new THREE.Group();
  scene.add(group);

  let boxgeo = new THREE.BoxGeometry(CUBE_SIDE_LENGTH, CUBE_SIDE_LENGTH, CUBE_SIDE_LENGTH)

  let boxMesh = new THREE.Mesh(boxgeo);
  const helper = new THREE.BoxHelper(
    boxMesh
  );
  scene.add(new THREE.AxesHelper(CUBE_SIDE_LENGTH / 2));
  //Box Gemoetry Color
  helper.material.color.setHex(BLACK_COLOR);
  //helper.material.blending = THREE.AdditiveBlending;
  helper.material.transparent = true;
  group.add(helper);

  positions = new Float32Array(CUBE_SIDE_LENGTH * 3);

  const pMaterial = new THREE.PointsMaterial({
    color: GRAY_COLOR,
    size: 1,
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
    color: BLACK_COLOR,
    linewidth: 1
  });
  linesMesh = new THREE.LineSegments(geometry, lineMaterial);
  group.add(linesMesh);


  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputEncoding = THREE.sRGBEncoding;


  container.appendChild(renderer.domElement);
}

function animate() {
  let vertexpos = 0;

  for (let i = 0; i < coordinateVectors.length - 1; i++) {
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
