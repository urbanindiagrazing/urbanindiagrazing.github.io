/**
 * Navigation Component Loader
 * Dynamically loads the navigation component into any page
 */

(function () {
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadNavigation);
  } else {
    loadNavigation();
  }

  function loadNavigation() {
    // Create a container for the navigation
    const navContainer = document.createElement('div');
    navContainer.id = 'nav-component-container';

    // Insert at the beginning of body
    document.body.insertBefore(navContainer, document.body.firstChild);

    // Fetch and load the navigation component
    fetch('/nav-component.html')
      .then(response => {
        if (!response.ok) {
          throw new Error('Navigation component not found');
        }
        return response.text();
      })
      .then(html => {
        navContainer.innerHTML = html;
        // Initialize navigation functionality after HTML is loaded
        initializeNavigation();
      })
      .catch(error => {
        console.error('Error loading navigation:', error);
      });
  }

  function initializeNavigation() {
    const menuBtn = document.getElementById('menuBtn');
    const navOverlay = document.getElementById('navOverlay');

    if (!menuBtn || !navOverlay) {
      console.error('Navigation elements not found');
      return;
    }

    // Function to close menu
    function closeMenu() {
      navOverlay.classList.remove('active');
      menuBtn.classList.remove('active');
      document.body.style.overflow = '';
    }

    // Toggle menu
    menuBtn.addEventListener('click', () => {
      const isActive = navOverlay.classList.contains('active');

      if (isActive) {
        closeMenu();
      } else {
        // Open menu
        navOverlay.classList.add('active');
        menuBtn.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });

    // Close menu when clicking outside
    navOverlay.addEventListener('click', (e) => {
      if (e.target === navOverlay) {
        closeMenu();
      }
    });

    // Close menu when pressing Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navOverlay.classList.contains('active')) {
        closeMenu();
      }
    });

    // Close menu when any navigation link is clicked
    const navLinks = navOverlay.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        closeMenu();
      });
    });
  }
})();