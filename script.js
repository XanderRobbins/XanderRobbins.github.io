// ==================== //
// Canvas Grain Effect  //
// ==================== //

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function drawNoise() {
    const imageData = ctx.createImageData(canvas.width, canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
        const noise = Math.random() * 255;
        data[i] = noise;     // Red
        data[i + 1] = noise; // Green
        data[i + 2] = noise; // Blue
        data[i + 3] = 15;    // Alpha (low opacity)
    }

    ctx.putImageData(imageData, 0, 0);
}

function animate() {
    drawNoise();
    requestAnimationFrame(animate);
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);
animate();

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
