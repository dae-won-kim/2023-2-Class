import * as THREE from 'three';
import SceneInit from './lib/SceneInit';
import { GUI } from 'dat.gui';
import { useEffect } from 'react';

// 3D를 불러오기
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

function App() {

  useEffect(() => {
    const test = new SceneInit('myThreeJsCanvas');
    test.initialize();
    test.animate();



    // initialize gui -> 빛 조정판
    const gui = new GUI();

    const mainGroup = new THREE.Group();
    test.scene.add(mainGroup);


    // Load 3D
    let loadedModel;
    const gltfLoader = new GLTFLoader();
    gltfLoader.load('./assets/pikachu/scene.gltf', (gltfScene) => {
      loadedModel = gltfScene;
      gltfScene.scene.position.x = -10;
      gltfScene.scene.castShadow = true;
      test.scene.add(gltfScene.scene);
    })

    const animate = () => {
      if (loadedModel) {
          loadedModel.scene.rotation.y += 0.03;
      }
      requestAnimationFrame(animate);
    };
    animate();



    // 바닥에 깔 박스
    const floorboxGeometry = new THREE.BoxGeometry(50, 1, 50);
    const floorboxMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
    const floorboxMesh = new THREE.Mesh(floorboxGeometry, floorboxMaterial);
    floorboxMesh.position.set(0, -5, 0);
    floorboxMesh.receiveShadow = true;
    mainGroup.add(floorboxMesh);


    // knot
    const torusKnotgeometry = new THREE.TorusKnotGeometry(5, 3, 100, 10);
    const torusKnotmaterial = new THREE.MeshPhongMaterial({ color: 0xf12200 });
    const torusKnot = new THREE.Mesh(torusKnotgeometry, torusKnotmaterial);
    torusKnot.position.set(15, 5, 0);
    torusKnot.castShadow = true;
    mainGroup.add(torusKnot);


    // ambientLight 전체 밝기 조정
    const al = new THREE.AmbientLight(0xffffff, 0);
    mainGroup.add(al);

    const alFolder = gui.addFolder('ambient light');
    const alSettings = { color: al.color.getHex() };
    alFolder.add(al, 'visible');
    alFolder.add(al, 'intensity', -3, 3, 0.1);
    alFolder.open();


    // directionalLight 수직의 빛 즉, 태양이라고 생각하면 됨)
    const dl = new THREE.DirectionalLight(0xffffff, 2);
    dl.position.set(0, 10, 5);
    dl.castShadow = true;
    const dlHelper = new THREE.DirectionalLightHelper(dl, 3);
    mainGroup.add(dl);

    const dlFolder = gui.addFolder('directional light');

    dlFolder.add(dl, 'intensity', 0, 5, 0.25);
    dlFolder.add(dl.position, 'y', 1, 20, 0.5);
    dlFolder.add(dl, 'castShadow');
    dlFolder.open();



    // pointLight (한 점에서부터 나오는 밝기 ex: 횃불)
    const pl = new THREE.PointLight(0xffffff, 50, 8, 2);
    pl.position.set(18, 15, 0);
    const plHelper = new THREE.PointLightHelper(pl, 0.5);
    mainGroup.add(pl, plHelper);

    const plSettings = {
      visible: true,
      color: pl.color.getHex(),
    };
    const plFolder = gui.addFolder('point light');
    plFolder.add(plSettings, 'visible').onChange((value) => {
      pl.visible = value;
      plHelper.visible = value;
    });
    plFolder.add(pl, 'intensity', 0, 100, 0.25);
    plFolder.add(pl.position, 'x', 15, 20, 0.5);
    plFolder.add(pl.position, 'y', 13, 18, 0.5);
    plFolder.add(pl.position, 'z', -2, 4, 0.5);
    plFolder.add(pl, 'castShadow');
    plFolder.open();



    // Destroy GUI (새로고침하면 중복되서 생성되기 때문에)
    return () => {
      gui.destroy();
    };

  }, []);

  return (
    <div>
      <canvas id="myThreeJsCanvas" />
    </div>
  );
}

export default App;