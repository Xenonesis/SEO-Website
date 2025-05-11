/**
 * Theme Switcher
 * Handles theme switching functionality and persistence
 * Supports multiple themes: light, dark, blue, green
 */

// Theme constants
const THEME_STORAGE_KEY = 'seo-website-theme';
const LIGHT_THEME = 'light';
const DARK_THEME = 'dark';
const BLUE_THEME = 'blue';
const GREEN_THEME = 'green';

// Theme array for cycling through themes
const THEMES = [LIGHT_THEME, DARK_THEME, BLUE_THEME, GREEN_THEME];

// DOM elements
let themeToggle;
let themeSelector;
let themeBar;

/**
 * Initialize the theme system
 */
document.addEventListener('DOMContentLoaded', function() {
    // Create theme toggle
    createThemeToggle();

    // Load saved theme
    loadTheme();
});

/**
 * Create the theme selector if it doesn't exist
 */
function createThemeToggle() {
    // Check if theme bar already exists
    themeBar = document.getElementById('theme-bar');
    if (themeBar) return;

    // Create modern theme toggle container
    const modernToggle = document.createElement('div');
    modernToggle.id = 'modern-theme-toggle';
    modernToggle.className = 'modern-theme-toggle';
    modernToggle.setAttribute('role', 'dialog');
    modernToggle.setAttribute('aria-labelledby', 'theme-dialog-title');

    // Create toggle header
    const toggleHeader = document.createElement('div');
    toggleHeader.className = 'toggle-header';

    // Create toggle title
    const toggleTitle = document.createElement('h3');
    toggleTitle.id = 'theme-dialog-title';
    toggleTitle.className = 'toggle-title';
    toggleTitle.textContent = 'Choose Your Theme';
    toggleHeader.appendChild(toggleTitle);

    // Create close button
    const closeButton = document.createElement('button');
    closeButton.className = 'toggle-close';
    closeButton.innerHTML = '<i class="fas fa-times"></i>';
    closeButton.setAttribute('aria-label', 'Close theme selector');
    closeButton.addEventListener('click', () => {
        modernToggle.classList.remove('active');
        // Return focus to the button that opened the dialog
        if (document.activeElement === closeButton) {
            const themeToggleBtn = document.querySelector('.theme-toggle-btn');
            if (themeToggleBtn) themeToggleBtn.focus();
        }
    });
    toggleHeader.appendChild(closeButton);

    // Add toggle header to modern toggle
    modernToggle.appendChild(toggleHeader);

    // Create theme options container
    const themeOptions = document.createElement('div');
    themeOptions.className = 'theme-options';

    // Add instructions text
    const instructions = document.createElement('p');
    instructions.className = 'theme-instructions';
    instructions.textContent = 'Select a theme to customize your browsing experience:';
    themeOptions.appendChild(instructions);

    // Define theme options
    const themes = [
        { name: LIGHT_THEME, icon: 'fa-sun', label: 'Light', description: 'Clean, bright interface for daytime browsing' },
        { name: DARK_THEME, icon: 'fa-moon', label: 'Dark', description: 'Reduced eye strain for nighttime viewing' },
        { name: BLUE_THEME, icon: 'fa-water', label: 'Blue', description: 'Calm, professional appearance' },
        { name: GREEN_THEME, icon: 'fa-leaf', label: 'Green', description: 'Fresh, organic feel for natural content' }
    ];

    // Create theme option cards
    themes.forEach(theme => {
        const themeCard = document.createElement('div');
        themeCard.className = 'theme-card';
        themeCard.setAttribute('data-theme', theme.name);
        themeCard.setAttribute('role', 'button');
        themeCard.setAttribute('tabindex', '0');
        themeCard.setAttribute('aria-label', `${theme.label} theme: ${theme.description}`);

        // Create theme preview
        const themePreview = document.createElement('div');
        themePreview.className = `theme-preview ${theme.name}-preview`;

        // Create theme icon
        const themeIcon = document.createElement('i');
        themeIcon.className = `fas ${theme.icon}`;
        themeIcon.setAttribute('aria-hidden', 'true');
        themePreview.appendChild(themeIcon);

        themeCard.appendChild(themePreview);

        // Create theme info
        const themeInfo = document.createElement('div');
        themeInfo.className = 'theme-info';

        // Create theme label
        const themeLabel = document.createElement('div');
        themeLabel.className = 'theme-label';
        themeLabel.textContent = theme.label;
        themeInfo.appendChild(themeLabel);

        // Create theme description
        const themeDesc = document.createElement('div');
        themeDesc.className = 'theme-description';
        themeDesc.textContent = theme.description;
        themeInfo.appendChild(themeDesc);

        themeCard.appendChild(themeInfo);

        // Create selection indicator
        const selectionIndicator = document.createElement('div');
        selectionIndicator.className = 'selection-indicator';
        selectionIndicator.innerHTML = '<i class="fas fa-check" aria-hidden="true"></i>';
        themeCard.appendChild(selectionIndicator);

        // Add click event
        themeCard.addEventListener('click', () => {
            setTheme(theme.name);
            updateActiveThemeCard();

            // Show feedback toast
            showThemeToast(theme.label);
        });

        // Add keyboard support
        themeCard.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                themeCard.click();
            }
        });

        // Add to theme options
        themeOptions.appendChild(themeCard);
    });

    // Add theme options to modern toggle
    modernToggle.appendChild(themeOptions);

    // Create theme preview section
    const previewSection = document.createElement('div');
    previewSection.className = 'theme-preview-section';

    // Create preview title
    const previewTitle = document.createElement('h4');
    previewTitle.className = 'preview-title';
    previewTitle.textContent = 'Preview';
    previewSection.appendChild(previewTitle);

    // Create preview container
    const previewContainer = document.createElement('div');
    previewContainer.className = 'preview-container';

    // Create preview elements (simplified website mockup)
    const previewHeader = document.createElement('div');
    previewHeader.className = 'preview-header';
    previewHeader.innerHTML = '<div class="preview-logo"></div><div class="preview-nav"></div>';
    previewContainer.appendChild(previewHeader);

    const previewHero = document.createElement('div');
    previewHero.className = 'preview-hero';
    previewHero.innerHTML = '<div class="preview-text"></div><div class="preview-button"></div>';
    previewContainer.appendChild(previewHero);

    const previewContent = document.createElement('div');
    previewContent.className = 'preview-content';
    previewContent.innerHTML = '<div class="preview-card"></div><div class="preview-card"></div><div class="preview-card"></div>';
    previewContainer.appendChild(previewContent);

    previewSection.appendChild(previewContainer);
    modernToggle.appendChild(previewSection);

    // Add modern toggle to body
    document.body.appendChild(modernToggle);

    // Create toast notification container
    const toastContainer = document.createElement('div');
    toastContainer.id = 'theme-toast-container';
    toastContainer.className = 'theme-toast-container';
    document.body.appendChild(toastContainer);

    // Create fixed theme bar container (simplified version)
    themeBar = document.createElement('div');
    themeBar.id = 'theme-bar';
    themeBar.className = 'theme-bar';

    // Create theme bar content
    const themeBarContent = document.createElement('div');
    themeBarContent.className = 'theme-bar-content';

    // Create current theme indicator
    const currentThemeIndicator = document.createElement('div');
    currentThemeIndicator.className = 'current-theme';

    // Create current theme icon
    const currentThemeIcon = document.createElement('span');
    currentThemeIcon.className = 'current-theme-icon';
    currentThemeIcon.innerHTML = '<i class="fas fa-sun" aria-hidden="true"></i>';
    currentThemeIndicator.appendChild(currentThemeIcon);

    // Create current theme label
    const currentThemeLabel = document.createElement('span');
    currentThemeLabel.className = 'current-theme-label';
    currentThemeLabel.textContent = 'Light';
    currentThemeIndicator.appendChild(currentThemeLabel);

    themeBarContent.appendChild(currentThemeIndicator);

    // Create theme toggle button
    const themeToggleBtn = document.createElement('button');
    themeToggleBtn.className = 'theme-toggle-btn';
    themeToggleBtn.innerHTML = 'Customize <i class="fas fa-chevron-right" aria-hidden="true"></i>';
    themeToggleBtn.setAttribute('aria-label', 'Open theme customizer');
    themeToggleBtn.addEventListener('click', () => {
        modernToggle.classList.add('active');
        updateActiveThemeCard();
        updatePreviewTheme();

        // Focus the first theme card for keyboard navigation
        setTimeout(() => {
            const firstCard = modernToggle.querySelector('.theme-card');
            if (firstCard) firstCard.focus();
        }, 100);
    });

    themeBarContent.appendChild(themeToggleBtn);

    // Add theme bar content to theme bar
    themeBar.appendChild(themeBarContent);

    // Add theme bar to body
    document.body.appendChild(themeBar);

    // Create theme selector for header
    themeSelector = document.createElement('div');
    themeSelector.id = 'theme-selector';
    themeSelector.className = 'theme-selector';

    // Create toggle button
    themeToggle = document.createElement('button');
    themeToggle.id = 'theme-toggle';
    themeToggle.className = 'theme-toggle';
    themeToggle.setAttribute('aria-label', 'Toggle theme bar');

    // Create toggle icon
    const toggleIcon = document.createElement('i');
    toggleIcon.className = 'fas fa-palette';
    toggleIcon.setAttribute('aria-hidden', 'true');
    themeToggle.appendChild(toggleIcon);

    // Add click event to toggle theme bar visibility
    themeToggle.addEventListener('click', () => {
        themeBar.classList.toggle('theme-bar-visible');
        themeToggle.classList.toggle('active');

        // Announce to screen readers
        if (themeBar.classList.contains('theme-bar-visible')) {
            announceToScreenReader('Theme bar opened');
        } else {
            announceToScreenReader('Theme bar closed');
        }
    });

    // Add toggle to theme selector
    themeSelector.appendChild(themeToggle);

    // Add to header
    const headerNav = document.querySelector('header nav.desktop-nav, header nav.hidden.md\\:flex');
    if (headerNav) {
        // For desktop, add before the last link (usually Contact Us)
        const navLinks = headerNav.querySelectorAll('a');
        if (navLinks.length > 0) {
            const lastLink = navLinks[navLinks.length - 1];
            headerNav.insertBefore(themeSelector, lastLink);
            themeSelector.style.marginRight = '1rem';
        } else {
            headerNav.appendChild(themeSelector);
        }
    }

    // Function to update active theme card
    function updateActiveThemeCard() {
        const currentTheme = document.documentElement.getAttribute('data-theme') || LIGHT_THEME;
        const themeCards = document.querySelectorAll('.theme-card');

        // Update theme cards
        themeCards.forEach(card => {
            if (card.getAttribute('data-theme') === currentTheme) {
                card.classList.add('active');
                card.setAttribute('aria-selected', 'true');
            } else {
                card.classList.remove('active');
                card.setAttribute('aria-selected', 'false');
            }
        });

        // Update current theme indicator
        const themeData = themes.find(t => t.name === currentTheme);
        if (themeData) {
            currentThemeIcon.innerHTML = `<i class="fas ${themeData.icon}" aria-hidden="true"></i>`;
            currentThemeLabel.textContent = themeData.label;
        }
    }

    // Function to update preview theme
    function updatePreviewTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme') || LIGHT_THEME;
        const previewContainer = document.querySelector('.preview-container');

        if (previewContainer) {
            // Remove all theme classes
            previewContainer.classList.remove('preview-light', 'preview-dark', 'preview-blue', 'preview-green');

            // Add current theme class
            previewContainer.classList.add(`preview-${currentTheme}`);
        }
    }

    // Function to show theme toast notification
    function showThemeToast(themeName) {
        const toastContainer = document.getElementById('theme-toast-container');
        if (!toastContainer) return;

        // Create toast
        const toast = document.createElement('div');
        toast.className = 'theme-toast';
        toast.innerHTML = `<i class="fas fa-check-circle" aria-hidden="true"></i> ${themeName} theme applied`;

        // Add to container
        toastContainer.appendChild(toast);

        // Animate in
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);

        // Remove after delay
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toastContainer.removeChild(toast);
            }, 300);
        }, 3000);

        // Announce to screen readers
        announceToScreenReader(`${themeName} theme applied`);
    }

    // Function to announce messages to screen readers
    function announceToScreenReader(message) {
        let announcer = document.getElementById('sr-announcer');

        if (!announcer) {
            announcer = document.createElement('div');
            announcer.id = 'sr-announcer';
            announcer.className = 'sr-only';
            announcer.setAttribute('aria-live', 'polite');
            document.body.appendChild(announcer);
        }

        announcer.textContent = message;
    }

    // Create mobile theme toggle
    createMobileThemeToggle();

    // Set initial theme bar visibility
    setTimeout(() => {
        // Show theme bar briefly on page load, then hide it
        themeBar.classList.add('theme-bar-visible');
        setTimeout(() => {
            themeBar.classList.remove('theme-bar-visible');
        }, 3000);
    }, 1000);

    // Close modern toggle when clicking outside
    document.addEventListener('click', (e) => {
        if (modernToggle.classList.contains('active') &&
            !modernToggle.contains(e.target) &&
            !themeToggleBtn.contains(e.target)) {
            modernToggle.classList.remove('active');
        }
    });

    // Add escape key support
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modernToggle.classList.contains('active')) {
            modernToggle.classList.remove('active');
            // Return focus to the button that opened the dialog
            const themeToggleBtn = document.querySelector('.theme-toggle-btn');
            if (themeToggleBtn) themeToggleBtn.focus();
        }
    });

    // Initialize active theme card and preview
    updateActiveThemeCard();
    updatePreviewTheme();
}

