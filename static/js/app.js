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
  const visualData = window.formaVisualDirection;
  const services = window.formaServices;
  const servicesList = document.querySelector("#servicesList");
  const atmosphereOptions = document.querySelector("#atmosphereOptions");
  const contrastOptions = document.querySelector("#contrastOptions");
  const materialOptions = document.querySelector("#materialOptions");
  const visualResultButton = document.querySelector("#visualResultButton");
  const visualResetButton = document.querySelector("#visualResetButton");
  const visualResult = document.querySelector("#visualResult");
  const visualResultImage = document.querySelector("#visualResultImage");
  const visualResultTitle = document.querySelector("#visualResultTitle");
  const visualResultDescription = document.querySelector("#visualResultDescription");
  const visualResultAtmospheres = document.querySelector("#visualResultAtmospheres");
  const visualResultMaterials = document.querySelector("#visualResultMaterials");
  const supportedLanguages = ["en", "es", "ru"];
  const languageLabels = { en: "EN", es: "ES", ru: "RU" };
  let currentLanguage = getSavedLanguage();
  let activeProjectId = null;
  let previousScrollPosition = 0;
  let visualState = loadVisualState();

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


  function loadVisualState() {
    try {
      const saved = JSON.parse(localStorage.getItem("formaVisualDirection") || "{}");
      return {
        atmospheres: Array.isArray(saved.atmospheres) ? saved.atmospheres : [],
        contrasts: saved.contrasts && typeof saved.contrasts === "object" ? saved.contrasts : {},
        materials: Array.isArray(saved.materials) ? saved.materials : [],
        resultId: typeof saved.resultId === "string" ? saved.resultId : null
      };
    } catch {
      return { atmospheres: [], contrasts: {}, materials: [], resultId: null };
    }
  }

  function saveVisualState() {
    localStorage.setItem("formaVisualDirection", JSON.stringify(visualState));
  }

  function getVisualLabel(item, language = currentLanguage) {
    return item.labels[language] || item.labels.en;
  }

  function renderVisualBuilder(language) {
    if (!visualData || !atmosphereOptions || !contrastOptions || !materialOptions) return;

    atmosphereOptions.innerHTML = visualData.atmosphereItems.map((item) => {
      const selected = visualState.atmospheres.includes(item.id);
      return `
        <button class="atmosphere-option${selected ? " is-selected" : ""}" type="button" data-atmosphere="${item.id}" aria-pressed="${selected}">
          <span>${getVisualLabel(item, language)}</span><span aria-hidden="true">${selected ? "×" : "+"}</span>
        </button>
      `;
    }).join("");

    contrastOptions.innerHTML = visualData.contrastItems.map((pair) => `
      <div class="contrast-pair">
        ${pair.options.map((option) => {
          const selected = visualState.contrasts[pair.id] === option.id;
          return `
            <button class="contrast-option${selected ? " is-selected" : ""}" type="button" data-contrast-pair="${pair.id}" data-contrast-option="${option.id}" aria-pressed="${selected}">
              <img src="/static/images/${option.image}" alt="${escapeHtml(getVisualLabel(option, language))}" loading="lazy">
              <span>${getVisualLabel(option, language)}</span>
            </button>
          `;
        }).join("")}
      </div>
    `).join("");

    materialOptions.innerHTML = visualData.materialItems.map((item) => {
      const selected = visualState.materials.includes(item.id);
      return `
        <button class="material-option${selected ? " is-selected" : ""}" type="button" data-material="${item.id}" aria-pressed="${selected}">
          <img src="/static/images/${item.image}" alt="${escapeHtml(getVisualLabel(item, language))}" loading="lazy">
          <span>${getVisualLabel(item, language)}</span>
        </button>
      `;
    }).join("");

    if (visualState.resultId) renderVisualResult(language);
  }

  function addScores(target, score) {
    Object.entries(score || {}).forEach(([key, value]) => {
      target[key] = (target[key] || 0) + value;
    });
  }

  function calculateVisualResult() {
    const scores = {};

    visualState.atmospheres.forEach((id) => {
      const item = visualData.atmosphereItems.find((entry) => entry.id === id);
      if (item) addScores(scores, item.score);
    });

    Object.entries(visualState.contrasts).forEach(([pairId, optionId]) => {
      const pair = visualData.contrastItems.find((entry) => entry.id === pairId);
      const option = pair?.options.find((entry) => entry.id === optionId);
      if (option) addScores(scores, option.score);
    });

    visualState.materials.forEach((id) => {
      const item = visualData.materialItems.find((entry) => entry.id === id);
      if (item) addScores(scores, item.score);
    });

    let bestResult = visualData.results[0];
    let bestScore = -1;

    visualData.results.forEach((result) => {
      const score = result.keys.reduce((total, key) => total + (scores[key] || 0), 0);
      if (score > bestScore) {
        bestResult = result;
        bestScore = score;
      }
    });

    return bestResult;
  }

  function renderVisualResult(language) {
    const result = visualData.results.find((item) => item.id === visualState.resultId);
    if (!result || !visualResult) return;

    const atmosphereLabels = visualState.atmospheres
      .map((id) => visualData.atmosphereItems.find((item) => item.id === id))
      .filter(Boolean)
      .map((item) => getVisualLabel(item, language));

    const materialLabels = visualState.materials
      .map((id) => visualData.materialItems.find((item) => item.id === id))
      .filter(Boolean)
      .map((item) => getVisualLabel(item, language));

    visualResultTitle.textContent = result.titles[language] || result.titles.en;
    visualResultDescription.textContent = result.descriptions[language] || result.descriptions.en;
    visualResultAtmospheres.textContent = atmosphereLabels.join(" · ");
    visualResultMaterials.textContent = materialLabels.join(" · ");
    visualResultImage.style.backgroundImage = `url("/static/images/${result.image}")`;
    visualResult.hidden = false;
  }

  function showVisualMessage() {
    const existing = document.querySelector(".visual-builder__message");
    if (existing) existing.remove();

    const message = document.createElement("p");
    message.className = "visual-builder__message";
    message.textContent = getTranslation("visual.chooseMore");
    visualResultButton.parentElement.insertAdjacentElement("beforebegin", message);
  }

  function resetVisualBuilder() {
    visualState = { atmospheres: [], contrasts: {}, materials: [], resultId: null };
    saveVisualState();
    if (visualResult) visualResult.hidden = true;
    document.querySelector(".visual-builder__message")?.remove();
    renderVisualBuilder(currentLanguage);
  }


  function renderServices(language) {
    if (!servicesList || !Array.isArray(services)) return;

    servicesList.innerHTML = services.map((service) => {
      const content = service.translations[language] || service.translations.en;
      const items = content.items.map((item) => `<li>${escapeHtml(item)}</li>`).join("");

      return `
        <article class="service-card" data-service-id="${service.id}">
          <button class="service-card__summary" type="button" data-service-toggle="${service.id}" aria-expanded="false">
            <span class="service-card__number">${service.number}</span>

            <div class="service-card__heading">
              <h3>${escapeHtml(content.title)}</h3>
              <p>${escapeHtml(content.outcome)}</p>
            </div>

            <span class="service-card__action">
              <span data-service-action-label>${getTranslation("services.open", language)}</span>
              <span aria-hidden="true">+</span>
            </span>
          </button>

          <div class="service-card__details" hidden>
            <div class="service-card__image">
              <img src="/static/images/${service.image}" alt="${escapeHtml(content.title)}" loading="lazy">
            </div>

            <div class="service-card__body">
              <p>${escapeHtml(content.description)}</p>

              <div class="service-card__included">
                <p class="eyebrow">${getTranslation("services.included", language)}</p>
                <ul>${items}</ul>
              </div>

              <a class="text-link" href="#brief">${getTranslation("global.primaryCta", language)}</a>
            </div>
          </div>
        </article>
      `;
    }).join("");
  }

  function toggleServiceCard(serviceId) {
    const card = servicesList?.querySelector(`[data-service-id="${serviceId}"]`);
    if (!card) return;

    const summary = card.querySelector("[data-service-toggle]");
    const details = card.querySelector(".service-card__details");
    const label = card.querySelector("[data-service-action-label]");
    const icon = card.querySelector(".service-card__action span:last-child");
    const isOpen = summary.getAttribute("aria-expanded") === "true";

    summary.setAttribute("aria-expanded", String(!isOpen));
    details.hidden = isOpen;
    card.classList.toggle("is-open", !isOpen);
    label.textContent = getTranslation(isOpen ? "services.open" : "services.close");
    icon.textContent = isOpen ? "+" : "−";
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
    renderVisualBuilder(language);
    renderServices(language);

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


  servicesList?.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-service-toggle]");
    if (trigger) toggleServiceCard(trigger.dataset.serviceToggle);
  });

  atmosphereOptions?.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-atmosphere]");
    if (!trigger) return;

    const id = trigger.dataset.atmosphere;
    if (visualState.atmospheres.includes(id)) {
      visualState.atmospheres = visualState.atmospheres.filter((item) => item !== id);
    } else if (visualState.atmospheres.length < 3) {
      visualState.atmospheres.push(id);
    }

    visualState.resultId = null;
    if (visualResult) visualResult.hidden = true;
    saveVisualState();
    renderVisualBuilder(currentLanguage);
  });

  contrastOptions?.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-contrast-option]");
    if (!trigger) return;

    visualState.contrasts[trigger.dataset.contrastPair] = trigger.dataset.contrastOption;
    visualState.resultId = null;
    if (visualResult) visualResult.hidden = true;
    saveVisualState();
    renderVisualBuilder(currentLanguage);
  });

  materialOptions?.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-material]");
    if (!trigger) return;

    const id = trigger.dataset.material;
    if (visualState.materials.includes(id)) {
      visualState.materials = visualState.materials.filter((item) => item !== id);
    } else if (visualState.materials.length < 4) {
      visualState.materials.push(id);
    }

    visualState.resultId = null;
    if (visualResult) visualResult.hidden = true;
    saveVisualState();
    renderVisualBuilder(currentLanguage);
  });

  visualResultButton?.addEventListener("click", () => {
    const hasAtmosphere = visualState.atmospheres.length > 0;
    const hasContrast = Object.keys(visualState.contrasts).length > 0;
    const hasMaterial = visualState.materials.length > 0;

    document.querySelector(".visual-builder__message")?.remove();

    if (!hasAtmosphere || !hasContrast || !hasMaterial) {
      showVisualMessage();
      return;
    }

    const result = calculateVisualResult();
    visualState.resultId = result.id;
    saveVisualState();
    renderVisualResult(currentLanguage);
    visualResult.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  visualResetButton?.addEventListener("click", resetVisualBuilder);

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
