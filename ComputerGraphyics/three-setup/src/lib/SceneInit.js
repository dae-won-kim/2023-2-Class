import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Stats from 'three/examples/jsm/libs/stats.module';

export default class SceneInit {
  constructor(canvasId) {

    this.scene = undefined;
    this.camera = undefined;
    this.renderer = undefined;

    // 카메라 각
    this.fov = 60;
    this.nearPlane = 1;
    this.farPlane = 1000;
    this.canvasId = canvasId;

    this.stats = undefined;
    this.controls = undefined;

   // 조명은 따로 초기화 함.
    this.spotLight = undefined;
    this.ambientLight = undefined;
  }

  initialize() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      this.fov,
      window.innerWidth / window.innerHeight,
      1,
      1000
    );
    this.camera.position.x = -30;
    this.camera.position.y = 30;
    this.camera.position.z = 30;


    const canvas = document.getElementById(this.canvasId);
    this.renderer = new THREE.WebGLRenderer({
      canvas,
     
      antialias: true,
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    
    // 그림자 활성화후 추가
    this.renderer.shadowMap.enabled = true;
    document.body.appendChild(this.renderer.domElement);

    // 마우스 컨트롤, gui stat 초기화
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.stats = Stats();

    window.addEventListener('resize', () => this.onWindowResize(), false);
  }

  animate() {
    window.requestAnimationFrame(this.animate.bind(this));
    this.render();
    this.stats.update();
    this.controls.update();
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }

  
  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
}
