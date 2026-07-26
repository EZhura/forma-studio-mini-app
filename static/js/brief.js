"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const app = document.querySelector("#briefApp");
  const stepRoot = document.querySelector("#briefStep");
  const backButton = document.querySelector("#briefBack");
  const nextButton = document.querySelector("#briefNext");
  const nextText = document.querySelector("#briefNextText");
  const progressText = document.querySelector("#briefProgressText");
  const progressFill = document.querySelector("#briefProgressFill");
  const error = document.querySelector("#briefError");
  const languageLabel = document.querySelector("#currentLanguage");

  if (!app || !stepRoot || !backButton || !nextButton) return;

  const STORAGE_KEY = "formaProjectBrief";

  const copy = {
    en: {
      eyebrow: "07 / Project Brief",
      title: "Build your project brief",
      intro: "Answer a few focused questions so we can understand your space, priorities and project stage.",
      progress: "Progress",
      back: "Back",
      continue: "Continue",
      finish: "Save brief",
      optional: "Optional",
      required: "Please answer the required questions before continuing.",
      saved: "Your brief has been saved. The recommendation will be added in the next section.",
      selectUpToThree: "Select up to three",
      selectAtLeastOne: "Select at least one",
      steps: [
        ["Your Space", "Tell us what kind of property or space you are planning."],
        ["Project Stage", "Help us understand what has already been decided."],
        ["Priorities", "Choose the outcomes that matter most to you."],
        ["Budget & Timing", "Provisional information is enough at this stage."],
        ["Visual Direction", "Add your saved direction or share an inspiration link."]
      ],
      questions: {
        projectType: "What type of space is this?",
        residentialUse: "How will the property be used?",
        commercialType: "What kind of commercial space is it?",
        location: "Where is the project located?",
        cityCountry: "City and country",
        area: "Approximate area",
        stage: "What stage is the project at?",
        support: "What kind of support do you need?",
        priorities: "What matters most for this project?",
        requirements: "Anything important we should know?",
        budget: "Provisional project budget",
        timing: "Preferred timing",
        completion: "Do you have a target completion date?",
        completionDate: "Target date",
        savedDirection: "Saved visual direction",
        noDirection: "No visual direction saved yet",
        chooseDirection: "Choose visual direction",
        inspiration: "Inspiration or reference link"
      }
    },
    es: {
      eyebrow: "07 / Brief del proyecto",
      title: "Crea el briefing de tu proyecto",
      intro: "Responde a unas preguntas concretas para que podamos entender tu espacio, prioridades y fase del proyecto.",
      progress: "Progreso",
      back: "Atrás",
      continue: "Continuar",
      finish: "Guardar briefing",
      optional: "Opcional",
      required: "Responde a las preguntas obligatorias antes de continuar.",
      saved: "Tu briefing se ha guardado. La recomendación se añadirá en la siguiente sección.",
      selectUpToThree: "Elige hasta tres",
      selectAtLeastOne: "Elige al menos una",
      steps: [
        ["Tu espacio", "Cuéntanos qué tipo de propiedad o espacio estás planificando."],
        ["Fase del proyecto", "Ayúdanos a entender qué está decidido."],
        ["Prioridades", "Elige los resultados que más te importan."],
        ["Presupuesto y plazos", "En esta fase basta con información provisional."],
        ["Dirección visual", "Añade tu dirección guardada o comparte un enlace de inspiración."]
      ],
      questions: {
        projectType: "¿Qué tipo de espacio es?",
        residentialUse: "¿Cómo se utilizará la propiedad?",
        commercialType: "¿Qué tipo de espacio comercial es?",
        location: "¿Dónde se encuentra el proyecto?",
        cityCountry: "Ciudad y país",
        area: "Superficie aproximada",
        stage: "¿En qué fase se encuentra el proyecto?",
        support: "¿Qué tipo de apoyo necesitas?",
        priorities: "¿Qué es lo más importante para este proyecto?",
        requirements: "¿Hay algo importante que debamos saber?",
        budget: "Presupuesto provisional del proyecto",
        timing: "Plazo preferido",
        completion: "¿Tienes una fecha objetivo de finalización?",
        completionDate: "Fecha objetivo",
        savedDirection: "Dirección visual guardada",
        noDirection: "Todavía no hay una dirección visual guardada",
        chooseDirection: "Elegir dirección visual",
        inspiration: "Enlace de inspiración o referencias"
      }
    },
    ru: {
      eyebrow: "07 / Проектный бриф",
      title: "Составьте проектный бриф",
      intro: "Ответьте на несколько точных вопросов, чтобы мы поняли пространство, приоритеты и этап проекта.",
      progress: "Прогресс",
      back: "Назад",
      continue: "Продолжить",
      finish: "Сохранить бриф",
      optional: "Необязательно",
      required: "Ответьте на обязательные вопросы, прежде чем продолжить.",
      saved: "Бриф сохранён. Рекомендацию мы добавим на следующем этапе.",
      selectUpToThree: "Выберите до трёх",
      selectAtLeastOne: "Выберите хотя бы один вариант",
      steps: [
        ["Ваше пространство", "Расскажите, какой объект или пространство вы планируете."],
        ["Этап проекта", "Помогите понять, какие решения уже приняты."],
        ["Приоритеты", "Выберите результаты, которые для вас важнее всего."],
        ["Бюджет и сроки", "На этом этапе достаточно предварительной информации."],
        ["Визуальное направление", "Добавьте сохранённое направление или ссылку на референсы."]
      ],
      questions: {
        projectType: "Какой тип пространства вы планируете?",
        residentialUse: "Как будет использоваться объект?",
        commercialType: "Уточните формат коммерческого пространства",
        location: "Где находится проект?",
        cityCountry: "Город и страна",
        area: "Примерная площадь",
        stage: "На каком этапе находится проект?",
        support: "Какая поддержка вам нужна?",
        priorities: "Что важнее всего для этого проекта?",
        requirements: "Есть ли важные особенности, которые нужно учесть?",
        budget: "Предварительный бюджет проекта",
        timing: "Предпочтительные сроки",
        completion: "Есть ли целевая дата завершения?",
        completionDate: "Целевая дата",
        savedDirection: "Сохранённое визуальное направление",
        noDirection: "Визуальное направление пока не выбрано",
        chooseDirection: "Выбрать визуальное направление",
        inspiration: "Ссылка на вдохновение или референсы"
      }
    }
  };

  const options = {
    projectType: [
      ["apartment", ["Apartment", "Apartamento", "Квартира"]],
      ["house", ["House", "Casa", "Дом"]],
      ["hospitality", ["Hotel, restaurant or café", "Hotel, restaurante o cafetería", "Отель, ресторан или кафе"]],
      ["store", ["Store", "Tienda", "Магазин"]],
      ["office", ["Office or studio", "Oficina o estudio", "Офис или студия"]],
      ["other", ["Other", "Otro", "Другое"]]
    ],
    residentialUse: [
      ["primary", ["Primary residence", "Vivienda habitual", "Основное жильё"]],
      ["second", ["Second or holiday residence", "Segunda residencia", "Второе жильё или дом для отдыха"]],
      ["investment", ["Investment property", "Propiedad de inversión", "Инвестиционный объект"]],
      ["undecided", ["Not decided yet", "Aún no decidido", "Пока не определено"]]
    ],
    location: [
      ["barcelona", ["Barcelona", "Barcelona", "Барселона"]],
      ["lisbon", ["Lisbon", "Lisboa", "Лиссабон"]],
      ["spain", ["Elsewhere in Spain", "Otra ubicación en España", "Другая локация в Испании"]],
      ["portugal", ["Elsewhere in Portugal", "Otra ubicación en Portugal", "Другая локация в Португалии"]],
      ["europe", ["Elsewhere in Europe", "Otra ubicación en Europa", "Другая локация в Европе"]],
      ["other", ["Other", "Otro", "Другое"]]
    ],
    area: [
      ["under60", ["Under 60 m²", "Menos de 60 m²", "До 60 м²"]],
      ["60-100", ["60–100 m²", "60–100 m²", "60–100 м²"]],
      ["100-180", ["100–180 m²", "100–180 m²", "100–180 м²"]],
      ["180-300", ["180–300 m²", "180–300 m²", "180–300 м²"]],
      ["over300", ["Over 300 m²", "Más de 300 m²", "Более 300 м²"]],
      ["unsure", ["Not sure", "No lo sé", "Не знаю"]]
    ],
    stage: [
      ["exploring", ["Exploring possibilities", "Explorando posibilidades", "Изучаю возможности"]],
      ["selected", ["Property selected", "Propiedad seleccionada", "Объект уже выбран"]],
      ["drawings", ["Plans or drawings available", "Hay planos disponibles", "Есть планы или чертежи"]],
      ["design-started", ["Design already started", "El diseño ya ha comenzado", "Дизайн уже начат"]],
      ["renovation", ["Renovation in progress", "Reforma en curso", "Ремонт уже идёт"]],
      ["review", ["Need a professional review", "Necesito una revisión profesional", "Нужна профессиональная проверка"]]
    ],
    support: [
      ["direction", ["Clarify the direction", "Aclarar la dirección", "Определить направление"]],
      ["layout", ["Improve the layout", "Mejorar la distribución", "Улучшить планировку"]],
      ["complete", ["Design the complete interior", "Diseñar todo el interior", "Спроектировать интерьер целиком"]],
      ["renovation-prep", ["Prepare for renovation", "Preparar la reforma", "Подготовиться к ремонту"]],
      ["coordination", ["Coordinate implementation", "Coordinar la ejecución", "Координировать реализацию"]],
      ["review", ["Review an existing project", "Revisar un proyecto existente", "Проверить существующий проект"]],
      ["unsure", ["Not sure yet", "Aún no lo sé", "Пока не знаю"]]
    ],
    priorities: [
      ["space", ["Better use of space", "Mejor uso del espacio", "Лучшее использование пространства"]],
      ["calm", ["Calm and coherent atmosphere", "Atmósfera serena y coherente", "Спокойная и цельная атмосфера"]],
      ["storage", ["Storage and functionality", "Almacenamiento y funcionalidad", "Хранение и функциональность"]],
      ["light", ["More natural light", "Más luz natural", "Больше естественного света"]],
      ["materials", ["Material quality", "Calidad de los materiales", "Качество материалов"]],
      ["identity", ["Distinctive identity", "Identidad propia", "Выразительная идентичность"]],
      ["value", ["Property value", "Valor de la propiedad", "Ценность объекта"]],
      ["management", ["Well-managed process", "Proceso bien gestionado", "Хорошо организованный процесс"]]
    ],
    budget: [
      ["under50", ["Under €50k", "Menos de 50.000 €", "До €50 тыс."]],
      ["50-100", ["€50–100k", "50.000–100.000 €", "€50–100 тыс."]],
      ["100-200", ["€100–200k", "100.000–200.000 €", "€100–200 тыс."]],
      ["200-400", ["€200–400k", "200.000–400.000 €", "€200–400 тыс."]],
      ["over400", ["Over €400k", "Más de 400.000 €", "Более €400 тыс."]],
      ["undefined", ["Not defined", "No definido", "Не определён"]]
    ],
    timing: [
      ["asap", ["As soon as possible", "Lo antes posible", "Как можно скорее"]],
      ["3months", ["Within 3 months", "En 3 meses", "В течение 3 месяцев"]],
      ["6months", ["Within 6 months", "En 6 meses", "В течение 6 месяцев"]],
      ["12months", ["Within 12 months", "En 12 meses", "В течение 12 месяцев"]],
      ["flexible", ["No fixed timing", "Sin plazo fijo", "Без фиксированных сроков"]]
    ],
    completion: [
      ["yes", ["Yes", "Sí", "Да"]],
      ["no", ["No", "No", "Нет"]],
      ["unsure", ["Not sure", "No lo sé", "Не знаю"]]
    ]
  };

  const visualTitles = {
    "warm-architectural-minimalism": ["Warm Architectural Minimalism", "Minimalismo arquitectónico cálido", "Тёплый архитектурный минимализм"],
    "quiet-mediterranean-modernism": ["Quiet Mediterranean Modernism", "Modernismo mediterráneo sereno", "Спокойный средиземноморский модернизм"],
    "sculptural-materialism": ["Sculptural Materialism", "Materialidad escultórica", "Скульптурная материальность"],
    "soft-contemporary-structure": ["Soft Contemporary Structure", "Estructura contemporánea suave", "Мягкая современная структура"],
    "atmospheric-minimalism": ["Atmospheric Minimalism", "Minimalismo atmosférico", "Атмосферный минимализм"],
    "refined-naturalism": ["Refined Naturalism", "Naturalismo refinado", "Утончённый натурализм"],
    "expressive-contemporary": ["Expressive Contemporary", "Contemporáneo expresivo", "Выразительный современный интерьер"],
    "layered-mediterranean-interior": ["Layered Mediterranean Interior", "Interior mediterráneo con capas", "Многослойный средиземноморский интерьер"]
  };

  let state = loadState();
  let currentStep = Math.min(Math.max(Number(state.currentStep) || 0, 0), 4);

  function language() {
    const saved = localStorage.getItem("formaLanguage");
    return ["en", "es", "ru"].includes(saved) ? saved : "en";
  }

  function languageIndex() {
    return { en: 0, es: 1, ru: 2 }[language()];
  }

  function t() {
    return copy[language()];
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function loadState() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
      return {
        currentStep: saved.currentStep || 0,
        answers: saved.answers && typeof saved.answers === "object" ? saved.answers : {}
      };
    } catch {
      return { currentStep: 0, answers: {} };
    }
  }

  function saveState() {
    state.currentStep = currentStep;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function optionLabel(group, value) {
    const item = options[group].find(([id]) => id === value);
    return item ? item[1][languageIndex()] : value;
  }

  function choiceGroup(name, type = "single", limit = 0) {
    const selected = type === "multi"
      ? (Array.isArray(state.answers[name]) ? state.answers[name] : [])
      : state.answers[name];

    return `
      <div class="brief-options" data-brief-group="${name}" data-brief-type="${type}" data-brief-limit="${limit}">
        ${options[name].map(([value, labels]) => {
          const active = type === "multi" ? selected.includes(value) : selected === value;
          return `
            <button class="brief-option${active ? " is-selected" : ""}" type="button"
              data-brief-value="${value}" aria-pressed="${active}">
              <span>${escapeHtml(labels[languageIndex()])}</span>
              <span aria-hidden="true">${active ? "×" : "+"}</span>
            </button>
          `;
        }).join("")}
      </div>
    `;
  }

  function question(title, content, helper = "") {
    return `
      <div class="brief-question">
        <div class="brief-question__title">
          <h4>${escapeHtml(title)}</h4>
          ${helper ? `<span>${escapeHtml(helper)}</span>` : ""}
        </div>
        ${content}
      </div>
    `;
  }

  function field(name, label, type = "text", optional = false) {
    const value = escapeHtml(state.answers[name] || "");
    const optionalText = optional ? `<small>${escapeHtml(t().optional)}</small>` : "";
    if (type === "textarea") {
      return `
        <label class="brief-field">
          <span>${escapeHtml(label)} ${optionalText}</span>
          <textarea rows="5" data-brief-input="${name}">${value}</textarea>
        </label>
      `;
    }
    return `
      <label class="brief-field">
        <span>${escapeHtml(label)} ${optionalText}</span>
        <input type="${type}" data-brief-input="${name}" value="${value}" ${type === "url" ? 'placeholder="https://"' : ""}>
      </label>
    `;
  }

  function renderStepBody() {
    const q = t().questions;
    const a = state.answers;

    if (currentStep === 0) {
      const residential = ["apartment", "house"].includes(a.projectType);
      const commercial = Boolean(a.projectType) && !residential;

      return [
        question(q.projectType, choiceGroup("projectType")),
        residential ? question(q.residentialUse, choiceGroup("residentialUse")) : "",
        commercial ? field("commercialType", q.commercialType, "text", true) : "",
        question(q.location, choiceGroup("location")),
        field("cityCountry", q.cityCountry),
        question(q.area, choiceGroup("area"))
      ].join("");
    }

    if (currentStep === 1) {
      return [
        question(q.stage, choiceGroup("stage")),
        question(q.support, choiceGroup("support", "multi"), t().selectAtLeastOne)
      ].join("");
    }

    if (currentStep === 2) {
      return [
        question(q.priorities, choiceGroup("priorities", "multi", 3), t().selectUpToThree),
        field("requirements", q.requirements, "textarea", true)
      ].join("");
    }

    if (currentStep === 3) {
      return [
        question(q.budget, choiceGroup("budget")),
        question(q.timing, choiceGroup("timing")),
        question(q.completion, choiceGroup("completion")),
        a.completion === "yes" ? field("completionDate", q.completionDate, "date") : ""
      ].join("");
    }

    let visualState = {};
    try {
      visualState = JSON.parse(localStorage.getItem("formaVisualDirection") || "{}");
    } catch {
      visualState = {};
    }
    const resultId = visualState.resultId;
    const title = resultId && visualTitles[resultId]
      ? visualTitles[resultId][languageIndex()]
      : null;

    return `
      <div class="brief-visual${title ? " has-result" : ""}">
        <p class="eyebrow">${escapeHtml(title ? q.savedDirection : q.noDirection)}</p>
        ${title ? `<h4>${escapeHtml(title)}</h4>` : ""}
        <a class="text-link" href="#visual-direction">${escapeHtml(q.chooseDirection)}</a>
      </div>
      ${field("inspiration", q.inspiration, "url", true)}
    `;
  }

  function render() {
    const langCopy = t();
    document.querySelectorAll("[data-brief-text]").forEach((element) => {
      const key = element.dataset.briefText;
      if (langCopy[key]) element.textContent = langCopy[key];
    });

    const [stepTitle, stepDescription] = langCopy.steps[currentStep];
    stepRoot.innerHTML = `
      <div class="brief-step__heading">
        <span>0${currentStep + 1}</span>
        <div>
          <h3>${escapeHtml(stepTitle)}</h3>
          <p>${escapeHtml(stepDescription)}</p>
        </div>
      </div>
      <div class="brief-step__body">${renderStepBody()}</div>
    `;

    progressText.textContent = `${currentStep + 1} / 5`;
    progressFill.style.width = `${(currentStep + 1) * 20}%`;
    backButton.disabled = currentStep === 0;
    nextText.textContent = currentStep === 4 ? langCopy.finish : langCopy.continue;
    error.hidden = true;
  }

  function clearInvalidFields() {
    stepRoot.querySelectorAll(".is-invalid").forEach((element) => {
      element.classList.remove("is-invalid");
    });
  }

  function markMissingField(selector, message) {
    const target = stepRoot.querySelector(selector);
    if (!target) return false;

    const wrapper =
      target.closest(".brief-field") ||
      target.closest(".brief-question") ||
      target;

    wrapper.classList.add("is-invalid");
    error.textContent = message || t().required;
    error.hidden = false;

    wrapper.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });

    const focusTarget = wrapper.querySelector("input, textarea, button");
    focusTarget?.focus();

    return true;
  }

  function valid() {
    clearInvalidFields();

    const a = state.answers;
    const q = t().questions;

    if (currentStep === 0) {
      if (!a.projectType) {
        markMissingField('[data-brief-group="projectType"]', q.projectType);
        return false;
      }

      if (
        ["apartment", "house"].includes(a.projectType) &&
        !a.residentialUse
      ) {
        markMissingField('[data-brief-group="residentialUse"]', q.residentialUse);
        return false;
      }

      if (!a.location) {
        markMissingField('[data-brief-group="location"]', q.location);
        return false;
      }

      if (!String(a.cityCountry || "").trim()) {
        markMissingField('[data-brief-input="cityCountry"]', q.cityCountry);
        return false;
      }

      if (!a.area) {
        markMissingField('[data-brief-group="area"]', q.area);
        return false;
      }

      return true;
    }

    if (currentStep === 1) {
      if (!a.stage) {
        markMissingField('[data-brief-group="stage"]', q.stage);
        return false;
      }

      if (!Array.isArray(a.support) || !a.support.length) {
        markMissingField('[data-brief-group="support"]', q.support);
        return false;
      }

      return true;
    }

    if (currentStep === 2) {
      if (!Array.isArray(a.priorities) || !a.priorities.length) {
        markMissingField('[data-brief-group="priorities"]', q.priorities);
        return false;
      }

      return true;
    }

    if (currentStep === 3) {
      if (!a.budget) {
        markMissingField('[data-brief-group="budget"]', q.budget);
        return false;
      }

      if (!a.timing) {
        markMissingField('[data-brief-group="timing"]', q.timing);
        return false;
      }

      if (!a.completion) {
        markMissingField('[data-brief-group="completion"]', q.completion);
        return false;
      }

      if (a.completion === "yes" && !a.completionDate) {
        markMissingField('[data-brief-input="completionDate"]', q.completionDate);
        return false;
      }

      return true;
    }

    return true;
  }

  stepRoot.addEventListener("click", (event) => {
    const button = event.target.closest("[data-brief-value]");
    if (!button) return;

    button.closest(".is-invalid")?.classList.remove("is-invalid");
    error.hidden = true;

    const group = button.closest("[data-brief-group]");
    const name = group.dataset.briefGroup;
    const type = group.dataset.briefType;
    const limit = Number(group.dataset.briefLimit) || 0;
    const value = button.dataset.briefValue;

    if (type === "multi") {
      const current = Array.isArray(state.answers[name]) ? state.answers[name] : [];
      if (current.includes(value)) {
        state.answers[name] = current.filter((item) => item !== value);
      } else if (!limit || current.length < limit) {
        state.answers[name] = [...current, value];
      }
    } else {
      state.answers[name] = value;
      if (name === "projectType") {
        state.answers.residentialUse = "";
        state.answers.commercialType = "";
      }
      if (name === "completion" && value !== "yes") {
        state.answers.completionDate = "";
      }
    }

    saveState();
    render();
  });

  stepRoot.addEventListener("input", (event) => {
    const input = event.target.closest("[data-brief-input]");
    if (!input) return;

    input.closest(".is-invalid")?.classList.remove("is-invalid");
    error.hidden = true;

    state.answers[input.dataset.briefInput] = input.value;
    saveState();
  });

  backButton.addEventListener("click", () => {
    if (currentStep === 0) return;
    currentStep -= 1;
    saveState();
    render();
    document.querySelector("#brief").scrollIntoView({ behavior: "smooth", block: "start" });
  });

  nextButton.addEventListener("click", () => {
    if (!valid()) {
      return;
    }

    if (currentStep < 4) {
      currentStep += 1;
      saveState();
      render();
      document.querySelector("#brief").scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    saveState();

    window.dispatchEvent(new CustomEvent("forma:brief-complete", {
      detail: {
        answers: state.answers
      }
    }));

    document.querySelector("#recommendation")?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  });

  const observer = new MutationObserver(() => render());
  if (languageLabel) {
    observer.observe(languageLabel, { childList: true, characterData: true, subtree: true });
  }

  render();
});
