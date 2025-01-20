// Core Initialization
document.addEventListener('DOMContentLoaded', () => {
    initCore();
});

function initCore() {
    window.addEventListener('load', () => {
        hideLoader();
        initializeAll();
    });

    document.documentElement.style.visibility = 'visible';
}

function hideLoader() {
    const loader = document.querySelector('.loader');
    if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.visibility = 'hidden';
            document.body.style.overflow = 'visible';
            loader.remove();
        }, 500);
    }
}

function initializeAll() {
    // Core functionality initialization
    initThemeSystem();
    initDateTime(); 
    initNavigation();
    initScrollEffects();
    
    // Initialize AOS
    AOS.init({
        duration: 800,
        easing: 'ease-out',
        once: false,
        offset: 50,
        disable: window.innerWidth < 768
    });

    // Initialize all sections
    initHeroSection();
    initInfoSection();
    initSimulationSection();
    initStatisticsSection();
    initProductSection();
    initTeamSection();
    initContactSection();
    initFooter();
    initModals();
}

// Theme System
function initThemeSystem() {
    const themeToggle = document.getElementById('theme-toggle');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Получаем сохранённую тему или по умолчанию устанавливаем систему
    const savedTheme = localStorage.getItem('theme');
    const currentTheme = savedTheme || (prefersDarkScheme.matches ? 'dark' : 'light');
    
    // Устанавливаем текущую тему в body
    document.body.setAttribute('data-theme', currentTheme);

    // Получаем элементы для иконок и шарика переключателя
    const lightIcon = themeToggle.querySelector('.light-icon');
    const darkIcon = themeToggle.querySelector('.dark-icon');
    const toggleBall = themeToggle.querySelector('.toggle-ball');

    // Изменяем отображение иконок в зависимости от текущей темы
    if (currentTheme === 'dark') {
        lightIcon.style.display = 'none';
        darkIcon.style.display = 'block';
        toggleBall.style.transform = 'translateX(32px)';
    } else {
        lightIcon.style.display = 'block';
        darkIcon.style.display = 'none';
        toggleBall.style.transform = 'translateX(0)';
    }

    // Обработчик клика по кнопке переключателя
    themeToggle.addEventListener('click', () => {
        const newTheme = document.body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';

        // Меняем тему
        document.body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);

        // Обновляем иконки и шарик переключателя
        if (newTheme === 'dark') {
            lightIcon.style.display = 'none';
            darkIcon.style.display = 'block';
            toggleBall.style.transform = 'translateX(32px)';
        } else {
            lightIcon.style.display = 'block';
            darkIcon.style.display = 'none';
            toggleBall.style.transform = 'translateX(0)';
        }

        // Обновляем графики, если они существуют
        updateChartTheme();
    });

    // Слушаем изменения системной темы (если пользователь меняет настройки)
    prefersDarkScheme.addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            const systemTheme = e.matches ? 'dark' : 'light';
            document.body.setAttribute('data-theme', systemTheme);

            // Обновляем иконки и шарик в зависимости от системной темы
            if (systemTheme === 'dark') {
                lightIcon.style.display = 'none';
                darkIcon.style.display = 'block';
                toggleBall.style.transform = 'translateX(32px)';
            } else {
                lightIcon.style.display = 'block';
                darkIcon.style.display = 'none';
                toggleBall.style.transform = 'translateX(0)';
            }
        }
    });

    // Функция для обновления цветов графиков в зависимости от темы
    function updateChartTheme() {
        const currentTheme = document.body.getAttribute('data-theme');
        const isDark = currentTheme === 'dark';

        // Обновление цветовой схемы графиков (предположим, что у вас используется Chart.js)
        if (window.russiaChart) {
            window.russiaChart.options = {
                ...window.russiaChart.options,
                plugins: {
                    legend: {
                        labels: {
                            color: isDark ? '#F7FAFC' : '#1A202C' // Цвет текста в легенде
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            color: isDark ? '#4A5568' : '#E2E8F0'
                        },
                        ticks: {
                            color: isDark ? '#F7FAFC' : '#1A202C'
                        }
                    },
                    y: {
                        grid: {
                            color: isDark ? '#4A5568' : '#E2E8F0'
                        },
                        ticks: {
                            color: isDark ? '#F7FAFC' : '#1A202C'
                        }
                    }
                }
            };
            window.russiaChart.update(); // Применяем изменения
        }

        if (window.worldChart) {
            window.worldChart.options = {
                ...window.worldChart.options,
                plugins: {
                    legend: {
                        labels: {
                            color: isDark ? '#F7FAFC' : '#1A202C' // Цвет текста в легенде
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            color: isDark ? '#4A5568' : '#E2E8F0'
                        },
                        ticks: {
                            color: isDark ? '#F7FAFC' : '#1A202C'
                        }
                    },
                    y: {
                        grid: {
                            color: isDark ? '#4A5568' : '#E2E8F0'
                        },
                        ticks: {
                            color: isDark ? '#F7FAFC' : '#1A202C'
                        }
                    }
                }
            };
            window.worldChart.update(); // Применяем изменения
        }
    }
}

// Инициализация темы
document.addEventListener('DOMContentLoaded', initThemeSystem);


// Date and Time
function initDateTime() {
    const dateTimeElement = document.getElementById('datetime');
    if (!dateTimeElement) return;

    function updateDateTime() {
        const now = new Date();
        const options = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        };
        
        const formattedDate = now.toLocaleString('ru-RU', options);
        dateTimeElement.textContent = formattedDate;
        dateTimeElement.setAttribute('datetime', now.toISOString());
    }

    updateDateTime();
    setInterval(updateDateTime, 1000);
}

// Navigation System 
function initNavigation() {
    const header = document.querySelector('.header');
    const mobileMenuBtn = document.querySelector('.mobile-menu-button');
    const nav = document.querySelector('.header-nav');
    const navLinks = document.querySelectorAll('a[href^="#"]');
    const progressBar = document.querySelector('.progress-bar');
    
    // Mobile menu toggle
    if(mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            nav.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });
    }

    // Smooth scroll
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                const headerHeight = header.offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = targetPosition - headerHeight;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                // Close mobile menu if open
                if (nav.classList.contains('active')) {
                    nav.classList.remove('active');
                    mobileMenuBtn.classList.remove('active');
                    document.body.classList.remove('menu-open');
                }
            }
        });
    });

    // Scroll spy
    const observerOptions = {
        root: null,
        rootMargin: `-${header.offsetHeight}px 0px 0px 0px`,
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                document.querySelector(`.nav-link[href="#${id}"]`)?.classList.add('active');
            } else {
                const id = entry.target.getAttribute('id');
                document.querySelector(`.nav-link[href="#${id}"]`)?.classList.remove('active');
            }
        });
    }, observerOptions);

    // Observe all sections
    document.querySelectorAll('section[id]').forEach(section => {
        observer.observe(section);
    });

    // Progress bar
    if (progressBar) {
        window.addEventListener('scroll', () => {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            progressBar.style.width = scrolled + '%';
        });
    }
}

// Scroll Effects
function initScrollEffects() {
    const header = document.querySelector('.header');
    const scrollTopBtn = document.querySelector('.scroll-to-top');
    let lastScroll = 0;
    
    function handleScroll() {
        const currentScroll = window.pageYOffset;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        
        // Header effects
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Hide/show header on scroll
        if (currentScroll > lastScroll && currentScroll > 100) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        // Scroll to top button
        if (scrollTopBtn) {
            if (currentScroll > 300) {
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }
        }
        
        lastScroll = currentScroll;
    }
    
    window.addEventListener('scroll', () => {
        requestAnimationFrame(handleScroll);
    });
    
    // Scroll to top functionality
    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}
// Hero Section
function initHeroSection() {
    initParticles();
    initHeroAnimations();
    initHeroParallax();
    initHeroScrollIndicator();
}

