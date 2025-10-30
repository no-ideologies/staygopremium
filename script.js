
/**
 * StayGo Premium - Main JavaScript
 * Mobile-First Responsive Interactions
 */

(function() {
  'use strict';

  // ========================================
  // State Management
  // ========================================
  const state = {
    scrollY: 0,
    lastScrollY: 0,
    isMenuOpen: false,
    isModalOpen: false
  };

  // ========================================
  // DOM Elements
  // ========================================
  const DOM = {
    header: document.getElementById('header'),
    navToggle: document.getElementById('nav-toggle'),
    navMenu: document.getElementById('nav-menu'),
    navLinks: document.querySelectorAll('.nav__link'),
    modal: document.getElementById('contact-modal'),
    modalOverlay: document.getElementById('modal-overlay'),
    modalClose: document.getElementById('modal-close'),
    showContactFormBtn: document.getElementById('show-contact-form'),
    contactForm: document.getElementById('contact-form'),
    backToTop: document.getElementById('back-to-top')
  };

  // ========================================
  // Navigation Menu Toggle
  // ========================================
  function initNavigation() {
    if (DOM.navToggle && DOM.navMenu) {
      DOM.navToggle.addEventListener('click', toggleMenu);
    }

    // Close menu when clicking on a nav link
    DOM.navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        // Close menu on mobile
        if (window.innerWidth < 1024) {
          closeMenu();
        }

        // Handle smooth scroll for anchor links
        if (link.getAttribute('href').startsWith('#')) {
          e.preventDefault();
          const targetId = link.getAttribute('href');
          const targetElement = document.querySelector(targetId);
          
          if (targetElement) {
            const headerHeight = DOM.header.offsetHeight;
            const targetPosition = targetElement.offsetTop - headerHeight;
            
            window.scrollTo({
              top: targetPosition,
              behavior: 'smooth'
            });
          }

          // Update active link
          updateActiveLink(link);
        }
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (state.isMenuOpen && 
          !DOM.navMenu.contains(e.target) && 
          !DOM.navToggle.contains(e.target)) {
        closeMenu();
      }
    });

    // Handle window resize
    window.addEventListener('resize', () => {
      if (window.innerWidth >= 1024 && state.isMenuOpen) {
        closeMenu();
      }
    });
  }

  function toggleMenu() {
    state.isMenuOpen = !state.isMenuOpen;
    
    if (state.isMenuOpen) {
      DOM.navMenu.classList.add('show');
      DOM.navToggle.classList.add('active');
      document.body.style.overflow = 'hidden';
    } else {
      closeMenu();
    }
  }

  function closeMenu() {
    state.isMenuOpen = false;
    DOM.navMenu.classList.remove('show');
    DOM.navToggle.classList.remove('active');
    document.body.style.overflow = '';
  }

  function updateActiveLink(activeLink) {
    DOM.navLinks.forEach(link => {
      link.classList.remove('active');
    });
    activeLink.classList.add('active');
  }

  // ========================================
  // Header Scroll Behavior
  // ========================================
  function initHeaderScroll() {
    let lastScroll = 0;
    const headerHeight = DOM.header.offsetHeight;

    window.addEventListener('scroll', () => {
      const currentScroll = window.pageYOffset;

      // Add shadow on scroll
      if (currentScroll > 10) {
        DOM.header.style.boxShadow = 'var(--shadow-md)';
      } else {
        DOM.header.style.boxShadow = 'var(--shadow-sm)';
      }

      // Hide/show header on scroll
      if (currentScroll > headerHeight && currentScroll > lastScroll) {
        // Scrolling down
        DOM.header.classList.add('header--hidden');
      } else {
        // Scrolling up
        DOM.header.classList.remove('header--hidden');
      }

      lastScroll = currentScroll;
    });
  }

  // ========================================
  // Intersection Observer for Animations
  // ========================================
  function initScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, observerOptions);

    // Animate feature cards
    const animatedElements = document.querySelectorAll(
      '.feature-card, .event-card, .testimonial-card, .process__step'
    );

    animatedElements.forEach((element, index) => {
      element.style.opacity = '0';
      element.style.transform = 'translateY(30px)';
      element.style.transition = `opacity 0.6s ease-out ${index * 0.1}s, transform 0.6s ease-out ${index * 0.1}s`;
      observer.observe(element);
    });
  }

  // ========================================
  // Active Section Highlighting
  // ========================================
  function initActiveSectionHighlight() {
    const sections = document.querySelectorAll('section[id]');
    
    const observerOptions = {
      threshold: 0.3,
      rootMargin: '-70px 0px -70% 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.getAttribute('id');
          const correspondingLink = document.querySelector(`.nav__link[href="#${sectionId}"]`);
          
          if (correspondingLink) {
            updateActiveLink(correspondingLink);
          }
        }
      });
    }, observerOptions);

    sections.forEach(section => {
      observer.observe(section);
    });
  }

  // ========================================
  // Modal Functionality
  // ========================================
  function initModal() {
    if (DOM.showContactFormBtn) {
      DOM.showContactFormBtn.addEventListener('click', openModal);
    }

    if (DOM.modalClose) {
      DOM.modalClose.addEventListener('click', closeModal);
    }

    if (DOM.modalOverlay) {
      DOM.modalOverlay.addEventListener('click', closeModal);
    }

    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && state.isModalOpen) {
        closeModal();
      }
    });

    // Prevent modal content clicks from closing modal
    if (DOM.modal) {
      const modalContent = DOM.modal.querySelector('.modal__content');
      if (modalContent) {
        modalContent.addEventListener('click', (e) => {
          e.stopPropagation();
        });
      }
    }
  }

  function openModal() {
    if (DOM.modal) {
      DOM.modal.classList.add('show');
      state.isModalOpen = true;
      document.body.style.overflow = 'hidden';
      
      // Focus first input
      const firstInput = DOM.modal.querySelector('input, textarea, select');
      if (firstInput) {
        setTimeout(() => firstInput.focus(), 100);
      }
    }
  }

  function closeModal() {
    if (DOM.modal) {
      DOM.modal.classList.remove('show');
      state.isModalOpen = false;
      document.body.style.overflow = '';
    }
  }

  // ========================================
  // Form Handling
  // ========================================
  function initForm() {
    if (DOM.contactForm) {
      DOM.contactForm.addEventListener('submit', handleFormSubmit);

      // Real-time validation
      const inputs = DOM.contactForm.querySelectorAll('input, textarea, select');
      inputs.forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => {
          if (input.classList.contains('error')) {
            validateField(input);
          }
        });
      });
    }
  }

  function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';

    // Required field validation
    if (field.hasAttribute('required') && !value) {
      isValid = false;
      errorMessage = 'This field is required';
    }

    // Email validation
    if (field.type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        isValid = false;
        errorMessage = 'Please enter a valid email address';
      }
    }

    // Phone validation
    if (field.type === 'tel' && value) {
      const phoneRegex = /^[\d\s\+\-\(\)]+$/;
      if (!phoneRegex.test(value) || value.length < 10) {
        isValid = false;
        errorMessage = 'Please enter a valid phone number';
      }
    }

    // Update field state
    if (isValid) {
      field.classList.remove('error');
      removeErrorMessage(field);
    } else {
      field.classList.add('error');
      showErrorMessage(field, errorMessage);
    }

    return isValid;
  }

  function showErrorMessage(field, message) {
    removeErrorMessage(field);
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'form__error';
    errorDiv.style.color = 'var(--color-accent-600)';
    errorDiv.style.fontSize = 'var(--text-sm)';
    errorDiv.style.marginTop = 'var(--spacing-xs)';
    errorDiv.textContent = message;
    
    field.parentNode.appendChild(errorDiv);
  }

  function removeErrorMessage(field) {
    const existingError = field.parentNode.querySelector('.form__error');
    if (existingError) {
      existingError.remove();
    }
  }

  function handleFormSubmit(e) {
    e.preventDefault();

    // Validate all fields
    const inputs = DOM.contactForm.querySelectorAll('input[required], textarea[required], select[required]');
    let isFormValid = true;

    inputs.forEach(input => {
      if (!validateField(input)) {
        isFormValid = false;
      }
    });

    if (!isFormValid) {
      // Focus first invalid field
      const firstError = DOM.contactForm.querySelector('.error');
      if (firstError) {
        firstError.focus();
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    // Get form data
    const formData = new FormData(DOM.contactForm);
    const data = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });

    // Show loading state
    const submitButton = DOM.contactForm.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.innerHTML;
    submitButton.disabled = true;
    submitButton.innerHTML = '<span>Sending...</span>';

    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
      console.log('Form submitted:', data);
      
      // Show success message
      showNotification('Thank you! We\'ll get back to you within 2 hours during business hours.', 'success');
      
      // Reset form
      DOM.contactForm.reset();
      
      // Close modal
      closeModal();
      
      // Restore button
      submitButton.disabled = false;
      submitButton.innerHTML = originalButtonText;

      // In production, this would be:
      /*
      fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      })
      .then(response => response.json())
      .then(result => {
        showNotification('Thank you! We\'ll get back to you soon.', 'success');
        DOM.contactForm.reset();
        closeModal();
      })
      .catch(error => {
        showNotification('Sorry, there was an error. Please try again.', 'error');
      })
      .finally(() => {
        submitButton.disabled = false;
        submitButton.innerHTML = originalButtonText;
      });
      */
    }, 1500);
  }

  // ========================================
  // Notifications
  // ========================================
  function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    // Styles
    Object.assign(notification.style, {
      position: 'fixed',
      top: '90px',
      right: '20px',
      padding: '1rem 1.5rem',
      backgroundColor: type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6',
      color: 'white',
      borderRadius: 'var(--radius-md)',
      boxShadow: 'var(--shadow-xl)',
      zIndex: '9999',
      animation: 'slideInRight 0.3s ease-out',
      maxWidth: '90%',
      fontSize: 'var(--text-sm)'
    });

    document.body.appendChild(notification);

    // Remove after 5 seconds
    setTimeout(() => {
      notification.style.animation = 'slideOutRight 0.3s ease-in';
      setTimeout(() => notification.remove(), 300);
    }, 5000);
  }

  // ========================================
  // Back to Top Button
  // ========================================
  function initBackToTop() {
    if (DOM.backToTop) {
      window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
          DOM.backToTop.classList.add('show');
        } else {
          DOM.backToTop.classList.remove('show');
        }
      });

      DOM.backToTop.addEventListener('click', () => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });
    }
  }

  // ========================================
  // Lazy Loading Images
  // ========================================
  function initLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
            }
            observer.unobserve(img);
          }
        });
      });

      images.forEach(img => imageObserver.observe(img));
    }
  }

  // ========================================
  // Smooth Scroll for All Anchor Links
  // ========================================
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        
        if (href === '#') {
          e.preventDefault();
          return;
        }

        const targetElement = document.querySelector(href);
        
        if (targetElement) {
          e.preventDefault();
          
          const headerHeight = DOM.header.offsetHeight;
          const targetPosition = targetElement.offsetTop - headerHeight;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  // ========================================
  // Dropdown Menu Hover (Desktop)
  // ========================================
  function initDropdownMenus() {
    const dropdowns = document.querySelectorAll('.nav__dropdown');
    
    dropdowns.forEach(dropdown => {
      const dropdownContent = dropdown.querySelector('.dropdown__content');
      
      if (dropdownContent) {
        let timeout;

        dropdown.addEventListener('mouseenter', () => {
          if (window.innerWidth >= 1024) {
            clearTimeout(timeout);
            dropdownContent.style.display = 'block';
            setTimeout(() => {
              dropdownContent.style.opacity = '1';
              dropdownContent.style.transform = 'translateY(0)';
            }, 10);
          }
        });

        dropdown.addEventListener('mouseleave', () => {
          if (window.innerWidth >= 1024) {
            timeout = setTimeout(() => {
              dropdownContent.style.opacity = '0';
              dropdownContent.style.transform = 'translateY(-10px)';
              setTimeout(() => {
                dropdownContent.style.display = 'none';
              }, 200);
            }, 100);
          }
        });

        // Style dropdown content
        dropdownContent.style.opacity = '0';
        dropdownContent.style.transform = 'translateY(-10px)';
        dropdownContent.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
      }
    });

    // Mobile dropdown toggle
    dropdowns.forEach(dropdown => {
      const dropdownLink = dropdown.querySelector('.nav__link');
      const dropdownContent = dropdown.querySelector('.dropdown__content');
      
      if (dropdownLink && dropdownContent && window.innerWidth < 1024) {
        dropdownLink.addEventListener('click', (e) => {
          if (window.innerWidth < 1024) {
            e.preventDefault();
            
            const isOpen = dropdownContent.style.display === 'block';
            
            // Close all other dropdowns
            document.querySelectorAll('.dropdown__content').forEach(content => {
              content.style.display = 'none';
            });
            
            // Toggle current dropdown
            dropdownContent.style.display = isOpen ? 'none' : 'block';
          }
        });
      }
    });
  }

  // ========================================
  // Phone Number Formatting
  // ========================================
  function initPhoneFormatting() {
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    
    phoneInputs.forEach(input => {
      input.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        
        // Format UK phone number
        if (value.startsWith('44')) {
          value = '+44 ' + value.slice(2);
        } else if (value.startsWith('0')) {
          value = '+44 ' + value.slice(1);
        }
        
        // e.target.value = value;
      });
    });
  }

  // ========================================
  // Event Date Validation
  // ========================================
  function initDateValidation() {
    const dateInputs = document.querySelectorAll('input[type="date"]');
    const today = new Date().toISOString().split('T')[0];
    
    dateInputs.forEach(input => {
      input.setAttribute('min', today);
    });
  }

  // ========================================
  // Analytics Event Tracking (Placeholder)
  // ========================================
  function trackEvent(category, action, label) {
    // Google Analytics tracking
    if (typeof gtag !== 'undefined') {
      gtag('event', action, {
        'event_category': category,
        'event_label': label
      });
    }
    
    // Console log for development
    console.log('Event tracked:', { category, action, label });
  }

  // Track CTA clicks
  function initAnalytics() {
    document.querySelectorAll('.btn--primary').forEach(btn => {
      btn.addEventListener('click', () => {
        trackEvent('CTA', 'click', btn.textContent.trim());
      });
    });

    // Track event card clicks
    document.querySelectorAll('.event-card').forEach(card => {
      card.addEventListener('click', () => {
        const eventName = card.querySelector('.event-card__title')?.textContent;
        trackEvent('Event', 'view', eventName);
      });
    });
  }

  // ========================================
  // Performance: Debounce Function
  // ========================================
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // ========================================
  // Window Resize Handler
  // ========================================
  function initResizeHandler() {
    const handleResize = debounce(() => {
      // Update viewport height for mobile browsers
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
      
      // Close mobile menu on desktop resize
      if (window.innerWidth >= 1024 && state.isMenuOpen) {
        closeMenu();
      }
    }, 250);

    window.addEventListener('resize', handleResize);
    
    // Initial call
    handleResize();
  }

  // ========================================
  // Page Load Performance
  // ========================================
  function checkPerformance() {
    if ('performance' in window && 'getEntriesByType' in performance) {
      const [navigation] = performance.getEntriesByType('navigation');
      
      if (navigation) {
        console.log('Page Load Time:', navigation.loadEventEnd - navigation.fetchStart, 'ms');
        console.log('DOM Content Loaded:', navigation.domContentLoadedEventEnd - navigation.fetchStart, 'ms');
      }
    }
  }

  // ========================================
  // Initialization
  // ========================================
  function init() {
    console.log('StayGo Premium - Initializing...');

    // Core functionality
    initNavigation();
    initHeaderScroll();
    initModal();
    initForm();
    initBackToTop();
    initSmoothScroll();
    initDropdownMenus();
    
    // Enhancements
    initScrollAnimations();
    initActiveSectionHighlight();
    initLazyLoading();
    initPhoneFormatting();
    initDateValidation();
    initResizeHandler();
    initAnalytics();
    
    // Performance tracking
    checkPerformance();

    console.log('StayGo Premium - Initialized successfully ✓');
  }

  // ========================================
  // Start Application
  // ========================================
  // Wait for DOM to be fully loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Export functions for external use (if needed)
  window.StayGoPremium = {
    openModal,
    closeModal,
    showNotification,
    trackEvent
  };

})();
