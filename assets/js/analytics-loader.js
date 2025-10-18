/**
 * Google Analytics 4 Dynamic Loader
 * Centralized GA4 tracking code that can be included in all pages
 */

(function () {
  // Your GA4 Measurement ID - Change this in one place to update all pages
  const GA4_MEASUREMENT_ID = 'G-TYT7YV16KY';

  // Create and inject the gtag.js script
  const gtagScript = document.createElement('script');
  gtagScript.async = true;
  gtagScript.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_MEASUREMENT_ID}`;
  document.head.appendChild(gtagScript);

  // Initialize the dataLayer and gtag function
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    dataLayer.push(arguments);
  }
  gtag('js', new Date());
  gtag('config', GA4_MEASUREMENT_ID);

  // Make gtag available globally for custom event tracking
  window.gtag = gtag;
})();
