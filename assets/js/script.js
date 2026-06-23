"use strict";

/* ---- 1. FALLING PETALS ---- */
(function initPetals() {
  const container = document.getElementById("petal-container");
  if (!container) return;

  const colors = ["#ffd8e7", "#E9D5FF", "#FCE7F3", "#ffffff", "#ffeef6"];

  function createPetal() {
    const petal = document.createElement("div");
    petal.classList.add("floating-petal");

    const size = Math.random() * 10 + 5;
    const left = Math.random() * 100;
    const duration = Math.random() * 10 + 10;
    const delay = Math.random() * 5;
    const color = colors[Math.floor(Math.random() * colors.length)];

    petal.style.cssText = `
      width:${size}px;
      height:${size}px;
      background-color:${color};
      left:${left}vw;
      animation-duration:${duration}s;
      animation-delay:${delay}s;
    `;

    container.appendChild(petal);

    setTimeout(() => petal.remove(), (duration + delay) * 1000);
  }

  // Create initial burst
  for (let i = 0; i < 15; i++) createPetal();

  // Ongoing trickle
  setInterval(createPetal, 1500);
})();

/* ---- 2. LIVE COUNTDOWN ---- */
(function initCountdown() {
  const weddingDate = new Date("2025-12-12T15:00:00");

  const cdDays = document.getElementById("cd-days");
  const cdHours = document.getElementById("cd-hours");
  const cdMins = document.getElementById("cd-mins");
  const cdSecs = document.getElementById("cd-secs");

  if (!cdDays) return;

  function pad(n) {
    return String(n).padStart(2, "0");
  }

  function tick() {
    const now = new Date();
    const diff = weddingDate - now;

    if (diff <= 0) {
      cdDays.textContent =
        cdHours.textContent =
        cdMins.textContent =
        cdSecs.textContent =
          "00";
      return;
    }

    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    const secs = Math.floor((diff % 60000) / 1000);

    cdDays.textContent = pad(days);
    cdHours.textContent = pad(hours);
    cdMins.textContent = pad(mins);
    cdSecs.textContent = pad(secs);
  }

  tick();
  setInterval(tick, 1000);
})();

/* ---- 3. SCROLL-TRIGGERED PARALLAX (subtle) ---- */
(function initParallax() {
  // Only on non-reduced-motion devices
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const arches = document.querySelectorAll(
    ".hero-arch img, .arch-portrait img",
  );

  window.addEventListener(
    "scroll",
    () => {
      const scrollY = window.scrollY;
      arches.forEach((img) => {
        const rect = img.closest('[class*="arch"]').getBoundingClientRect();
        const offset = scrollY + rect.top - scrollY;
        img.style.transform = `translateY(${(scrollY - offset) * 0.05}px)`;
      });
    },
    { passive: true },
  );
})();

/* ---- 4. NAVBAR SHRINK ON SCROLL ---- */
(function initNavScroll() {
  const nav = document.getElementById("mainNav");
  if (!nav) return;

  window.addEventListener(
    "scroll",
    () => {
      if (window.scrollY > 50) {
        nav.classList.add("scrolled");
      } else {
        nav.classList.remove("scrolled");
      }
    },
    { passive: true },
  );
})();

/* ---- 5. ACTIVE NAV LINK ON SCROLL (Intersection Observer) ---- */
(function initActiveNav() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".navbar-nav .nav-link");

  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navLinks.forEach((link) => {
            link.classList.remove("nav-active");
            if (link.getAttribute("href") === "#" + entry.target.id) {
              link.classList.add("nav-active");
            }
          });
        }
      });
    },
    { rootMargin: "-40% 0px -55% 0px" },
  );

  sections.forEach((s) => observer.observe(s));
})();

/* ---- 6. SCROLL FADE-IN ANIMATION ---- */
(function initFadeIn() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  // Inject keyframe + utility class once
  const style = document.createElement("style");
  style.textContent = `
    .fade-in-up {
      opacity: 0;
      transform: translateY(28px);
      transition: opacity 0.6s ease, transform 0.6s ease;
    }
    .fade-in-up.visible {
      opacity: 1;
      transform: translateY(0);
    }
  `;
  document.head.appendChild(style);

  // Target elements
  const targets = document.querySelectorAll(
    ".countdown-circle, .arch-portrait, .story-photo, " +
      ".gallery-arch, .gallery-circle, .registry-card, " +
      ".blessing-card, .program-item, .party-card, " +
      ".venue-main-img, .venue-sm-img",
  );

  targets.forEach((el) => el.classList.add("fade-in-up"));

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 },
  );

  targets.forEach((el) => io.observe(el));
})();

/* ---- 7. RSVP FORM SUBMISSION ---- */
(function initRsvpForm() {
  const form = document.getElementById("rsvpForm");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const nameInput = form.querySelector('input[type="text"]');
    const emailInput = form.querySelector('input[type="email"]');
    const attending = form.querySelector('input[name="attending"]:checked');

    if (!nameInput.value.trim() || !emailInput.value.trim()) {
      showToast("Please fill in your name and email.", "warning");
      return;
    }
    if (!attending) {
      showToast("Please let us know if you're attending.", "warning");
      return;
    }

    const msg =
      attending.value === "yes"
        ? `🎉 Thank you, ${nameInput.value.split(" ")[0]}! We can't wait to celebrate with you.`
        : `We'll miss you, ${nameInput.value.split(" ")[0]}. Thank you for letting us know.`;

    showToast(msg, "success");

    form.reset();

    setTimeout(() => {
      window.location.href = "pages/common/404.html";
    }, 2000);
  });
})();

