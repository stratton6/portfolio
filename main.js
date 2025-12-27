// Elisha Straton Kimario | 3D Portfolio Engine

class PortfolioManager {
    constructor() {
        this.cursor = document.querySelector('.custom-cursor');
        this.follower = document.querySelector('.cursor-follower');
        this.mouseX = 0;
        this.mouseY = 0;
        this.followerX = 0;
        this.followerY = 0;

        this.initCursor();
        this.initThree();
        this.initEvents();
    }

    initCursor() {
        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;

            // Direct cursor position
            this.cursor.style.left = this.mouseX + 'px';
            this.cursor.style.top = this.mouseY + 'px';
        });

        const animateFollower = () => {
            this.followerX += (this.mouseX - this.followerX) * 0.15;
            this.followerY += (this.mouseY - this.followerY) * 0.15;

            this.follower.style.left = (this.followerX - 20) + 'px';
            this.follower.style.top = (this.followerY - 20) + 'px';
            requestAnimationFrame(animateFollower);
        };
        animateFollower();

        // Hover effects
        const interactive = document.querySelectorAll('a, .btn, .info-card, .project-item');
        interactive.forEach(el => {
            el.addEventListener('mouseenter', () => {
                this.cursor.style.transform = 'scale(2.5)';
                this.follower.style.borderColor = '#667eea';
                this.follower.style.transform = 'scale(1.2)';
            });
            el.addEventListener('mouseleave', () => {
                this.cursor.style.transform = 'scale(1)';
                this.follower.style.borderColor = 'rgba(255,255,255,0.3)';
                this.follower.style.transform = 'scale(1)';
            });
        });
    }

    initThree() {
        const container = document.getElementById('canvas-container');
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        container.appendChild(this.renderer.domElement);

        this.camera.position.z = 5;

        this.createWorld();
        this.animateThree();
    }

    createWorld() {
        // Starfield Particles
        const geometry = new THREE.BufferGeometry();
        const count = 3000;
        const positions = new Float32Array(count * 3);
        for (let i = 0; i < count * 3; i++) {
            positions[i] = (Math.random() - 0.5) * 20;
        }
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        const material = new THREE.PointsMaterial({
            size: 0.015,
            color: 0x667eea,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending
        });

        this.stars = new THREE.Points(geometry, material);
        this.scene.add(this.stars);

        // Tech Shapes: Torus
        const torusGeo = new THREE.TorusGeometry(1.5, 0.4, 16, 100);
        const torusMat = new THREE.MeshStandardMaterial({
            color: 0x764ba2,
            wireframe: true,
            transparent: true,
            opacity: 0.2
        });
        this.torus = new THREE.Mesh(torusGeo, torusMat);
        this.torus.position.set(-4, 0, -2);
        this.scene.add(this.torus);

        // Tech Shapes: Sphere
        const sphereGeo = new THREE.SphereGeometry(1, 32, 32);
        const sphereMat = new THREE.MeshStandardMaterial({
            color: 0x667eea,
            wireframe: true,
            transparent: true,
            opacity: 0.2
        });
        this.sphere = new THREE.Mesh(sphereGeo, sphereMat);
        this.sphere.position.set(4, -1, -3);
        this.scene.add(this.sphere);

        // Lights
        const pLight = new THREE.PointLight(0x667eea, 2);
        pLight.position.set(5, 5, 5);
        this.scene.add(pLight);

        this.scene.add(new THREE.AmbientLight(0xffffff, 0.4));
    }

    initEvents() {
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });

        // Parallax values
        this.pX = 0;
        this.pY = 0;
        document.addEventListener('mousemove', (e) => {
            this.pX = (e.clientX / window.innerWidth) * 2 - 1;
            this.pY = -(e.clientY / window.innerHeight) * 2 + 1;
        });
    }

    animateThree() {
        const tick = () => {
            requestAnimationFrame(tick);

            const time = Date.now() * 0.0005;

            // Rotation
            this.torus.rotation.x = time * 0.3;
            this.torus.rotation.y = time * 0.5;
            this.sphere.rotation.y = -time * 0.2;
            this.stars.rotation.y = time * 0.05;

            // Smooth parallax
            this.camera.position.x += (this.pX * 0.8 - this.camera.position.x) * 0.05;
            this.camera.position.y += (this.pY * 0.8 - this.camera.position.y) * 0.05;
            this.camera.lookAt(this.scene.position);

            this.renderer.render(this.scene, this.camera);
        };
        tick();
    }
}

// Kickoff
window.addEventListener('DOMContentLoaded', () => {
    new PortfolioManager();
});
