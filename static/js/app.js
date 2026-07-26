"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const translations = window.formaTranslations;
  const projects = window.formaProjects;
  const languageToggle = document.querySelector("#languageToggle");
  const languageMenu = document.querySelector("#languageMenu");
  const currentLanguageLabel = document.querySelector("#currentLanguage");
  const languageOptions = document.querySelectorAll("[data-language]");
  const menuToggle = document.querySelector("#menuToggle");
  const menuClose = document.querySelector("#menuClose");
  const siteMenu = document.querySelector("#siteMenu");
  const menuLinks = document.querySelectorAll("[data-menu-link]");
  const projectsList = document.querySelector("#projectsList");
  const projectDetail = document.querySelector("#projectDetail");
  const projectDetailContent = document.querySelector("#projectDetailContent");
  const projectDetailBack = document.querySelector("#projectDetailBack");
  const supportedLanguages = ["en", "es", "ru"];
  const languageLabels = { en: "EN", es: "ES", ru: "RU" };
  let currentLanguage = getSavedLanguage();
  let activeProjectId = null;
  let previousScrollPosition = 0;

  function getSavedLanguage() {
    const saved = localStorage.getItem("formaLanguage");
    return supportedLanguages.includes(saved) ? saved : "en";
  }

  function getNestedValue(object, path) {
    return path.split(".").reduce((value, key) => {
      if (value && Object.prototype.hasOwnProperty.call(value, key)) return value[key];
      return null;
    }, object);
  }

  function getTranslation(path, language = currentLanguage) {
    const value = getNestedValue(translations[language], path);
    return typeof value === "string" ? value : "";
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function renderProjects(language) {
    if (!projectsList || !Array.isArray(projects)) return;

    projectsList.innerHTML = projects.map((project) => {
      const content = project.translations[language] || project.translations.en;
      const layout = project.layout ? ` ${project.layout}` : "";

      return `
        <article class="project-card${layout}" data-project-id="${project.id}">
          <button class="project-card__open" type="button" data-open-project="${project.id}">
            <div class="project-card__media">
              <img class="project-card__image" src="/static/images/${project.image}" alt="${escapeHtml(content.title)}" loading="lazy">
              <span class="project-card__number">${project.number}</span>
            </div>
          </button>
          <div class="project-card__content">
            <div class="project-card__meta">
              <span>${escapeHtml(content.location)}</span><span>${escapeHtml(content.type)}</span><span>${escapeHtml(content.area)}</span>
            </div>
            <h3 class="project-card__title">${escapeHtml(content.title)}</h3>
            <p class="project-card__description">${escapeHtml(content.description)}</p>
            <button class="project-card__link" type="button" data-open-project="${project.id}">
              <span>${getTranslation("projects.viewProject", language)}</span><span aria-hidden="true">↗</span>
            </button>
          </div>
        </article>
      `;
    }).join("");
  }

  function renderProjectDetail(project, language) {
    const content = project.translations[language] || project.translations.en;
    const focusItems = content.focus.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
    const gallery = project.images.map((image, index) => `
      <figure class="project-detail__image project-detail__image--${index + 1}">
        <img src="/static/images/${image}" alt="${escapeHtml(content.title)} ${index + 1}" loading="${index === 0 ? "eager" : "lazy"}">
      </figure>
    `).join("");

    projectDetailContent.innerHTML = `
      <header class="project-detail__hero">
        <div class="project-detail__meta">
          <span>${escapeHtml(project.number)}</span>
          <span>${escapeHtml(content.location)}</span>
          <span>${escapeHtml(content.type)}</span>
          <span>${escapeHtml(content.area)}</span>
        </div>

        <h1>${escapeHtml(content.title)}</h1>
        <p>${escapeHtml(content.description)}</p>
      </header>

      <div class="project-detail__gallery">
        ${gallery}
      </div>

      <div class="project-detail__story">
        <p class="project-detail__intro">${escapeHtml(content.introduction)}</p>

        <div class="project-detail__focus">
          <p class="eyebrow">${getTranslation("projects.focus", language)}</p>
          <ul>${focusItems}</ul>
        </div>
      </div>

      <div class="project-detail__cta">
        <p>${getTranslation("projects.similar", language)}</p>
        <a class="button button--primary" href="#brief" id="projectDetailCta">
          <span>${getTranslation("global.primaryCta", language)}</span>
          <span aria-hidden="true">→</span>
        </a>
      </div>
    `;
  }

  function openProjectDetail(projectId) {
    const project = projects.find((item) => item.id === projectId);
    if (!project) return;

    activeProjectId = projectId;
    previousScrollPosition = window.scrollY;
    renderProjectDetail(project, currentLanguage);
    projectDetail.classList.add("is-open");
    projectDetail.setAttribute("aria-hidden", "false");
    document.body.classList.add("detail-open");
    projectDetail.scrollTop = 0;
    history.replaceState(null, "", `#project-${projectId}`);

    const cta = document.querySelector("#projectDetailCta");
    if (cta) {
      cta.addEventListener("click", closeProjectDetail);
    }
  }

  function closeProjectDetail() {
    projectDetail.classList.remove("is-open");
    projectDetail.setAttribute("aria-hidden", "true");
    document.body.classList.remove("detail-open");
    activeProjectId = null;
    history.replaceState(null, "", "#projects");
    window.setTimeout(() => window.scrollTo(0, previousScrollPosition), 0);
  }

  function applyLanguage(language) {
    if (!supportedLanguages.includes(language)) language = "en";
    currentLanguage = language;
    const dictionary = translations[language];
    document.documentElement.lang = language;
    currentLanguageLabel.textContent = languageLabels[language];

    document.querySelectorAll("[data-i18n]").forEach((element) => {
      const value = getNestedValue(dictionary, element.dataset.i18n);
      if (typeof value === "string") element.textContent = value;
    });

    languageOptions.forEach((option) => {
      const active = option.dataset.language === language;
      option.classList.toggle("is-active", active);
      option.setAttribute("aria-pressed", String(active));
    });

    renderProjects(language);

    if (activeProjectId) {
      const activeProject = projects.find((item) => item.id === activeProjectId);
      if (activeProject) renderProjectDetail(activeProject, language);
    }

    localStorage.setItem("formaLanguage", language);
  }

  function closeLanguageMenu() {
    languageMenu.hidden = true;
    languageToggle.setAttribute("aria-expanded", "false");
  }

  function toggleLanguageMenu() {
    const open = languageToggle.getAttribute("aria-expanded") === "true";
    languageMenu.hidden = open;
    languageToggle.setAttribute("aria-expanded", String(!open));
  }

  function openSiteMenu() {
    siteMenu.classList.add("is-open");
    siteMenu.setAttribute("aria-hidden", "false");
    menuToggle.setAttribute("aria-expanded", "true");
    document.body.classList.add("menu-open");
    window.setTimeout(() => menuClose.focus(), 100);
  }

  function closeSiteMenu() {
    siteMenu.classList.remove("is-open");
    siteMenu.setAttribute("aria-hidden", "true");
    menuToggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("menu-open");
  }

  languageToggle.addEventListener("click", (event) => {
    event.stopPropagation();
    toggleLanguageMenu();
  });

  languageMenu.addEventListener("click", (event) => event.stopPropagation());

  languageOptions.forEach((option) => {
    option.addEventListener("click", () => {
      applyLanguage(option.dataset.language);
      closeLanguageMenu();
    });
  });

  projectsList.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-open-project]");
    if (trigger) openProjectDetail(trigger.dataset.openProject);
  });

  projectDetailBack.addEventListener("click", closeProjectDetail);
  document.addEventListener("click", closeLanguageMenu);
  menuToggle.addEventListener("click", openSiteMenu);
  menuClose.addEventListener("click", closeSiteMenu);
  menuLinks.forEach((link) => link.addEventListener("click", closeSiteMenu));

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeLanguageMenu();
      closeSiteMenu();
      if (activeProjectId) closeProjectDetail();
    }
  });

  applyLanguage(currentLanguage);

  const requestedProject = window.location.hash.startsWith("#project-")
    ? window.location.hash.replace("#project-", "")
    : null;

  if (requestedProject) openProjectDetail(requestedProject);
});
