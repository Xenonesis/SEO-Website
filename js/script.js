
document.addEventListener('DOMContentLoaded', () => {
    // --- Mobile Menu ---
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('.nav');
    const body = document.body;

    if (menuBtn && nav) {
        menuBtn.addEventListener('click', () => {
            const isExpanded = menuBtn.getAttribute('aria-expanded') === 'true';
            
            // Toggle Menu
            nav.classList.toggle('active');
            menuBtn.setAttribute('aria-expanded', !isExpanded);
            body.classList.toggle('no-scroll'); // Prevent body scroll when menu is open

            // Toggle Icon
            const icon = menuBtn.querySelector('i');
            if (icon) {
                if (nav.classList.contains('active')) {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-times');
                } else {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });

        // Close menu when clicking a link
        const navLinks = nav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('active');
                menuBtn.setAttribute('aria-expanded', 'false');
                body.classList.remove('no-scroll');
                
                // Reset icon
                const icon = menuBtn.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            });
        });

        // Close menu when clicking outside (optional)
        document.addEventListener('click', (e) => {
            if (nav.classList.contains('active') && !nav.contains(e.target) && !menuBtn.contains(e.target)) {
                nav.classList.remove('active');
                menuBtn.setAttribute('aria-expanded', 'false');
                body.classList.remove('no-scroll');
                
                const icon = menuBtn.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });
    }

    // --- Header Scroll Effect ---
    const header = document.querySelector('.header');
    const scrollThreshold = 50;

    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > scrollThreshold) {
                header.classList.add('scrolled');
                header.style.background = 'rgba(10, 10, 10, 0.9)';
                header.style.backdropFilter = 'blur(10px)';
                header.style.padding = '0.5rem 0';
            } else {
                header.classList.remove('scrolled');
                header.style.background = 'transparent';
                header.style.backdropFilter = 'none';
                header.style.padding = '1rem 0';
            }
        }, { passive: true });
    }

    // --- GSAP Animations ---
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        // Hero Animations
        const heroTitle = document.querySelector('.hero h1') || document.querySelector('.hero-title');
        const heroDesc = document.querySelector('.hero p') || document.querySelector('.hero-description');
        const heroCta = document.querySelector('.hero .btn') || document.querySelector('.hero-cta');

        const tl = gsap.timeline({ defaults: { ease: 'power4.out', duration: 1 } });

        if (heroTitle) {
            tl.from(heroTitle, { y: 50, opacity: 0, duration: 1.2 });
        }
        if (heroDesc) {
            tl.from(heroDesc, { y: 30, opacity: 0 }, "-=0.8");
        }
        if (heroCta) {
            tl.from(heroCta, { y: 20, opacity: 0 }, "-=0.8");
        }

        // Generic Reveal Up Animation
        const revealElements = document.querySelectorAll('.reveal-up');
        revealElements.forEach(elem => {
            gsap.from(elem, {
                scrollTrigger: {
                    trigger: elem,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse'
                },
                y: 50,
                opacity: 0,
                duration: 0.8,
                ease: 'power2.out'
            });
        });

        // Section Titles (if not using reveal-up)
        const sectionTitles = document.querySelectorAll('h2:not(.reveal-up)');
        sectionTitles.forEach(title => {
            gsap.from(title, {
                scrollTrigger: {
                    trigger: title,
                    start: 'top 85%',
                },
                y: 30,
                opacity: 0,
                duration: 0.8,
                ease: 'power2.out'
            });
        });
    }

    // --- FAQ Accordion ---
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const header = item.querySelector('.faq-header');
        const content = item.querySelector('.faq-content');
        const icon = item.querySelector('.faq-icon');

        if (header && content) {
            header.addEventListener('click', () => {
                const isOpen = content.style.maxHeight;

                // Close all other FAQs
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        const otherContent = otherItem.querySelector('.faq-content');
                        const otherIcon = otherItem.querySelector('.faq-icon');
                        if (otherContent) otherContent.style.maxHeight = null;
                        if (otherIcon) otherIcon.style.transform = 'rotate(0deg)';
                    }
                });

                // Toggle current
                if (isOpen) {
                    content.style.maxHeight = null;
                    if (icon) icon.style.transform = 'rotate(0deg)';
                } else {
                    content.style.maxHeight = content.scrollHeight + 'px';
                    if (icon) icon.style.transform = 'rotate(180deg)';
                }
            });
        }
    });

    // --- Smooth Scroll for Anchor Links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#' || targetId === '') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});
