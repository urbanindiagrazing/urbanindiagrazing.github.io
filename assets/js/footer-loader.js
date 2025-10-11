/**
 * Footer Component Loader
 * Dynamically loads the navigation component into any page
 */

(function () {
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadFooter);
  } else {
    loadFooter();
  }

  function loadFooter() {
    // Create footer element
    const footer = document.createElement('footer');

    // Fetch and load the navigation component
    fetch('footer-component.html')
      .then(response => {
        if (!response.ok) {
          throw new Error('Footer component not found');
        }
        return response.text();
      })
      .then(html => {
        footer.innerHTML = html;
      })
      .catch(error => {
        console.error('Error loading footer:', error);
      });

    // Append footer to body
    document.body.appendChild(footer);
  }
})();