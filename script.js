// Theme Toggle System - Define early for inline onclick support
function toggleTheme() {
    const html = document.documentElement;
    const themeIcon = document.getElementById('theme-icon');
    
    // Toggle dark class
    const isDark = html.classList.toggle('dark');
    
    // Update icon
    if (themeIcon) {
        themeIcon.className = isDark ? 'fas fa-sun text-base' : 'fas fa-moon text-base';
    }
    
    // Save to localStorage
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    
    // Force style recalculation to ensure CSS is applied
    void html.offsetHeight;
}

window.toggleTheme = toggleTheme;

// Copy Email to Clipboard and Show Notification
function openEmailClient() {
    const email = 'bilaldrsngl@gmail.com';
    
    // Copy email to clipboard
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(() => {
            showEmailNotification('Email kopyalandı');
        }).catch(() => {
            // Fallback for older browsers
            copyToClipboardFallback(email);
        });
    } else {
        // Fallback for older browsers
        copyToClipboardFallback(email);
    }
}

// Fallback copy method for older browsers
function copyToClipboardFallback(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        showEmailNotification('Email kopyalandı');
    } catch (err) {
        showEmailNotification('Email kopyalanamadı', true);
    }
    
    document.body.removeChild(textArea);
}

// Show email notification as a bubble
function showEmailNotification(message, isError = false) {
    // Find the clicked email icon to position bubble near it
    const emailIcons = document.querySelectorAll('a[onclick*="openEmailClient"]');
    let targetElement = null;
    
    // Get the last clicked element (most recent)
    emailIcons.forEach(icon => {
        if (icon === document.activeElement || icon.matches(':hover')) {
            targetElement = icon;
        }
    });
    
    // Fallback to first email icon if none found
    if (!targetElement && emailIcons.length > 0) {
        targetElement = emailIcons[0];
    }
    
    // Remove existing bubble if any
    const existingBubble = document.getElementById('email-bubble');
    if (existingBubble) {
        existingBubble.remove();
    }
    
    // Create bubble element
    const bubble = document.createElement('div');
    bubble.id = 'email-bubble';
    bubble.className = 'email-bubble';
    bubble.innerHTML = `
        <div class="bubble-content">
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Position bubble near the email icon
    if (targetElement) {
        const rect = targetElement.getBoundingClientRect();
        bubble.style.position = 'fixed';
        bubble.style.left = `${rect.left + rect.width / 2}px`;
        bubble.style.top = `${rect.top - 10}px`;
        bubble.style.transform = 'translate(-50%, -100%)';
    } else {
        // Fallback position
        bubble.style.position = 'fixed';
        bubble.style.right = '20px';
        bubble.style.top = '80px';
    }
    
    // Add to body
    document.body.appendChild(bubble);
    
    // Trigger bubble animation
    setTimeout(() => {
        bubble.classList.add('bubble-pop');
    }, 10);
    
    // Pop animation after showing message
    setTimeout(() => {
        bubble.classList.add('bubble-burst');
        setTimeout(() => {
            if (bubble.parentNode) {
                bubble.parentNode.removeChild(bubble);
            }
        }, 600);
    }, 1500);
}

window.openEmailClient = openEmailClient;

function initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    const html = document.documentElement;
    const themeIcon = document.getElementById('theme-icon');
    
    // Apply saved theme
    if (savedTheme === 'dark') {
        html.classList.add('dark');
        if (themeIcon) themeIcon.className = 'fas fa-sun text-base';
    } else {
        html.classList.remove('dark');
        if (themeIcon) themeIcon.className = 'fas fa-moon text-base';
    }
}

// Apply theme immediately
initializeTheme();

// Interactive Background Particle System
class Particle {
    constructor(canvas) {
        this.canvas = canvas;
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 2 - 1;
        this.speedY = Math.random() * 2 - 1;
        // Higher opacity for better visibility, especially on white background
        this.opacity = Math.random() * 0.5 + 0.4;
    }
    
    update(mouseX, mouseY) {
        // Mouse attraction/repulsion
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 130) {
            // Repel from mouse - faster escape to farther distances
            const force = (130 - distance) / 130;
            this.speedX -= (dx / distance) * force * 0.85;
            this.speedY -= (dy / distance) * force * 0.85;
        }
        
        // Update position
        this.x += this.speedX;
        this.y += this.speedY;
        
        // Boundary collision
        if (this.x < 0 || this.x > this.canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > this.canvas.height) this.speedY *= -1;
        
        // Keep particles in bounds
        this.x = Math.max(0, Math.min(this.canvas.width, this.x));
        this.y = Math.max(0, Math.min(this.canvas.height, this.y));
        
        // Friction - reduced for faster movement and longer escape distance
        this.speedX *= 0.96;
        this.speedY *= 0.96;
    }
    
    draw(ctx, mouseX, mouseY) {
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Glow effect near mouse
        const glowIntensity = Math.max(0, 1 - distance / 150);
        
        // Check if dark mode
        const isDark = document.documentElement.classList.contains('dark');
        const colorR = isDark ? 56 : 14;
        const colorG = isDark ? 189 : 165;
        const colorB = isDark ? 248 : 233;
        
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        
        // Gradient from mouse position
        const gradient = ctx.createRadialGradient(
            mouseX, mouseY, 0,
            this.x, this.y, distance
        );
        
        // More visible particles, especially on white background
        const baseOpacity = this.opacity * 1.3;
        gradient.addColorStop(0, `rgba(${colorR}, ${colorG}, ${colorB}, ${Math.min(1, baseOpacity + glowIntensity * 0.4)})`);
        gradient.addColorStop(0.5, `rgba(${colorR}, ${colorG}, ${colorB}, ${baseOpacity * 0.7})`);
        gradient.addColorStop(1, `rgba(${colorR}, ${colorG}, ${colorB}, ${baseOpacity * 0.3})`);
        
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // Glow effect - stronger for better visibility
        if (glowIntensity > 0) {
            ctx.shadowBlur = 20 * glowIntensity;
            ctx.shadowColor = `rgba(${colorR}, ${colorG}, ${colorB}, 0.9)`;
            ctx.fill();
            ctx.shadowBlur = 0;
        }
    }
}

// Initialize Interactive Background
let particles = [];
let canvas, ctx;
let animationId;
let currentMouseX = 0;
let currentMouseY = 0;

function initializeInteractiveBackground() {
    canvas = document.getElementById('interactive-bg');
    if (!canvas) return;
    
    ctx = canvas.getContext('2d');
    
    // Set canvas size
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Create particles - Increased count for better visual effect
    const particleCount = Math.floor((canvas.width * canvas.height) / 4000);
    particles = [];
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle(canvas));
    }
    
    // Start animation
    animate();
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Update and draw particles
    particles.forEach(particle => {
        particle.update(currentMouseX, currentMouseY);
        particle.draw(ctx, currentMouseX, currentMouseY);
    });
    
    // Check if dark mode
    const isDark = document.documentElement.classList.contains('dark');
    const colorR = isDark ? 56 : 14;
    const colorG = isDark ? 189 : 165;
    const colorB = isDark ? 248 : 233;
    
    // Connect nearby particles with lines - Optimized (only check nearby particles)
    const maxDistance = 120;
    const maxDistanceSq = maxDistance * maxDistance;
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distanceSq = dx * dx + dy * dy;
            
            // Use squared distance to avoid expensive sqrt
            if (distanceSq < maxDistanceSq) {
                const distance = Math.sqrt(distanceSq);
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.strokeStyle = `rgba(${colorR}, ${colorG}, ${colorB}, ${0.2 * (1 - distance / maxDistance)})`;
                ctx.lineWidth = 1;
                ctx.stroke();
            }
        }
    }
    
    // Mouse glow effect removed - using CSS mouse-follow instead
    
    animationId = requestAnimationFrame(animate);
}

// Update mouse position for particles (already handled in mousemove event below)

// Projects Data
const projects = [
    {
        id: 1,
        title: 'BeBi - Event Management System',
        subtitle: 'Web Programming Course Project',
        shortDescription: 'Full-stack web application for event ticketing and management. Built with HTML5, CSS3, JavaScript, PHP, and MySQL.',
        fullDescription: 'Developed as a final project for the Web Programming course, this is a full-stack web application covering the entire process of event ticketing and management. The project successfully applied both fundamental and advanced concepts required for web application development.\n\nDevelopment and Achievements:\n\nFull-Stack Proficiency: Integrated the front-end (HTML5, CSS3, Vanilla JavaScript) and the server-side (PHP, MySQL) to build the entire application from scratch.\n\nFunctionality: Developed a user flow for event searching and ticket purchasing, alongside an Admin Panel for managers to handle event/user management and category-based analytics.\n\nSecurity Focus: In line with course requirements, I prioritized security by implementing measures like Prepared Statements for SQL Injection protection and password hashing to ensure data integrity.\n\nDesign: Applied modern UI/UX principles and ensured mobile compatibility (Responsive Design) to guarantee the project functions seamlessly across all devices.',
        technologies: ['HTML5', 'CSS3', 'JavaScript', 'PHP', 'MySQL', 'Responsive Design'],
        githubUrl: 'https://github.com/bilaldrsngl',
        images: [
            'images/web/2.png',
            'images/web/1.png',
            'images/web/3.png',
            'images/web/4.png',
            'images/web/5.png',
            'images/web/6.png',
            'images/web/7.png',
            'images/web/8.png',
            'images/web/9.png',
            'images/web/10.png',
            'images/web/1.0.png'
        ],
        hasCarousel: true,
        hasModal: true
    },
    {
        id: 2,
        title: 'CineGalaxy - Cinema Database Management System',
        subtitle: 'Database Management Systems (DBMS) Course Project',
        shortDescription: 'Comprehensive cinema operation system with complex database relationships, transaction management, and data integrity controls.',
        fullDescription: 'This project is designed to simulate the backend data architecture and management of a comprehensive cinema operation system.\n\nKey Database Features:\n\nData Modeling: Designed and implemented complex relationships (One-to-Many, Many-to-Many) between entities such as Movies, Halls, Sessions, Tickets, and Users based on ER diagrams.\n\nData Integrity: Applied transaction management and concurrency control logic to ensure consistency and prevent double-booking of seats.\n\nComplex Queries: Utilized Joins (or Aggregation Pipelines) and grouping functions to calculate revenue analytics and seat occupancy rates.\n\nNormalization: The database schema was normalized to minimize data redundancy and optimize performance.',
        technologies: ['MSMS', 'PHP', 'CSS', 'HTML', 'JavaScript'],
        githubUrl: 'https://github.com/bilaldrsngl',
        images: [
            'images/dataresim/2.png',
            'images/dataresim/1.png',
            'images/dataresim/3.png',
            'images/dataresim/4.png',
            'images/dataresim/5.png',
            'images/dataresim/6.png',
            'images/dataresim/7.png',
            'images/dataresim/8.png',
            'images/dataresim/9.png',
            'images/dataresim/10.png',
            'images/dataresim/11.png',
            'images/dataresim/12.png',
            'images/dataresim/13.png',
            'images/dataresim/14.png',
            'images/dataresim/15.png',
            'images/dataresim/16.png',
            'images/dataresim/17.png',
            'images/dataresim/18.png',
            'images/dataresim/19.png'
        ],
        hasCarousel: true,
        hasModal: true
    },
];

// Certificates Data
const certificates = [
    {
        id: 1,
        title: 'ERASMUS+',
        subtitle: 'European Solidarity Corps Volunteer',
        issuer: 'European Solidarity Corps (H2O - Associação de Jovens de Arrouquelas)',
        date: '01/07/2025 – 30/08/2025',
        issueDate: '07/09/2025',
        description: 'Actively participated in an EU-funded volunteering project aimed at building a more inclusive society. The project was conducted entirely in English.',
        fullDescription: 'European Solidarity Corps Volunteer\n\nOrganization: European Solidarity Corps (H2O - Associação de Jovens de Arrouquelas)\n\nLocation: Arrouquelas, Portugal\n\nDate: 01/07/2025 – 30/08/2025\n\nCertificate Issue Date: 07/09/2025\n\nVerification ID: CXSG-CY7G-9D4L-9T7U\n\nDescription:\n\nActively participated in an EU-funded volunteering project aimed at building a more inclusive society. The project was conducted entirely in English.\n\nKey Responsibilities & Achievements:\n\nActivity Planning: Actively participated in the planning and implementation of youth and community activities.\n\nWorkshop Facilitation: Assisted with educational and environmental workshops and supported local cultural events.\n\nSocial Inclusion: Promoted social inclusion through creative and intercultural initiatives, collaborating with participants from different countries.\n\nLanguage & Adaptability: Demonstrated strong adaptability and communication skills in a multicultural environment where the working language was English.',
        credentialUrl: '', // Optional
        credentialId: 'CXSG-CY7G-9D4L-9T7U',
        icon: 'fas fa-certificate',
        image: 'images/certificates/WhatsApp Image 2025-11-27 at 23.19.27_fb61a6ea.jpg',
        images: [
            'images/certificates/WhatsApp Image 2025-11-27 at 23.19.27_fb61a6ea.jpg',
            'images/certificates/WhatsApp Image 2025-11-27 at 23.19.27_fff1148d.jpg'
        ],
        hasCarousel: true,
        hasModal: true
    }
];

// Mouse Trail Circles
let mouseX = 0;
let mouseY = 0;
let trailCircles = [];
let circlePositions = [];

// Initialize trail circles
function initializeMouseTrail() {
    const trailContainer = document.getElementById('mouse-trail');
    if (!trailContainer) return;
    
    const circles = trailContainer.querySelectorAll('.trail-circle');
    circles.forEach((circle, index) => {
        circlePositions.push({ x: 0, y: 0 });
        circle.style.left = '0px';
        circle.style.top = '0px';
        circle.style.opacity = '0';
    });
}

// Mouse Movement Tracker with Trail Effect - Optimized
let mouseUpdateTicking = false;
document.addEventListener('mousemove', function(event) {
    mouseX = event.clientX;
    mouseY = event.clientY;
    currentMouseX = mouseX;
    currentMouseY = mouseY;
    
    document.documentElement.style.setProperty('--mouse-x', `${mouseX}px`);
    document.documentElement.style.setProperty('--mouse-y', `${mouseY}px`);
    
    if (!mouseUpdateTicking) {
        requestAnimationFrame(() => {
    updateTrailCircles();
            mouseUpdateTicking = false;
});
        mouseUpdateTicking = true;
    }
}, { passive: true });

// Update trail circles position
let animationFrameId = null;

function updateTrailCircles() {
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }
    
    animationFrameId = requestAnimationFrame(() => {
        const trailContainer = document.getElementById('mouse-trail');
        if (!trailContainer) return;
        
        const circles = trailContainer.querySelectorAll('.trail-circle');
        
        circles.forEach((circle, index) => {
            if (index === 0) {
                // First circle follows mouse directly
                circlePositions[index] = { x: mouseX, y: mouseY };
            } else {
                // Other circles follow the previous one with smooth interpolation
                const prevPos = circlePositions[index - 1] || { x: mouseX, y: mouseY };
                const currentPos = circlePositions[index] || { x: mouseX, y: mouseY };
                
                circlePositions[index] = {
                    x: currentPos.x + (prevPos.x - currentPos.x) * 0.4,
                    y: currentPos.y + (prevPos.y - currentPos.y) * 0.4
                };
            }
            
            const pos = circlePositions[index];
            circle.style.left = `${pos.x}px`;
            circle.style.top = `${pos.y}px`;
            circle.classList.add('visible');
        });
    });
}

// Hide trail when mouse leaves window
document.addEventListener('mouseleave', function() {
    const circles = document.querySelectorAll('.trail-circle');
    circles.forEach(circle => {
        circle.classList.remove('visible');
    });
});

// Show trail when mouse enters window
document.addEventListener('mouseenter', function() {
    updateTrailCircles();
});

// Scroll Progress Bar
// Throttle function for performance
function throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function initializeScrollProgress() {
    const progressBar = document.getElementById('scroll-progress');
    if (!progressBar) return;
    
    const updateProgress = throttle(() => {
        const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = (window.scrollY / windowHeight) * 100;
        progressBar.style.width = `${scrolled}%`;
    }, 16); // ~60fps
    
    window.addEventListener('scroll', updateProgress, { passive: true });
}

// Back to Top Button
function initializeBackToTop() {
    const backToTopBtn = document.getElementById('back-to-top');
    if (!backToTopBtn) return;
    
    const updateButton = throttle(() => {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('visible');
            backToTopBtn.style.opacity = '1';
            backToTopBtn.style.pointerEvents = 'auto';
        } else {
            backToTopBtn.classList.remove('visible');
            backToTopBtn.style.opacity = '0';
            backToTopBtn.style.pointerEvents = 'none';
        }
    }, 100);
    
    window.addEventListener('scroll', updateButton, { passive: true });
    
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Smooth Scroll Indicator
function initializeScrollIndicator() {
    const dots = document.querySelectorAll('.scroll-dot');
    const sections = document.querySelectorAll('section[id]');
    
    if (dots.length === 0) return;
    
    // Update active dot on scroll - throttled
    const updateActiveDot = throttle(() => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        dots.forEach(dot => {
            dot.classList.remove('active');
            if (dot.getAttribute('data-section') === current) {
                dot.classList.add('active');
            }
        });
    }, { passive: true });
    
    // Smooth scroll on click
    dots.forEach(dot => {
        dot.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = dot.getAttribute('data-section');
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Typing Effect for Hero Title - English only
function initializeTypingEffect() {
    const typingElement = document.querySelector('.typing-text');
    if (!typingElement) return;
    
    // Clear and prepare for typing animation
    const baseText = "Hello, I'm ";
    const nameText = "Bilal";
    typingElement.innerHTML = baseText;
    typingElement.style.opacity = '1';
    typingElement.style.visibility = 'visible';
    
    let charIndex = 0;
    let typingSpeed = 100;
    
    function type() {
        if (charIndex < nameText.length) {
            // Typing "Bilal" - name kısmını renkli göster
            const typedName = nameText.substring(0, charIndex + 1);
            typingElement.innerHTML = baseText + '<span class="text-primary-600 dark:text-primary-400">' + typedName + '</span><span class="typing-cursor"></span>';
            charIndex++;
            setTimeout(type, typingSpeed);
        } else {
            // "Hello, I'm Bilal" tamamlandı - cursor'ı kaldır
            typingElement.innerHTML = baseText + '<span class="text-primary-600 dark:text-primary-400">' + nameText + '</span>';
        }
    }
    
    // Start typing after a short delay
    setTimeout(type, 1000);
}

// Enhanced Contact Form Validation
function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    // Remove previous error
    const existingError = field.parentElement.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    field.classList.remove('error', 'valid');
    
    // Validation rules
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'This field is required';
    } else if (field.type === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        isValid = false;
        errorMessage = 'Please enter a valid email';
    } else if (field.name === 'message' && value.length < 10) {
        isValid = false;
        errorMessage = 'Message must be at least 10 characters';
    }
    
    if (!isValid) {
        field.classList.add('error');
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message text-red-500 text-sm mt-1';
        errorDiv.textContent = errorMessage;
        field.parentElement.appendChild(errorDiv);
    } else if (value) {
        field.classList.add('valid');
    }
    
    return isValid;
}

function initializeContactForm() {
    const form = document.getElementById('contact-form');
    const submitBtn = document.getElementById('submit-btn');
    const statusMsg = document.getElementById('form-status');
    
    if (!form) return;
    
    const inputs = form.querySelectorAll('input, textarea');
    
    // Add focus/blur animations and validation
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
            this.style.transform = 'scale(1.02)';
            this.style.transition = 'transform 0.2s ease';
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
            this.style.transform = 'scale(1)';
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            validateField(this);
        });
    });
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        let isValid = true;
        inputs.forEach(input => {
            if (!validateField(input)) {
                isValid = false;
            }
        });
        
        if (!isValid) {
            if (statusMsg) {
                statusMsg.textContent = 'Please fix the errors above';
                statusMsg.classList.remove('hidden', 'success');
                statusMsg.classList.add('error');
            }
            return;
        }
        
        const formData = {
            name: document.getElementById('name')?.value || '',
            email: document.getElementById('email')?.value || '',
            message: document.getElementById('message')?.value || '',
        };
        
        // Get submit button (it's the button inside the form)
        const submitButton = form.querySelector('button[type="submit"]');
        let originalText = '';
        
        // Disable submit button
        if (submitButton) {
            submitButton.disabled = true;
            originalText = submitButton.innerHTML;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        }
        if (statusMsg) {
            statusMsg.classList.add('hidden');
        }
        
        // Send email using Web3Forms API (free email service)
        // Get your access key from https://web3forms.com/
        const accessKey = '2c077938-46fb-4d74-8300-4ca789ab87ab';
        
        // If access key is not set, show error
        if (accessKey === 'YOUR_ACCESS_KEY') {
            showErrorMessage(submitButton, statusMsg, 'Please configure email service. Contact me directly at bilaldrsngl@gmail.com');
            return;
        }
        
        // Send email using Web3Forms
        fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                access_key: accessKey,
                subject: `Portfolio Contact Form: ${formData.name}`,
                from_name: formData.name,
                from_email: formData.email,
                message: formData.message,
                to_email: 'bilaldrsngl@gmail.com'
            })
        })
        .then(async (response) => {
            const result = await response.json();
            if (response.ok && result.success) {
                showSuccessMessage(submitButton, statusMsg, form, inputs, originalText);
            } else {
                throw new Error(result.message || 'Failed to send email');
            }
        })
        .catch((error) => {
            showErrorMessage(submitButton, statusMsg, error.message);
        });
    });
}

function showSuccessMessage(submitButton, statusMsg, form, inputs, originalText) {
    if (submitButton) {
        submitButton.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
        submitButton.classList.add('success');
        submitButton.disabled = false;
            }
            if (statusMsg) {
        statusMsg.textContent = 'Your message has been sent successfully! I will get back to you soon.';
                statusMsg.classList.remove('hidden', 'error');
                statusMsg.classList.add('success');
            }
            
            // Reset form and clear validation
            form.reset();
            inputs.forEach(input => {
                input.classList.remove('error', 'valid');
                const errorMsg = input.parentElement.querySelector('.error-message');
                if (errorMsg) errorMsg.remove();
            });
            
    // Reset button after 5 seconds
            setTimeout(() => {
        if (submitButton && originalText) {
            submitButton.innerHTML = originalText;
            submitButton.classList.remove('success');
                }
                if (statusMsg) {
                    statusMsg.classList.add('hidden');
                }
    }, 5000);
}

function showErrorMessage(submitButton, statusMsg, customMessage) {
    if (submitButton) {
        submitButton.disabled = false;
        submitButton.innerHTML = 'Send Message';
    }
    if (statusMsg) {
        statusMsg.textContent = customMessage || 'Failed to send message. Please try again or contact me directly at bilaldrsngl@gmail.com';
        statusMsg.classList.remove('hidden', 'success');
        statusMsg.classList.add('error');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Prevent browser zoom on load
    if (window.devicePixelRatio !== 1) {
        document.body.style.zoom = 1 / window.devicePixelRatio;
    }
    
    // Ensure viewport is set correctly
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
        viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
    }
    // Update theme icon (theme already applied in initializeTheme above)
    const themeIcon = document.getElementById('theme-icon');
    const html = document.documentElement;
    if (themeIcon && html.classList.contains('dark')) {
        themeIcon.className = 'fas fa-sun text-base';
    } else if (themeIcon) {
        themeIcon.className = 'fas fa-moon text-base';
    }
    
    // Theme toggle button - remove inline onclick handler and use addEventListener
    const themeToggleBtn = document.getElementById('theme-toggle');
    if (themeToggleBtn) {
        // Remove inline onclick and use addEventListener
        themeToggleBtn.removeAttribute('onclick');
        themeToggleBtn.addEventListener('click', toggleTheme);
    }
    
    initializeWelcomeScreen();
    initializeInteractiveBackground();
    initializeMouseTrail();
    initializeScrollProgress();
    initializeBackToTop();
    initializeScrollIndicator();
    initializeProjects();
    initializeCertificates();
    initializeNavigation();
    initializeContactForm();
    initializeFooter();
    initializeScrollEffects();
    initializeTypingEffect();
    initializeSectionReveal();
    initializeBlobAnimation();
    initializeAOS();
});


// Theme Notification - Show once on first visit (original function for backward compatibility)
function initializeThemeNotification() {
    // This function is kept for backward compatibility but won't be called
    // The notification is now shown after typing effect completes
}


// Initialize Projects
function initializeProjects() {
    const container = document.getElementById('projects-container');
    if (!container) return;

    projects.forEach(project => {
        const projectDiv = document.createElement('div');
        projectDiv.className = 'project-card project-card-modern modern-card gradient-card rounded-xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-3 hover:scale-105';
        
        let linksHtml = '';
        if (project.githubUrl) {
            linksHtml += `<a href="${project.githubUrl}" target="_blank" rel="noopener noreferrer" class="project-link flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-500 to-primary-600 dark:from-primary-600 dark:to-primary-700 text-white rounded-lg font-medium hover:from-primary-600 hover:to-primary-700 dark:hover:from-primary-500 dark:hover:to-primary-600 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105">
                <i class="fab fa-github"></i>
                <span>GitHub</span>
            </a>`;
        }
        if (project.liveUrl) {
            linksHtml += `<a href="${project.liveUrl}" target="_blank" rel="noopener noreferrer" class="project-link flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-500 to-primary-600 dark:from-primary-600 dark:to-primary-700 text-white rounded-lg font-medium hover:from-primary-600 hover:to-primary-700 dark:hover:from-primary-500 dark:hover:to-primary-600 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105">
                <i class="fas fa-external-link-alt"></i>
                <span>Live Demo</span>
            </a>`;
        }

        // Fotoğraf carousel varsa özel header oluştur
        let headerHtml = '';
        if (project.hasCarousel && project.images && project.images.length > 0) {
            const imagesHtml = project.images.map((img, idx) => 
                `<div class="project-carousel-slide ${idx === 0 ? 'active' : ''}" data-slide="${idx}">
                    <img src="${img}" alt="${project.title} - Screenshot ${idx + 1}" class="w-full h-full object-cover">
                </div>`
            ).join('');
            
            headerHtml = `
                <div class="project-header project-carousel-container h-64 bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 dark:from-primary-600 dark:via-primary-700 dark:to-primary-800 relative overflow-hidden">
                    <div class="project-carousel-wrapper h-full w-full relative">
                        ${imagesHtml}
            </div>
                    ${project.images.length > 1 ? `
                        <div class="project-carousel-controls absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
                            ${project.images.map((_, idx) => 
                                `<button class="carousel-dot ${idx === 0 ? 'active' : ''} w-2 h-2 rounded-full bg-white/50 hover:bg-white transition-all duration-300" data-slide="${idx}" aria-label="Go to slide ${idx + 1}"></button>`
                            ).join('')}
                        </div>
                        <button class="carousel-prev absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-all duration-300 z-20" aria-label="Previous slide">
                            <i class="fas fa-chevron-left"></i>
                        </button>
                        <button class="carousel-next absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-all duration-300 z-20" aria-label="Next slide">
                            <i class="fas fa-chevron-right"></i>
                        </button>
                    ` : ''}
                    <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
                </div>
            `;
        } else {
            headerHtml = `
                <div class="project-header h-48 bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 dark:from-primary-600 dark:via-primary-700 dark:to-primary-800 flex items-center justify-center relative overflow-hidden">
                    <div class="absolute inset-0 bg-black/10 dark:bg-black/20"></div>
                    <div class="text-white text-6xl font-bold relative z-10 drop-shadow-lg">${project.title.charAt(0)}</div>
                    <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
            `;
        }
        
        const subtitleHtml = project.subtitle ? `<p class="text-sm text-primary-600 dark:text-primary-400 mb-2 font-medium">${project.subtitle}</p>` : '';
        
        // Kısa açıklama kullan
        const displayDescription = project.shortDescription || project.description || '';
        
        // Modal için full description formatla
        let formattedFullDescription = '';
        if (project.hasModal && project.fullDescription) {
            const descriptionLines = project.fullDescription.split('\n').filter(line => line.trim());
            let inList = false;
            
            descriptionLines.forEach((line, index) => {
                const trimmed = line.trim();
                if (!trimmed) return;
                
                if (trimmed.endsWith(':')) {
                    if (inList) {
                        formattedFullDescription += '</ul>';
                        inList = false;
                    }
                    formattedFullDescription += `<p class="font-semibold text-gray-900 dark:text-white mb-2 mt-3">${trimmed}</p>`;
                }
                else if (trimmed.startsWith('-') || trimmed.startsWith('•') || 
                         (index > 0 && descriptionLines[index - 1].trim().endsWith(':'))) {
                    if (!inList) {
                        formattedFullDescription += '<ul class="list-disc list-inside space-y-1 mb-2 ml-4">';
                        inList = true;
                    }
                    const listItem = trimmed.replace(/^[-•]\s*/, '');
                    formattedFullDescription += `<li class="text-gray-600 dark:text-gray-300">${listItem}</li>`;
                }
                else {
                    if (inList) {
                        formattedFullDescription += '</ul>';
                        inList = false;
                    }
                    formattedFullDescription += `<p class="mb-2 text-gray-600 dark:text-gray-300">${trimmed}</p>`;
                }
            });
            
            if (inList) {
                formattedFullDescription += '</ul>';
            }
        }
        
        
        // Önizle butonu için modal HTML'i (büyük modal)
        const modalId = `project-modal-${project.id}`;
        let modalHtml = '';
        if (project.hasModal && project.images && project.images.length > 0) {
            const modalImagesHtml = project.images.map((img, idx) => 
                `<div class="modal-carousel-slide ${idx === 0 ? 'active' : ''}" data-slide="${idx}">
                    <img src="${img}" alt="${project.title} - Screenshot ${idx + 1}" class="w-full h-full object-contain">
                </div>`
            ).join('');
            
            modalHtml = `
                <div id="${modalId}" class="project-modal fixed inset-0 bg-black/90 dark:bg-black/95 backdrop-blur-sm z-[10000] hidden items-center justify-center p-4" style="position: fixed !important; top: 0 !important; left: 0 !important; right: 0 !important; bottom: 0 !important; width: 100vw !important; height: 100vh !important;">
                    <div class="project-modal-content bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-[95vw] max-w-[95vw] h-[95vh] max-h-[95vh] overflow-hidden flex flex-col" style="width: 95vw !important; max-width: 95vw !important; height: 95vh !important; max-height: 95vh !important;">
                        <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                            <div>
                                <h3 class="text-3xl font-bold text-gray-900 dark:text-white">${project.title}</h3>
                                ${subtitleHtml}
                            </div>
                            <button class="modal-close text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-2xl p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-all" aria-label="Close modal">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                        <div class="flex-1 overflow-y-auto p-6">
                            <div class="grid lg:grid-cols-2 gap-8">
                                <div class="modal-carousel-container h-[500px] lg:h-[600px] bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden relative shadow-lg">
                                    <div class="modal-carousel-wrapper h-full w-full relative">
                                        ${modalImagesHtml}
                                    </div>
                                    ${project.images.length > 1 ? `
                                        <div class="modal-carousel-controls absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
                                            ${project.images.map((_, idx) => 
                                                `<button class="modal-carousel-dot ${idx === 0 ? 'active' : ''} w-2 h-2 rounded-full bg-white/50 hover:bg-white transition-all duration-300" data-slide="${idx}"></button>`
                                            ).join('')}
                                        </div>
                                        <button class="modal-carousel-prev absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 dark:bg-gray-700/90 hover:bg-white dark:hover:bg-gray-700 text-gray-900 dark:text-white p-3 rounded-full transition-all z-20 shadow-lg">
                                            <i class="fas fa-chevron-left"></i>
                                        </button>
                                        <button class="modal-carousel-next absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 dark:bg-gray-700/90 hover:bg-white dark:hover:bg-gray-700 text-gray-900 dark:text-white p-3 rounded-full transition-all z-20 shadow-lg">
                                            <i class="fas fa-chevron-right"></i>
                                        </button>
                                    ` : ''}
                                </div>
                                <div class="space-y-6">
                                    <div>
                                        <h4 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Description</h4>
                                        <div class="text-gray-700 dark:text-gray-300 text-base leading-relaxed max-h-[400px] overflow-y-auto pr-2">
                                            ${formattedFullDescription || displayDescription}
                                        </div>
                                    </div>
                                    <div>
                                        <h4 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Technologies</h4>
                                        <div class="flex flex-wrap gap-3">
                                            ${project.technologies.map(tech => 
                                                `<span class="px-4 py-2 bg-gradient-to-r from-primary-500/20 to-primary-600/20 dark:from-primary-400/30 dark:to-primary-500/30 text-primary-700 dark:text-primary-300 border border-primary-300 dark:border-primary-600 rounded-lg text-sm font-medium">${tech}</span>`
                                            ).join('')}
                                        </div>
                                    </div>
                                    ${linksHtml ? `
                                        <div class="flex gap-4 pt-2">
                                            ${linksHtml}
                                        </div>
                                    ` : ''}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }

        projectDiv.innerHTML = `
            ${headerHtml}
            <div class="p-6 project-content relative">
                <!-- Preview Butonu (Hover'da görünür) -->
                ${project.hasModal ? `
                    <div class="preview-btn-overlay absolute inset-0 bg-black/60 dark:bg-black/70 backdrop-blur-sm rounded-xl opacity-0 pointer-events-none transition-opacity duration-300 flex items-center justify-center z-10">
                        <button class="preview-btn bg-gradient-to-r from-primary-500 to-primary-600 dark:from-primary-600 dark:to-primary-700 text-white px-6 py-3 rounded-lg font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2" data-modal="${modalId}">
                            <i class="fas fa-eye"></i>
                            <span>Preview</span>
                        </button>
            </div>
                ` : ''}
                <h3 class="text-2xl font-semibold text-gray-900 dark:text-white mb-1">${project.title}</h3>
                ${subtitleHtml}
                <p class="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed text-sm line-clamp-3">${displayDescription}</p>
                <div class="flex flex-wrap gap-2 mb-4">
                    ${project.technologies.map(tech => 
                        `<span class="tech-badge px-3 py-1 bg-gradient-to-r from-primary-500/20 to-primary-600/20 dark:from-primary-400/30 dark:to-primary-500/30 text-primary-700 dark:text-primary-300 border border-primary-300 dark:border-primary-600 rounded-full text-sm font-medium hover:from-primary-500/30 hover:to-primary-600/30 dark:hover:from-primary-400/40 dark:hover:to-primary-500/40 transition-all duration-200">${tech}</span>`
                    ).join('')}
                </div>
                <div class="flex gap-4">
                    ${linksHtml}
                </div>
            </div>
        `;
        container.appendChild(projectDiv);
        
        // Modal'ı body'ye ekle (proje kartından bağımsız olarak tüm ekrana yayılsın)
        if (project.hasModal && modalHtml) {
            const modalWrapper = document.createElement('div');
            modalWrapper.innerHTML = modalHtml.trim();
            const modalElement = modalWrapper.firstElementChild;
            if (modalElement) {
                document.body.appendChild(modalElement);
            }
        }
        
        // Carousel varsa initialize et (otomatik geçiş YOK - sadece manuel)
        if (project.hasCarousel && project.images && project.images.length > 1) {
            initializeProjectCarousel(projectDiv, project.images.length, false); // false = otomatik geçiş yok
        }
        
        // Büyük modal'ı initialize et
        if (project.hasModal) {
            initializeProjectModal(projectDiv, project.id, project.images ? project.images.length : 0);
        }
    });
}

