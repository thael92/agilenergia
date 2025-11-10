// JavaScript para funcionalidades futuras

document.addEventListener('DOMContentLoaded', () => {
    const elementsToTranslate = document.querySelectorAll('[data-lang-pt], [data-en], .main-nav a');

    // --- Efeito de Digitação ---
    const typingEffect = (element, text, speed = 100) => {
        let i = 0;
        element.innerHTML = ''; // Limpa o texto inicial
        element.classList.add('typing'); // Adiciona a classe para mostrar o cursor
        const type = () => {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, speed);
            } else {
                element.classList.remove('typing'); // Remove a classe ao final da digitação
            }
        };
        type();
    };

    const heroTitle = document.querySelector('.hero-section h1');
    if (heroTitle) {
        // O código de tradução abaixo irá reiniciar o efeito quando o idioma for trocado.
    }

    let currentLang = localStorage.getItem('lang') || 'pt';

    const langButton = document.querySelector('.language-toggle .lang-btn');

    const updateLangButtonAndTexts = () => {
        if (langButton) {
            if (currentLang === 'pt') {
                langButton.textContent = langButton.dataset.ptText;
            } else {
                langButton.textContent = langButton.dataset.enText;
            }
        }

        elementsToTranslate.forEach(element => {
            if (currentLang === 'en' && element.dataset.langEn) {
                // Se for o título do hero, aplica o efeito de digitação
                if (element === heroTitle) {
                    typingEffect(element, element.dataset.langEn);
                } else {
                    element.textContent = element.dataset.langEn;
                }
            } else if (currentLang === 'pt' && element.dataset.langPt) {
                // Se for o título do hero, aplica o efeito de digitação
                if (element === heroTitle) {
                    typingEffect(element, element.dataset.langPt);
                } else {
                    element.textContent = element.dataset.langPt;
                }
            }
        });

        document.documentElement.lang = currentLang; // Atualiza o atributo lang da tag <html>
    };

    // Language toggle logic
    if (langButton) {
        langButton.addEventListener('click', () => {
            currentLang = (currentLang === 'pt') ? 'en' : 'pt';
            localStorage.setItem('lang', currentLang);
            updateLangButtonAndTexts(); // Isso irá chamar o efeito de digitação novamente
        });
    }

    // Initial load
    updateLangButtonAndTexts();

    // Hamburger menu toggle
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const mainNav = document.querySelector('.main-nav');

    hamburgerMenu.addEventListener('click', () => {
        mainNav.classList.toggle('active');
        hamburgerMenu.classList.toggle('open');
        document.body.classList.toggle('menu-open'); // Toggle body class for overlay
    });

    // Close mobile menu when a nav link is clicked
    mainNav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mainNav.classList.remove('active');
            hamburgerMenu.classList.remove('open');
            document.body.classList.remove('menu-open'); // Remove body class
        });
    });

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - (document.querySelector('.main-header').offsetHeight),
                    behavior: 'smooth'
                });
            }
        });
    });

    // Intersection Observer for scroll animations
    const animateOnScroll = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                observer.unobserve(entry.target);
            }
        });
    };

    const observer = new IntersectionObserver(animateOnScroll, {
        root: null, // viewport
        rootMargin: '0px',
        threshold: 0.2 // Trigger when 20% of the item is visible
    });

    document.querySelectorAll('.about-section .about-text, .about-section .brazil-map, .about-section .about-cards-wrapper, .strategy-block, .ethics-section .card, .ethics-cta, .whistleblower-channel, .news-card, .contact-form, .contact-info').forEach(element => {
        observer.observe(element);
    });

    // Team member bio expansion
    document.querySelectorAll('.team-member').forEach(memberCard => {
        const readMoreBtn = memberCard.querySelector('.read-more-btn');
        const fullBioContent = memberCard.querySelector('.full-bio-content');
        const shortBio = memberCard.querySelector('.short-bio');

        readMoreBtn.addEventListener('click', () => {
            if (fullBioContent.classList.contains('expanded')) {
                fullBioContent.classList.remove('expanded');
                shortBio.style.display = 'block';
                readMoreBtn.dataset.lang === 'en' ? readMoreBtn.textContent = 'Read More' : readMoreBtn.textContent = 'Ler Mais';
            } else {
                fullBioContent.classList.add('expanded');
                shortBio.style.display = 'none';
                readMoreBtn.dataset.lang === 'en' ? readMoreBtn.textContent = 'Read Less' : readMoreBtn.textContent = 'Ler Menos';
            }
        });
    });

    // Animated Counter
    const counters = document.querySelectorAll('.counter');

    const startCounter = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.dataset.target);
                let count = 0;
                const increment = target / 200; // Adjust speed here

                const updateCount = () => {
                    if (count < target) {
                        count += increment;
                        counter.textContent = Math.ceil(count);
                        requestAnimationFrame(updateCount);
                    } else {
                        counter.textContent = target;
                    }
                };
                updateCount();
                observer.unobserve(counter);
            }
        });
    };

    const counterObserver = new IntersectionObserver(startCounter, {
        root: null,
        rootMargin: '0px',
        threshold: 0.5
    });

    counters.forEach(counter => {
        counterObserver.observe(counter);
    });

    // Contact Form Validation
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            let isValid = true;
            const name = contactForm.querySelector('#name');
            const email = contactForm.querySelector('#email');
            const subject = contactForm.querySelector('#subject');
            const message = contactForm.querySelector('#message');

            // Simple validation
            if (name.value.trim() === '') {
                isValid = false;
                displayMessage('error', 'Por favor, insira seu nome.');
            } else if (!/^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/.test(email.value)) {
                isValid = false;
                displayMessage('error', 'Por favor, insira um email válido.');
            } else if (subject.value.trim() === '') {
                isValid = false;
                displayMessage('error', 'Por favor, insira o assunto.');
            } else if (message.value.trim() === '') {
                isValid = false;
                displayMessage('error', 'Por favor, insira sua mensagem.');
            }

            if (isValid) {
                // In a real application, you would send this data to a server
                displayMessage('success', 'Mensagem enviada com sucesso!');
                contactForm.reset();
            }
        });
    }

    function displayMessage(type, msg) {
        formMessage.textContent = msg;
        formMessage.className = 'form-message ' + type;
        formMessage.style.display = 'block';
        setTimeout(() => {
            formMessage.style.display = 'none';
        }, 5000);
    }

    // Set current year in footer
    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // Fullscreen Map Functionality
    const brazilMapLink = document.getElementById('brazilMapLink');
    if (brazilMapLink) {
        const mapSrc = brazilMapLink.querySelector('img').src;

        // Create fullscreen modal HTML dynamically
        const fullscreenModal = document.createElement('div');
        fullscreenModal.id = 'fullscreenMapModal';
        fullscreenModal.classList.add('fullscreen-modal');
        fullscreenModal.innerHTML = `
            <div class="modal-content">
                <span class="close-button">&times;</span>
                <img src="${mapSrc}" alt="Mapa do Brasil em tela cheia">
            </div>
        `;
        document.body.appendChild(fullscreenModal);

        const closeButton = fullscreenModal.querySelector('.close-button');
        const modalContent = fullscreenModal.querySelector('.modal-content');

        brazilMapLink.addEventListener('click', (e) => {
            e.preventDefault();
            fullscreenModal.classList.add('open');
            document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
        });

        closeButton.addEventListener('click', () => {
            fullscreenModal.classList.remove('open');
            document.body.style.overflow = ''; // Restore scrolling
        });

        fullscreenModal.addEventListener('click', (e) => {
            if (e.target === fullscreenModal) {
                fullscreenModal.classList.remove('open');
                document.body.style.overflow = '';
            }
        });
    }

    /* --- Canvas Gas Animation --- */
    const canvas = document.getElementById('gasCanvas');
    const ctx = canvas.getContext('2d');

    let particles = [];
    const numParticles = 80; // Número de partículas
    const particleRadius = 1.5; // Raio das partículas
    const maxLineDistance = 120; // Distância máxima para conectar partículas
    const flowSpeed = 0.5; // Velocidade de fluxo das partículas

    const colors = [
        'rgba(245, 166, 35, 0.7)', // Laranja com transparência
        'rgba(74, 29, 110, 0.7)'   // Roxo com transparência
    ];

    // Função para redimensionar o canvas
    const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };

    // Classe para representar uma partícula
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * flowSpeed; // Velocidade em X
            this.vy = (Math.random() - 0.5) * flowSpeed; // Velocidade em Y
            this.radius = particleRadius + Math.random() * 1.5;
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.opacity = 0.5 + Math.random() * 0.5; // Opacidade translúcida
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Faz a partícula reaparecer do lado oposto se sair da tela
            if (this.x < -this.radius) this.x = canvas.width + this.radius;
            if (this.x > canvas.width + this.radius) this.x = -this.radius;
            if (this.y < -this.radius) this.y = canvas.height + this.radius;
            if (this.y > canvas.height + this.radius) this.y = -this.radius;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.color.replace(/[^,]+(?=\))/, this.opacity.toFixed(1)); // Ajusta opacidade dinamicamente
            ctx.shadowBlur = 10; // Brilho suave
            ctx.shadowColor = this.color.replace(/[^,]+(?=\))/, '1'); // Cor do brilho
            ctx.fill();
            ctx.shadowBlur = 0; // Reseta o brilho para não afetar outros desenhos
        }
    }

    // Inicializa as partículas
    const initParticles = () => {
        particles = []; // Limpa partículas existentes
        for (let i = 0; i < numParticles; i++) {
            particles.push(new Particle());
        }
    };

    // Função para desenhar linhas entre partículas próximas
    const drawLines = () => {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const p1 = particles[i];
                const p2 = particles[j];
                const distance = Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));

                if (distance < maxLineDistance) {
                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.lineWidth = 0.5; // Linhas sutis
                    ctx.strokeStyle = `rgba(100, 100, 100, ${(1 - distance / maxLineDistance) * 0.5})`; // Opacidade baseada na distância
                    ctx.stroke();
                }
            }
        }
    };

    // Loop de animação
    const animate = () => {
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpa o canvas

        // Desenha as linhas primeiro
        drawLines();

        // Atualiza e desenha as partículas
        particles.forEach(p => {
            p.update();
            p.draw();
        });
    };

    // Event Listeners
    window.addEventListener('resize', () => {
        resizeCanvas();
        initParticles(); // Re-inicializa partículas para se ajustar ao novo tamanho
    });

    // Inicializa e começa a animação
    resizeCanvas();
    initParticles();
    animate();

});