function initParticles() {
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            particles: {
                number: {
                    value: 80,
                    density: { enable: true, value_area: 800 }
                },
                color: { value: '#3182ce' },
                shape: {
                    type: 'circle',
                    stroke: { width: 0, color: '#000000' },
                    polygon: { nb_sides: 5 }
                },
                opacity: {
                    value: 0.5,
                    random: false,
                    anim: {
                        enable: false,
                        speed: 1,
                        opacity_min: 0.1,
                        sync: false
                    }
                },
                size: {
                    value: 3,
                    random: true,
                    anim: {
                        enable: false,
                        speed: 40,
                        size_min: 0.1,
                        sync: false
                    }
                },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: '#3182ce',
                    opacity: 0.4,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 2,
                    direction: 'none',
                    random: false,
                    straight: false,
                    out_mode: 'out',
                    bounce: false,
                    attract: { enable: false, rotateX: 600, rotateY: 1200 }
                }
            },
            interactivity: {
                detect_on: 'canvas',
                events: {
                    onhover: { enable: true, mode: 'grab' },
                    onclick: { enable: true, mode: 'push' },
                    resize: true
                },
                modes: {
                    grab: { distance: 140, line_linked: { opacity: 1 } },
                    bubble: { distance: 400, size: 40, duration: 2, opacity: 8, speed: 3 },
                    repulse: { distance: 200, duration: 0.4 },
                    push: { particles_nb: 4 },
                    remove: { particles_nb: 2 }
                }
            },
            retina_detect: true
        });
    }
}

function initHeroAnimations() {
    const heroContent = document.querySelector('.hero-content');
    if (!heroContent) return;

    const animateElements = [
        { el: heroContent.querySelector('.hero-title'), delay: 0 },
        { el: heroContent.querySelector('.hero-subtitle'), delay: 200 },
        { el: heroContent.querySelector('.hero-description'), delay: 400 },
        { el: heroContent.querySelector('.hero-cta'), delay: 600 }
    ];

    animateElements.forEach(({el, delay}) => {
        if (el) {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                el.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, delay);
        }
    });
}

function initHeroParallax() {
    const shapes = document.querySelectorAll('.shape');
    
    shapes.forEach((shape, index) => {
        const speed = 0.05 + (index * 0.01);
        
        window.addEventListener('mousemove', (e) => {
            const x = (window.innerWidth - e.pageX * speed) / 100;
            const y = (window.innerHeight - e.pageY * speed) / 100;
            
            shape.style.transform = `translateX(${x}px) translateY(${y}px)`;
        });
    });
}

function initHeroScrollIndicator() {
    const scrollIndicator = document.querySelector('.hero-scroll-indicator');
    if (!scrollIndicator) return;

    // Show scroll indicator after delay
    setTimeout(() => {
        scrollIndicator.style.opacity = '1';
    }, 2000);

    // Hide on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            scrollIndicator.style.opacity = '0';
        } else {
            scrollIndicator.style.opacity = '1';
        }
    });

    // Animate on hover
    scrollIndicator.addEventListener('mouseenter', () => {
        scrollIndicator.style.transform = 'translateY(5px)';
    });

    scrollIndicator.addEventListener('mouseleave', () => {
        scrollIndicator.style.transform = 'translateY(0)';
    });

    // Smooth scroll to next section
    scrollIndicator.addEventListener('click', () => {
        const nextSection = document.querySelector('#about');
        if (nextSection) {
            nextSection.scrollIntoView({ behavior: 'smooth' });
        }
    });
}

// Feature Cards Animation
function initFeatureCards() {
    const featureCards = document.querySelectorAll('.feature-card');
    
    featureCards.forEach((card, index) => {
        // Initial state
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';

        // Animate entrance
        setTimeout(() => {
            card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 1000 + (index * 200));

        // Initialize stat counters
        const stats = card.querySelectorAll('.stat-value');
        stats.forEach(stat => {
            const value = parseInt(stat.textContent);
            animateNumber(stat, 0, value, 2000);
        });

        // Add hover effects
        const icon = card.querySelector('.feature-icon');
        if (icon) {
            card.addEventListener('mouseenter', () => {
                icon.style.transform = 'scale(1.2) rotate(10deg)';
            });

            card.addEventListener('mouseleave', () => {
                icon.style.transform = 'scale(1) rotate(0)';
            });
        }

        // Add ripple effect
        card.addEventListener('click', createRipple);
    });
}

function animateNumber(element, start, end, duration) {
    const range = end - start;
    const increment = end > start ? 1 : -1;
    const stepTime = Math.abs(Math.floor(duration / range));
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        element.textContent = current;
        
        if (current === end) {
            clearInterval(timer);
        }
    }, stepTime);
}

// Continue from previous ripple effect
function createRipple(event) {
    const element = event.currentTarget;
    const ripple = document.createElement('span');
    
    const diameter = Math.max(element.clientWidth, element.clientHeight);
    const radius = diameter / 2;
    
    ripple.style.width = ripple.style.height = `${diameter}px`;
    ripple.style.left = `${event.clientX - (element.offsetLeft + radius)}px`;
    ripple.style.top = `${event.clientY - (element.offsetTop + radius)}px`;
    
    ripple.classList.add('ripple');
    
    // Remove existing ripples
    const existingRipple = element.getElementsByClassName('ripple')[0];
    if (existingRipple) {
        existingRipple.remove();
    }
    
    element.appendChild(ripple);
    
    // Remove ripple after animation
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Info Section Animations
function initInfoSection() {
    const cards = document.querySelectorAll('.immunity-info-card');
    
    cards.forEach((card, index) => {
        // Initialize progress bars
        const progressBars = card.querySelectorAll('.progress-bar');
        progressBars.forEach(bar => {
            const targetWidth = bar.style.width;
            bar.style.width = '0';
            
            setTimeout(() => {
                bar.style.transition = 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1)';
                bar.style.width = targetWidth;
            }, 500 + (index * 200));
        });

        // Initialize step animations
        const steps = card.querySelectorAll('.immunity-step-item');
        steps.forEach((step, stepIndex) => {
            step.style.opacity = '0';
            step.style.transform = 'translateX(-20px)';
            
            setTimeout(() => {
                step.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                step.style.opacity = '1';
                step.style.transform = 'translateX(0)';
            }, 800 + (index * 200) + (stepIndex * 150));
        });

        // Add hover effects
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px)';
            const icon = card.querySelector('.immunity-icon');
            if (icon) {
                icon.style.transform = 'scale(1.1) rotate(10deg)';
            }
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
            const icon = card.querySelector('.immunity-icon');
            if (icon) {
                icon.style.transform = 'scale(1) rotate(0)';
            }
        });

        // Initialize effectiveness tags
        const tag = card.querySelector('.effectiveness-tag');
        if (tag) {
            tag.addEventListener('mouseenter', () => {
                tag.style.transform = 'scale(1.05)';
            });
            
            tag.addEventListener('mouseleave', () => {
                tag.style.transform = 'scale(1)';
            });
        }
    });

    // Initialize canvas animations
    initCanvasAnimations();
}

// Canvas Animations for Info Section
function initCanvasAnimations() {
    const canvases = ['immunityCanvas', 'protectionCanvas', 'preventionCanvas'];
    
    canvases.forEach(canvasId => {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const particles = [];
        
        // Set canvas size
        function resizeCanvas() {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        }
        
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Create particles
        for (let i = 0; i < 50; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random() * 3 + 1,
                speed: Math.random() * 2 + 0.5,
                direction: Math.random() * 360,
                color: getCanvasColor(canvasId, Math.random() * 0.5 + 0.2)
            });
        }

        function drawParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            particles.forEach(particle => {
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
                ctx.fillStyle = particle.color;
                ctx.fill();
                ctx.closePath();

                // Update particle position
                particle.x += Math.cos(particle.direction * Math.PI / 180) * particle.speed;
                particle.y += Math.sin(particle.direction * Math.PI / 180) * particle.speed;

                // Wrap around canvas
                if (particle.x < 0) particle.x = canvas.width;
                if (particle.x > canvas.width) particle.x = 0;
                if (particle.y < 0) particle.y = canvas.height;
                if (particle.y > canvas.height) particle.y = 0;
            });

            requestAnimationFrame(drawParticles);
        }

        drawParticles();
    });
}