// Project Carousel Initialization
function initializeProjectCarousel(projectCard, totalSlides, autoSlide = true) {
    const carouselContainer = projectCard.querySelector('.project-carousel-container');
    if (!carouselContainer) return;
    
    const slides = carouselContainer.querySelectorAll('.project-carousel-slide');
    const dots = carouselContainer.querySelectorAll('.carousel-dot');
    const prevBtn = carouselContainer.querySelector('.carousel-prev');
    const nextBtn = carouselContainer.querySelector('.carousel-next');
    
    let currentSlide = 0;
    let autoSlideInterval;
    
    function showSlide(index) {
        // Slide'ları gizle
        slides.forEach((slide, idx) => {
            slide.classList.remove('active');
            if (idx === index) {
                slide.classList.add('active');
            }
        });
        
        // Dot'ları güncelle
        dots.forEach((dot, idx) => {
            dot.classList.remove('active');
            if (idx === index) {
                dot.classList.add('active');
            }
        });
        
        currentSlide = index;
    }
    
    function nextSlide() {
        const next = (currentSlide + 1) % totalSlides;
        showSlide(next);
    }
    
    function prevSlide() {
        const prev = (currentSlide - 1 + totalSlides) % totalSlides;
        showSlide(prev);
    }
    
    function startAutoSlide() {
        if (autoSlide) {
            autoSlideInterval = setInterval(nextSlide, 3000); // 3 saniyede bir geçiş
        }
    }
    
    function stopAutoSlide() {
        if (autoSlideInterval) {
            clearInterval(autoSlideInterval);
        }
    }
    
    // Event listeners - Click and Touch support for mobile
    const handleNext = (e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        if (autoSlide) {
            stopAutoSlide();
            nextSlide();
            startAutoSlide();
        } else {
            nextSlide();
        }
    };
    
    const handlePrev = (e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        if (autoSlide) {
            stopAutoSlide();
            prevSlide();
            startAutoSlide();
        } else {
            prevSlide();
        }
    };
    
    if (nextBtn) {
        nextBtn.addEventListener('click', handleNext);
        nextBtn.addEventListener('touchend', handleNext);
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', handlePrev);
        prevBtn.addEventListener('touchend', handlePrev);
    }
    
    // Dot'lara tıklama - Click and Touch support
    dots.forEach((dot, index) => {
        const handleDotClick = (e) => {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }
            if (autoSlide) {
                stopAutoSlide();
                showSlide(index);
                startAutoSlide();
            } else {
                showSlide(index);
            }
        };
        dot.addEventListener('click', handleDotClick);
        dot.addEventListener('touchend', handleDotClick);
    });
    
    // Mouse hover'da durdur (sadece auto slide aktifse)
    if (autoSlide) {
        carouselContainer.addEventListener('mouseenter', stopAutoSlide);
        carouselContainer.addEventListener('mouseleave', startAutoSlide);
    }
    
    // İlk slide'ı göster
    showSlide(0);
    // Auto slide'ı başlat (eğer aktifse)
    if (autoSlide) {
        startAutoSlide();
    }
}


