/* ========= Utilities ========= */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

/* ========= Theme ========= */
(function initTheme() {
  const storageKey = "cz_theme";
  const saved = localStorage.getItem(storageKey);

  // Default: system preference if nothing saved
  if (saved === "light" || saved === "dark") {
    document.documentElement.setAttribute("data-theme", saved);
  } else {
    const prefersLight = window.matchMedia?.("(prefers-color-scheme: light)")?.matches;
    document.documentElement.setAttribute("data-theme", prefersLight ? "light" : "dark");
  }

  const btn = $("[data-theme-toggle]");
  if (!btn) return;

  btn.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme") || "dark";
    const next = current === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem(storageKey, next);
  });
})();

/* ========= Mobile Menu ========= */
(function initMenu() {
  const menu = $("[data-menu]");
  const button = $("[data-menu-button]");
  if (!menu || !button) return;

  const close = () => {
    menu.classList.remove("is-open");
    button.setAttribute("aria-expanded", "false");
    button.setAttribute("aria-label", "Open menu");
  };

  const open = () => {
    menu.classList.add("is-open");
    button.setAttribute("aria-expanded", "true");
    button.setAttribute("aria-label", "Close menu");
  };

  button.addEventListener("click", () => {
    const isOpen = menu.classList.contains("is-open");
    isOpen ? close() : open();
  });

  // Close after clicking a nav link (mobile)
  $$("a", menu).forEach((a) => a.addEventListener("click", close));

  // Close on Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });
})();

/* ========= Footer Year ========= */
(function setYear() {
  const el = $("[data-year]");
  if (el) el.textContent = String(new Date().getFullYear());
})();

/* ========= Project Filter ========= */
(function initProjectFilter() {
  const buttons = $$("[data-filter]");
  const projectsWrap = $("[data-projects]");
  if (!buttons.length || !projectsWrap) return;

  const cards = $$(".project", projectsWrap);

  const setActiveBtn = (active) => {
    buttons.forEach((b) => {
      const isActive = b === active;
      b.classList.toggle("is-active", isActive);
      b.setAttribute("aria-selected", isActive ? "true" : "false");
    });
  };

  const applyFilter = (tag) => {
    cards.forEach((card) => {
      const tags = (card.getAttribute("data-tags") || "").split(/\s+/).filter(Boolean);
      const show = tag === "all" ? true : tags.includes(tag);
      card.style.display = show ? "" : "none";
    });
  };

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const tag = btn.getAttribute("data-filter") || "all";
      setActiveBtn(btn);
      applyFilter(tag);
    });
  });

  applyFilter("all");
})();

/* ========= Copy Template ========= */
(function initCopySnippet() {
  const copyBtn = $("[data-copy-snippet]");
  const status = $("[data-copy-status]");
  const snippet = $(".snippet");
  if (!copyBtn || !snippet) return;

  copyBtn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(snippet.textContent.trim());
      if (status) status.textContent = "Copied to clipboard.";
      copyBtn.blur();
      setTimeout(() => { if (status) status.textContent = ""; }, 2500);
    } catch {
      if (status) status.textContent = "Copy failed. Select the text and copy manually.";
    }
  });
})();
