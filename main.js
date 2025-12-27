// 3D Portfolio Engine - main.js

class Portfolio3D {
    constructor() {
        this.canvas = document.querySelector('#scene-canvas');
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            alpha: true
        });

        this.points = [];
        this.init();
        this.createParticles();
        this.setupAnimations();
        this.listenToEvents();
        this.animate();
    }

    init() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.camera.position.z = 5;
    }

    createParticles() {
        const geometry = new THREE.BufferGeometry();
        const count = 2000;
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);

        for (let i = 0; i < count * 3; i++) {
            positions[i] = (Math.random() - 0.5) * 15;
            colors[i] = Math.random();
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const material = new THREE.PointsMaterial({
            size: 0.02,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });

        this.particleSystem = new THREE.Points(geometry, material);
        this.scene.add(this.particleSystem);

        // Add a subtle ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);
    }

    setupAnimations() {
        gsap.registerPlugin(ScrollTrigger);

        // Hero reveal
        gsap.to('.reveal', {
            opacity: 1,
            y: 0,
            duration: 1.5,
            stagger: 0.2,
            ease: "power4.out"
        });

        // Scroll animations for sections
        gsap.utils.toArray('section').forEach(section => {
            gsap.from(section.querySelectorAll('.reveal'), {
                scrollTrigger: {
                    trigger: section,
                    start: "top 80%",
                    toggleActions: "play none none reverse"
                },
                opacity: 0,
                y: 50,
                duration: 1,
                stagger: 0.2
            });
        });
    }

    listenToEvents() {
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });

        window.addEventListener('mousemove', (e) => {
            const mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
            const mouseY = -(e.clientY / window.innerHeight - 0.5) * 2;

            gsap.to(this.particleSystem.rotation, {
                x: mouseY * 0.1,
                y: mouseX * 0.1,
                duration: 2,
                ease: "power2.out"
            });
        });
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        const time = Date.now() * 0.0001;
        this.particleSystem.rotation.y += 0.001;

        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize on load
window.addEventListener('DOMContentLoaded', () => {
    new Portfolio3D();

    // Initialize Lucide icons
    if (window.lucide) {
        window.lucide.createIcons();
    }
});
