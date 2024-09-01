import { animate } from '@angular/animations';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

@Component({
  selector: 'app-lookat',
  standalone: true,
  imports: [],
  templateUrl: './lookat.component.html',
  styleUrl: './lookat.component.css',
})
export class LookatComponent implements AfterViewInit {
  @ViewChild('lookAt', { static: true })
  canvasRef!: ElementRef<HTMLCanvasElement>;
  clock = new THREE.Clock();

  ngAfterViewInit(): void {
    const canvas = this.canvasRef.nativeElement;
    //create a scene----------------------------------------
    const scene = new THREE.Scene();
    scene.background = new THREE.Color();
    const axesHelper = new THREE.AxesHelper(5); // Specify the length of the axes
    scene.add(axesHelper);
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

    //create a object----------------------------------------
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    //
    const robot = this.createRobot();
    robot.position.x = -5;
    scene.add(robot);

    //lights-------------------------------------------
    const ambientLight = new THREE.AmbientLight(0x404040);
    ambientLight.intensity = 0.5;
    scene.add(ambientLight);

    //cube1.lookAt(cube.position);

    //lookAt event listener
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
      aspect.width / aspect.height,
      1,
      1000
    );
    camera.position.z = 6;
    //orbit controls-----------------------------------------------

    const orbitcontrols = new OrbitControls(camera, canvas);
    orbitcontrols.dampingFactor = 0.2;

    //create a renderer-------------------------------------------
    const renderer = new THREE.WebGLRenderer({ canvas: canvas }); //add canvas to renderer
    renderer.setSize(window.innerWidth, window.innerHeight); //set size of renderer

    const animate = () => {
      cube.lookAt(lookAt.x, -lookAt.y, 1);
      renderer.render(scene, camera);
      const delta = this.clock.getDelta();
      particalMesh.rotateY(delta * 0.1);

      requestAnimationFrame(animate);
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

  createRobot() {
    const robot = new THREE.Group();

    // Body
    const bodyGeometry = new THREE.BoxGeometry(2, 4, 1);
    const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    robot.add(body);

    // Head
    const headGeometry = new THREE.SphereGeometry(1, 32, 32);
    const headMaterial = new THREE.MeshStandardMaterial({ color: 0xcccccc });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.y = 3;
    robot.add(head);

    // Arms
    const armGeometry = new THREE.CylinderGeometry(0.2, 0.2, 2, 32);
    const armMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
    const leftArm = new THREE.Mesh(armGeometry, armMaterial);
    const rightArm = leftArm.clone();
    leftArm.position.x = 1.2;
    leftArm.position.y = 1;
    rightArm.position.x = -1.2;
    rightArm.position.y = 1;
    robot.add(leftArm, rightArm);

    // Legs
    const legGeometry = new THREE.CylinderGeometry(0.3, 0.3, 2, 32);
    const legMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
    const leftLeg = new THREE.Mesh(legGeometry, legMaterial);
    const rightLeg = leftLeg.clone();
    leftLeg.position.x = 0.6;
    leftLeg.position.y = -2;
    rightLeg.position.x = -0.6;
    rightLeg.position.y = -2;
    robot.add(leftLeg, rightLeg);

    robot.scale.set(1, 1, 1);

    return robot;
  }
}
