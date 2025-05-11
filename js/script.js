// --- Header Scroll Effect ---
const header = document.getElementById('main-header');
const scrollThreshold = 50; // Pixels to scroll before changing header

if (header) {
    const handleScroll = () => {
        if (window.scrollY > scrollThreshold) {
            document.body.classList.add('scrolled');
            // Add shadow to header when scrolled
            header.style.boxShadow = 'var(--shadow-lg)';
        } else {
            document.body.classList.remove('scrolled');
            // Reset shadow when at top
            header.style.boxShadow = 'var(--shadow-md)';
        }
    };

    // Initial check in case the page loads already scrolled
    handleScroll();

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll, { passive: true }); // Use passive listener for performance
} else {
    console.warn('Main header element not found for scroll effect.');
}

// --- Menu & Navigation ---

const menuToggle = document.getElementById('menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');

if (menuToggle && mobileMenu) { // Check if elements exist
    // Toggle the visibility of the mobile menu on button click
    menuToggle.addEventListener('click', () => {
      const isHidden = mobileMenu.classList.contains('hidden');
      const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';

      if (isHidden || !isExpanded) {
        mobileMenu.classList.remove('hidden');
        // Delay setting max-height slightly to ensure 'hidden' is removed first
        requestAnimationFrame(() => {
            mobileMenu.style.maxHeight = mobileMenu.scrollHeight + 'px';
        });
        menuToggle.setAttribute('aria-expanded', 'true');
      } else {
        mobileMenu.style.maxHeight = '0';
        menuToggle.setAttribute('aria-expanded', 'false');
        // Add 'hidden' back after transition completes (handled by transitionend listener)
      }
    });

    // Close the mobile menu when clicking outside of it
    window.addEventListener('click', (event) => {
      if (
        mobileMenu.style.maxHeight !== '0px' && // Check if menu is open
        !menuToggle.contains(event.target) &&
        !mobileMenu.contains(event.target)
      ) {
        mobileMenu.style.maxHeight = '0';
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });

    // Handle the transition end for mobile menu
    mobileMenu.addEventListener('transitionend', (event) => {
        if (event.propertyName === 'max-height') {
            if (mobileMenu.style.maxHeight === '0px') {
                mobileMenu.classList.add('hidden');
            } else {
                 // Optional: Set max-height to 'none' after opening to allow content reflow
                 // mobileMenu.style.maxHeight = 'none';
            }
        }
    });

    // Close mobile menu on link click
    mobileMenu.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', () => {
            if (mobileMenu.style.maxHeight !== '0px') {
                mobileMenu.style.maxHeight = '0';
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        });
    });

} else {
    console.warn('Mobile menu toggle or menu element not found.');
}


// Smooth scrolling for anchor links (applies to all such links)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (event) {
    const targetId = this.getAttribute('href');
    // Check if it's more than just '#'
    if (targetId.length > 1) {
        const target = document.querySelector(targetId);
        if (target) {
            event.preventDefault(); // Prevent default only if target exists
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start' // Or 'center' depending on preference
            });
        }
    }
    // Note: Mobile menu closing is handled separately above
  });
});


// Loading animation (Keep if #loader element exists or will be added)
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  if (loader) {
    // Ensure fade-out class exists in CSS and handles opacity/visibility
    loader.classList.add('fade-out');
    // Remove loader from DOM after animation for better performance
    loader.addEventListener('transitionend', () => {
        loader.remove();
    }, { once: true }); // Ensure listener runs only once
     // Fallback timeout in case transitionend doesn't fire
    setTimeout(() => {
        if (document.body.contains(loader)) { // Check if still exists
             loader.remove();
        }
    }, 1000); // Slightly longer than animation
  }
});

// --- Scroll-Triggered Animations ---
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');

    if (!animatedElements.length) {
        console.log("No elements found with the 'animate-on-scroll' class.");
        return; // Exit if no elements to animate
    }

    const observerOptions = {
        root: null, // Use the viewport as the root
        rootMargin: '0px',
        threshold: 0.1 // Trigger when 10% of the element is visible
    };

    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // Optional: Unobserve after animation to save resources
                // observer.unobserve(entry.target);
            }
            // Optional: Remove class if element scrolls out of view (for re-animation)
            // else {
            //     entry.target.classList.remove('is-visible');
            // }
        });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    animatedElements.forEach(el => {
        observer.observe(el);
    });

    // Update current year in footer
    const currentYearElements = document.querySelectorAll('#current-year');
    const currentYear = new Date().getFullYear();

    currentYearElements.forEach(element => {
        element.textContent = currentYear;
    });
});
