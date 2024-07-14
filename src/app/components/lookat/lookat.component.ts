import { animate } from '@angular/animations';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import * as THREE from 'three';

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

  ngAfterViewInit(): void {
    const canvas = this.canvasRef.nativeElement;

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

    const geometry1 = new THREE.BoxGeometry(1, 1, 1);
    const material1 = new THREE.MeshBasicMaterial({ color: 'white' });
    const cube1 = new THREE.Mesh(geometry1, material1);
    cube1.position.x = 2;
    cube1.position.y = 2;
    scene.add(cube1);

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

    //create a renderer-------------------------------------------
    const renderer = new THREE.WebGLRenderer({ canvas: canvas }); //add canvas to renderer
    renderer.setSize(window.innerWidth, window.innerHeight); //set size of renderer

    const animate = () => {
      cube.lookAt(lookAt.x, -lookAt.y, 1);
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
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));//for retina display
    });
  }
}
