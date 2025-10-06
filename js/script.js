const textElement = document.getElementById('text');
const cursorElement = document.getElementById('cursor');
const text = "I am currently studying Computer Science at Santa Clara University";
let index = 0;

function type() {
  if (!textElement || !cursorElement) return;
  if (index < text.length) {
    textElement.textContent += text.charAt(index);
    index++;
    setTimeout(type, 35);
  } else {
    // keep blinking cursor (CSS handles blink). Optionally add a class when done:
    document.documentElement.classList.add('typed-complete');
  }
}

type();

// Header Navigation Functionality
document.addEventListener('DOMContentLoaded', function() {
  const header = document.querySelector('.header-inner');
  const navToggle = document.querySelector('.nav-toggle');
  const siteNav = document.querySelector('.site-nav');
  const navLinks = document.querySelectorAll('.nav-link');

  // Mobile navigation toggle
  if (navToggle && siteNav) {
    navToggle.addEventListener('click', function() {
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !isExpanded);
      siteNav.classList.toggle('show');
    });
  }

  // Close mobile nav when clicking on a link
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      if (siteNav && navToggle) {
        siteNav.classList.remove('show');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // Header scroll effect
  let scrollTimeout;
  function handleScroll() {
    if (header) {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }
  }

  // Throttled scroll handler for performance
  window.addEventListener('scroll', function() {
    if (scrollTimeout) {
      cancelAnimationFrame(scrollTimeout);
    }
    scrollTimeout = requestAnimationFrame(handleScroll);
  });

  // Smooth scrolling for navigation links
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        const headerHeight = document.querySelector('.site-header').offsetHeight;
        const targetPosition = targetElement.offsetTop - headerHeight - 20;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // Highlight active section in navigation
  function updateActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.scrollY;
    const viewportCenter = scrollY + window.innerHeight / 2;
    
    // Check if we're at the very top (before intro section)
    const introSection = document.getElementById('intro');
    if (introSection && scrollY < introSection.offsetTop - 200) {
      navLinks.forEach(link => link.classList.remove('active'));
      return;
    }
    
    // Give Intro section more prominence - if we're in the intro area, prioritize it
    if (introSection) {
      const introTop = introSection.offsetTop;
      const introBottom = introTop + introSection.offsetHeight;
      const introExtendedBottom = introBottom + 120;
      
      if (scrollY >= introTop - 200 && viewportCenter <= introExtendedBottom) {
        navLinks.forEach(link => link.classList.remove('active'));
        const introLink = document.querySelector('.nav-link[href="#intro"]');
        if (introLink) introLink.classList.add('active');
        return;
      }
    }
    
    // Check if we're at the bottom of the page
    const isAtBottom = scrollY + window.innerHeight >= document.documentElement.scrollHeight - 10;
    
    if (isAtBottom) {
      navLinks.forEach(link => link.classList.remove('active'));
      const techLink = document.querySelector('.nav-link[href="#tech"]');
      if (techLink) techLink.classList.add('active');
      return;
    }
    
    let activeSection = null;
    let closestDistance = Infinity;

    sections.forEach(section => {
      const top = section.offsetTop;
      const center = top + section.offsetHeight / 2;
      const distance = Math.abs(viewportCenter - center);

      // If this section is closer to viewport center than previous ones
      if (distance < closestDistance) {
        closestDistance = distance;
        activeSection = section;
      }
    });

    // Update active nav link
    navLinks.forEach(link => link.classList.remove('active'));
    if (activeSection) {
      const id = activeSection.getAttribute('id');
      const navLink = document.querySelector(`.nav-link[href="#${id}"]`);
      if (navLink) navLink.classList.add('active');
    }
  }

  window.addEventListener('scroll', updateActiveNav);
  updateActiveNav(); // Run once on load

  // Enhanced Project Cards Functionality - simplified to just expand
  setTimeout(() => {
    const expandButtons = document.querySelectorAll('.expand-btn');
    
    expandButtons.forEach(button => {
      button.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const target = this.getAttribute('data-target');
        const projectCard = document.querySelector(`[data-project="${target}"]`);
        const projectDetails = projectCard.querySelector('.project-details');
        
        // Just expand and hide the button
        projectCard.classList.add('expanded');
        projectDetails.style.display = 'block';
        projectDetails.classList.add('show');
        this.style.display = 'none'; // Hide the button after clicking
        
        // Smooth scroll to keep card in view
        setTimeout(() => {
          const cardRect = projectCard.getBoundingClientRect();
          const headerHeight = document.querySelector('.site-header').offsetHeight;
          
          if (cardRect.bottom > window.innerHeight) {
            const scrollTarget = window.scrollY + cardRect.top - headerHeight - 20;
            window.scrollTo({
              top: scrollTarget,
              behavior: 'smooth'
            });
          }
        }, 300);
      });
    });
  }, 100);
});