// Project Modal Initialization (Büyük Modal - Önizle butonuna tıklayınca açılır)
function initializeProjectModal(projectCard, projectId, totalSlides) {
    const previewBtn = projectCard.querySelector('.preview-btn');
    const modal = document.getElementById(`project-modal-${projectId}`);
    if (!modal || !previewBtn) return;
    
    const closeBtn = modal.querySelector('.modal-close');
    const modalContent = modal.querySelector('.project-modal-content');
    
    const openModal = () => {
        
        // Modal'ı göster - tüm ekranı kapla
        modal.style.position = 'fixed';
        modal.style.top = '0';
        modal.style.left = '0';
        modal.style.right = '0';
        modal.style.bottom = '0';
        modal.style.width = '100vw';
        modal.style.height = '100vh';
        modal.style.zIndex = '10000';
        modal.style.display = 'flex';
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        
        // İlk başta çok küçük başlat (dosya açılır gibi - scale 0.3)
        modalContent.style.transform = 'scale(0.3)';
        modalContent.style.opacity = '0';
        modalContent.style.transition = 'none';
        modalContent.style.width = '95vw';
        modalContent.style.maxWidth = '95vw';
        modalContent.style.height = '95vh';
        modalContent.style.maxHeight = '95vh';
        
        void modalContent.offsetHeight;
        
        setTimeout(() => {
            modalContent.style.transition = 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.6s ease-out';
            modalContent.style.transform = 'scale(1)';
            modalContent.style.opacity = '1';
        }, 50);
        
        // Modal carousel'i initialize et
        if (totalSlides > 1) {
            setTimeout(() => {
                initializeModalCarousel(modal, totalSlides);
            }, 200);
        }
    };
    
    const closeModal = () => {
        // Küçülme animasyonu
        modalContent.style.transition = 'transform 0.3s ease-in, opacity 0.3s ease-in';
        modalContent.style.transform = 'scale(0.7)';
        modalContent.style.opacity = '0';
        
        setTimeout(() => {
            modal.style.display = 'none';
            modal.classList.add('hidden');
            document.body.style.overflow = '';
            // Reset styles
            modalContent.style.transform = '';
            modalContent.style.opacity = '';
            modalContent.style.transition = '';
        }, 300);
    };
    
    // Preview butonuna tıklama - Click and Touch support for mobile
    const handlePreviewClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        openModal();
    };
    previewBtn.addEventListener('click', handlePreviewClick);
    previewBtn.addEventListener('touchend', handlePreviewClick);
    
    // Modal kapatma
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }
    
    // Modal dışına tıklayınca kapat (modal backdrop'una tıklayınca)
    modal.addEventListener('click', (e) => {
        // Eğer tıklama modal backdrop'una (siyah arka plan) ise kapat
        if (e.target === modal || e.target.classList.contains('project-modal')) {
            closeModal();
        }
    });
    
    // Modal içeriğine tıklayınca kapanmasın
    modalContent.addEventListener('click', (e) => {
        e.stopPropagation();
    });
    
    // ESC tuşu ile kapat
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
            closeModal();
        }
    });
}