function getCanvasColor(canvasId, alpha) {
    switch(canvasId) {
        case 'immunityCanvas':
            return `rgba(49, 130, 206, ${alpha})`;
        case 'protectionCanvas':
            return `rgba(72, 187, 120, ${alpha})`;
        case 'preventionCanvas':
            return `rgba(245, 101, 101, ${alpha})`;
        default:
            return `rgba(160, 174, 192, ${alpha})`;
    }
}

// Simulation Section

function initSimulationSection() {
    // DOM Elements
    const simulationSection = document.querySelector('.simulation-section');
    if (!simulationSection) return;

    // Get all required elements
    const populationGrid = document.getElementById('population-grid');
    const vaccinationRate = document.getElementById('vaccination-rate');
    const rateValue = document.getElementById('rate-value');
    const simulationControl = document.getElementById('simulation-control');
    const simulationReset = document.getElementById('simulation-reset');
    const speedControl = document.getElementById('speed-control');
    const vaccinatedCount = document.getElementById('vaccinated-count');
    const infectedCount = document.getElementById('infected-count');
    const immuneCount = document.getElementById('immune-count');

    // Constants
    const GRID_SIZE = 400; // 20x20 grid
    const GRID_WIDTH = Math.sqrt(GRID_SIZE);
    const INFECTION_PROBABILITY = 0.2;
    const RECOVERY_PROBABILITY = 0.1;
    const INITIAL_INFECTION_RATE = 0.02;

    // Simulation state
    let simulationRunning = false;
    let simulationInterval = null;
    let simulationSpeed = 1;
    let currentPopulation = [];

    // Initialize population array
    function initializePopulation() {
        const rate = parseInt(vaccinationRate.value);
        currentPopulation = new Array(GRID_SIZE);

        for (let i = 0; i < GRID_SIZE; i++) {
            if (Math.random() * 100 < rate) {
                currentPopulation[i] = 'vaccinated';
            } else {
                if (Math.random() < INITIAL_INFECTION_RATE) {
                    currentPopulation[i] = 'infected';
                } else {
                    currentPopulation[i] = 'unvaccinated';
                }
            }
        }
    }

    // Create visual grid
    function createGrid() {
        populationGrid.innerHTML = '';
        
        for (let i = 0; i < GRID_SIZE; i++) {
            const cell = document.createElement('div');
            cell.className = 'person ' + currentPopulation[i];
            populationGrid.appendChild(cell);
        }

        updateStats();
    }

    // Update population stats and UI
    function updateStats() {
        const stats = {
            vaccinated: 0,
            infected: 0,
            immune: 0
        };

        currentPopulation.forEach(status => {
            if (stats.hasOwnProperty(status)) {
                stats[status]++;
            }
        });

        // Update counters
        vaccinatedCount.textContent = stats.vaccinated;
        infectedCount.textContent = stats.infected;
        immuneCount.textContent = stats.immune;

        // Update progress bars
        updateProgressBar('vaccinated', (stats.vaccinated / GRID_SIZE) * 100);
        updateProgressBar('infected', (stats.infected / GRID_SIZE) * 100);
        updateProgressBar('immune', (stats.immune / GRID_SIZE) * 100);
    }

    function updateProgressBar(className, percentage) {
        const progressBar = document.querySelector(`.progress-bar.${className}`);
        if (progressBar) {
            progressBar.style.width = `${percentage}%`;
        }
    }

    // Get neighbors for infection spread
    function getNeighbors(index) {
        const neighbors = [];
        const row = Math.floor(index / GRID_WIDTH);
        const col = index % GRID_WIDTH;

        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                if (i === 0 && j === 0) continue;

                const newRow = row + i;
                const newCol = col + j;

                if (newRow >= 0 && newRow < GRID_WIDTH && 
                    newCol >= 0 && newCol < GRID_WIDTH) {
                    neighbors.push(newRow * GRID_WIDTH + newCol);
                }
            }
        }

        return neighbors;
    }

    // Simulation step
    function simulationStep() {
        const newPopulation = [...currentPopulation];

        for (let i = 0; i < GRID_SIZE; i++) {
            if (currentPopulation[i] === 'unvaccinated') {
                const neighbors = getNeighbors(i);
                const infectedNeighbors = neighbors.filter(n => currentPopulation[n] === 'infected').length;

                if (infectedNeighbors > 0 && Math.random() < INFECTION_PROBABILITY * infectedNeighbors) {
                    newPopulation[i] = 'infected';
                }
            } 
            else if (currentPopulation[i] === 'infected') {
                if (Math.random() < RECOVERY_PROBABILITY) {
                    newPopulation[i] = 'immune';
                }
            }
        }

        currentPopulation = newPopulation;
        updateGrid();
    }

    function updateGrid() {
        const cells = populationGrid.children;
        for (let i = 0; i < GRID_SIZE; i++) {
            cells[i].className = 'person ' + currentPopulation[i];
        }
        updateStats();
    }

    // Event Listeners
    vaccinationRate.addEventListener('input', (e) => {
        rateValue.textContent = `${e.target.value}%`;
        initializePopulation();
        createGrid();
    });

    simulationControl.addEventListener('click', () => {
        simulationRunning = !simulationRunning;

        if (simulationRunning) {
            simulationInterval = setInterval(
                simulationStep, 
                1000 / simulationSpeed
            );
            simulationControl.innerHTML = '<i class="fas fa-pause"></i><span>Пауза</span>';
        } else {
            clearInterval(simulationInterval);
            simulationControl.innerHTML = '<i class="fas fa-play"></i><span>Запустить симуляцию</span>';
        }
    });

    simulationReset.addEventListener('click', () => {
        // Stop simulation if running
        if (simulationRunning) {
            clearInterval(simulationInterval);
            simulationRunning = false;
            simulationControl.innerHTML = '<i class="fas fa-play"></i><span>Запустить симуляцию</span>';
        }

        // Reset population and grid
        initializePopulation();
        createGrid();
    });

    speedControl.addEventListener('change', (e) => {
        simulationSpeed = parseFloat(e.target.value);
        if (simulationRunning) {
            clearInterval(simulationInterval);
            simulationInterval = setInterval(
                simulationStep, 
                1000 / simulationSpeed
            );
        }
    });

    // Initialize tooltip system
    function initializeTooltips() {
        populationGrid.addEventListener('mouseover', (e) => {
            if (e.target.classList.contains('person')) {
                showTooltip(e.target, e);
            }
        });

        populationGrid.addEventListener('mouseout', (e) => {
            if (e.target.classList.contains('person')) {
                hideTooltip();
            }
        });
    }

    function showTooltip(person, event) {
        let status = '';
        if (person.classList.contains('vaccinated')) status = 'Вакцинирован';
        else if (person.classList.contains('infected')) status = 'Инфицирован';
        else if (person.classList.contains('immune')) status = 'Иммунитет';
        else status = 'Уязвим';

        const tooltip = document.createElement('div');
        tooltip.className = 'simulation-tooltip';
        tooltip.textContent = status;
        document.body.appendChild(tooltip);

        const rect = person.getBoundingClientRect();
        tooltip.style.left = `${rect.left + rect.width/2 - tooltip.offsetWidth/2}px`;
        tooltip.style.top = `${rect.top - tooltip.offsetHeight - 10}px`;
    }

    function hideTooltip() {
        const tooltip = document.querySelector('.simulation-tooltip');
        if (tooltip) tooltip.remove();
    }

    // Initialize everything
    initializePopulation();
    createGrid();
    initializeTooltips();
}

// simulation end

