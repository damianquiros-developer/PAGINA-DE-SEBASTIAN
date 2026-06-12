const header = document.querySelector("[data-header]");
const revealItems = document.querySelectorAll(".reveal");
const navLinks = document.querySelectorAll(".main-nav a");
const sections = [...document.querySelectorAll("section[id]")];
const cursor = document.querySelector(".cursor-dot");

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.18, rootMargin: "0px 0px -8% 0px" }
);

revealItems.forEach((item, index) => {
  item.style.transitionDelay = `${Math.min(index % 4, 3) * 70}ms`;
  revealObserver.observe(item);
});

const setHeaderState = () => {
  header.classList.toggle("is-scrolled", window.scrollY > 28);
};

setHeaderState();
window.addEventListener("scroll", setHeaderState, { passive: true });

const activeSectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      navLinks.forEach((link) => {
        const href = link.getAttribute("href");
        link.classList.toggle("is-active", href === `#${entry.target.id}`);
      });
    });
  },
  { threshold: 0.52 }
);

sections.forEach((section) => activeSectionObserver.observe(section));

document.querySelectorAll(".magnetic").forEach((element) => {
  element.addEventListener("mousemove", (event) => {
    const rect = element.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 16;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 16;
    element.style.setProperty("--mx", `${x}px`);
    element.style.setProperty("--my", `${y}px`);
  });

  element.addEventListener("mouseleave", () => {
    element.style.setProperty("--mx", "0px");
    element.style.setProperty("--my", "0px");
  });
});

if (window.matchMedia("(pointer: fine)").matches && cursor) {
  window.addEventListener("mousemove", (event) => {
    cursor.classList.add("is-visible");
    cursor.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0) translate3d(-50%, -50%, 0)`;
  });

  document.querySelectorAll("a, button, .magnetic").forEach((target) => {
    target.addEventListener("mouseenter", () => cursor.classList.add("is-active"));
    target.addEventListener("mouseleave", () => cursor.classList.remove("is-active"));
  });
}

let ticking = false;

const applyScrollDrift = () => {
  const viewport = window.innerHeight;
  document.querySelectorAll(".project-image, .quote-image, .about-image").forEach((element) => {
    const rect = element.getBoundingClientRect();
    const progress = (rect.top - viewport / 2) / viewport;
    const shift = Math.max(-18, Math.min(18, progress * -22));
    element.style.transform = `translate3d(0, ${shift}px, 0)`;
  });
  ticking = false;
};

window.addEventListener(
  "scroll",
  () => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!ticking) {
      window.requestAnimationFrame(applyScrollDrift);
      ticking = true;
    }
  },
  { passive: true }
);

applyScrollDrift();