// Modal Carousel Initialization (sadece manuel kontrol)
function initializeModalCarousel(modal, totalSlides) {
    const carouselContainer = modal.querySelector('.modal-carousel-container');
    if (!carouselContainer) return;
    
    const slides = carouselContainer.querySelectorAll('.modal-carousel-slide');
    const dots = carouselContainer.querySelectorAll('.modal-carousel-dot');
    const prevBtn = carouselContainer.querySelector('.modal-carousel-prev');
    const nextBtn = carouselContainer.querySelector('.modal-carousel-next');
    
    let currentSlide = 0;
    
    function showSlide(index) {
        slides.forEach((slide, idx) => {
            slide.classList.remove('active');
            if (idx === index) {
                slide.classList.add('active');
            }
        });
        
        dots.forEach((dot, idx) => {
            dot.classList.remove('active');
            if (idx === index) {
                dot.classList.add('active');
            }
        });
        
        currentSlide = index;
    }
    
    function nextSlide() {
        const next = (currentSlide + 1) % totalSlides;
        showSlide(next);
    }
    
    function prevSlide() {
        const prev = (currentSlide - 1 + totalSlides) % totalSlides;
        showSlide(prev);
    }
    
    // Event listeners - Click and Touch support for mobile
    const handleNext = (e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        nextSlide();
    };
    
    const handlePrev = (e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        prevSlide();
    };
    
    if (nextBtn) {
        nextBtn.addEventListener('click', handleNext);
        nextBtn.addEventListener('touchend', handleNext);
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', handlePrev);
        prevBtn.addEventListener('touchend', handlePrev);
    }
    
    dots.forEach((dot, index) => {
        const handleDotClick = (e) => {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }
            showSlide(index);
        };
        dot.addEventListener('click', handleDotClick);
        dot.addEventListener('touchend', handleDotClick);
    });
    
    // Klavye ile kontrol
    const handleKeyDown = (e) => {
        if (!modal.classList.contains('hidden')) {
            if (e.key === 'ArrowRight') {
                nextSlide();
            } else if (e.key === 'ArrowLeft') {
                prevSlide();
            }
        }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    
    showSlide(0);
}