// Statistics Section
function initStatisticsSection() {
    const russiaChart = document.getElementById('russia-chart');
    const worldChart = document.getElementById('world-chart');
    
    let russiaChartInstance = null;
    let worldChartInstance = null;

    // Russia vaccination data
    const russiaData = {
        yearly: {
            labels: ['2020', '2021', '2022', '2023', '2024'],
            datasets: [
                {
                    label: 'Общий охват вакцинации',
                    data: [72, 78, 85, 89, 94],
                    borderColor: 'rgba(49, 130, 206, 1)',
                    backgroundColor: 'rgba(49, 130, 206, 0.1)',
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: 'rgba(49, 130, 206, 1)',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                    pointHoverBorderWidth: 3,
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgba(49, 130, 206, 1)'
                },
                {
                    label: 'Первичная вакцинация',
                    data: [68, 75, 82, 87, 92],
                    borderColor: 'rgba(72, 187, 120, 1)',
                    backgroundColor: 'rgba(72, 187, 120, 0.1)',
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: 'rgba(72, 187, 120, 1)',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                    pointHoverBorderWidth: 3,
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgba(72, 187, 120, 1)'
                },
                {
                    label: 'Ревакцинация',
                    data: [65, 70, 77, 83, 88],
                    borderColor: 'rgba(236, 201, 75, 1)',
                    backgroundColor: 'rgba(236, 201, 75, 0.1)',
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: 'rgba(236, 201, 75, 1)',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                    pointHoverBorderWidth: 3,
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgba(236, 201, 75, 1)'
                }
            ]
        },
        monthly: {
            labels: [...Array(30)].map((_, i) => (i + 1).toString()),
            datasets: [{
                label: 'Охват вакцинации',
                data: Array.from({length: 30}, (_, i) => {
                    const base = 89;
                    const variation = Math.sin(i / 3) * 2;
                    return Math.min(100, Math.max(0, base + variation + (i / 30)));
                }),
                borderColor: 'rgba(49, 130, 206, 1)',
                backgroundColor: 'rgba(49, 130, 206, 0.1)',
                fill: true,
                tension: 0.4
            }]
        }
    };

    // World vaccination data by region
    const worldRegionsData = {
        'global': {
            title: 'Глобальный охват вакцинации',
            labels: ['Европа', 'Азия', 'Сев. Америка', 'Юж. Америка', 'Африка', 'Океания'],
            datasets: [{
                label: 'Охват вакцинации',
                data: [85, 80, 78, 75, 65, 80],
                backgroundColor: [
                    'rgba(49, 130, 206, 0.8)',  // Blue
                    'rgba(72, 187, 120, 0.8)',  // Green
                    'rgba(236, 201, 75, 0.8)',  // Yellow
                    'rgba(245, 101, 101, 0.8)', // Red
                    'rgba(159, 122, 234, 0.8)', // Purple
                    'rgba(56, 178, 172, 0.8)'   // Teal
                ],
                hoverBackgroundColor: [
                    'rgba(49, 130, 206, 1)',
                    'rgba(72, 187, 120, 1)',
                    'rgba(236, 201, 75, 1)',
                    'rgba(245, 101, 101, 1)',
                    'rgba(159, 122, 234, 1)',
                    'rgba(56, 178, 172, 1)'
                ],
                borderWidth: 0
            }]
        },
        'europe': {
            title: 'Вакцинация в Европе',
            labels: ['Зап. Европа', 'Вост. Европа', 'Сев. Европа', 'Юж. Европа'],
            datasets: [{
                label: 'Охват вакцинации',
                data: [90, 82, 88, 84],
                backgroundColor: [
                    'rgba(49, 130, 206, 0.8)',
                    'rgba(72, 187, 120, 0.8)',
                    'rgba(236, 201, 75, 0.8)',
                    'rgba(245, 101, 101, 0.8)'
                ],
                hoverBackgroundColor: [
                    'rgba(49, 130, 206, 1)',
                    'rgba(72, 187, 120, 1)',
                    'rgba(236, 201, 75, 1)',
                    'rgba(245, 101, 101, 1)'
                ],
                borderWidth: 0
            }]
        },
        // ... other regions with similar structure
    };

    // Chart configuration
    const chartConfig = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: 'top',
                labels: {
                    usePointStyle: true,
                    padding: 20,
                    font: {
                        family: 'SF Pro Display, system-ui, sans-serif',
                        size: 12
                    }
                }
            },
            tooltip: {
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                titleColor: '#2D3748',
                bodyColor: '#4A5568',
                borderColor: '#E2E8F0',
                borderWidth: 1,
                padding: 12,
                displayColors: true,
                callbacks: {
                    label: function(context) {
                        const value = context.raw;
                        let label = context.dataset.label || '';
                        if (label) {
                            label += ': ';
                        }
                        return `${label}${value.toFixed(1)}%`;
                    },
                    afterLabel: function(context) {
                        const value = context.raw;
                        const total = context.dataset.data.reduce((a, b) => a + b, 0);
                        const percentage = ((value / total) * 100).toFixed(1);
                        return `Доля от общего: ${percentage}%`;
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                max: 100,
                grid: {
                    color: 'rgba(226, 232, 240, 0.5)',
                    drawBorder: false
                },
                ticks: {
                    callback: value => `${value}%`,
                    font: {
                        family: 'SF Pro Display, system-ui, sans-serif',
                        size: 12
                    }
                }
            },
            x: {
                grid: {
                    display: false
                },
                ticks: {
                    maxRotation: 45,
                    minRotation: 45,
                    font: {
                        family: 'SF Pro Display, system-ui, sans-serif',
                        size: 12
                    }
                }
            }
        }
    };

    // Initialize Russia Chart
    if (russiaChart) {
        russiaChartInstance = new Chart(russiaChart, {
            type: 'line',
            data: russiaData.yearly,
            options: {
                ...chartConfig,
                interaction: {
                    mode: 'nearest',
                    axis: 'x',
                    intersect: false
                },
                plugins: {
                    ...chartConfig.plugins,
                    tooltip: {
                        ...chartConfig.plugins.tooltip,
                        callbacks: {
                            title: function(tooltipItems) {
                                const viewType = document.querySelector('.view-button.active')?.dataset.view;
                                const period = viewType === 'yearly' ? 'Год' : 'День';
                                return `${period}: ${tooltipItems[0].label}`;
                            },
                            label: function(context) {
                                return `${context.dataset.label}: ${context.parsed.y.toFixed(1)}%`;
                            },
                            footer: function(tooltipItems) {
                                const item = tooltipItems[0];
                                const dataset = item.dataset;
                                const index = item.dataIndex;
                                const currentValue = dataset.data[index];
                                const previousValue = dataset.data[index - 1];

                                if (previousValue) {
                                    const change = currentValue - previousValue;
                                    return `Изменение: ${change >= 0 ? '+' : ''}${change.toFixed(1)}%`;
                                }
                                return '';
                            }
                        }
                    }
                }
            }
        });
    }
    // Initialize World Chart
    if (worldChart) {
        const initialData = {
            labels: worldRegionsData.global.labels,
            datasets: worldRegionsData.global.datasets
        };

        worldChartInstance = new Chart(worldChart, {
            type: 'bar',
            data: initialData,
            options: {
                ...chartConfig,
                indexAxis: 'y',
                plugins: {
                    ...chartConfig.plugins,
                    legend: {
                        display: false
                    },
                    tooltip: {
                        ...chartConfig.plugins.tooltip,
                        callbacks: {
                            title: function(tooltipItems) {
                                const region = document.getElementById('world-region').value;
                                return worldRegionsData[region].title;
                            },
                            label: function(context) {
                                return `${context.label}: ${context.parsed.x.toFixed(1)}%`;
                            },
                            afterLabel: function(context) {
                                const region = document.getElementById('world-region').value;
                                const dataIndex = context.dataIndex;
                                const dataset = context.dataset;
                                
                                let additionalInfo = [];
                                const baseValue = dataset.data[dataIndex];
                                const trend = baseValue > 80 ? 'Высокий' : baseValue > 60 ? 'Средний' : 'Низкий';
                                
                                additionalInfo.push(`Уровень охвата: ${trend}`);
                                if (dataset._meta && dataset._meta[dataIndex]) {
                                    const meta = dataset._meta[dataIndex];
                                    additionalInfo.push(`Динамика: ${meta.trend}`);
                                    additionalInfo.push(`Всего привито: ${meta.vaccinated}`);
                                }
                                
                                return additionalInfo;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        beginAtZero: true,
                        max: 100,
                        grid: {
                            display: true,
                            drawBorder: false,
                            color: 'rgba(226, 232, 240, 0.5)'
                        },
                        ticks: {
                            callback: value => `${value}%`,
                            font: {
                                size: 12
                            }
                        }
                    },
                    y: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            font: {
                                size: 12
                            }
                        }
                    }
                },
                onHover: (event, elements) => {
                    event.native.target.style.cursor = elements.length ? 'pointer' : 'default';
                },
                onClick: handleWorldChartClick
            }
        });

        // Add click interaction
        worldChart.onclick = handleWorldChartClick;
    }

    // Event Handlers
    function handleViewChange(view) {
        if (!russiaChartInstance) return;

        const data = view === 'yearly' ? russiaData.yearly : russiaData.monthly;
        russiaChartInstance.data = data;
        russiaChartInstance.options.scales.x.ticks.maxRotation = view === 'yearly' ? 0 : 45;
        russiaChartInstance.options.scales.x.ticks.minRotation = view === 'yearly' ? 0 : 45;
        
        // Update with animation
        russiaChartInstance.update('active');

        // Update statistics display
        updateStatistics(view);
    }

    function handleRegionChange(region) {
        if (!worldChartInstance || !worldRegionsData[region]) return;

        const newData = {
            labels: worldRegionsData[region].labels,
            datasets: worldRegionsData[region].datasets
        };

        worldChartInstance.data = newData;
        worldChartInstance.update('active');

        // Update statistics
        updateWorldStatistics(region);
    }

    function handleWorldChartClick(event, elements) {
        if (!elements || !elements.length) return;

        const element = elements[0];
        const index = element.index;
        const region = document.getElementById('world-region').value;
        const regionData = worldRegionsData[region];
        
        showDetailedStats(regionData, index);
    }

    // Statistics Updates
    function updateStatistics(view) {
        const data = view === 'yearly' ? russiaData.yearly : russiaData.monthly;
        const currentIndex = data.datasets[0].data.length - 1;
        const currentValue = data.datasets[0].data[currentIndex];
        const previousValue = data.datasets[0].data[currentIndex - 1] || 0;
        const change = currentValue - previousValue;

        // Update DOM elements
        document.querySelectorAll('[data-stat="current-coverage"]')
            .forEach(el => el.textContent = `${currentValue.toFixed(1)}%`);

        const changeElements = document.querySelectorAll('[data-stat="coverage-change"]');
        changeElements.forEach(el => {
            el.textContent = `${change >= 0 ? '+' : ''}${change.toFixed(1)}%`;
            el.className = `trend ${change >= 0 ? 'positive' : 'negative'}`;
        });

        // Update detailed statistics if they exist
        const detailsContainer = document.querySelector('.vaccination-details');
        if (detailsContainer) {
            const details = `
                <div class="detail-item">
                    <span class="detail-label">Первичная вакцинация</span>
                    <span class="detail-value">${data.datasets[1].data[currentIndex].toFixed(1)}%</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Ревакцинация</span>
                    <span class="detail-value">${data.datasets[2].data[currentIndex].toFixed(1)}%</span>
                </div>
            `;
            detailsContainer.innerHTML = details;
        }
    }

    function updateWorldStatistics(region) {
        const regionData = worldRegionsData[region];
        if (!regionData) return;

        const data = regionData.datasets[0].data;
        const average = (data.reduce((a, b) => a + b, 0) / data.length).toFixed(1);

        document.querySelectorAll('[data-stat="world-coverage"]')
            .forEach(el => el.textContent = `${average}%`);

        // Update region details if they exist
        const detailsContainer = document.querySelector('.region-details');
        if (detailsContainer) {
            const highestRegion = regionData.labels[data.indexOf(Math.max(...data))];
            const lowestRegion = regionData.labels[data.indexOf(Math.min(...data))];
            
            const details = `
                <div class="detail-item">
                    <span class="detail-label">Наивысший охват</span>
                    <span class="detail-value">${highestRegion} (${Math.max(...data).toFixed(1)}%)</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Наименьший охват</span>
                    <span class="detail-value">${lowestRegion} (${Math.min(...data).toFixed(1)}%)</span>
                </div>
            `;
            detailsContainer.innerHTML = details;
        }
    }

    // UI Components
    function showDetailedStats(regionData, index) {
        const modalContent = document.querySelector('.detailed-stats');
        if (!modalContent) return;

        const label = regionData.labels[index];
        const value = regionData.datasets[0].data[index];
        const meta = regionData.datasets[0]._meta?.[index] || {};

        const content = `
            <h3 class="text-xl font-bold mb-4">${label}</h3>
            <div class="grid grid-cols-2 gap-4">
                <div class="stat-card p-4 rounded-lg bg-white shadow dark:bg-gray-800">
                    <span class="text-sm text-gray-600 dark:text-gray-400">Охват вакцинации</span>
                    <span class="text-2xl font-bold">${value.toFixed(1)}%</span>
                    ${meta.trend ? `<span class="text-sm ${meta.trend.includes('+') ? 'text-green-500' : 'text-red-500'}">${meta.trend}</span>` : ''}
                </div>
                <div class="stat-card p-4 rounded-lg bg-white shadow dark:bg-gray-800">
                    <span class="text-sm text-gray-600 dark:text-gray-400">Статус</span>
                    <span class="text-2xl font-bold">${value >= 80 ? 'Оптимальный' : value >= 60 ? 'Средний' : 'Требует внимания'}</span>
                </div>
            </div>
        `;

        modalContent.innerHTML = content;
        document.getElementById('infoModal')?.classList.add('active');
    }

    // Theme Management
    function updateChartsTheme(isDark) {
        const theme = {
            backgroundColor: isDark ? '#1A202C' : '#FFFFFF',
            textColor: isDark ? '#E2E8F0' : '#2D3748',
            gridColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(226, 232, 240, 0.5)',
            tooltipBackground: isDark ? 'rgba(45, 55, 72, 0.95)' : 'rgba(255, 255, 255, 0.95)',
            tooltipText: isDark ? '#E2E8F0' : '#2D3748'
        };

        [russiaChartInstance, worldChartInstance].forEach(chart => {
            if (!chart) return;

            // Update chart options
            chart.options.plugins.legend.labels.color = theme.textColor;
            chart.options.scales.x.ticks.color = theme.textColor;
            chart.options.scales.y.ticks.color = theme.textColor;
            chart.options.scales.y.grid.color = theme.gridColor;
            chart.options.plugins.tooltip.backgroundColor = theme.tooltipBackground;
            chart.options.plugins.tooltip.titleColor = theme.textColor;
            chart.options.plugins.tooltip.bodyColor = theme.textColor;
            
            chart.update('none');
        });
    }
    // Event Listeners Setup
    function initializeEventListeners() {
        // View toggle buttons
        const viewButtons = document.querySelectorAll('.view-button');
        viewButtons.forEach(button => {
            button.addEventListener('click', () => {
                viewButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                handleViewChange(button.dataset.view);
            });
        });

        // Region select
        const regionSelect = document.getElementById('world-region');
        if (regionSelect) {
            regionSelect.addEventListener('change', (e) => {
                handleRegionChange(e.target.value);
            });
        }

        // Theme toggle
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('change', () => {
                const isDark = themeToggle.checked;
                updateChartsTheme(isDark);
            });
        }

        // Handle window resize
        window.addEventListener('resize', debounce(() => {
            if (russiaChartInstance) russiaChartInstance.resize();
            if (worldChartInstance) worldChartInstance.resize();
        }, 250));
    }

    // Initialize everything
    function init() {
        try {
            // Initialize both charts
            initializeEventListeners();

            // Set initial theme
            const initialTheme = document.body.getAttribute('data-theme') === 'dark';
            updateChartsTheme(initialTheme);

            // Initial statistics update
            updateStatistics('yearly');
            updateWorldStatistics('global');

            // Start auto-update interval
            setInterval(() => {
                const viewType = document.querySelector('.view-button.active')?.dataset.view;
                const region = document.getElementById('world-region')?.value;

                if (viewType) updateStatistics(viewType);
                if (region) updateWorldStatistics(region);
            }, 5000);

            return {
                handleViewChange,
                handleRegionChange,
                updateChartsTheme
            };
        } catch (error) {
            console.error('Statistics initialization failed:', error);
            showError('Failed to initialize statistics section');
            return null;
        }
    }

    // Initialize the section
    return init();
}
// end of stat

