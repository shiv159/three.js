import { Component, ElementRef, ViewChild } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';

@Component({
  selector: 'app-texture',
  standalone: true,
  imports: [],
  templateUrl: './texture.component.html',
  styleUrl: './texture.component.css',
})
export class TextureComponent {
  @ViewChild('canvas', { static: true })
  canvasRef!: ElementRef<HTMLCanvasElement>;

  ngAfterViewInit(): void {
    const canvas = this.canvasRef.nativeElement;
    //create a scene----------------------------------------
    const scene = new THREE.Scene();
    //scene.background = new THREE.Color('black');
    const axesHelper = new THREE.AxesHelper(5); // Specify the length of the axes
    scene.add(axesHelper);

    //debugger dat.ui-------------------------------------------
    const gui = new dat.GUI();

    //adding light-------------------------------------------
    //few matreial require light to be visible
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(2, 3, 4);
    scene.add(ambientLight, pointLight);

    //texture loader-------------------------------------------
    const loadingManager = new THREE.LoadingManager();

    const loader = new THREE.CubeTextureLoader();
    loader.setPath('../../../assets/cube/');

    const textureCube = loader.load([
      'px.jpg',
      'nx.jpg',
      'py.jpg',
      'ny.jpg',
      'pz.jpg',
      'nz.jpg',
    ]);
    scene.background = textureCube;
    loadingManager.onStart = () => {
      console.log('loading started');
    };
    loadingManager.onLoad = () => {
      console.log('loading completed');
    };
    loadingManager.onProgress = () => {
      console.log('loading in progress');
    };
    loadingManager.onError = () => {
      console.log('loading error');
    };

    //create a object(MESH==geometry and material)----------------------------------------
    const geometry = new THREE.SphereGeometry(1, 32, 16);
    const material = new THREE.MeshStandardMaterial({
      envMap: textureCube,
    });
    const mesh = new THREE.Mesh(geometry, material);
    material.metalness = 0.3;
    material.roughness = 0.2;
    scene.add(mesh);

    //debugger-------------------------------------------
    gui.add(material, 'metalness').min(0).max(1).step(0.01);
    gui.add(material, 'roughness').min(0).max(1).step(0.01);
    gui.add(material, 'wireframe');
    gui.add(material, 'flatShading');
    gui.add(mesh.position, 'y').min(-3).max(3).step(0.01);
    gui.add(pointLight.position, 'x').min(-3).max(3).step(0.01);

    //create a camera------------------------------------------
    const aspect = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    const camera = new THREE.PerspectiveCamera(
      75,
      aspect.width / aspect.height,
      1,
      1000
    );
    camera.position.z = 5;
    camera.position.x = 1;
    camera.position.y = 1;

    //create a renderer-------------------------------------------
    const renderer = new THREE.WebGLRenderer({ canvas: canvas }); //add canvas to renderer
    renderer.setSize(aspect.width, aspect.height); //set size of renderer

    //orbit controls-----------------------------------------------
    const orbitcontrols = new OrbitControls(camera, canvas);
    orbitcontrols.dampingFactor = 0.2;

    //create a animate function------------------------------------
    const clock = new THREE.Clock();
    const animate = () => {
      const elapsedTime = clock.getElapsedTime();
      requestAnimationFrame(animate);
      mesh.rotation.y += elapsedTime * 0.25;
      renderer.render(scene, camera); //render the scene
    };
    animate();

    //resize canvas---------------

    window.addEventListener('resize', () => {
      //update sizes
      aspect.width = window.innerWidth;
      aspect.height = window.innerHeight;
      //update camera
      camera.aspect = aspect.width / aspect.height;
      camera.updateProjectionMatrix();
      //update renderer
      renderer.setSize(aspect.width, aspect.height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); //for retina display
    });
  }
}
