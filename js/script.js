const menuToggle = document.getElementById('menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');

// Toggle the visibility of the mobile menu on button click
menuToggle.addEventListener('click', () => {
  const isHidden = mobileMenu.classList.contains('hidden');

  if (isHidden) {
    mobileMenu.classList.remove('hidden');
    mobileMenu.classList.add('slide-in');
    mobileMenu.style.maxHeight = mobileMenu.scrollHeight + 'px';
  } else {
    mobileMenu.style.maxHeight = '0';
    mobileMenu.classList.remove('slide-in');
    setTimeout(() => {
      mobileMenu.classList.add('hidden');
    }, 300); // Delay to allow the closing animation to complete
  }

  menuToggle.classList.toggle('active');
});

// Close the mobile menu when clicking outside of it
window.addEventListener('click', (event) => {
  if (
    !menuToggle.contains(event.target) &&
    !mobileMenu.contains(event.target) &&
    !mobileMenu.classList.contains('hidden')
  ) {
    mobileMenu.style.maxHeight = '0';
    mobileMenu.classList.remove('slide-in');
    setTimeout(() => {
      mobileMenu.classList.add('hidden');
    }, 300);
    menuToggle.classList.remove('active');
  }
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (event) {
    event.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    target.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });

    // Close the mobile menu after clicking on a link in mobile view
    if (!mobileMenu.classList.contains('hidden')) {
      mobileMenu.style.maxHeight = '0';
      mobileMenu.classList.remove('slide-in');
      setTimeout(() => {
        mobileMenu.classList.add('hidden');
      }, 300);
      menuToggle.classList.remove('active');
    }
  });
});

// Handle the transition end to clean up the slide-in class after the animation completes
mobileMenu.addEventListener('transitionend', () => {
  if (mobileMenu.style.maxHeight === '0px') {
    mobileMenu.classList.add('hidden');
    mobileMenu.classList.remove('slide-in');
  }
});

// Loading animation
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  if (loader) {
    loader.classList.add('fade-out');
    setTimeout(() => {
      loader.style.display = 'none';
    }, 500);
  }
});
