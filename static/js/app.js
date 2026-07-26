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
  const supportedLanguages = ["en", "es", "ru"];
  const languageLabels = { en: "EN", es: "ES", ru: "RU" };
  let currentLanguage = getSavedLanguage();

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

  function renderProjects(language) {
    if (!projectsList || !Array.isArray(projects)) return;

    projectsList.innerHTML = projects.map((project) => {
      const content = project.translations[language] || project.translations.en;
      const layout = project.layout ? ` ${project.layout}` : "";

      return `
        <article class="project-card${layout}" data-project-id="${project.id}">
          <div class="project-card__media">
            <img class="project-card__image" src="/static/images/${project.image}" alt="${content.title}" loading="lazy">
            <span class="project-card__number">${project.number}</span>
          </div>
          <div class="project-card__content">
            <div class="project-card__meta">
              <span>${content.location}</span><span>${content.type}</span><span>${content.area}</span>
            </div>
            <h3 class="project-card__title">${content.title}</h3>
            <p class="project-card__description">${content.description}</p>
            <a class="project-card__link" href="#${project.id}" aria-label="${getTranslation("projects.viewProject", language)}: ${content.title}">
              <span>${getTranslation("projects.viewProject", language)}</span><span aria-hidden="true">↗</span>
            </a>
          </div>
        </article>
      `;
    }).join("");
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

  document.addEventListener("click", closeLanguageMenu);
  menuToggle.addEventListener("click", openSiteMenu);
  menuClose.addEventListener("click", closeSiteMenu);
  menuLinks.forEach((link) => link.addEventListener("click", closeSiteMenu));

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeLanguageMenu();
      closeSiteMenu();
    }
  });

  applyLanguage(currentLanguage);
});