// Product Section 
function initProductSection() {
    const phoneMockup = document.querySelector('.phone-mockup');
    if (!phoneMockup) return;

    // Initialize slider
    const slides = document.querySelectorAll('.info-slide');
    const indicators = document.querySelectorAll('.slide-indicators button');
    let currentSlide = 0;
    let slideInterval;

    function showSlide(index) {
        slides.forEach(slide => {
            slide.classList.remove('active');
            slide.style.opacity = '0';
        });

        indicators.forEach(indicator => {
            indicator.classList.remove('active');
            indicator.setAttribute('aria-selected', 'false');
        });

        slides[index].classList.add('active');
        slides[index].style.opacity = '1';
        indicators[index].classList.add('active');
        indicators[index].setAttribute('aria-selected', 'true');
        
        currentSlide = index;
    }

    function nextSlide() {
        const next = (currentSlide + 1) % slides.length;
        showSlide(next);
    }

    // Initialize slider controls
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            clearInterval(slideInterval);
            showSlide(index);
            startSlideInterval();
        });
    });

    function startSlideInterval() {
        slideInterval = setInterval(nextSlide, 5000);
    }

    // Start automatic slideshow
    startSlideInterval();

    // Pause on hover
    phoneMockup.addEventListener('mouseenter', () => {
        clearInterval(slideInterval);
    });

    phoneMockup.addEventListener('mouseleave', () => {
        startSlideInterval();
    });

    // Phone mockup tilt effect
    phoneMockup.addEventListener('mousemove', (e) => {
        const rect = phoneMockup.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        
        phoneMockup.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    phoneMockup.addEventListener('mouseleave', () => {
        phoneMockup.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
    });

    // Feature items animation
    const featureItems = document.querySelectorAll('.feature-item');
    featureItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            const icon = item.querySelector('.feature-icon');
            if (icon) {
                icon.style.transform = 'scale(1.1) rotate(10deg)';
            }
        });

        item.addEventListener('mouseleave', () => {
            const icon = item.querySelector('.feature-icon');
            if (icon) {
                icon.style.transform = 'scale(1) rotate(0)';
            }
        });
    });

    // Demo modal
    const demoButton = document.querySelector('.btn-outline[data-modal="demo"]');
    if (demoButton) {
        demoButton.addEventListener('click', () => {
            const modal = document.getElementById('videoModal');
            if (modal) {
                modal.classList.add('active');
            }
        });
    }

    // CTA button effects
    const ctaButtons = document.querySelectorAll('.product-cta .btn');
    ctaButtons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'translateY(-2px)';
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translateY(0)';
        });

        button.addEventListener('click', createRipple);
    });
}
// Team Section
// Team Section (continued)
function initTeamSection() {
    const teamMembers = document.querySelectorAll('.team-member');
    
    teamMembers.forEach((member, index) => {
        // Initial animation
        member.style.opacity = '0';
        member.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            member.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            member.style.opacity = '1';
            member.style.transform = 'translateY(0)';
        }, 300 + (index * 150));

        // Hover effects
        const avatar = member.querySelector('.avatar-container');
        const card = member.querySelector('.member-card');
        
        if (card) {
            card.addEventListener('mouseenter', () => {
                if (avatar) {
                    avatar.style.transform = 'scale(1.1)';
                }
                card.style.transform = 'translateY(-8px)';
            });

            card.addEventListener('mouseleave', () => {
                if (avatar) {
                    avatar.style.transform = 'scale(1)';
                }
                card.style.transform = 'translateY(0)';
            });
        }

        // Achievement badges tooltips
        const badges = member.querySelectorAll('.achievement-badge');
        badges.forEach(badge => {
            const tooltip = badge.querySelector('.tooltip');
            
            badge.addEventListener('mouseenter', () => {
                if (tooltip) {
                    tooltip.style.opacity = '1';
                    tooltip.style.visibility = 'visible';
                    badge.style.transform = 'translateY(-3px)';
                }
            });

            badge.addEventListener('mouseleave', () => {
                if (tooltip) {
                    tooltip.style.opacity = '0';
                    tooltip.style.visibility = 'hidden';
                    badge.style.transform = 'translateY(0)';
                }
            });
        });

        // Contact buttons effects
        const contactButtons = member.querySelectorAll('.contact-button');
        contactButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                createRipple(e);
                button.classList.add('clicked');
                setTimeout(() => button.classList.remove('clicked'), 300);
            });

            button.addEventListener('mouseenter', () => {
                button.style.transform = 'translateY(-2px)';
            });

            button.addEventListener('mouseleave', () => {
                button.style.transform = 'translateY(0)';
            });
        });

        // Member stats animation
        const stats = member.querySelectorAll('.stat-value');
        stats.forEach(stat => {
            const finalValue = parseInt(stat.textContent);
            stat.textContent = '0';

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        animateNumber(stat, 0, finalValue, 2000);
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.5
            });

            observer.observe(stat);
        });

        // Member social links effects
        const socialLinks = member.querySelectorAll('.member-social .social-link');
        socialLinks.forEach(link => {
            link.addEventListener('mouseenter', () => {
                link.style.transform = 'translateY(-3px) scale(1.1)';
            });

            link.addEventListener('mouseleave', () => {
                link.style.transform = 'translateY(0) scale(1)';
            });
        });

        // Member status indicator pulse
        const statusIndicator = member.querySelector('.member-status');
        if (statusIndicator && statusIndicator.classList.contains('online')) {
            setInterval(() => {
                statusIndicator.style.transform = 'scale(1.2)';
                setTimeout(() => {
                    statusIndicator.style.transform = 'scale(1)';
                }, 200);
            }, 2000);
        }
    });

    // Team grid layout animation
    const teamGrid = document.querySelector('.team-grid');
    if (teamGrid) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1
        });

        observer.observe(teamGrid);
    }
}
// Contact Section
function initContactSection() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;

    // Form validation
    const inputs = contactForm.querySelectorAll('input, textarea');
    const submitButton = contactForm.querySelector('[type="submit"]');

    inputs.forEach(input => {
        // Input focus effects
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        });

        input.addEventListener('blur', () => {
            input.parentElement.classList.remove('focused');
            validateInput(input);
        });

        // Real-time validation
        input.addEventListener('input', () => {
            validateInput(input);
            checkFormValidity();
        });
    });

    function validateInput(input) {
        const errorMessage = input.parentElement.querySelector('.error-message');
        const indicator = input.parentElement.querySelector('.form-indicator');
        
        if (input.checkValidity()) {
            input.classList.remove('invalid');
            input.classList.add('valid');
            if (errorMessage) errorMessage.style.opacity = '0';
            if (indicator) indicator.style.opacity = '1';
        } else {
            input.classList.remove('valid');
            input.classList.add('invalid');
            if (errorMessage) errorMessage.style.opacity = '1';
            if (indicator) indicator.style.opacity = '1';
        }
    }

    function checkFormValidity() {
        if (submitButton) {
            submitButton.disabled = !contactForm.checkValidity();
        }
    }

    // Form submission
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!contactForm.checkValidity()) return;

        const formData = new FormData(contactForm);
        submitButton.disabled = true;
        contactForm.classList.add('form-loading');

        try {
            // Simulate form submission
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            showNotification('success', 'Сообщение успешно отправлено!');
            contactForm.reset();
            inputs.forEach(input => {
                input.classList.remove('valid', 'invalid');
                input.parentElement.classList.remove('focused');
            });
        } catch (error) {
            showNotification('error', 'Произошла ошибка. Попробуйте позже.');
        } finally {
            submitButton.disabled = false;
            contactForm.classList.remove('form-loading');
        }
    });

    // Contact items hover effects
    const contactItems = document.querySelectorAll('.contact-item');
    contactItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.style.transform = 'translateY(-5px)';
            const icon = item.querySelector('.contact-icon');
            if (icon) {
                icon.style.transform = 'scale(1.1) rotate(10deg)';
            }
        });

        item.addEventListener('mouseleave', () => {
            item.style.transform = 'translateY(0)';
            const icon = item.querySelector('.contact-icon');
            if (icon) {
                icon.style.transform = 'scale(1) rotate(0)';
            }
        });
    });

    // Social links hover effects
    const socialLinks = document.querySelectorAll('.footer-social .social-link');
    socialLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
            link.style.transform = 'translateY(-5px)';
        });

        link.addEventListener('mouseleave', () => {
            link.style.transform = 'translateY(0)';
        });
    });

    // Newsletter form
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = newsletterForm.querySelector('input[type="email"]').value;
            
            if (email) {
                const submitBtn = newsletterForm.querySelector('button');
                submitBtn.disabled = true;
                
                try {
                    await new Promise(resolve => setTimeout(resolve, 1500));
                    showNotification('success', 'Вы успешно подписались на новости!');
                    newsletterForm.reset();
                } catch (error) {
                    showNotification('error', 'Произошла ошибка. Попробуйте позже.');
                } finally {
                    submitBtn.disabled = false;
                }
            }
        });
    }
}

