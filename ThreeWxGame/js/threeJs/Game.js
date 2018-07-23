
let THREE=require('../../libs/threejs/three.min.js');

import '../../libs/threejs/controls/OrbitControls'

let render;
let width;
let height;

let camera;
let scene;
let light;

//纹理
let bgTexture;
let sphereTexture;
let cylinderTexture;
let coneTexture;

//显示对象
let sphereMesh;
let cylinderMesh;
let coneMesh;

let trackBall;

//底部的图片显示
let bottomPic = wx.createImage()

export default class Game{

  constructor(){
    this.init();
  }



  /**
   * three3D render的初始化
   */
  initThree(){
    width=window.innerWidth;
    height=window.innerHeight;

    render = new THREE.WebGLRenderer({
      antialias: true,     //设置为抗锯齿
      canvas: canvas
    });
    
    //产生阴影
    render.shadowMap.enabled = true;
    render.shadowMap.type = THREE.PCFSoftShadowMap; 
    render.setSize(width,height);
    // canvas.style.height = height / 2 + 'px';
    // canvas1.id ="canvas1";
    // console.log(canvas)
    // console.log(canvas1)
    
  }

  
  /**
   * 初始化相机
   */
  initCamera() {
    camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 10000);
    camera.position.x = 800;
    camera.position.y = 400;
    camera.position.z = 800;
    camera.up.x = 0;
    camera.up.y = 1;
    camera.up.z = 0;        //表示z轴为相机的上方
    //相机的观察点,相机在全局空间中的位置
    camera.lookAt(0,0, 0);


    trackBall = new THREE.OrbitControls(camera, render.domElement)
    /////////OrbitControlls 
    trackBall.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
    trackBall.dampingFactor = 0.5;
    trackBall.screenSpacePanning = true;
    trackBall.minDistance = 0;
    trackBall.maxDistance = 10000;
    trackBall.maxPolarAngle = Math.PI / 0.1;
  }

  /**
   * 初始化场景
   */
  initScene(){
    scene = new THREE.Scene();
    //设置场景的背景颜色
    scene.background = 0x0094ff;
    // scene.position.y=height/2;
  }

  initLight(){
    //聚光光源
    light = new THREE.SpotLight(0xffffff);
    light.position.set(0, 800, 500);
  

    let sphereSize = 10;
    let pointLightHelper = new THREE.PointLightHelper(light, sphereSize, 0x0094ff);
    scene.add(pointLightHelper);
    scene.add(light);


  }   

  initTexture(){
    bgTexture = new THREE.TextureLoader().load("texture/planeBg.jpg");
    bgTexture.wrapS = THREE.MirroredRepeatWrapping;
    bgTexture.wrapT = THREE.MirroredRepeatWrapping;
    bgTexture.repeat.set(1, 1);


    sphereTexture = new THREE.TextureLoader().load("texture/wl1.jpg");
    sphereTexture.wrapS = THREE.MirroredRepeatWrapping;
    sphereTexture.wrapT = THREE.MirroredRepeatWrapping;
    sphereTexture.repeat.set(1, 1);

    cylinderTexture = new THREE.TextureLoader().load("texture/wl2.jpg");
    cylinderTexture.wrapS = THREE.MirroredRepeatWrapping;
    cylinderTexture.wrapT = THREE.MirroredRepeatWrapping;
    cylinderTexture.repeat.set(1, 1);

    coneTexture = new THREE.TextureLoader().load("texture/wl3.jpg");
    coneTexture.wrapS = THREE.MirroredRepeatWrapping;
    coneTexture.wrapT = THREE.MirroredRepeatWrapping;
    coneTexture.repeat.set(1, 1);
  }                     

  initObject(){
    //画一个圆形平面

    let circleGeometry = new THREE.CircleGeometry(250, 100);
    let material = new THREE.MeshLambertMaterial({ color: 0xffffff });
    let mesh = new THREE.Mesh(circleGeometry, material);
    mesh.position.set(0, 0, 0);
    mesh.rotateX(-Math.PI * 0.5);
    //平面接收阴影
    mesh.receiveShadow = true;
    mesh.castShadow = true;
    scene.add(mesh);
    
    //画一个圆锥体

    let coneGeometry = new THREE.ConeGeometry(40, 120, 100);
    let coneMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff,map:coneTexture,flatShading: true });
    coneMesh = new THREE.Mesh(coneGeometry, coneMaterial);
    coneMesh.castShadow = true;
    coneMesh.position.set(0, 60, 200);
    scene.add(coneMesh);

    //画一个球
    let sphereGeometry = new THREE.SphereGeometry(60, 60, 200);
    let sphereMaterial = new THREE.MeshLambertMaterial({ color: 0x0094ff, map: sphereTexture, flatShading: true });
    sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
    //需要计算阴影的物体
    sphereMesh.castShadow = true;
    sphereMesh.position.set(-200, 60, 0);
    scene.add(sphereMesh);

    //画一个圆柱
    let cylinderGeometry = new THREE.CylinderGeometry(60, 60, 180, 100);
    let cylinderMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, map: cylinderTexture, flatShading: true });
    cylinderMesh = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
    cylinderMesh.castShadow = true;
    cylinderMesh.position.set(0, 90, 0);
    scene.add(cylinderMesh);

    let modelLoader = new THREE.JSONLoader();
    //通过json加载人物模型
    // modelLoader.load('models/Male02_dds.json', (geometry, materials) => {
    //   let maleMesh = new THREE.Mesh(geometry, materials);
    //   maleMesh.position.set(-300, 0, 200);
    //   maleMesh.scale.set(2, 2, 2);
    //   maleMesh.castShadow = true;
    //   scene.add(maleMesh);
    // }, // onProgress 回调
    // (xhr) =>{
    //   console.log((xhr.loaded / xhr.total * 100) + '% 已载入')
    // },
    // // onError 回调
    // (err) =>{
    //   console.log('载入出错', err.target.status)
    // });

    
  }

  init() {
    this.initThree();
    this.initScene();
    this.initCamera();
    this.initLight();
    this.initTexture();
    this.initObject();

    let data = canvas.toDataURL();
    
    window.requestAnimationFrame(this.loop.bind(this), canvas);

  }
  
  loop(){
    render.render(scene, camera);
    i++;
    if(i==10){
      //获取到当前的渲染图
      // console.log('fuck:', render.domElement.toDataURL())
      this.showPic(render.domElement.toDataURL());
    }
    
    
    window.requestAnimationFrame(this.loop.bind(this), canvas)
  }


  showPic(base64Data){
    bottomPic.width=width;
    bottomPic.height=height/2;
    bottomPic.style.top=200+'px';
    bottomPic.src = base64Data;
    console.log(bottomPic)
  }

}
let i=0;