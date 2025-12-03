// Futuristic 3D Scene with Navigation Orbs

const container = document.getElementById('canvas-container');
const scene = new THREE.Scene();
// Fog for depth
scene.fog = new THREE.FogExp2(0x000000, 0.02);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
container.appendChild(renderer.domElement);

// Lighting
const ambientLight = new THREE.AmbientLight(0x404040, 2);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0x00ffcc, 1, 100);
pointLight.position.set(0, 0, 10);
scene.add(pointLight);

// Stars / Particles
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 5000;
const posArray = new Float32Array(particlesCount * 3);

for (let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 50;
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
const particlesMaterial = new THREE.PointsMaterial({
    size: 0.02,
    color: 0xffffff,
    transparent: true,
    opacity: 0.8,
});
const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh);

// Navigation Orbs
const navGroup = new THREE.Group();
scene.add(navGroup);

const orbGeometry = new THREE.IcosahedronGeometry(0.5, 1);
const orbMaterial = new THREE.MeshStandardMaterial({
    color: 0x00ffcc,
    wireframe: true,
    emissive: 0x00ffcc,
    emissiveIntensity: 0.5
});

const links = [
    { name: 'About', url: '/about/', pos: [-3, 1, -2] },
    { name: 'Projects', url: '/projects/', pos: [3, 1, -2] },
    { name: 'Contact', url: '/contact/', pos: [0, -2, -2] }
];

links.forEach(link => {
    const orb = new THREE.Mesh(orbGeometry, orbMaterial.clone());
    orb.position.set(...link.pos);
    orb.userData = { url: link.url, name: link.name };
    navGroup.add(orb);

    // Label (Simple HTML overlay would be better, but keeping it 3D focused for now)
    // For simplicity, we'll rely on hover effects or console logs for now, 
    // or add a text sprite if needed. 
});

camera.position.z = 5;

// Raycaster for interaction
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function onMouseMove(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

function onClick(event) {
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(navGroup.children);
    if (intersects.length > 0) {
        const target = intersects[0].object.userData.url;
        window.location.href = target;
    }
}

window.addEventListener('mousemove', onMouseMove);
window.addEventListener('click', onClick);

// Animation Loop
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();

    // Rotate particles
    particlesMesh.rotation.y = elapsedTime * 0.05;

    // Animate Orbs
    navGroup.children.forEach((orb, i) => {
        orb.rotation.x += 0.01;
        orb.rotation.y += 0.01;
        // Float effect
        orb.position.y += Math.sin(elapsedTime + i) * 0.002;
    });

    // Hover effect logic
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(navGroup.children);

    navGroup.children.forEach(orb => {
        orb.material.emissiveIntensity = 0.5;
        orb.scale.set(1, 1, 1);
    });

    if (intersects.length > 0) {
        const hoveredOrb = intersects[0].object;
        hoveredOrb.material.emissiveIntensity = 1;
        hoveredOrb.scale.set(1.2, 1.2, 1.2);
        document.body.style.cursor = 'pointer';
    } else {
        document.body.style.cursor = 'default';
    }

    renderer.render(scene, camera);
}
animate();

// Resize Handler
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Audio Autoplay Logic
document.addEventListener('click', () => {
    const audio = document.getElementById('bg-music');
    if (audio && audio.paused) {
        audio.play().catch(e => console.log("Audio play failed:", e));
    }
}, { once: true });