// Footer initialization
function initFooter() {
    // Scroll to top button
    const scrollTopBtn = document.querySelector('.scroll-to-top');
    if (scrollTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }
        });

        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Footer wave animation
    const waves = document.querySelectorAll('.wave');
    waves.forEach((wave, index) => {
        wave.style.animationDelay = `${index * 0.2}s`;
    });

    // Footer links hover effects
    const footerLinks = document.querySelectorAll('.footer-nav a, .compliance-links a');
    footerLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
            link.style.transform = 'translateX(8px)';
        });

        link.addEventListener('mouseleave', () => {
            link.style.transform = 'translateX(0)';
        });
    });

    // Footer social links
    const socialLinks = document.querySelectorAll('.footer-social .social-link');
    socialLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
            const icon = link.querySelector('i');
            if (icon) {
                icon.style.transform = 'scale(1.2) rotate(10deg)';
            }
        });

        link.addEventListener('mouseleave', () => {
            const icon = link.querySelector('i');
            if (icon) {
                icon.style.transform = 'scale(1) rotate(0)';
            }
        });
    });
}

// Initialize modals
function initModals() {
    const modals = document.querySelectorAll('.modal-container');
    
    modals.forEach(modal => {
        const closeBtn = modal.querySelector('.modal-close');
        const overlay = modal.querySelector('.modal-overlay');
        
        if (closeBtn) {
            closeBtn.addEventListener('click', () => closeModal(modal));
        }
        
        if (overlay) {
            overlay.addEventListener('click', () => closeModal(modal));
        }
        
        // Close on ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeModal(modal);
            }
        });
    });

    // Modal triggers
    document.addEventListener('click', (e) => {
        if (e.target.dataset.modal) {
            const modalId = e.target.dataset.modal;
            const modal = document.getElementById(`${modalId}Modal`);
            if (modal) {
                openModal(modal);
            }
        }
    });
}