// Navigation Functions
window.scrollToSection = function(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

// Mobile menu functions removed - menu is now always visible horizontally

// Initialize Navigation Scroll Effect
function initializeNavigation() {
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    
    function updateNavbar() {
        const isDark = document.documentElement.classList.contains('dark');
        if (window.scrollY > 50) {
            navbar.classList.remove('bg-transparent', 'py-4');
            if (isDark) {
                navbar.classList.add('bg-black', 'shadow-lg', 'py-2');
            } else {
                navbar.classList.add('bg-white', 'shadow-lg', 'py-2');
            }
        } else {
            navbar.classList.add('bg-transparent', 'py-4');
            navbar.classList.remove('bg-white', 'bg-black', 'shadow-lg', 'py-2');
        }
    }
    
    function updateActiveSection() {
        const sections = ['home', 'about', 'cv', 'projects', 'contact'];
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(sectionId => {
            const section = document.getElementById(sectionId);
            const link = document.querySelector(`[data-section="${sectionId}"]`);
            
                if (section && link) {
                    const { offsetTop, offsetHeight } = section;
                    if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
                        navLinks.forEach(l => {
                            l.classList.remove('active', 'text-primary-600', 'dark:text-primary-400', 'font-semibold');
                        });
                        link.classList.add('active', 'text-primary-600', 'dark:text-primary-400', 'font-semibold');
                    }
                }
        });
    }
    
    const updateOnScroll = throttle(() => {
        updateNavbar();
        updateActiveSection();
    }, 100);
    
    window.addEventListener('scroll', updateOnScroll, { passive: true });
    
    updateNavbar();
    updateActiveSection();
}


