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
coordinatePointsData.forEach(vertice => {
  coordinateVectors.push(new THREE.Vector3(vertice[0], vertice[1], vertice[2]));
});


function init() {
  container = document.getElementById("container");
  camera = new THREE.PerspectiveCamera(
    30,
    window.innerWidth / window.innerHeight,
    1,
    4000
  );
  camera.position.z = CUBE_SIDE_LENGTH * 4;

  const controls = new OrbitControls(camera, container);
  controls.minDistance = CUBE_SIDE_LENGTH;
  controls.maxDistance = CUBE_SIDE_LENGTH * CAMERA_MAX_DISTANCE;


  scene = new THREE.Scene();
  //Change background of the scene
  scene.background = new THREE.Color(GRAY_COLOR);

  group = new THREE.Group();
  scene.add(group);

  const wireframe = new THREE.WireframeGeometry(getPolyGeometry(CUBE_SIDE_LENGTH / 2));

  const lineSegments = new THREE.LineSegments(wireframe);
  lineSegments.material.depthTest = false;
  lineSegments.material.opacity = 1;
  lineSegments.material.color.setHex(BLACK_COLOR);
  lineSegments.material.transparent = true;

  scene.add(lineSegments);
  scene.add(new THREE.AxesHelper(CUBE_SIDE_LENGTH / 2));
  /* 
      //Removed Box helper

      let boxgeo = new THREE.BoxGeometry(CUBE_SIDE_LENGTH, CUBE_SIDE_LENGTH, CUBE_SIDE_LENGTH)
    
      let boxMesh = new THREE.Mesh(boxgeo);
      const helper = new THREE.BoxHelper(
        boxMesh
      );
      
      helper.material.color.setHex(BLACK_COLOR);
      helper.material.transparent = true;
      group.add(helper);
  */
  positions = new Float32Array(CUBE_SIDE_LENGTH * 3);
  const pMaterial = new THREE.PointsMaterial({
    color: RED_COLOR,
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
    color: RED_COLOR,
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

  //Draw lines between two points
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

//Polygeometry
function getPolyGeometry(hgtOfPlane) {
  let geometry = new THREE.BufferGeometry();
  // generate vertices
  let vertices = new Float32Array([
    /**bottom plane **/
    -93, 0, 246, 0, 0, 0, 93, 0, 246,
    -93, 0, 246, 0, 0, 0, -260, 0, -42,
    93, 0, 246, 0, 0, 0, 260, 0, -42,
    -204, 0, -166, 0, 0, 0, -260, 0, -42,
    204, 0, -166, 0, 0, 0, 260, 0, -42,
    204, 0, -166, 0, 0, 0, -204, 0, -166,

    /************************************/

    /**upper plane **/
    -93, hgtOfPlane, 246, 0, hgtOfPlane, 0, 93, hgtOfPlane, 246,
    -93, hgtOfPlane, 246, 0, hgtOfPlane, 0, -260, hgtOfPlane, -42,
    93, hgtOfPlane, 246, 0, hgtOfPlane, 0, 260, hgtOfPlane, -42,
    -204, hgtOfPlane, -166, 0, hgtOfPlane, 0, -260, hgtOfPlane, -42,
    204, hgtOfPlane, -166, 0, hgtOfPlane, 0, 260, hgtOfPlane, -42,
    204, hgtOfPlane, -166, 0, hgtOfPlane, 0, -204, hgtOfPlane, -166,

    /************************************/

    /**small plane connecting**/
    -93, 0, 246, -93, hgtOfPlane, 246, 93, hgtOfPlane, 246, -93, hgtOfPlane, 246, 93, hgtOfPlane, 246, 93, 0, 246,
    -260, 0, -42, -260, hgtOfPlane, -42, -204, 0, -166, -204, 0, -166, -204, hgtOfPlane, -166, -260, 0, -42,
    260, 0, -42, 260, hgtOfPlane, -42, 204, 0, -166, 204, 0, -166, 204, hgtOfPlane, -166, 260, 0, -42
    /************************************/
  ]);

  geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
  return geometry;
}