import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'app-geometry',
  standalone: true,
  imports: [],
  templateUrl: './geometry.component.html',
  styleUrl: './geometry.component.css',
})
export class GeometryComponent {
  @ViewChild('canvas', { static: true })
  canvasRef!: ElementRef<HTMLCanvasElement>;

  ngAfterViewInit(): void {
    const canvas = this.canvasRef.nativeElement;

    //create a scene----------------------------------------
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('white');
    const axesHelper = new THREE.AxesHelper(5); // Specify the length of the axes
    scene.add(axesHelper);

    //create a object----------------------------------------
    const robo = this.createRobotModel();
    scene.add(robo);
    console.log(robo);
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
      .1,
      1000
    );
    camera.position.z = 10;

    //create a renderer-------------------------------------------
    const renderer = new THREE.WebGLRenderer({ canvas: canvas }); //add canvas to renderer
    renderer.setSize(window.innerWidth, window.innerHeight); //set size of renderer

    const animate = () => {
      robo.lookAt(lookAt.x, -lookAt.y, 1);
      renderer.render(scene, camera);
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

  createRobotModel() {
    const robot = new THREE.Group();

    // Base
    const baseGeometry = new THREE.BoxGeometry(5, 2, 5);
    const baseMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    robot.add(base);

    // Body
    const bodyGeometry = new THREE.BoxGeometry(3, 4, 3);
    const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0x4444ff });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 2; // Adjust based on base height
    robot.add(body);

    // Head
    const headGeometry = new THREE.BoxGeometry(2, 2, 2);
    const headMaterial = new THREE.MeshStandardMaterial({ color: 0x4444ff });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.y = 4; // Adjust based on body height
    robot.add(head);

    // Eyes
    const eyeGeometry = new THREE.SphereGeometry(0.3, 32, 32);
    const eyeMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const eye1 = new THREE.Mesh(eyeGeometry, eyeMaterial);
    const eye2 = eye1.clone();
    eye1.position.set(-0.5, 0.3, 0.8);
    eye2.position.set(0.5, 0.3, 0.8);
    head.add(eye1, eye2);

    // Antennas
    const antennaGeometry = new THREE.CylinderGeometry(0.1, 0.1, 1, 32);
    const antennaMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
    const antenna1 = new THREE.Mesh(antennaGeometry, antennaMaterial);
    const antenna2 = antenna1.clone();
    antenna1.position.set(-0.5, 1, 0);
    antenna2.position.set(0.5, 1, 0);
    head.add(antenna1, antenna2);

    return robot;
  }
}
