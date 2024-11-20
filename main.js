import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import * as dat from 'lil-gui'
import gsap from 'gsap';

const canvas = document.querySelector('canvas.webgl');
const scene = new THREE.Scene();
const gui = new dat.GUI()

const parameters = {
    color: 0x152663,
    shapeRadius: 1,
    shapeTube: .3,
    radialSegments: 10, 
    tubularSegments: 10,
    arc: Math.PI * 2, 
    spin: ()=>{
        gsap.to(mesh.rotation, {duration: 1, y: mesh.rotation.y + Math.PI * 2})
    },
}

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight // Corrected here
};

const camera = new THREE.PerspectiveCamera(
    75, sizes.width / sizes.height
);
camera.position.z = 3;

scene.add(camera);

const geometry = new THREE.TorusGeometry(
    parameters.shapeRadius,
    parameters.shapeTube,
    parameters.radialSegments,
    parameters.tubularSegments,
    parameters.arc)
const material = new THREE.MeshBasicMaterial({color: parameters.color, wireframe: true})

const mesh = new THREE.Mesh(
    geometry,
    material
)


scene.add(mesh);

const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
});


renderer.setSize(sizes.width, sizes.height);

window.addEventListener('resize', ()=>{
    // Sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

window.addEventListener('dblclick', ()=>{
    const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement

    if (!fullscreenElement){
        if (canvas.requestFullscreen){
            canvas.requestFullscreen()
        }
        else if(canvas.webkitRequestFullscreen){
            canvas.webkitRequestFullscreen()
        }
    }
    else{
        if(document.exitFullscreen){
            document.exitFullscreen()
        }
        else if(document.webkitExitFullscreen)
        {
            document.webkitExitFullscreen()
        }
    }
})
// DAT GUI

function updateShape(){
    return new THREE.TorusGeometry(
        parameters.shapeRadius,
        parameters.shapeTube,
        parameters.radialSegments,
        parameters.tubularSegments,
        parameters.arc)
}


gui.add(mesh.position, 'y').min(-1.5).max(1.5).step(0.01).name('Vertical')
gui.add(mesh.position, 'x').min(-3).max(3).step(0.01).name('Horizontal')
gui.add(mesh, 'visible').name('Visibility')
gui.add(material, 'wireframe')
gui.add(mesh.rotation, 'x').min(-3).max(3).step(0.01).name('Rotate on X')
gui.add(mesh.rotation, 'y').min(-3).max(3).step(0.01).name('Rotate on Y')
gui.add(mesh.rotation, 'z').min(-3).max(3).step(0.01).name('Rotate on Z')
gui.add(camera.position, 'z').min(1).max(10).step(0.01).name('Zoom')
gui.addColor(parameters, 'color').onChange(()=>{
    material.color.set(parameters.color)
}).name('Color')
gui.add(parameters, 'shapeRadius').min(1).max(10).step(0.01).name('Radius').onChange(()=>{
    mesh.geometry.dispose()
    mesh.geometry = updateShape()
})
gui.add(parameters, 'shapeTube').min(0).max(1).step(0.01).name('Tube').onChange(()=>{
    mesh.geometry.dispose()
    mesh.geometry = updateShape()
})
gui.add(parameters, 'radialSegments').min(1).max(20).step(0.01).name('Radial Segments').onChange(()=>{
    mesh.geometry.dispose()
    mesh.geometry = updateShape()
})

gui.add(parameters, 'tubularSegments').min(3).max(100).step(0.01).name('Tubular Segments').onChange(()=>{
    mesh.geometry.dispose()
    mesh.geometry = updateShape()
})

gui.add(parameters, 'arc').min(0).max(Math.PI * 2).step(0.01).name('Arc').onChange(()=>{
    mesh.geometry.dispose()
    mesh.geometry = updateShape()
})
gui.add(parameters, 'spin').name("Spin")

// Camera Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
const tick = () =>{
    controls.update()
    renderer.render( scene , camera );
    window.requestAnimationFrame(tick)
}

tick()
