// --- FAQ Accordion ---
const faqItems = document.querySelectorAll('.bg-gray-50.p-6.rounded-lg'); // Updated selector for FAQ container

faqItems.forEach(item => {
  const button = item.querySelector('button');
  // Select the div that is a direct child of the item and is not the button's parent (more robust)
  const answerDiv = item.querySelector(':scope > div:not(:has(button))');
  const icon = button ? button.querySelector('svg') : null; // Check if button exists before querying icon

  if (button && answerDiv && icon) { // Ensure all elements exist
    // Add the class for CSS targeting if it doesn't exist
    if (!answerDiv.classList.contains('faq-answer')) {
        answerDiv.classList.add('faq-answer');
    }
    // Ensure initial state matches HTML (hidden)
    answerDiv.style.maxHeight = '0px';
    button.setAttribute('aria-expanded', 'false');


    button.addEventListener('click', () => {
      const isOpen = answerDiv.classList.contains('open');

      // Optional: Close other open FAQs
      faqItems.forEach(otherItem => {
          if (otherItem !== item) {
              const otherAnswer = otherItem.querySelector('.faq-answer');
              const otherButton = otherItem.querySelector('button');
              if (otherAnswer && otherButton && otherAnswer.classList.contains('open')) {
                  otherAnswer.classList.remove('open');
                  otherAnswer.style.maxHeight = '0px'; // Explicitly set max-height for closing
                  otherButton.setAttribute('aria-expanded', 'false');
              }
          }
      });

      if (isOpen) {
        answerDiv.classList.remove('open');
        button.setAttribute('aria-expanded', 'false');
        answerDiv.style.maxHeight = '0px'; // Set max-height to 0 for closing animation
      } else {
        answerDiv.classList.add('open');
        button.setAttribute('aria-expanded', 'true');
         // Set max-height dynamically based on scrollHeight for accuracy BEFORE transition starts
         answerDiv.style.maxHeight = answerDiv.scrollHeight + 'px';
      }
    });

     // Reset max-height after transition to allow dynamic height changes if needed
     answerDiv.addEventListener('transitionend', (event) => {
        // Ensure the transition is for max-height
        if (event.propertyName === 'max-height') {
            if (answerDiv.classList.contains('open')) {
                // Optional: Remove explicit max-height after opening to allow content reflow if needed
                // answerDiv.style.maxHeight = 'none';
            }
        }
    });
  } else {
      console.warn('FAQ item structure incorrect, skipping:', item);
  }
});

// --- Rest of the script (Menu, Scroll, Loader) ---

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
