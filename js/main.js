function scrollToContent() {
    const element = document.getElementById("explore");
    element.scrollIntoView({ behavior: "smooth" });
}

// Navbar scroll effect
window.addEventListener('scroll', function() {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
    } else {
        navbar.style.boxShadow = "0 2px 10px rgba(0,0,0,0.1)";
    }
});

// Mobile Navigation
const navSlide = () => {
    const burger = document.querySelector('.hamburger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links a');

    if(burger) {
        burger.addEventListener('click', () => {
            // Toggle Nav
            nav.classList.toggle('nav-active');

            // Burger Animation
            burger.classList.toggle('toggle');

            // Animate Links
            navLinks.forEach((link, index) => {
                if (link.style.animation) {
                    link.style.animation = '';
                } else {
                    link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
                }
            });
        });
    }
}
navSlide();

// 3 Balls "Scitriad" Canvas Animation for Hero Section
const canvas = document.getElementById('heroCanvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let width, height;

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    // 3 Triad Balls Configuration
    const balls = [
        { angle: 0, color: '#ff416c', radius: 15, speed: 0.02, distX: 160, distY: 100 },
        { angle: Math.PI * 2 / 3, color: '#f7b733', radius: 15, speed: 0.025, distX: 110, distY: 160 },
        { angle: Math.PI * 4 / 3, color: '#00b09b', radius: 15, speed: 0.015, distX: 130, distY: 130 }
    ];

    function animate() {
        // Draw the dark background trail
        ctx.fillStyle = 'rgba(15, 23, 42, 0.15)'; 
        ctx.fillRect(0, 0, width, height);

        const centerX = width / 2;
        const centerY = height / 2;
        const positions = [];

        // Move and draw each ball
        balls.forEach(ball => {
            ball.angle += ball.speed;
            
            // Lissajous curves mapping for natural overlapping motion
            const x = centerX + Math.cos(ball.angle) * ball.distX;
            const y = centerY + Math.sin(ball.angle * 1.2) * ball.distY;
            positions.push({ x, y });

            ctx.beginPath();
            ctx.arc(x, y, ball.radius, 0, Math.PI * 2);
            ctx.fillStyle = ball.color;
            ctx.shadowBlur = 15;
            ctx.shadowColor = ball.color;
            ctx.fill();
            ctx.closePath();
        });

        // Draw connecting triad lines
        ctx.shadowBlur = 0;
        ctx.beginPath();
        ctx.moveTo(positions[0].x, positions[0].y);
        ctx.lineTo(positions[1].x, positions[1].y);
        ctx.lineTo(positions[2].x, positions[2].y);
        ctx.lineTo(positions[0].x, positions[0].y);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.closePath();

        requestAnimationFrame(animate);
    }
    animate();
}