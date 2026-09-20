// Spotlight que segue o mouse
const spotlight = document.getElementById("spotlight");
window.addEventListener("mousemove", (e) => {
  spotlight.style.setProperty("--x", e.clientX + "px");
  spotlight.style.setProperty("--y", e.clientY + "px");
});

const aboutCopy = document.querySelector(".about-copy");
if (aboutCopy) {
  const text = aboutCopy.dataset.text || aboutCopy.textContent.trim();
  aboutCopy.textContent = "";
  let index = 0;

  const typeText = () => {
    if (index < text.length) {
      aboutCopy.textContent += text.charAt(index);
      index += 1;
      setTimeout(typeText, 18);
    }
  };

  aboutCopy.style.display = "inline-block";
  aboutCopy.style.overflow = "hidden";
  setTimeout(typeText, 250);
}

// Marca no menu a seção que está na tela
const sections = document.querySelectorAll(".section");
const links = document.querySelectorAll(".nav-link");

const setActiveLink = (id) => {
  links.forEach((link) => {
    const isActive = link.getAttribute("href") === `#${id}`;
    link.classList.toggle("active", isActive);
  });
};

links.forEach((link) => {
  link.addEventListener("click", () => {
    const targetId = link.getAttribute("href")?.replace("#", "");
    if (targetId) setActiveLink(targetId);
  });
});

const observer = new IntersectionObserver(
  (entries) => {
    const visibleEntry = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (visibleEntry) {
      setActiveLink(visibleEntry.target.id);
    }
  },
  { rootMargin: "-20% 0px -45% 0px", threshold: [0.2, 0.5, 0.8] }
);

sections.forEach((section) => observer.observe(section));
