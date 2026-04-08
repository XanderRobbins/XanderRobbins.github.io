// ==================== //
// Advanced Canvas      //
// ==================== //

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let particles = [];
let time = 0;

class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.baseX = x;
        this.baseY = y;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.size = Math.random() * 1.5;
        this.alpha = Math.random() * 0.3 + 0.1;
        this.life = Math.random() * 100 + 50;
        this.maxLife = this.life;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life--;
        this.alpha = (this.life / this.maxLife) * (Math.random() * 0.3 + 0.1);

        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height || this.life <= 0) {
            return false;
        }
        return true;
    }

    draw() {
        ctx.fillStyle = `rgba(0, 102, 255, ${this.alpha})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Initialize particles
    particles = [];
    for (let i = 0; i < 50; i++) {
        particles.push(new Particle(
            Math.random() * canvas.width,
            Math.random() * canvas.height
        ));
    }
}

function drawBackground() {
    // Create gradient background
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);

    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    if (isDark) {
        gradient.addColorStop(0, '#0a0a0a');
        gradient.addColorStop(0.5, '#1a1a2e');
        gradient.addColorStop(1, '#16213e');
    } else {
        gradient.addColorStop(0, '#ffffff');
        gradient.addColorStop(0.5, '#f8f9ff');
        gradient.addColorStop(1, '#f0f4ff');
    }

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function animate() {
    time++;
    drawBackground();

    // Update and draw particles
    particles = particles.filter(p => p.update());
    particles.forEach(p => p.draw());

    // Add new particles occasionally
    if (time % 3 === 0 && particles.length < 100) {
        particles.push(new Particle(
            Math.random() * canvas.width,
            Math.random() * canvas.height
        ));
    }

    requestAnimationFrame(animate);
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);
animate();

// ==================== //
// 3D Card Tilt Effect  //
// ==================== //

const cards = document.querySelectorAll('[data-tilt]');

cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * 5;
        const rotateY = ((centerX - x) / centerX) * 5;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
    });
});

// ==================== //
// Intersection Observer //
// ==================== //

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = entry.target.style.animation || 'slideUpFade 0.6s ease forwards';
            if (entry.target.classList.contains('section-title')) {
                entry.target.querySelector('::after')?.style.setProperty('width', '100%');
            }
        }
    });
}, observerOptions);

document.querySelectorAll('.update-card, .project-card, .section').forEach(el => {
    observer.observe(el);
});

// ==================== //
// Theme Switcher       //
// ==================== //

const themeButtons = document.querySelectorAll('.theme-btn');
const html = document.documentElement;

// Load saved theme
const savedTheme = localStorage.getItem('theme') || 'light';
setTheme(savedTheme);

themeButtons.forEach(button => {
    button.addEventListener('click', () => {
        const theme = button.getAttribute('data-theme');
        setTheme(theme);
        localStorage.setItem('theme', theme);
    });
});

function setTheme(theme) {
    // Remove active class from all buttons
    themeButtons.forEach(btn => btn.classList.remove('active'));
    
    // Add active class to selected button
    const activeButton = document.querySelector(`[data-theme="${theme}"]`);
    if (activeButton) {
        activeButton.classList.add('active');
    }
    
    // Apply theme
    if (theme === 'dark') {
        html.setAttribute('data-theme', 'dark');
    } else if (theme === 'light') {
        html.setAttribute('data-theme', 'light');
    } else if (theme === 'auto') {
        // Auto mode - check system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        html.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    }
}

// Listen for system theme changes in auto mode
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'auto') {
        html.setAttribute('data-theme', e.matches ? 'dark' : 'light');
    }
});

// ==================== //
// Keyboard Shortcuts   //
// ==================== //

document.addEventListener('keydown', (e) => {
    // Only trigger if not typing in an input
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
    }

    switch(e.key) {
        case '1':
            window.location.href = 'index.html';
            break;
        case '2':
            window.location.href = 'about.html';
            break;
        case '3':
            window.location.href = 'projects.html';
            break;
        case '4':
            window.location.href = 'blog.html';
            break;
    }
});
