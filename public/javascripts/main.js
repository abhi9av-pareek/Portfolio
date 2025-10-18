// Mobile Navigation Toggle
const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");

hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("active");
  navMenu.classList.toggle("active");
});

document.addEventListener("DOMContentLoaded", () => {
  // Find the heading container
  const headingContainer = document.querySelector(".heading-container");

  // Wait for 1000 milliseconds (1 second)
  setTimeout(() => {
    // Add the class to trigger the CSS transition
    headingContainer.classList.add("show-intro");
  }, 1000);
});

// Close mobile menu when clicking on a link
document.querySelectorAll(".nav-link").forEach((n) =>
  n.addEventListener("click", () => {
    hamburger.classList.remove("active");
    navMenu.classList.remove("active");
  })
);

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});

// Add active class to navigation links based on scroll position
window.addEventListener("scroll", () => {
  let current = "";
  const sections = document.querySelectorAll("section");

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (scrollY >= sectionTop - 200) {
      current = section.getAttribute("id");
    }
  });

  document.querySelectorAll(".nav-link").forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("active");
    }
  });
});

// Add scroll effect to navbar: subtle shadow + hide/show on scroll direction
(function () {
  const navbar = document.querySelector(".navbar");
  if (!navbar) return;
  let lastScrollY = window.scrollY;
  let hideTimeoutId = null;

  function scheduleHide() {
    clearTimeout(hideTimeoutId);
    hideTimeoutId = setTimeout(() => {
      navbar.classList.add("nav-hidden");
    }, 2200); // hide after ~2.2s of downward scrolling
  }

  function showNow() {
    clearTimeout(hideTimeoutId);
    navbar.classList.remove("nav-hidden");
  }

  window.addEventListener(
    "scroll",
    () => {
      const currentY = window.scrollY;

      // subtle shadow update
      navbar.style.boxShadow =
        currentY > 100
          ? "0 2px 20px rgba(0, 0, 0, 0.15)"
          : "0 2px 20px rgba(0, 0, 0, 0.1)";

      // direction-aware hide/show
      if (currentY > lastScrollY && currentY > 150) {
        scheduleHide();
      } else {
        showNow();
      }
      lastScrollY = currentY;
    },
    { passive: true }
  );
})();

// Animate elements on scroll
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1";
      entry.target.style.transform = "translateY(0)";
    }
  });
}, observerOptions);

// Observe elements for animation
document.addEventListener("DOMContentLoaded", () => {
  const animateElements = document.querySelectorAll(
    ".project-card, .skill-category, .stat"
  );
  animateElements.forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(30px)";
    el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    observer.observe(el);
  });
});

// Contact form handling
document.addEventListener("DOMContentLoaded", () => {
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      // Get form data
      const formData = {
        name: contactForm.querySelector('input[name="name"]').value,
        email: contactForm.querySelector('input[name="email"]').value,
        subject: contactForm.querySelector('input[name="subject"]').value,
        message: contactForm.querySelector('textarea[name="message"]').value,
      };

      // Simple validation
      if (
        !formData.name ||
        !formData.email ||
        !formData.subject ||
        !formData.message
      ) {
        showAppAlert("Please fill in all fields.", { type: "error" });
        return;
      }

      // Update button state
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = "Sending...";
      submitBtn.disabled = true;

      try {
        // Send data to server
        const response = await fetch("/contact", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (data.success) {
          showAppAlert(
            "Thank you for believing in me. I'll get back to you soon.",
            { type: "success" }
          );
          contactForm.reset();
        } else {
          showAppAlert("Error sending message. Please try again.", {
            type: "error",
          });
        }
      } catch (error) {
        console.error("Error:", error);
        showAppAlert("Error sending message. Please try again.", {
          type: "error",
        });
      } finally {
        // Reset button state
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }
    });
  }
});

// Custom App Alert
function showAppAlert(message, options = {}) {
  const { type = "success" } = options;
  const wrapper = document.getElementById("app-alert");
  const messageEl = wrapper.querySelector(".app-alert-message");
  messageEl.textContent = message || "";

  wrapper.classList.remove("app-alert-success", "app-alert-error");
  wrapper.classList.add(
    type === "error" ? "app-alert-error" : "app-alert-success"
  );
  wrapper.classList.add("show");
  wrapper.setAttribute("aria-hidden", "false");

  const close = (ev) => {
    const target = ev.target;
    if (target.matches("[data-close-alert]") || target === wrapper) {
      wrapper.classList.remove("show");
      wrapper.setAttribute("aria-hidden", "true");
      wrapper.removeEventListener("click", close);
      document.removeEventListener("keydown", onEsc);
    }
  };

  const onEsc = (ev) => {
    if (ev.key === "Escape") {
      wrapper.classList.remove("show");
      wrapper.setAttribute("aria-hidden", "true");
      wrapper.removeEventListener("click", close);
      document.removeEventListener("keydown", onEsc);
    }
  };

  wrapper.addEventListener("click", close);
  document.addEventListener("keydown", onEsc);
}

