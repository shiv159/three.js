import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

@Component({
  selector: 'app-three',
  standalone: true,
  imports: [],
  templateUrl: './three.component.html',
  styleUrl: './three.component.css',
})
export class ThreeComponent implements AfterViewInit {
  @ViewChild('canvas', { static: true })
  canvasRef!: ElementRef<HTMLCanvasElement>;

  ngAfterViewInit(): void {
    const canvas = this.canvasRef.nativeElement;
    console.log(OrbitControls);
    //create a scene----------------------------------------
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('black');
    const axesHelper = new THREE.AxesHelper(5); // Specify the length of the axes
    scene.add(axesHelper);

    //create a object----------------------------------------
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

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
    camera.position.z = 5;
    camera.position.x = 1;
    camera.position.y = 1;

    //create a renderer-------------------------------------------
    const renderer = new THREE.WebGLRenderer({ canvas: canvas }); //add canvas to renderer
    renderer.setSize(window.innerWidth, window.innerHeight); //set size of renderer

    //orbit controls-----------------------------------------------
    const orbitcontrols = new OrbitControls(camera, canvas);
    orbitcontrols.dampingFactor = 0.2;

    //create a animate function------------------------------------
    const clock = new THREE.Clock();
    const animate = () => {
      const elapsedTime = clock.getElapsedTime();
      requestAnimationFrame(animate);
      cube.rotation.y += elapsedTime * 0.0001;
      renderer.render(scene, camera); //render the scene
    };
    animate();
  }
}
