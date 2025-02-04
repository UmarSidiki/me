// GSAP Page Transitions

// Removed initial query selectors
let links = document.querySelectorAll("nav a");
let transition1 = document.querySelector(".transition-1");
let transition2 = document.querySelector(".transition-2");
const content = document.getElementById("content");

document.addEventListener('DOMContentLoaded', function() {
    // Initialize GSAP transitions
    gsap.set(['.transition-1', '.transition-2'], {
        scaleY: 0
    });

    // Apply stored theme
    if (localStorage.getItem("theme") === "light") {
        document.body.classList.add("light-mode");
    }

    // Load header and setup navigation
    fetch('components/header.html')
        .then(response => response.text())
        .then(html => {
            document.getElementById('header').innerHTML = html;
            setupNavigation();
            setupThemeToggle();
            animatePageEntry();
        });
});

function setupNavigation() {
    const links = document.querySelectorAll("nav a");
    const transition1 = document.querySelector(".transition-1");
    const transition2 = document.querySelector(".transition-2");

    links.forEach(link => {
        link.addEventListener("click", e => {
            e.preventDefault();
            const href = e.currentTarget.href;

            // Exit sequence
            const tl = gsap.timeline();
            
            tl.to('.content-wrapper', {
                opacity: 0,
                y: 20,
                duration: 0.3,
                ease: "power2.inOut"
            })
            .to(transition1, {
                scaleY: 1,
                duration: 0.5,
                ease: "power2.inOut"
            })
            .to(transition2, {
                scaleY: 1,
                duration: 0.5,
                ease: "power2.inOut",
                onComplete: () => {
                    window.location.href = href;
                }
            });
        });
    });
}

function setupThemeToggle() {
    const themeToggle = document.getElementById("theme-toggle");
    if (themeToggle) {
        themeToggle.textContent = document.body.classList.contains("light-mode") ? "🌞" : "🌙";
        themeToggle.addEventListener("click", () => {
            document.body.classList.toggle("light-mode");
            themeToggle.textContent = document.body.classList.contains("light-mode") ? "🌞" : "🌙";
            localStorage.setItem("theme", document.body.classList.contains("light-mode") ? "light" : "dark");
        });
    }
}

function animatePageEntry() {
    const tl = gsap.timeline();
    
    tl.from('.content-wrapper', {
        opacity: 0,
        y: 20,
        duration: 0.6,
        ease: "power2.out",
        delay: 0.2
    })
    .to(['.transition-1', '.transition-2'], {
        scaleY: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: "power2.inOut"
    }, "-=0.5");
}

// Cursor
const coords = { x: 0, y: 0 };
const circles = document.querySelectorAll(".circle");
const gridSize = 10; // Controls pixel size
const numCircles = 20; // Number of tail segments

// Create circles dynamically
const container = document.body;
for (let i = 0; i < numCircles; i++) {
  const circle = document.createElement("div");
  circle.className = "circle";
  container.appendChild(circle);
}

// Initialize circles
document.querySelectorAll(".circle").forEach((circle, index) => {
  circle.x = 0;
  circle.y = 0;
  circle.style.backgroundColor = `hsl(${(index * 15) % 360}, 100%, 50%)`;
});

// Mouse move handler with scroll position
window.addEventListener("mousemove", (e) => {
  coords.x = e.pageX;  // Changed from clientX
  coords.y = e.pageY;  // Changed from clientY
});

function animateCircles() {
  let x = coords.x;
  let y = coords.y;

  document.querySelectorAll(".circle").forEach((circle, index) => {
    // Snap to grid with scroll position
    const snappedX = Math.round(x / gridSize) * gridSize;
    const snappedY = Math.round(y / gridSize) * gridSize;

    // Update position (accounting for circle size)
    circle.style.left = `${snappedX - 5}px`;
    circle.style.top = `${snappedY - 5}px`;
    
    // Store current position
    circle.x = snappedX;
    circle.y = snappedY;

    // Calculate next position
    const nextCircle = document.querySelectorAll(".circle")[
      (index + 1) % numCircles
    ];
    x += (nextCircle.x - x) * 0.3;
    y += (nextCircle.y - y) * 0.3;

    // Add pixelated effect
    circle.style.boxShadow = "0 0 2px currentColor";
    circle.style.opacity = 1 - index * 0.03;
  });

  requestAnimationFrame(animateCircles);
}

animateCircles();

// Add fixed positioning to circles
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  .circle {
    position: absolute;
    pointer-events: none;
    z-index: 9999;
  }
`;
document.head.appendChild(styleSheet);