const textElement = document.getElementById("text");

const typingLines = [
  "I am currently studying Computer Science at Santa Clara University.",
  "I build practical automation and AI-driven tools.",
  "I enjoy turning complex workflows into simple experiences."
];

function runTypingAnimation() {
  if (!textElement) return;

  let lineIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  const tick = () => {
    const currentLine = typingLines[lineIndex];

    if (!isDeleting) {
      textElement.textContent = currentLine.slice(0, charIndex + 1);
      charIndex += 1;

      if (charIndex === currentLine.length) {
        isDeleting = true;
        setTimeout(tick, 1300);
        return;
      }

      setTimeout(tick, 35);
      return;
    }

    textElement.textContent = currentLine.slice(0, Math.max(0, charIndex - 1));
    charIndex -= 1;

    if (charIndex <= 0) {
      isDeleting = false;
      lineIndex = (lineIndex + 1) % typingLines.length;
      setTimeout(tick, 260);
      return;
    }

    setTimeout(tick, 20);
  };

  tick();
}

function initNavigation() {
  const headerInner = document.querySelector(".header-inner");
  const navToggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".site-nav");
  const navLinks = Array.from(document.querySelectorAll(".nav-link"));
  const sections = Array.from(document.querySelectorAll("section[id]"));

  if (navToggle && nav) {
    navToggle.addEventListener("click", () => {
      const expanded = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!expanded));
      nav.classList.toggle("show", !expanded);
    });
  }

  navLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const targetId = link.getAttribute("href")?.replace("#", "");
      if (!targetId) return;

      const target = document.getElementById(targetId);
      if (!target) return;

      const headerOffset = document.querySelector(".site-header")?.offsetHeight || 0;
      const targetTop = target.getBoundingClientRect().top + window.scrollY - headerOffset - 10;

      window.scrollTo({ top: targetTop, behavior: "smooth" });

      if (nav && navToggle) {
        nav.classList.remove("show");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  });

  const updateHeaderAndActiveLink = () => {
    if (headerInner) {
      headerInner.classList.toggle("scrolled", window.scrollY > 10);
    }

    const viewportMiddle = window.scrollY + window.innerHeight * 0.35;
    let currentSectionId = "";

    sections.forEach((section) => {
      const top = section.offsetTop;
      const bottom = top + section.offsetHeight;
      if (viewportMiddle >= top && viewportMiddle < bottom) {
        currentSectionId = section.id;
      }
    });

    navLinks.forEach((link) => {
      const isActive = link.getAttribute("href") === `#${currentSectionId}`;
      link.classList.toggle("active", isActive);
    });
  };

  let rafId = 0;
  window.addEventListener("scroll", () => {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(updateHeaderAndActiveLink);
  });

  updateHeaderAndActiveLink();
}

function initRevealAnimations() {
  const revealElements = document.querySelectorAll(".reveal");
  if (!revealElements.length) return;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    revealElements.forEach((element) => element.classList.add("show"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: "0px 0px -40px 0px"
    }
  );

  revealElements.forEach((element) => observer.observe(element));
}

document.addEventListener("DOMContentLoaded", () => {
  runTypingAnimation();
  initNavigation();
  initRevealAnimations();
});
