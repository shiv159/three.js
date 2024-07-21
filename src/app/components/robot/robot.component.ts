import { Component, ElementRef, ViewChild } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as dat from 'dat.gui';
@Component({
  selector: 'app-robot',
  standalone: true,
  imports: [],
  templateUrl: './robot.component.html',
  styleUrl: './robot.component.css',
})
export class RobotComponent {
  @ViewChild('canvas', { static: true })
  canvasRef!: ElementRef<HTMLCanvasElement>;
  private mixer?: THREE.AnimationMixer;
  clock = new THREE.Clock();
  cabeza?: THREE.Object3D;
  //raycaster?: THREE.Raycaster;
  //mouse?: THREE.Vector2;

  ngAfterViewInit(): void {
    const canvas = this.canvasRef.nativeElement;

    //create a scene----------------------------------------
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('skyblue');
    const axesHelper = new THREE.AxesHelper(5); // Specify the length of the axes
    scene.add(axesHelper);
    const directionalLight = new THREE.AmbientLight();
    directionalLight.castShadow = true;
    directionalLight.intensity = 1;
    directionalLight.position.set(15, 15, 15);
    scene.add(directionalLight);

    // const datGui = new dat.GUI();
    // datGui.add(directionalLight, 'intensity', 0, 1, 0.1).step(0.1);
    // datGui.add(directionalLight, 'distance', 0, 100, 1).step(1);
    // datGui.add(directionalLight, 'angle', 0, Math.PI, 0.1).step(0.1);
    // datGui.add(directionalLight, 'position', -100, 100, 1).step(1);

    // //texture loader----------------------------------------
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load(
      '../../../assets/textures/bluetexture.jpg'
    );

    //load the model----------------------------------------
    const loader = new GLTFLoader();

    loader.load(
      // resource URL
      '../../../assets/robot/robot.gltf',
      // called when the resource is loaded

      (gltf) => {
        // Use an arrow function here

        gltf.animations; // Array<THREE.AnimationClip>
        const model = gltf.scene; // THREE.Group
        gltf.scenes; // Array<THREE.Group>
        gltf.cameras; // Array<THREE.Camera>
        //console.log(gltf.scene.children[0]);
        console.log(gltf.scene.children[0].children[0].children);

        model.traverse((child) => {
          // console.log(`child name ${child.name}`);
          if (child instanceof THREE.Mesh && child.name !== 'Plane') {
            // console.log(`child name ${child.name}`);
            child.material = new THREE.MeshStandardMaterial({
              metalness: 0.9,
              roughness: 0.1,
              envMap: texture,
            });
          }
          if (
            child instanceof THREE.Mesh == false &&
            child instanceof THREE.Object3D
          ) {
            if (child.name === 'Cabeza') {
              console.log('child cabeza');
              this.cabeza = child;
              child.traverse((grandchild) => {
                if (grandchild instanceof THREE.Mesh) {
                  console.log(` grand childs :${grandchild.name}`);
                  grandchild.material = new THREE.MeshStandardMaterial({
                    color: 'white',
                    roughness: 0.2,
                    metalness: 0.9,
                  });
                }
              });
            }
            //   child.traverse((grandchild) => {
            //     if (grandchild instanceof THREE.Mesh) {
            //       console.log(` grand childs :${grandchild.name}`);
            //       grandchild.material = new THREE.MeshStandardMaterial({
            //         color: new THREE.Color('red'),
            //       });
            //     }
            //   });
          }
        });
        model.scale.set(3, 3, 3);
        model.position.set(0, 3, 0);
        scene.add(model);
        // Object
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

    const lookAt = {
      x: 0,
      y: 0,
    };

    window.addEventListener('mousemove', (event) => {
      lookAt.x = event.clientX / window.innerWidth - 0.5;
      lookAt.y = event.clientY / window.innerHeight - 0.5;
    });

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
    camera.position.z = 14;

    //create a renderer-------------------------------------------
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
    }); //add canvas to renderer
    renderer.setSize(window.innerWidth, window.innerHeight); //set size of renderer

    //orbit controls-----------------------------------------------
    const orbitcontrols = new OrbitControls(camera, canvas);
    orbitcontrols.dampingFactor = 0.2;

    //create a animate function------------------------------------
    const animate = () => {
      const delta = this.clock.getDelta();
      requestAnimationFrame(animate);

      if (this.cabeza) {
        this.cabeza.lookAt(lookAt.x, -lookAt.y, 1);
      }

      orbitcontrols.update();

      renderer.render(scene, camera); //render the scene
    };
    animate();
  }
}