/* ---- 8. WISH FORM SUBMISSION ---- */
(function initWishForm() {
  const wishBtn = document.querySelector(
    ".wish-textarea + button, .leave-wish-card button",
  );
  const wishArea = document.querySelector(".wish-textarea");

  if (!wishBtn || !wishArea) return;

  wishBtn.addEventListener("click", () => {
    if (!wishArea.value.trim()) {
      showToast("Please write your wish before sending!", "warning");
      return;
    }

    showToast("💌 Your wish has been sent to the happy couple!", "success");

    setTimeout(() => {
      window.location.href = "pages/common/404.html";
    }, 1000);
  });
})();

/* ---- 9. FOOTER EMAIL SUBSCRIBE ---- */
(function initFooterSubscribe() {
  const form = document.querySelector(".footer-subscribe-form");
  const footerEmail = document.querySelector(".footer-email");

  if (!form || !footerEmail) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    showToast(
      "✨ You're subscribed! Expect some beautiful inspiration.",
      "success",
    );

    footerEmail.value = "";

    setTimeout(() => {
      window.location.href = "pages/common/404.html";
    }, 1000);
  });
})();

/* ---- 10 UTILITY: Toast Notification ---- */
function showToast(message, type = "success") {
  // Remove existing toast
  const existing = document.getElementById("aura-toast");
  if (existing) existing.remove();

  const colors = {
    success: { bg: "#7a5365", text: "#fff" },
    warning: { bg: "#B59410", text: "#fff" },
  };
  const c = colors[type] || colors.success;

  const toast = document.createElement("div");
  toast.id = "aura-toast";
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    bottom: 24px;
    left: 50%;
    transform: translateX(-50%) translateY(60px);
    background: ${c.bg};
    color: ${c.text};
    padding: 14px 28px;
    border-radius: 9999px;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 0.9375rem;
    box-shadow: 0 8px 32px rgba(0,0,0,0.18);
    z-index: 9999;
    max-width: 90vw;
    text-align: center;
    transition: transform 0.35s cubic-bezier(0.34,1.56,0.64,1), opacity 0.35s ease;
    opacity: 0;
  `;

  document.body.appendChild(toast);

  // Animate in
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      toast.style.transform = "translateX(-50%) translateY(0)";
      toast.style.opacity = "1";
    });
  });

  // Animate out
  setTimeout(() => {
    toast.style.transform = "translateX(-50%) translateY(60px)";
    toast.style.opacity = "0";
    setTimeout(() => toast.remove(), 400);
  }, 3500);
}

/* ---- 11 SCROLL TO TOP ---- */
document.addEventListener("click", function (e) {
  const btn = e.target.closest("#scrollTopBtn");

  if (!btn) return;

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});

window.addEventListener("scroll", () => {
  const btn = document.getElementById("scrollTopBtn");

  if (!btn) return;

  if (window.scrollY > 300) {
    btn.classList.add("show");
  } else {
    btn.classList.remove("show");
  }
});

/* ---- 12 custom cursor ---- */
const cursor = document.querySelector(".custom-cursor");

document.addEventListener("mousemove", (e) => {
  cursor.style.left = e.clientX + "px";
  cursor.style.top = e.clientY + "px";
});

document.querySelectorAll("a, button").forEach((el) => {
  el.addEventListener("mouseenter", () => {
    cursor.style.width = "45px";
    cursor.style.height = "45px";
  });

  el.addEventListener("mouseleave", () => {
    cursor.style.width = "28px";
    cursor.style.height = "28px";
  });
});

/* ---- 13 LIVE DATE & TIME ---- */
(function initCountdown() {
  const targetDate = new Date("2026-12-12T16:00:00");

  const daysEl = document.getElementById("cd-days");
  const hoursEl = document.getElementById("cd-hours");
  const minsEl = document.getElementById("cd-mins");
  const secsEl = document.getElementById("cd-secs");

  if (!daysEl) return;

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = targetDate.getTime() - now;

    if (distance <= 0) {
      daysEl.textContent = "00";
      hoursEl.textContent = "00";
      minsEl.textContent = "00";
      secsEl.textContent = "00";
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
    );
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    daysEl.textContent = String(days).padStart(2, "0");
    hoursEl.textContent = String(hours).padStart(2, "0");
    minsEl.textContent = String(minutes).padStart(2, "0");
    secsEl.textContent = String(seconds).padStart(2, "0");
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);
})();

/* ---- REDIRECT EMPTY OR BROKEN LINKS ---- */
document.addEventListener("click", function (e) {
  const link = e.target.closest("a");

  if (!link) return;

  const href = link.getAttribute("href");

  if (
    !href ||
    href.trim() === "" ||
    href === "#" ||
    href.startsWith("javascript:")
  ) {
    e.preventDefault();

    const isInsidePages = window.location.pathname.includes("/pages/");

    window.location.href = isInsidePages
      ? "common/404.html"
      : "pages/common/404.html";
  }
});

/* ---- 15 Pre Loader ---- */
window.addEventListener("load", () => {
  setTimeout(() => {
    document.getElementById("preloader").classList.add("hide");
  }, 2000);
});

/* ---- 16. REVEAL ANIMATIONS (inner pages) ---- */
(function initReveal() {
  const reveals = document.querySelectorAll(".reveal");
  if (!reveals.length) return;

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 },
  );

  reveals.forEach((el) => io.observe(el));
})();