// Initialize Footer
function initializeFooter() {
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

// CV Preview Toggle
function toggleCVPreview() {
    const cvPreview = document.getElementById('cv-preview');
    const cvPlaceholder = document.getElementById('cv-placeholder');
    const btn = document.getElementById('view-cv-btn');
    const cvObject = document.getElementById('cv-object');
    
    if (cvPreview && cvPlaceholder) {
        if (cvPreview.classList.contains('hidden')) {
            // Show CV preview
            cvPreview.classList.remove('hidden');
            cvPlaceholder.classList.add('hidden');
            // Load PDF if not already loaded
            if (cvObject && (!cvObject.data || cvObject.data === '')) {
                cvObject.data = 'cv/CV.pdf#toolbar=1&navpanes=1&scrollbar=1';
            }
            // Scroll to CV preview
            setTimeout(() => {
                cvPreview.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 100);
            // Update button text
            if (btn) {
                const icon = btn.querySelector('.view-cv-icon');
                const text = btn.querySelector('.view-cv-text');
                if (icon) icon.className = 'fas fa-eye-slash view-cv-icon';
                if (text) text.textContent = 'Hide CV';
            }
        } else {
            // Hide CV preview
            cvPreview.classList.add('hidden');
            cvPlaceholder.classList.remove('hidden');
            // Update button text
            if (btn) {
                const icon = btn.querySelector('.view-cv-icon');
                const text = btn.querySelector('.view-cv-text');
                if (icon) icon.className = 'fas fa-eye view-cv-icon';
                if (text) text.textContent = 'View CV';
            }
        }
    }
}

window.toggleCVPreview = toggleCVPreview;

// Add touch event support for CV buttons
document.addEventListener('DOMContentLoaded', function() {
    const cvBtn = document.getElementById('view-cv-btn');
    const certificatesBtn = document.getElementById('certificates-btn');
    
    if (cvBtn) {
        cvBtn.addEventListener('touchend', function(e) {
            e.preventDefault();
            e.stopPropagation();
            toggleCVPreview();
        }, { passive: false });
    }
    
    if (certificatesBtn) {
        certificatesBtn.addEventListener('touchend', function(e) {
            e.preventDefault();
            e.stopPropagation();
            toggleCertificatesPreview();
        }, { passive: false });
    }
});

// Initialize Certificates (Similar to Projects)
function initializeCertificates() {
    const container = document.getElementById('certificates-container');
    if (!container) return;

    if (certificates.length === 0) {
        container.innerHTML = `
            <div class="col-span-full text-center py-8">
                <i class="fas fa-certificate text-4xl text-gray-400 dark:text-gray-600 mb-3"></i>
                <p class="text-gray-600 dark:text-gray-400">Certificates will be displayed here.</p>
            </div>
        `;
        return;
    }

    certificates.forEach(certificate => {
        const certDiv = document.createElement('div');
        certDiv.className = 'project-card project-card-modern modern-card gradient-card rounded-xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-3 hover:scale-105';
        
        // Icon instead of image
        const icon = certificate.icon || 'fas fa-certificate';
        headerHtml = `
            <div class="project-header h-48 bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 dark:from-primary-600 dark:via-primary-700 dark:to-primary-800 flex items-center justify-center relative overflow-hidden">
                <div class="absolute inset-0 bg-black/10 dark:bg-black/20"></div>
                <i class="${icon} text-white text-7xl relative z-10 drop-shadow-lg"></i>
                <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
        `;
        
        const shortDescription = certificate.description || 'Click to view details';
        
        certDiv.innerHTML = `
            ${headerHtml}
            <div class="p-6">
                <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">${certificate.title}</h3>
                <button class="certificate-preview-btn w-full px-4 py-2 bg-gradient-to-r from-primary-500 to-primary-600 dark:from-primary-600 dark:to-primary-700 text-white rounded-lg font-medium hover:from-primary-600 hover:to-primary-700 dark:hover:from-primary-500 dark:hover:to-primary-600 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105" data-cert-id="${certificate.id}">
                    <i class="fas fa-eye mr-2"></i>Preview
                </button>
            </div>
        `;
        
        container.appendChild(certDiv);
        
        // Initialize certificate modal (no hover preview, no carousel on card)
        initializeCertificateModal(certDiv, certificate);
    });
}

// Initialize Certificate Modal (Click)
function initializeCertificateModal(certCard, certificate) {
    const previewBtn = certCard.querySelector('.certificate-preview-btn');
    if (!previewBtn) return;
    
    const modalId = `certificate-modal-${certificate.id}`;
    
    previewBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        
        // Check if modal already exists
        let modal = document.getElementById(modalId);
        
        if (!modal) {
            // Create modal
            const modalWrapper = document.createElement('div');
            
            // Format full description
            let formattedDescription = '';
            if (certificate.fullDescription) {
                const lines = certificate.fullDescription.split('\n').filter(line => line.trim());
                formattedDescription = '<div class="space-y-3">';
                lines.forEach(line => {
                    const trimmed = line.trim();
                    if (!trimmed) return;
                    
                    if (trimmed.includes(':') && !trimmed.startsWith('-') && !trimmed.startsWith('•')) {
                        const parts = trimmed.split(':');
                        if (parts.length === 2) {
                            formattedDescription += `<p class="text-base"><span class="font-semibold text-primary-600 dark:text-primary-400">${parts[0]}:</span> <span class="text-gray-700 dark:text-gray-300">${parts[1].trim()}</span></p>`;
                        } else {
                            formattedDescription += `<p class="text-lg font-semibold text-gray-900 dark:text-white mb-2">${trimmed}</p>`;
                        }
                    } else if (trimmed.startsWith('-') || trimmed.startsWith('•')) {
                        const item = trimmed.replace(/^[-•]\s*/, '');
                        formattedDescription += `<p class="text-base text-gray-700 dark:text-gray-300 ml-4">• ${item}</p>`;
                    } else {
                        formattedDescription += `<p class="text-base text-gray-700 dark:text-gray-300">${trimmed}</p>`;
                    }
                });
                formattedDescription += '</div>';
            }
            
            // Image carousel for modal
            let imageHtml = '';
            if (certificate.hasCarousel && certificate.images && certificate.images.length > 0) {
                const modalImagesHtml = certificate.images.map((img, idx) => 
                    `<div class="modal-carousel-slide ${idx === 0 ? 'active' : ''}" data-slide="${idx}">
                        <img src="${img}" alt="${certificate.title} - Image ${idx + 1}" class="w-full h-full object-contain">
                    </div>`
                ).join('');
                
                imageHtml = `
                    <div class="modal-carousel-container h-[500px] lg:h-[600px] bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden relative shadow-lg">
                        <div class="modal-carousel-wrapper h-full w-full relative">
                            ${modalImagesHtml}
                        </div>
                        ${certificate.images.length > 1 ? `
                            <div class="modal-carousel-controls absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
                                ${certificate.images.map((_, idx) => 
                                    `<button class="modal-carousel-dot ${idx === 0 ? 'active' : ''} w-2 h-2 rounded-full bg-white/50 hover:bg-white transition-all duration-300" data-slide="${idx}"></button>`
                                ).join('')}
                            </div>
                            <button class="modal-carousel-prev absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 dark:bg-gray-700/90 hover:bg-white dark:hover:bg-gray-700 text-gray-900 dark:text-white p-3 rounded-full transition-all z-20 shadow-lg">
                                <i class="fas fa-chevron-left"></i>
                            </button>
                            <button class="modal-carousel-next absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 dark:bg-gray-700/90 hover:bg-white dark:hover:bg-gray-700 text-gray-900 dark:text-white p-3 rounded-full transition-all z-20 shadow-lg">
                                <i class="fas fa-chevron-right"></i>
                            </button>
                        ` : ''}
                    </div>
                `;
            } else if (certificate.image) {
                imageHtml = `
                    <div class="mb-6">
                        <img src="${certificate.image}" alt="${certificate.title}" class="w-full h-auto rounded-xl shadow-lg object-contain border-2 border-gray-200 dark:border-gray-700">
                    </div>
                `;
            }
            
            modalWrapper.innerHTML = `
                <div id="${modalId}" class="project-modal fixed inset-0 bg-black/90 dark:bg-black/95 backdrop-blur-sm z-[10000] hidden items-center justify-center p-4" style="position: fixed !important; top: 0 !important; left: 0 !important; right: 0 !important; bottom: 0 !important; width: 100vw !important; height: 100vh !important;">
                    <div class="project-modal-content bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-[95vw] max-w-[95vw] h-[95vh] max-h-[95vh] overflow-hidden flex flex-col" style="width: 95vw !important; max-width: 95vw !important; height: 95vh !important; max-height: 95vh !important;">
                        <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex-shrink-0">
                            <div>
                                <h3 class="text-3xl font-bold text-gray-900 dark:text-white">${certificate.title}</h3>
                                ${certificate.subtitle ? `<p class="text-lg text-primary-600 dark:text-primary-400 mt-1">${certificate.subtitle}</p>` : ''}
                            </div>
                            <button class="modal-close text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-2xl p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-all" aria-label="Close modal">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                        <div class="flex-1 overflow-y-auto p-6">
                            <div class="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
                                <div class="space-y-4">
                                    ${imageHtml}
                                </div>
                                <div class="space-y-6">
                                    <div>
                                        <h4 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Details</h4>
                                        <div class="space-y-3 text-base leading-relaxed">
                                            <p><span class="font-semibold text-gray-900 dark:text-white">Organization:</span> <span class="text-primary-600 dark:text-primary-400">${certificate.issuer}</span></p>
                                            <p><span class="font-semibold text-gray-900 dark:text-white">Date:</span> <span class="text-gray-700 dark:text-gray-300">${certificate.date}</span></p>
                                            ${certificate.issueDate ? `<p><span class="font-semibold text-gray-900 dark:text-white">Issue Date:</span> <span class="text-gray-700 dark:text-gray-300">${certificate.issueDate}</span></p>` : ''}
                                            ${certificate.credentialId ? `<p><span class="font-semibold text-gray-900 dark:text-white">Verification ID:</span> <span class="text-gray-700 dark:text-gray-300 font-mono">${certificate.credentialId}</span></p>` : ''}
                                        </div>
                                    </div>
                                    ${certificate.description ? `
                                    <div>
                                        <h4 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Description</h4>
                                        <p class="text-base text-gray-700 dark:text-gray-300 leading-relaxed">${certificate.description}</p>
                                    </div>
                                    ` : ''}
                                    ${formattedDescription ? `
                                    <div>
                                        <h4 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Full Details</h4>
                                        <div class="text-base text-gray-700 dark:text-gray-300 leading-relaxed max-h-[400px] overflow-y-auto pr-2">
                                            ${formattedDescription}
                                        </div>
                                    </div>
                                    ` : ''}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            modal = modalWrapper.firstElementChild;
            document.body.appendChild(modal);
        }
        
        // Open modal (similar to project modal)
        const modalContent = modal.querySelector('.project-modal-content');
        const closeBtn = modal.querySelector('.modal-close');
        
        modal.style.display = 'flex';
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        
        modalContent.style.transform = 'scale(0.3)';
        modalContent.style.opacity = '0';
        modalContent.style.transition = 'none';
        
        void modalContent.offsetHeight;
        
        setTimeout(() => {
            modalContent.style.transition = 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.6s ease-out';
            modalContent.style.transform = 'scale(1)';
            modalContent.style.opacity = '1';
        }, 50);
        
        // Initialize modal carousel if has multiple images
        if (certificate.hasCarousel && certificate.images && certificate.images.length > 1) {
            setTimeout(() => {
                initializeModalCarousel(modal, certificate.images.length);
            }, 200);
        }
        
        // Close handlers
        const closeModal = () => {
            modalContent.style.transition = 'transform 0.3s ease-in, opacity 0.3s ease-in';
            modalContent.style.transform = 'scale(0.7)';
            modalContent.style.opacity = '0';
            
            setTimeout(() => {
                modal.classList.add('hidden');
                modal.style.display = 'none';
                document.body.style.overflow = '';
            }, 300);
        };
        
        closeBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
        
        const handleEsc = (e) => {
            if (e.key === 'Escape') {
                closeModal();
                document.removeEventListener('keydown', handleEsc);
            }
        };
        document.addEventListener('keydown', handleEsc);
    });
}

// Toggle Certificates Preview (Small area)
function toggleCertificatesPreview() {
    const preview = document.getElementById('certificates-preview');
    if (!preview) return;
    
    if (preview.classList.contains('hidden')) {
        preview.classList.remove('hidden');
        setTimeout(() => {
            preview.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
    } else {
        preview.classList.add('hidden');
    }
}

window.toggleCertificatesPreview = toggleCertificatesPreview;
window.openCertificatesModal = toggleCertificatesPreview; // Alias for button onclick

function initializeScrollEffects() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
        const animatedElements = document.querySelectorAll('section:not(#home) > div, .project-card, .card-hover');
    animatedElements.forEach((el, index) => {
            if (el.classList.contains('fade-in') || el.classList.contains('slide-in-left') || el.classList.contains('slide-in-right') || el.classList.contains('scale-in')) {
                return;
            }
        
            const delay = Math.min(index * 0.05, 0.3);
            el.style.transitionDelay = `${delay}s`;
            
        if (el.classList.contains('project-card')) {
            el.classList.add('fade-in');
        } else if (index % 2 === 0) {
            el.classList.add('slide-in-left');
        } else {
            el.classList.add('slide-in-right');
        }
        
        observer.observe(el);
    });
}


function initializeSectionReveal() {
    const sections = document.querySelectorAll('section:not(#home)');
    if (sections.length === 0) return;
    
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                sectionObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -100px 0px' });
    
    sections.forEach(section => {
        if (!section.classList.contains('revealed')) {
            section.style.opacity = '0';
            section.style.transform = 'translateY(30px)';
            section.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
            sectionObserver.observe(section);
        }
    });
}

// Blob Animasyonları - Scroll ile hareket eden blob'lar
function initializeBlobAnimation() {
    const blobs = document.querySelectorAll('.blob');
    if (blobs.length === 0) return;
    
    let currentScroll = 0;
    let requestId;
    
    const initialPositions = [
        { x: -4, y: 0 },
        { x: -4, y: 0 },
        { x: 20, y: -8 },
        { x: 20, y: -8 },
    ];
    
    let scrollTicking = false;
    const handleScroll = () => {
        if (scrollTicking) return;
        scrollTicking = true;
        
        requestAnimationFrame(() => {
            const newScroll = window.pageYOffset;
            currentScroll = newScroll;
            
            blobs.forEach((blob, index) => {
                const initialPos = initialPositions[index] || { x: 0, y: 0 };
                
                // Reduced movement for better performance
                const xOffset = Math.sin(newScroll / 150 + index * 0.5) * 200;
                const yOffset = Math.cos(newScroll / 150 + index * 0.5) * 30;
                
                const x = initialPos.x + xOffset;
                const y = initialPos.y + yOffset;
                
                blob.style.transform = `translate(${x}px, ${y}px)`;
                blob.style.transition = 'transform 1.4s ease-out';
            });
            
            scrollTicking = false;
        });
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // İlk çalıştırma
}

// AOS (Animate On Scroll) Entegrasyonu
function initializeAOS() {
    // AOS kütüphanesini yükle
    if (typeof AOS === 'undefined') {
        const aosCSS = document.createElement('link');
        aosCSS.rel = 'stylesheet';
        aosCSS.href = 'https://unpkg.com/aos@next/dist/aos.css';
        document.head.appendChild(aosCSS);
        
        const aosJS = document.createElement('script');
        aosJS.src = 'https://unpkg.com/aos@next/dist/aos.js';
        aosJS.onload = () => {
            AOS.init({
                duration: 1000,
                once: true,
                offset: 100,
                easing: 'ease-out-cubic',
            });
        };
        document.head.appendChild(aosJS);
    } else {
        AOS.init({
            duration: 1000,
            once: true,
            offset: 100,
            easing: 'ease-out-cubic',
        });
    }
    
    // AOS data attribute'larını elementlere ekle
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach((card, index) => {
        if (!card.hasAttribute('data-aos')) {
            const animations = ['fade-up-right', 'fade-up', 'fade-up-left'];
            card.setAttribute('data-aos', animations[index % 3]);
            card.setAttribute('data-aos-duration', index % 3 === 0 ? '1000' : index % 3 === 1 ? '1200' : '1000');
        }
    });
    
    // Section'lara AOS ekle
    const sections = document.querySelectorAll('section[id]');
    sections.forEach((section, index) => {
        if (!section.hasAttribute('data-aos')) {
            section.setAttribute('data-aos', 'fade-up');
            section.setAttribute('data-aos-duration', '1000');
            section.setAttribute('data-aos-delay', (index * 100).toString());
        }
    });
}

// Initialize Welcome Screen
function initializeWelcomeScreen() {
    const welcomeScreen = document.getElementById('welcome-screen');
    const welcomeText = document.getElementById('welcome-text');
    
    if (!welcomeScreen || !welcomeText) return;
    
    // Add active class to body for blur effect
    document.body.classList.add('welcome-active');
    welcomeScreen.classList.add('active');
    
    // Split text into letters
    const text = welcomeText.textContent;
    welcomeText.innerHTML = '';
    text.split('').forEach((char, index) => {
        const span = document.createElement('span');
        span.className = 'letter';
        span.textContent = char === ' ' ? '\u00A0' : char;
        span.style.transitionDelay = `${index * 0.02}s`;
        welcomeText.appendChild(span);
    });
    
    // Show welcome text after a brief delay
                        setTimeout(() => {
        welcomeText.classList.add('show');
    }, 100);
    
    // After 2 seconds, explode letters into particles
                            setTimeout(() => {
        explodeTextToParticles(welcomeText, welcomeScreen);
    }, 2000);
}

function explodeTextToParticles(textElement, screenElement) {
    const letters = textElement.querySelectorAll('.letter');
    const canvas = document.getElementById('interactive-bg');
    
    // Wait for particles to be ready
    const checkParticles = setInterval(() => {
        if (particles && particles.length > 0 && canvas) {
            clearInterval(checkParticles);
            performExplosion(letters, canvas, textElement, screenElement);
        }
    }, 100);
    
    // Fallback: if particles not ready after 3 seconds, just fade out
                        setTimeout(() => {
        clearInterval(checkParticles);
        if (!particles || particles.length === 0) {
            textElement.classList.add('exploding');
                            setTimeout(() => {
                screenElement.classList.remove('active');
                document.body.classList.remove('welcome-active');
            }, 1000);
        }
    }, 3000);
}

function performExplosion(letters, canvas, textElement, screenElement) {
    const rect = canvas.getBoundingClientRect();
    
    // Calculate target positions (random positions on canvas)
    letters.forEach((letter, index) => {
        const letterRect = letter.getBoundingClientRect();
        const letterX = letterRect.left + letterRect.width / 2;
        const letterY = letterRect.top + letterRect.height / 2;
        
        // Convert to canvas coordinates
        const canvasX = letterX - rect.left;
        const canvasY = letterY - rect.top;
        
        // Find nearest particle or create target position
        let targetX, targetY;
        if (particles.length > index) {
            // Use existing particle position
            targetX = particles[index].x;
            targetY = particles[index].y;
        } else {
            // Random position on canvas
            targetX = Math.random() * canvas.width;
            targetY = Math.random() * canvas.height;
        }
        
        // Calculate distance to travel
        const dx = targetX - canvasX;
        const dy = targetY - canvasY;
        
        // Set CSS variables for animation
        letter.style.setProperty('--target-x', `${dx}px`);
        letter.style.setProperty('--target-y', `${dy}px`);
    });
    
    // Start explosion animation
    textElement.classList.add('exploding');
    
    // Remove welcome screen after animation
    setTimeout(() => {
        screenElement.classList.remove('active');
        document.body.classList.remove('welcome-active');
    }, 1000);
}