function openModal(modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Animate modal content
    const content = modal.querySelector('.modal-content');
    if (content) {
        content.style.transform = 'scale(0.9)';
        content.style.opacity = '0';
        
        setTimeout(() => {
            content.style.transform = 'scale(1)';
            content.style.opacity = '1';
        }, 10);
    }
}

function closeModal(modal) {
    const content = modal.querySelector('.modal-content');
    if (content) {
        content.style.transform = 'scale(0.9)';
        content.style.opacity = '0';
    }
    
    setTimeout(() => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }, 300);
}

// Utility function to show notifications
function showNotification(type, message) {
    const container = document.querySelector('.notifications-container');
    if (!container) return;

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;

    container.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}
// Utility functions
function animateNumber(element, start, end, duration) {
    const range = end - start;
    const increment = range > 0 ? 1 : -1;
    const stepTime = Math.abs(Math.floor(duration / range));
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        element.textContent = current;
        
        if (current === end) {
            clearInterval(timer);
        }
    }, stepTime);
}

function updateProgressBar(element, value) {
    if (!element) return;
    
    const bar = element.querySelector('.progress-fill');
    if (bar) {
        bar.style.width = `${value}%`;
    }
}

// Utility functions 
function createRipple(event) {
    const button = event.currentTarget;
    const circle = document.createElement('span');
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - (button.offsetLeft + radius)}px`;
    circle.style.top = `${event.clientY - (button.offsetTop + radius)}px`;
    circle.classList.add('ripple');

    const ripple = button.querySelector('.ripple');
    if (ripple) {
        ripple.remove();
    }

    button.appendChild(circle);

    // Remove ripple after animation
    setTimeout(() => {
        circle.remove();
    }, 600);
}

function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

function debounce(func, wait) {
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

// Cookie start
// Cookie Management System
const CookieManager = {
    // Default cookie settings
    defaultSettings: {
        necessary: true, // Always true, can't be disabled
        analytics: true,
        marketing: false,
        personalization: true,
        functionality: true
    },

    // Cookie names and descriptions for UI
    cookieTypes: {
        necessary: {
            name: 'Необходимые',
            description: 'Эти файлы cookie необходимы для работы сайта и не могут быть отключены.',
            required: true
        },
        analytics: {
            name: 'Аналитика',
            description: 'Помогают понять, как посетители взаимодействуют с сайтом.',
            required: false
        },
        marketing: {
            name: 'Маркетинг',
            description: 'Используются для показа релевантной рекламы.',
            required: false
        },
        personalization: {
            name: 'Персонализация',
            description: 'Позволяют настраивать контент под ваши интересы.',
            required: false
        },
        functionality: {
            name: 'Функциональность',
            description: 'Улучшают работу сайта и расширяют его возможности.',
            required: false
        }
    },

    // Initialize cookie management system
    init() {
        this.cookieConsent = document.querySelector('.cookie-consent');
        this.cookieModal = document.getElementById('cookieSettingsModal');
        
        if (!this.hasConsent()) {
            this.showConsentBanner();
        }

        this.initializeEventListeners();
        this.loadSettings();
    },

    // Event listeners initialization
    initializeEventListeners() {
        // Accept all cookies
        document.getElementById('accept-cookies')?.addEventListener('click', () => {
            this.acceptAll();
            this.hideConsentBanner();
        });

        // Customize cookies button
        document.getElementById('customize-cookies')?.addEventListener('click', () => {
            this.showSettingsModal();
        });

        // Close modal button
        const closeBtn = this.cookieModal?.querySelector('.cookie-modal__close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.hideSettingsModal());
        }

        // Close modal on overlay click
        this.cookieModal?.addEventListener('click', (e) => {
            if (e.target === this.cookieModal) {
                this.hideSettingsModal();
            }
        });

        // Close modal on ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.cookieModal?.classList.contains('active')) {
                this.hideSettingsModal();
            }
        });
    },

    // Show cookie consent banner
    showConsentBanner() {
        if (this.cookieConsent) {
            this.cookieConsent.classList.add('active');
        }
    },

    // Hide cookie consent banner
    hideConsentBanner() {
        if (this.cookieConsent) {
            this.cookieConsent.classList.remove('active');
            setTimeout(() => {
                this.cookieConsent.style.display = 'none';
            }, 300);
        }
    },

    // Show cookie settings modal
    showSettingsModal() {
        if (this.cookieModal) {
            this.renderSettingsContent();
            this.cookieModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    },

    // Hide cookie settings modal
    hideSettingsModal() {
        if (this.cookieModal) {
            this.cookieModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    },

    // Render cookie settings content
    renderSettingsContent() {
        const currentSettings = this.getSettings();
        const modalBody = this.cookieModal?.querySelector('.cookie-modal__body');
        
        if (!modalBody) return;

        let html = `
            <div class="cookie-settings">
                <p class="cookie-settings__description">
                    Настройте использование cookies на сайте в соответствии с вашими предпочтениями.
                </p>
                <div class="cookie-settings__options">
        `;

        // Render each cookie type
        for (const [key, value] of Object.entries(this.cookieTypes)) {
            const isChecked = currentSettings[key];
            const isDisabled = value.required;
            
            html += `
                <div class="cookie-option ${isDisabled ? 'disabled' : ''}">
                    <div class="cookie-option__header">
                        <label class="cookie-switch">
                            <input type="checkbox" 
                                   name="cookie-${key}" 
                                   ${isChecked ? 'checked' : ''} 
                                   ${isDisabled ? 'disabled' : ''}
                                   data-cookie-type="${key}">
                            <span class="cookie-switch__slider"></span>
                        </label>
                        <span class="cookie-option__title">${value.name}</span>
                    </div>
                    <p class="cookie-option__description">${value.description}</p>
                </div>
            `;
        }

        html += `
                </div>
                <div class="cookie-settings__actions">
                    <button class="cookie-btn cookie-btn--save" id="save-cookie-settings">
                        Сохранить настройки
                    </button>
                    <button class="cookie-btn cookie-btn--accept-all" id="accept-all-cookies">
                        Принять все
                    </button>
                </div>
            </div>
        `;

        modalBody.innerHTML = html;

        // Add event listeners to new buttons
        document.getElementById('save-cookie-settings')?.addEventListener('click', () => {
            this.saveSettings();
            this.hideSettingsModal();
            this.hideConsentBanner();
        });

        document.getElementById('accept-all-cookies')?.addEventListener('click', () => {
            this.acceptAll();
            this.hideSettingsModal();
            this.hideConsentBanner();
        });
    },

    // Save cookie settings
    saveSettings() {
        const settings = { ...this.defaultSettings };
        const checkboxes = document.querySelectorAll('.cookie-option input[type="checkbox"]');
        
        checkboxes.forEach(checkbox => {
            const type = checkbox.dataset.cookieType;
            if (type && !this.cookieTypes[type].required) {
                settings[type] = checkbox.checked;
            }
        });

        this.setSettings(settings);
        this.applySettings(settings);
        this.showNotification('success', 'Настройки cookies сохранены');
    },

    // Accept all cookies
    acceptAll() {
        const settings = Object.keys(this.cookieTypes).reduce((acc, key) => {
            acc[key] = true;
            return acc;
        }, {});

        this.setSettings(settings);
        this.applySettings(settings);
        this.showNotification('success', 'Все cookies приняты');
    },

    // Get current cookie settings
    getSettings() {
        const settings = localStorage.getItem('cookieSettings');
        return settings ? JSON.parse(settings) : { ...this.defaultSettings };
    },

    // Set cookie settings
    setSettings(settings) {
        localStorage.setItem('cookieSettings', JSON.stringify(settings));
        localStorage.setItem('cookieConsent', 'true');
    },

    // Check if user has given consent
    hasConsent() {
        return localStorage.getItem('cookieConsent') === 'true';
    },

    // Apply cookie settings
    applySettings(settings) {
        // Apply analytics cookies
        if (settings.analytics) {
            this.initializeAnalytics();
        } else {
            this.removeAnalyticsCookies();
        }

        // Apply marketing cookies
        if (settings.marketing) {
            this.initializeMarketing();
        } else {
            this.removeMarketingCookies();
        }

        // Apply personalization
        if (settings.personalization) {
            this.initializePersonalization();
        } else {
            this.removePersonalizationCookies();
        }

        // Apply functionality cookies
        if (settings.functionality) {
            this.initializeFunctionality();
        } else {
            this.removeFunctionalityCookies();
        }

        // Trigger custom event
        window.dispatchEvent(new CustomEvent('cookieSettingsUpdated', { detail: settings }));
    },

    // Load and apply saved settings
    loadSettings() {
        const settings = this.getSettings();
        this.applySettings(settings);
    },

    // Show notification
    showNotification(type, message) {
        const notification = document.createElement('div');
        notification.className = `cookie-notification ${type}`;
        notification.innerHTML = `
            <div class="cookie-notification__content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
                <span>${message}</span>
            </div>
        `;

        document.body.appendChild(notification);

        // Add show class after a small delay for animation
        setTimeout(() => notification.classList.add('show'), 10);

        // Remove notification after delay
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    },

    // Initialize analytics
    initializeAnalytics() {
        // Implementation for analytics initialization
        console.log('Analytics initialized');
    },

    // Remove analytics cookies
    removeAnalyticsCookies() {
        // Implementation for removing analytics cookies
        console.log('Analytics cookies removed');
    },

    // Initialize marketing
    initializeMarketing() {
        // Implementation for marketing cookies
        console.log('Marketing initialized');
    },

    // Remove marketing cookies
    removeMarketingCookies() {
        // Implementation for removing marketing cookies
        console.log('Marketing cookies removed');
    },

    // Initialize personalization
    initializePersonalization() {
        // Implementation for personalization features
        console.log('Personalization initialized');
    },

    // Remove personalization cookies
    removePersonalizationCookies() {
        // Implementation for removing personalization cookies
        console.log('Personalization cookies removed');
    },

    // Initialize functionality
    initializeFunctionality() {
        // Implementation for functionality features
        console.log('Functionality initialized');
    },

    // Remove functionality cookies
    removeFunctionalityCookies() {
        // Implementation for removing functionality cookies
        console.log('Functionality cookies removed');
    },

    // Helper function to set a cookie
    setCookie(name, value, days = 365) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        const expires = `expires=${date.toUTCString()}`;
        document.cookie = `${name}=${value};${expires};path=/;SameSite=Lax`;
    },

    // Helper function to get a cookie
    getCookie(name) {
        const nameEQ = `${name}=`;
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    },

    // Helper function to delete a cookie
    deleteCookie(name) {
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
    }
};

// Initialize cookie management system when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    CookieManager.init();
});

 // cookie end

// Accessibility improvements
function initAccessibility() {
    // Handle focus trap in modals
    const modals = document.querySelectorAll('.modal-container');
    modals.forEach(modal => {
        const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];

        modal.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstFocusable) {
                        lastFocusable.focus();
                        e.preventDefault();
                    }
                } else {
                    if (document.activeElement === lastFocusable) {
                        firstFocusable.focus();
                        e.preventDefault();
                    }
                }
            }
        });
    });

    // Skip to main content
    const skipLink = document.querySelector('.skip-link');
    if (skipLink) {
        skipLink.addEventListener('click', (e) => {
            e.preventDefault();
            const main = document.querySelector('main');
            if (main) {
                main.tabIndex = -1;
                main.focus();
            }
        });
    }
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initCore();
    initSimulationSection();
    initAccessibility();
    initCookieConsent();
});