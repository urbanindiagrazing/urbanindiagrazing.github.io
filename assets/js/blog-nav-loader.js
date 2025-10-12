/**
 * Blog Navigation Component Loader
 * Dynamically loads the navigation component into any page
 */

(function () {
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadBlogNavigation);
  } else {
    loadBlogNavigation();
  }

  function loadBlogNavigation() {
    // Create a container for the navigation
    const navContainer = document.getElementById('blog-navigation-container');
    if (!navContainer) {
      console.error('Blog navigation container not found');
      return;
    }

    // Fetch and load the navigation component
    fetch('/blog-nav-component.html')
      .then(response => {
        if (!response.ok) {
          throw new Error('Blog Navigation component not found');
        }
        return response.text();
      })
      .then(html => {
        navContainer.innerHTML = html;
      })
      .catch(error => {
        console.error('Error loading blog navigation:', error);
      });
  }
})();