// Dynamic slideshow functionality
document.addEventListener("DOMContentLoaded", () => {
  const slides = document.querySelectorAll(".slide");
  let currentSlide = 0;

  // Function to show a specific slide with dynamic animation
  function showSlide(slideIndex) {
    // Hide all slides first
    slides.forEach((slide) => {
      slide.classList.remove("active");
      slide.style.opacity = "0";
      slide.style.transform = "translateY(30px) scale(0.9)";
    });

    // Show current slide with dynamic effect
    if (slides[slideIndex]) {
      const currentSlideElement = slides[slideIndex];

      // Add typing effect for text
      const text =
        currentSlideElement.textContent || currentSlideElement.innerText;
      currentSlideElement.textContent = "";
      currentSlideElement.classList.add("active");
      currentSlideElement.style.opacity = "1";
      currentSlideElement.style.transform = "translateY(0) scale(1)";

      // Type out the text character by character
      let i = 0;
      function typeText() {
        if (i < text.length) {
          currentSlideElement.textContent += text.charAt(i);
          i++;
          setTimeout(typeText, 50); // Fast typing speed
        }
      }

      // Start typing after a brief delay
      setTimeout(typeText, 500);
    }
  }

  // Function to go to next slide (stop at last slide)
  function nextSlide() {
    if (currentSlide < slides.length - 1) {
      currentSlide += 1;
      showSlide(currentSlide);
    } else {
      // Stop the slideshow at the last slide ("Abhinav")
      clearInterval(slideshowIntervalId);
    }
  }

  // Initialize slideshow - start with first slide
  showSlide(0);

  // Start the slideshow with the configured interval
  const slideshowIntervalId = setInterval(nextSlide, 2000);
});

// Add parallax effect to hero section
window.addEventListener("scroll", () => {
  const scrolled = window.pageYOffset;
  const hero = document.querySelector(".hero");
  if (hero) {
    const rate = scrolled * -0.5;
    hero.style.transform = `translateY(${rate}px)`;
  }
});

// Add hover effects to project cards
document.querySelectorAll(".project-card").forEach((card) => {
  card.addEventListener("mouseenter", () => {
    card.style.transform = "translateY(-10px) scale(1.02)";
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "translateY(0) scale(1)";
  });
});

// Add click effects to buttons (exclude hero buttons to avoid expansion)
document.querySelectorAll(".btn:not(.no-ripple)").forEach((btn) => {
  btn.addEventListener("click", function (e) {
    const ripple = document.createElement("span");
    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    ripple.style.width = ripple.style.height = size + "px";
    ripple.style.left = x + "px";
    ripple.style.top = y + "px";
    ripple.classList.add("ripple");

    this.appendChild(ripple);

    setTimeout(() => {
      ripple.remove();
    }, 600);
  });
});

// Add CSS for ripple effect
const style = document.createElement("style");
style.textContent = `
    .btn { position: relative; overflow: hidden; }
    .ripple { position: absolute; border-radius: 50%; background: rgba(255,255,255,.3); transform: scale(0); animation: ripple-animation .6s linear; pointer-events: none; }
    @keyframes ripple-animation { to { transform: scale(4); opacity: 0; } }
    .nav-link.active { color: #2563eb; }
    .nav-link.active::after { width: 100%; }
`;
document.head.appendChild(style);
// cursor logic
document.addEventListener("mousemove", (e) => {
  const trail = document.createElement("div");
  trail.classList.add("trail");
  trail.style.left = e.clientX + "px";
  trail.style.top = e.clientY + "px";
  document.body.appendChild(trail);

  setTimeout(() => {
    trail.remove();
  }, 5000);
});
// Vanta Birds: run only on homepage (hero in view)
(function () {
  let birdsEffect = null;
  const heroEl = document.getElementById("vanta-birds");
  function initBirds() {
    if (!window.VANTA || !heroEl || birdsEffect) return;
    birdsEffect = VANTA.BIRDS({
      el: heroEl,
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: 200.0,
      minWidth: 200.0,
      scale: 1.0,
      scaleMobile: 1.0,
      backgroundColor: 0x0d1117, // dark theme background
      color1: 0x58a6ff, // soft blue
      color2: 0x1f6feb, // deep blue
      birdSize: 1.0,
      wingSpan: 30.0,
      speedLimit: 5.0,
      separation: 20.0,
      alignment: 20.0,
      cohesion: 20.0,
      quantity: 3.5,
    });
  }
  function destroyBirds() {
    if (birdsEffect && typeof birdsEffect.destroy === "function") {
      birdsEffect.destroy();
    }
    birdsEffect = null;
  }

  function toggleBirdsByScroll() {
    const viewportH = window.innerHeight || 800;
    const threshold = viewportH * 0.8;
    if (window.scrollY <= threshold) {
      initBirds();
    } else {
      destroyBirds();
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    toggleBirdsByScroll();
  });
  window.addEventListener("scroll", toggleBirdsByScroll, { passive: true });
})();
// Logo click-to-top and setup after DOM ready
document.addEventListener("DOMContentLoaded", function () {
  const logo = document.querySelector(".nav-logo h2");
  if (logo) {
    logo.addEventListener("click", (e) => {
      e.preventDefault();
      // subtle click animation
      logo.style.transition = "transform 180ms ease, filter 180ms ease";
      logo.style.transform = "scale(0.97)";
      logo.style.filter = "brightness(1.2)";
      setTimeout(() => {
        logo.style.transform = "scale(1)";
        logo.style.filter = "none";
      }, 180);
      const home = document.getElementById("home");
      if (home) {
        home.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
  }
});
