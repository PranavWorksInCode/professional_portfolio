document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
                // Close mobile menu if open
                const nav = document.querySelector('nav');
                nav.classList.remove('active');
            }
        });
    });

    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');

    if (menuToggle && nav) {
        menuToggle.addEventListener('click', () => {
            nav.classList.toggle('active');
        });
    }

    // Simple scroll reveal animation
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(section);
    });

    // Background Particle Animation
    const canvas = document.getElementById('bg-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height;
        let particles = [];

        function resize() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        }

        window.addEventListener('resize', resize);
        resize();

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.size = Math.random() * 2 + 1;
                this.color = `rgba(99, 102, 241, ${Math.random() * 0.5})`; // Indigo with opacity
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;
            }

            draw() {
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        function initParticles() {
            particles = [];
            for (let i = 0; i < 50; i++) {
                particles.push(new Particle());
            }
        }

        function animateParticles() {
            ctx.clearRect(0, 0, width, height);

            // Draw connections
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 150) {
                        ctx.strokeStyle = `rgba(99, 102, 241, ${1 - distance / 150})`;
                        ctx.lineWidth = 0.5;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }

            particles.forEach(p => {
                p.update();
                p.draw();
            });

            requestAnimationFrame(animateParticles);
        }

        initParticles();
        animateParticles();
    }

    // Image Stack Loop
    const stackContainer = document.getElementById('image-stack');
    if (stackContainer) {
        const stackItems = Array.from(document.querySelectorAll('.stack-item'));

        // Initialize z-indices
        stackItems.forEach((item, index) => {
            item.style.zIndex = stackItems.length - index;
        });

        function rotateStack() {
            const topItem = stackContainer.firstElementChild;
            if (!topItem) return;

            // Animate out
            topItem.style.transform = 'translateX(50px) rotate(10deg)';
            topItem.style.opacity = '0';

            setTimeout(() => {
                // Move to bottom of stack in DOM
                stackContainer.appendChild(topItem);

                // Reset styles
                topItem.style.transform = '';
                topItem.style.opacity = '1';

                // Re-apply z-indices based on new DOM order
                Array.from(stackContainer.children).forEach((item, index) => {
                    item.style.zIndex = stackItems.length - index;
                });

            }, 500); // Wait for animation
        }

        // Auto-rotate every 10 seconds
        let autoRotate = setInterval(rotateStack, 10000);

        // Click to rotate
        stackContainer.addEventListener('click', () => {
            rotateStack();
            // Reset timer on manual click
            clearInterval(autoRotate);
            autoRotate = setInterval(rotateStack, 10000);
        });
    }

    // Project Video Playback
    document.querySelectorAll('.project-card').forEach(card => {
        const video = card.querySelector('video');
        if (video) {
            card.addEventListener('mouseenter', () => {
                video.play().catch(error => {
                    // Autoplay might be prevented or no source
                    console.log("Video play failed:", error);
                });
            });

            card.addEventListener('mouseleave', () => {
                video.pause();
                video.currentTime = 0;
            });
        }
    });
});