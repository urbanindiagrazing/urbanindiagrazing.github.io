/**
 * Google Analytics Event Tracking
 * Automatically tracks user interactions with links and forms
 */

(function () {
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initEventTracking);
  } else {
    initEventTracking();
  }

  function initEventTracking() {
    trackLinks();
    trackForms();
  }

  /**
   * Track all link clicks
   */
  function trackLinks() {
    document.addEventListener('click', function (e) {
      // Find the closest anchor tag
      const link = e.target.closest('a');
      if (!link) return;

      const href = link.getAttribute('href');
      if (!href) return;

      // Determine link type and category
      let eventCategory = 'link_click';
      let eventLabel = href;
      let eventAction = 'click';

      // Internal navigation links (hash links)
      if (href.startsWith('#')) {
        eventCategory = 'navigation';
        eventAction = 'scroll_to_section';
        eventLabel = href.substring(1); // Remove the #
      }
      // External links
      else if (href.startsWith('http') || href.startsWith('//')) {
        eventCategory = 'external_link';
        eventAction = 'outbound_click';

        // Identify specific external link types
        if (href.includes('instagram.com')) {
          eventLabel = 'Instagram';
        } else if (href.includes('facebook.com')) {
          eventLabel = 'Facebook';
        } else if (href.startsWith('mailto:')) {
          eventCategory = 'email';
          eventAction = 'email_click';
          eventLabel = href.replace('mailto:', '');
        } else if (href.startsWith('tel:')) {
          eventCategory = 'phone';
          eventAction = 'phone_click';
          eventLabel = href.replace('tel:', '');
        } else {
          eventLabel = href;
        }
      }
      // Internal page links
      else if (href.endsWith('.html') || href.includes('.html#')) {
        eventCategory = 'internal_navigation';
        eventAction = 'page_view';
        eventLabel = href.split('#')[0]; // Get page name without hash

        // Identify specific page types
        if (href.includes('menu.html')) {
          eventLabel = 'Menu Page';
        } else if (href.includes('blog')) {
          eventLabel = 'Blog - ' + href.split('/').pop().replace('.html', '');
        } else if (href.includes('thanks.html')) {
          eventLabel = 'Thank You Page';
        } else if (href.includes('rsvp.html')) {
          eventLabel = 'RSVP Page';
        }
      }

      // Check if it's a CTA button
      if (link.classList.contains('button') || link.classList.contains('scrolly')) {
        const buttonText = link.textContent.trim();

        // Track specific CTA buttons
        if (buttonText.toLowerCase().includes('book')) {
          eventCategory = 'cta';
          eventAction = 'book_event_click';
          eventLabel = buttonText;
        } else if (buttonText.toLowerCase().includes('menu')) {
          eventCategory = 'cta';
          eventAction = 'view_menu_click';
          eventLabel = buttonText;
        } else if (buttonText.toLowerCase().includes('rsvp')) {
          eventCategory = 'cta';
          eventAction = 'rsvp_click';
          eventLabel = buttonText;
        } else if (link.classList.contains('button')) {
          eventCategory = 'cta';
          eventAction = 'button_click';
          eventLabel = buttonText;
        }
      }

      // Send event to GA4
      if (window.gtag) {
        gtag('event', eventAction, {
          'event_category': eventCategory,
          'event_label': eventLabel,
          'link_url': href,
          'link_text': link.textContent.trim()
        });
      }
    });
  }

  /**
   * Track form interactions
   */
  function trackForms() {
    const forms = document.querySelectorAll('form');

    forms.forEach(function (form) {
      // Identify form type
      const formType = identifyFormType(form);

      // Track form start (when user focuses on first input)
      let formStarted = false;
      const inputs = form.querySelectorAll('input, textarea, select');

      inputs.forEach(function (input) {
        input.addEventListener('focus', function () {
          if (!formStarted) {
            formStarted = true;
            if (window.gtag) {
              gtag('event', 'form_start', {
                'event_category': 'form_interaction',
                'event_label': formType,
                'form_name': formType
              });
            }
          }
        });
      });

      // Track form submission
      form.addEventListener('submit', function (e) {
        // Get form data for context
        const formData = new FormData(form);
        const packageSelected = formData.get('package') || 'not specified';
        const eventType = formData.get('eventType') || 'not specified';
        const guests = formData.get('guests') || 'not specified';
        const contactMethod = formData.get('contactMethod') || 'not specified';

        if (window.gtag) {
          gtag('event', 'form_submit', {
            'event_category': 'form_interaction',
            'event_label': formType,
            'form_name': formType,
            'package': packageSelected,
            'event_type': eventType,
            'guests': guests,
            'contact_method': contactMethod
          });

          // Track as conversion
          gtag('event', 'conversion', {
            'event_category': 'lead_generation',
            'event_label': formType,
            'value': 1
          });
        }
      });

      // Track field interactions for key fields
      trackKeyFields(form, formType);
    });
  }

  /**
   * Identify the type of form
   */
  function identifyFormType(form) {
    const action = form.getAttribute('action') || '';
    const pageUrl = window.location.pathname;

    // Check for RSVP form
    if (pageUrl.includes('rsvp')) {
      return 'RSVP Form';
    }

    // Check for contact/booking form
    const nameInput = form.querySelector('#name');
    const eventTypeInput = form.querySelector('#eventType');
    const packageInput = form.querySelector('#package');

    if (packageInput && eventTypeInput) {
      return 'Contact/Booking Form';
    }

    return 'Form';
  }

  /**
   * Track interactions with key form fields
   */
  function trackKeyFields(form, formType) {
    // Track package selection
    const packageField = form.querySelector('#package, [name="package"]');
    if (packageField) {
      packageField.addEventListener('change', function () {
        if (window.gtag && this.value) {
          gtag('event', 'package_selected', {
            'event_category': 'form_interaction',
            'event_label': this.value,
            'form_name': formType,
            'package_type': this.value
          });
        }
      });
    }

    // Track event type input
    const eventTypeField = form.querySelector('#eventType, [name="eventType"]');
    if (eventTypeField) {
      eventTypeField.addEventListener('blur', function () {
        if (window.gtag && this.value) {
          gtag('event', 'event_type_entered', {
            'event_category': 'form_interaction',
            'event_label': this.value,
            'form_name': formType,
            'event_type': this.value
          });
        }
      });
    }

    // Track guest count
    const guestsField = form.querySelector('#guests, [name="guests"]');
    if (guestsField) {
      guestsField.addEventListener('change', function () {
        if (window.gtag && this.value) {
          const guestCount = parseInt(this.value);
          let guestRange = 'unknown';

          if (guestCount <= 15) guestRange = '10-15';
          else if (guestCount <= 25) guestRange = '16-25';
          else if (guestCount <= 40) guestRange = '26-40';
          else guestRange = '40+';

          gtag('event', 'guest_count_selected', {
            'event_category': 'form_interaction',
            'event_label': guestRange,
            'form_name': formType,
            'guest_count': guestCount,
            'guest_range': guestRange
          });
        }
      });
    }

    // Track contact method preference
    const contactMethodField = form.querySelector('#contactMethod, [name="contactMethod"]');
    if (contactMethodField) {
      contactMethodField.addEventListener('change', function () {
        if (window.gtag && this.value) {
          gtag('event', 'contact_method_selected', {
            'event_category': 'form_interaction',
            'event_label': this.value,
            'form_name': formType,
            'contact_method': this.value
          });
        }
      });
    }
  }

})();
