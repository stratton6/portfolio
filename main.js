/* 
   Portfolio Main Controller 
   Handles: Three.js Background, GSAP Animations, Cursor, Navigation
*/

// Wait for DOM
document.addEventListener('DOMContentLoaded', () => {
    initTypingAnimation();
    initThreeJS();
    initScrollAnimations();
    initNavigation();
});

/* --- Typing Animation --- */
function initTypingAnimation() {
    const typingText = document.getElementById('typingText');
    if (!typingText) return;

    const text = 'Elisha Straton';
    let index = 0;

    function type() {
        if (index < text.length) {
            typingText.textContent += text.charAt(index);
            index++;
            setTimeout(type, 150); // Typing speed
        }
    }

    // Start typing after a short delay
    setTimeout(type, 500);
}

/* Custom cursor removed as per user request */

/* --- Three.js Background --- */
function initThreeJS() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    // Particles
    const geometry = new THREE.BufferGeometry();
    const particlesCount = 2000;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 15; // Spread
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    // Material
    const material = new THREE.PointsMaterial({
        size: 0.02,
        color: 0x00f3ff,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });

    // Mesh
    const particlesMesh = new THREE.Points(geometry, material);
    scene.add(particlesMesh);

    camera.position.z = 3;

    // Mouse interaction
    let mouseX = 0;
    let mouseY = 0;

    document.addEventListener('mousemove', (event) => {
        mouseX = event.clientX / window.innerWidth - 0.5;
        mouseY = event.clientY / window.innerHeight - 0.5;
    });

    // Animation Loop
    function animate() {
        requestAnimationFrame(animate);

        particlesMesh.rotation.y += 0.001;
        particlesMesh.rotation.x += 0.001;

        // Gentle Parallax
        particlesMesh.rotation.x += mouseY * 0.05;
        particlesMesh.rotation.y += mouseX * 0.05;

        renderer.render(scene, camera);
    }

    animate();

    // Resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

/* --- GSAP Animations --- */
function initScrollAnimations() {
    gsap.registerPlugin(ScrollTrigger);

    // Header Load
    gsap.from('header', {
        y: -100,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
    });

    // Hero Text Stagger
    gsap.from('.hero-text > *', {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        delay: 0.5,
        ease: 'power3.out'
    });

    // Hero Image Animation - simplified to prevent disappearing
    gsap.from('.hero-img', {
        scale: 0.9,
        opacity: 0,
        duration: 1,
        delay: 0.8,
        ease: 'power2.out'
    });

    // Section Titles
    gsap.utils.toArray('.section-title').forEach(title => {
        gsap.from(title, {
            scrollTrigger: {
                trigger: title,
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            },
            y: 50,
            opacity: 0,
            duration: 0.8
        });
    });

    // Cards
    gsap.utils.toArray('.card').forEach((card, i) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 85%'
            },
            y: 50,
            opacity: 0,
            duration: 0.6,
            delay: i * 0.1 // stagger effect
        });
    });
}

/* --- Navigation --- */
function initNavigation() {
    const toggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (toggle && navLinks) {
        toggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            toggle.classList.toggle('active');
            document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
        });

        // Close menu when clicking links
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                toggle.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }
}
