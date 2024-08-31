import * as THREE from 'three';
import { Body, Physics } from './physics.js';
import WebGL from 'three/addons/capabilities/WebGL.js';

if (!WebGL.isWebGL2Available()) {
    const warning = document.createElement('div');
    warning.innerHTML = WebGL.getWebGL2ErrorMessage();
    warning.style.color = 'red';
    document.body.appendChild(warning);
}

// Scene, camera, renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create a bounding box
const boundingBoxSize = 10;
const boundingBoxGeometry = new THREE.BoxGeometry(boundingBoxSize, boundingBoxSize, boundingBoxSize);
const boundingBoxMaterial = new THREE.MeshBasicMaterial({ color: 0x888888, wireframe: true });
const boundingBoxMesh = new THREE.Mesh(boundingBoxGeometry, boundingBoxMaterial);
scene.add(boundingBoxMesh);

const physics = new Physics(boundingBoxSize);
const body1 = new Body(1.1, 1, 0xff0000, new THREE.Vector3(-2, 0, 0));
const body2 = new Body(1, 1, 0x00ff00, new THREE.Vector3(-1, 3, 1));
const body3 = new Body(0.9, 1, 0x0000ff, new THREE.Vector3(3, 1, 0));
physics.addBody(body1);
physics.addBody(body2);
physics.addBody(body3);

scene.add(body1.create());
scene.add(body2.create());
scene.add(body3.create());

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, 0, 1);
scene.add(light);

camera.position.z = 15;

function animate(time) {
    const delta = time * 0.001;
    boundingBoxMesh.rotateY += 0.01;
    physics.update(delta);
    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);
