import { Component, ElementRef, ViewChild } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as dat from 'dat.gui';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [],
  templateUrl: './portfolio.component.html',
  styleUrl: './portfolio.component.css',
})
export class PortfolioComponent {
  @ViewChild('canvas', { static: true })
  canvasRef!: ElementRef<HTMLCanvasElement>;
  private mixer?: THREE.AnimationMixer;
  clock = new THREE.Clock();
  bloomObject?: THREE.Mesh;
  bloomObject2?: THREE.Mesh;

  ngAfterViewInit(): void {
    const canvas = this.canvasRef.nativeElement;

    //create a renderer-------------------------------------------
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
    }); //add canvas to renderer

    renderer.setSize(window.innerWidth, window.innerHeight);

    //create a scene----------------------------------------
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('black');
    //const axesHelper = new THREE.AxesHelper(5); // Specify the length of the axes
    //scene.add(axesHelper);
    //LIghts----------------------------------------
    const light = new THREE.DirectionalLight('white', 1);
    light.position.set(0, 0, 10);
    scene.add(light);

    const datGui = new dat.GUI();
    datGui.add(light, 'intensity', 0, 1, 0.1).step(0.1);
    datGui.add(light.position, 'y').min(-15).max(15).step(1);
    datGui.add(light.position, 'x').min(-15).max(15).step(1);
    datGui.add(light.position, 'z').min(-15).max(15).step(1);
    //datGui.addColor('backgroundColor', 'white');
    //texture loader----------------------------------------
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load(
      '../../../assets/chromatic_core/textures/material_1_emissive.png'
    );
    const material = new THREE.MeshStandardMaterial({ envMap: texture });

    //particals-----------------------------
    const particalGeometry = new THREE.BufferGeometry();
    const vertices = 5000;
    const positions = new Float32Array(vertices * 3);
    for (let i = 0; i < vertices * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 20;
    }
    particalGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(positions, 3)
    );
    const particalMaterial = new THREE.PointsMaterial({});
    particalMaterial.size = 0.009;
    particalMaterial.transparent = true;
    //particalMaterial.alphaMap = texture;
    particalMaterial.blendColor = new THREE.Color('white');
    particalMaterial.depthTest = false;
    const particalMesh = new THREE.Points(particalGeometry, particalMaterial);
    scene.add(particalMesh);

    //load the model----------------------------------------
    const loader = new GLTFLoader();

    loader.load(
      // resource URL
      '../../../assets/chromatic_core/scene.gltf',
      // called when the resource is loaded

      (gltf) => {
        // Use an arrow function here
        const model = gltf.scene;
        model.scale.set(1, 1, 1);
        scene.add(model);
        console.log(model.children);
        model.traverse((object) => {
          console.log(object);
          if (object instanceof THREE.Mesh) {
            console.log(object.name);
            this.bloomObject = object;
            this.bloomObject.layers.set(0);
            object.material.transparent = true;
            // object.material.opacity = 0.8;
            const geometry = object.geometry;
            const vertices = geometry.attributes.position.array;
            const particleGeometry = new THREE.BufferGeometry();
            particleGeometry.setAttribute(
              'position',
              new THREE.Float32BufferAttribute(vertices, 3)
            );
            const particleMaterial = new THREE.PointsMaterial({
              size: 0.001, // Adjust particle size
              transparent: true,
            });
            const particles = new THREE.Points(
              particleGeometry,
              particleMaterial
            );
            scene.add(particles);
          } else if (object instanceof THREE.Object3D) {
            object.scale.set(1, 1, 1);
          }
        });

        const mixer = new THREE.AnimationMixer(model);
        gltf.animations.forEach((clip) => {
          mixer.clipAction(clip).play();
        });

        // Save the mixer to your component for updating
        this.mixer = mixer;

        //debugger dat.ui-------------------------------------------

        gltf.animations; // Array<THREE.AnimationClip>
        gltf.scene; // THREE.Group
        gltf.scenes; // Array<THREE.Group>
        gltf.cameras; // Array<THREE.Camera>
      },
      // called while loading is progressing
      function (xhr) {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
      },
      // called when loading has errors
      function (error) {
        console.log('An error happened');
      }
    );
    //debugger dat.ui-------------------------------------------

    //create a camera------------------------------------------
    const aspect = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      1,
      1000
    );
    camera.position.z = 6;
    //set size of renderer

    //orbit controls-----------------------------------------------
    const orbitcontrols = new OrbitControls(camera, canvas);
    orbitcontrols.dampingFactor = 0.2;

    //create a animate function------------------------------------
    const animate = () => {
      const delta = this.clock.getDelta();
      if (this.mixer) {
        this.mixer.update(delta);
        // console.log(delta);
      }
      particalMesh.rotateY(delta * 0.1);
      requestAnimationFrame(animate);
      camera.layers.enableAll();
      renderer.render(scene, camera);
      composer.render(); //render the scene
    };
    // post processing----------------------------------------
    const renderScene = new RenderPass(scene, camera);
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      1,
      0.4,
      0.85
    );
    //  bloomPass.
    renderer.toneMappingExposure = Math.pow(2, 5.0);
    bloomPass.threshold = 5;
    bloomPass.strength = 0.1; // Bloom strength
    bloomPass.radius = 100; // Bloom radius
    datGui.add(bloomPass, 'threshold', 0, 1, 0.1).step(0.1);
    datGui.add(bloomPass, 'strength', 0, 1, 0.1).step(0.1);
    datGui.add(bloomPass, 'radius', 0, 500, 10).step(10);

    const composer = new EffectComposer(renderer);
    composer.addPass(renderScene);
    composer.addPass(bloomPass);
    //  this.bloomObject?.layers.set(1);
    // camera.layers.enable(0);
    camera.layers.enableAll();
    //  bloomPass.
    animate();
  }
}