// These functions have been replaced by the panel toggle functionality in createThemeToggle

/**
 * Create a mobile theme selector
 * This is a simplified version that opens the modern theme toggle
 */
function createMobileThemeToggle() {
    // Find mobile menu
    const mobileMenu = document.getElementById('mobile-menu');
    if (!mobileMenu) return;

    // Check if mobile theme selector already exists
    if (mobileMenu.querySelector('.mobile-theme-selector')) return;

    // Create container for mobile theme options
    const mobileThemeContainer = document.createElement('div');
    mobileThemeContainer.className = 'px-4 pt-4 pb-2 mobile-theme-selector';

    // Create label
    const label = document.createElement('p');
    label.className = 'text-sm font-medium mb-3';
    label.textContent = 'Theme Options';
    label.style.color = 'var(--text-medium)';
    mobileThemeContainer.appendChild(label);

    // Create current theme display
    const currentThemeDisplay = document.createElement('div');
    currentThemeDisplay.className = 'current-theme-display flex items-center mb-3';

    // Create current theme icon
    const currentThemeIcon = document.createElement('span');
    currentThemeIcon.className = 'current-theme-mobile-icon mr-2';

    // Get current theme
    const currentTheme = document.documentElement.getAttribute('data-theme') || LIGHT_THEME;
    let iconClass = 'fa-sun';
    let themeName = 'Light';

    // Set icon based on current theme
    switch (currentTheme) {
        case DARK_THEME:
            iconClass = 'fa-moon';
            themeName = 'Dark';
            break;
        case BLUE_THEME:
            iconClass = 'fa-water';
            themeName = 'Blue';
            break;
        case GREEN_THEME:
            iconClass = 'fa-leaf';
            themeName = 'Green';
            break;
    }

    currentThemeIcon.innerHTML = `<i class="fas ${iconClass}"></i>`;
    currentThemeDisplay.appendChild(currentThemeIcon);

    // Create current theme text
    const currentThemeText = document.createElement('span');
    currentThemeText.className = 'text-sm';
    currentThemeText.textContent = `Current theme: ${themeName}`;
    currentThemeText.style.color = 'var(--text-medium)';
    currentThemeDisplay.appendChild(currentThemeText);

    mobileThemeContainer.appendChild(currentThemeDisplay);

    // Create theme toggle button
    const toggleButton = document.createElement('button');
    toggleButton.className = 'mobile-theme-toggle-btn w-full py-3 px-4 rounded-md flex items-center justify-center';
    toggleButton.innerHTML = '<i class="fas fa-palette mr-2"></i> <span>Customize Theme</span>';

    // Add click event to open modern theme toggle
    toggleButton.addEventListener('click', () => {
        const modernToggle = document.getElementById('modern-theme-toggle');
        if (modernToggle) {
            modernToggle.classList.add('active');

            // Update active theme card
            const updateActiveThemeCard = () => {
                const currentTheme = document.documentElement.getAttribute('data-theme') || LIGHT_THEME;
                const themeCards = document.querySelectorAll('.theme-card');

                themeCards.forEach(card => {
                    if (card.getAttribute('data-theme') === currentTheme) {
                        card.classList.add('active');
                    } else {
                        card.classList.remove('active');
                    }
                });
            };

            updateActiveThemeCard();
        }

        // Close mobile menu
        const menuToggle = document.getElementById('menu-toggle');
        if (menuToggle) {
            menuToggle.click();
        }
    });

    mobileThemeContainer.appendChild(toggleButton);

    // Add to mobile menu
    const menuContent = mobileMenu.querySelector('div');
    if (menuContent) {
        menuContent.appendChild(mobileThemeContainer);
    } else {
        mobileMenu.appendChild(mobileThemeContainer);
    }
}

