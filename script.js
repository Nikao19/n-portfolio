const intro = document.getElementById("intro");
const introStorageKey = "nicolas-portfolio-intro-seen";
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const finishIntro = () => {
  if (!intro) return;

  intro.classList.add("is-hidden");
  window.setTimeout(() => intro.remove(), 650);
};

if (intro) {
  let hasSeenIntro = false;

  try {
    hasSeenIntro = sessionStorage.getItem(introStorageKey) === "true";
    sessionStorage.setItem(introStorageKey, "true");
  } catch (error) {
    console.warn("Não foi possível registrar a intro nesta sessão.", error);
  }

  if (hasSeenIntro || prefersReducedMotion) {
    finishIntro();
  } else {
    window.setTimeout(finishIntro, 4500);
  }

}

// Spotlight que segue o mouse
const spotlight = document.getElementById("spotlight");
window.addEventListener("mousemove", (e) => {
  spotlight.style.setProperty("--x", e.clientX + "px");
  spotlight.style.setProperty("--y", e.clientY + "px");
});

const aboutCopy = document.querySelector(".about-copy");
let typeTimer;

// Efeito de digitação do "Sobre" (reinicia a cada troca de idioma)
const startTyping = (text) => {
  if (!aboutCopy) return;
  clearTimeout(typeTimer);
  if (prefersReducedMotion) {
    aboutCopy.textContent = text;
    return;
  }
  aboutCopy.textContent = "";
  let index = 0;
  const typeText = () => {
    if (index < text.length) {
      aboutCopy.textContent += text.charAt(index);
      index += 1;
      typeTimer = setTimeout(typeText, 18);
    }
  };
  typeTimer = setTimeout(typeText, 250);
};

// Idioma (PT / EN)
const langKey = "nicolas-portfolio-lang";
const langButtons = document.querySelectorAll("[data-lang]");

const applyLang = (lang, retype = true) => {
  const dict = translations[lang] || translations.pt;
  document.documentElement.lang = lang === "en" ? "en" : "pt-BR";
  document.title = dict["meta.title"];
  document.querySelector('meta[name="description"]')?.setAttribute("content", dict["meta.desc"]);
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    if (dict[el.dataset.i18n] !== undefined) el.textContent = dict[el.dataset.i18n];
  });
  document.querySelectorAll("[data-i18n-aria]").forEach((el) => {
    el.setAttribute("aria-label", dict[el.dataset.i18nAria]);
  });
  langButtons.forEach((btn) => btn.setAttribute("aria-pressed", String(btn.dataset.lang === lang)));
  if (retype) startTyping(dict["about.text"]);
};

langButtons.forEach((btn) =>
  btn.addEventListener("click", () => {
    try {
      localStorage.setItem(langKey, btn.dataset.lang);
    } catch (error) {
      console.warn("Não foi possível salvar o idioma.", error);
    }
    applyLang(btn.dataset.lang);
  })
);

let savedLang = "pt";
try {
  savedLang = localStorage.getItem(langKey) || (navigator.language.startsWith("pt") ? "pt" : "en");
} catch (error) {
  savedLang = navigator.language.startsWith("pt") ? "pt" : "en";
}
applyLang(savedLang);

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