/**
 * Load theme from localStorage or system preference
 */
function loadTheme() {
    // Get saved theme from localStorage
    let savedTheme = localStorage.getItem(THEME_STORAGE_KEY);

    // If no saved theme, check for system preference
    if (!savedTheme) {
        // Check if user prefers dark mode
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            savedTheme = DARK_THEME;
        } else {
            savedTheme = LIGHT_THEME;
        }
    }

    // Validate the theme
    if (!THEMES.includes(savedTheme)) {
        savedTheme = LIGHT_THEME;
    }

    // Set the theme
    setTheme(savedTheme);

    // Log for debugging
    console.log('Theme loaded:', savedTheme);
}

/**
 * Set the theme
 * @param {string} theme - 'light', 'dark', 'blue', or 'green'
 */
function setTheme(theme) {
    // Validate theme
    if (!THEMES.includes(theme)) {
        theme = LIGHT_THEME; // Default to light theme if invalid
    }

    // Update data attribute on html element
    document.documentElement.setAttribute('data-theme', theme);

    // Remove all theme classes
    document.documentElement.classList.remove('dark-mode', 'blue-mode', 'green-mode');

    // Add appropriate theme class for CSS compatibility
    switch (theme) {
        case DARK_THEME:
            document.documentElement.classList.add('dark-mode');
            break;
        case BLUE_THEME:
            document.documentElement.classList.add('blue-mode');
            break;
        case GREEN_THEME:
            document.documentElement.classList.add('green-mode');
            break;
        // Light theme is default, no class needed
    }

    // Update theme bar buttons
    if (themeBar) {
        const themeButtons = themeBar.querySelectorAll('.theme-bar-button');
        themeButtons.forEach(button => {
            if (button.getAttribute('data-theme') === theme) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });
    }

    // Update mobile theme options
    const mobileThemeButtons = document.querySelectorAll('.mobile-theme-button');
    mobileThemeButtons.forEach(button => {
        if (button.getAttribute('data-theme') === theme) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });

    // Add transition class for smooth color changes
    document.documentElement.classList.add('theme-transition');

    // Remove transition class after transition completes to prevent transition on page load
    setTimeout(() => {
        document.documentElement.classList.remove('theme-transition');
    }, 300);

    // Save to localStorage
    localStorage.setItem(THEME_STORAGE_KEY, theme);

    // Log theme change for debugging
    console.log('Theme set to:', theme);
}

/**
 * Listen for system theme preference changes
 */
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    // Only update if user hasn't manually set a theme
    if (!localStorage.getItem(THEME_STORAGE_KEY)) {
        setTheme(e.matches ? DARK_THEME : LIGHT_THEME);
    }
});

/**
 * Handle mobile menu visibility changes
 */
document.addEventListener('DOMContentLoaded', () => {
    // Handle theme changes when mobile menu opens/closes
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu) {
        // Create mobile theme toggle when menu is opened
        const menuToggle = document.getElementById('menu-toggle');
        if (menuToggle) {
            menuToggle.addEventListener('click', () => {
                // Small delay to ensure menu is fully open
                setTimeout(() => {
                    createMobileThemeToggle();
                }, 100);
            });
        }
    }

    // Add keyboard accessibility for theme buttons
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            const themeButton = e.target.closest('.theme-bar-button, .mobile-theme-bar-toggle');
            if (themeButton) {
                e.preventDefault();
                themeButton.click();
            }
        }
    });
});
