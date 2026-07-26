"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#contactForm");
  const summaryRoot = document.querySelector("#contactSummary");
  const status = document.querySelector("#contactStatus");
  const languageLabel = document.querySelector("#currentLanguage");

  if (!form || !summaryRoot || !status) return;

  const copy = {
    en: {
      eyebrow: "09 / Contact",
      title: "Send your project brief",
      intro: "Share your contact details. Your brief and recommendation will be attached automatically.",
      name: "Name",
      email: "Email",
      phone: "Phone or Telegram",
      contactMethod: "Preferred contact method",
      choose: "Choose",
      language: "Preferred language",
      message: "Anything else you would like to add?",
      privacy: "By sending this form, you agree that FORMA Studio may contact you about this project.",
      submit: "Send brief",
      summary: "Attached to your request",
      required: "Please complete the required fields.",
      sending: "Sending your project brief…",
      success: "Thank you. Your project brief has been sent to FORMA Studio.",
      sendError: "The brief could not be sent. Please try again in a moment.",
      labels: {
        service: "Recommended service",
        projectType: "Space",
        location: "Location",
        area: "Area",
        stage: "Project stage",
        budget: "Budget",
        timing: "Timing",
        visual: "Visual direction"
      },
      none: "Not selected"
    },
    es: {
      eyebrow: "09 / Contacto",
      title: "Envía el briefing de tu proyecto",
      intro: "Comparte tus datos de contacto. El briefing y la recomendación se adjuntarán automáticamente.",
      name: "Nombre",
      email: "Email",
      phone: "Teléfono o Telegram",
      contactMethod: "Método de contacto preferido",
      choose: "Elegir",
      language: "Idioma preferido",
      message: "¿Quieres añadir algo más?",
      privacy: "Al enviar este formulario, aceptas que FORMA Studio pueda contactarte sobre este proyecto.",
      submit: "Enviar briefing",
      summary: "Adjunto a tu solicitud",
      required: "Completa los campos obligatorios.",
      sending: "Enviando el briefing de tu proyecto…",
      success: "Gracias. Tu briefing se ha enviado a FORMA Studio.",
      sendError: "No se pudo enviar el briefing. Inténtalo de nuevo en un momento.",
      labels: {
        service: "Servicio recomendado",
        projectType: "Espacio",
        location: "Ubicación",
        area: "Superficie",
        stage: "Fase del proyecto",
        budget: "Presupuesto",
        timing: "Plazos",
        visual: "Dirección visual"
      },
      none: "No seleccionado"
    },
    ru: {
      eyebrow: "09 / Контакты",
      title: "Отправьте проектный бриф",
      intro: "Оставьте контактные данные. Бриф и рекомендация будут прикреплены автоматически.",
      name: "Имя",
      email: "Email",
      phone: "Телефон или Telegram",
      contactMethod: "Предпочтительный способ связи",
      choose: "Выберите",
      language: "Предпочтительный язык",
      message: "Хотите добавить что-то ещё?",
      privacy: "Отправляя форму, вы соглашаетесь, что FORMA Studio может связаться с вами по этому проекту.",
      submit: "Отправить бриф",
      summary: "Будет приложено к заявке",
      required: "Заполните обязательные поля.",
      sending: "Отправляем проектный бриф…",
      success: "Спасибо. Проектный бриф отправлен в FORMA Studio.",
      sendError: "Не удалось отправить бриф. Попробуйте ещё раз через несколько секунд.",
      labels: {
        service: "Рекомендуемая услуга",
        projectType: "Пространство",
        location: "Локация",
        area: "Площадь",
        stage: "Этап проекта",
        budget: "Бюджет",
        timing: "Сроки",
        visual: "Визуальное направление"
      },
      none: "Не выбрано"
    }
  };

  const labels = {
    projectType: {
      apartment: ["Apartment", "Apartamento", "Квартира"],
      house: ["House", "Casa", "Дом"],
      hospitality: ["Hotel, restaurant or café", "Hotel, restaurante o cafetería", "Отель, ресторан или кафе"],
      store: ["Store", "Tienda", "Магазин"],
      office: ["Office or studio", "Oficina o estudio", "Офис или студия"],
      other: ["Other", "Otro", "Другое"]
    },
    area: {
      under60: ["Under 60 m²", "Menos de 60 m²", "До 60 м²"],
      "60-100": ["60–100 m²", "60–100 m²", "60–100 м²"],
      "100-180": ["100–180 m²", "100–180 m²", "100–180 м²"],
      "180-300": ["180–300 m²", "180–300 m²", "180–300 м²"],
      over300: ["Over 300 m²", "Más de 300 m²", "Более 300 м²"],
      unsure: ["Not sure", "No lo sé", "Не знаю"]
    },
    stage: {
      exploring: ["Exploring possibilities", "Explorando posibilidades", "Изучаю возможности"],
      selected: ["Property selected", "Propiedad seleccionada", "Объект уже выбран"],
      drawings: ["Plans or drawings available", "Hay planos disponibles", "Есть планы или чертежи"],
      "design-started": ["Design already started", "El diseño ya ha comenzado", "Дизайн уже начат"],
      renovation: ["Renovation in progress", "Reforma en curso", "Ремонт уже идёт"],
      review: ["Need a professional review", "Necesito una revisión profesional", "Нужна профессиональная проверка"]
    },
    budget: {
      under50: ["Under €50k", "Menos de 50.000 €", "До €50 тыс."],
      "50-100": ["€50–100k", "50.000–100.000 €", "€50–100 тыс."],
      "100-200": ["€100–200k", "100.000–200.000 €", "€100–200 тыс."],
      "200-400": ["€200–400k", "200.000–400.000 €", "€200–400 тыс."],
      over400: ["Over €400k", "Más de 400.000 €", "Более €400 тыс."],
      undefined: ["Not defined", "No definido", "Не определён"]
    },
    timing: {
      asap: ["As soon as possible", "Lo antes posible", "Как можно скорее"],
      "3months": ["Within 3 months", "En 3 meses", "В течение 3 месяцев"],
      "6months": ["Within 6 months", "En 6 meses", "В течение 6 месяцев"],
      "12months": ["Within 12 months", "En 12 meses", "В течение 12 месяцев"],
      flexible: ["No fixed timing", "Sin plazo fijo", "Без фиксированных сроков"]
    }
  };

  const services = {
    direction: ["Define Direction", "Definir la dirección", "Определить направление"],
    complete: ["Design Complete Space", "Diseñar el espacio completo", "Спроектировать пространство целиком"],
    delivery: ["Transform and Deliver", "Transformar y ejecutar", "Спроектировать и реализовать"],
    review: ["Review Existing Project", "Revisar un proyecto existente", "Проверить существующий проект"]
  };

  const visuals = {
    "warm-architectural-minimalism": ["Warm Architectural Minimalism", "Minimalismo arquitectónico cálido", "Тёплый архитектурный минимализм"],
    "quiet-mediterranean-modernism": ["Quiet Mediterranean Modernism", "Modernismo mediterráneo sereno", "Спокойный средиземноморский модернизм"],
    "sculptural-materialism": ["Sculptural Materialism", "Materialidad escultórica", "Скульптурная материальность"],
    "soft-contemporary-structure": ["Soft Contemporary Structure", "Estructura contemporánea suave", "Мягкая современная структура"],
    "atmospheric-minimalism": ["Atmospheric Minimalism", "Minimalismo atmosférico", "Атмосферный минимализм"],
    "refined-naturalism": ["Refined Naturalism", "Naturalismo refinado", "Утончённый натурализм"],
    "expressive-contemporary": ["Expressive Contemporary", "Contemporáneo expresivo", "Выразительный современный интерьер"],
    "layered-mediterranean-interior": ["Layered Mediterranean Interior", "Interior mediterráneo con capas", "Многослойный средиземноморский интерьер"]
  };

  function language() {
    const value = localStorage.getItem("formaLanguage");
    return ["en", "es", "ru"].includes(value) ? value : "en";
  }

  function index() {
    return { en: 0, es: 1, ru: 2 }[language()];
  }

  function t() {
    return copy[language()];
  }

  function readJson(key) {
    try {
      return JSON.parse(localStorage.getItem(key) || "{}");
    } catch {
      return {};
    }
  }

  function recommendationKey(answers) {
    const support = Array.isArray(answers.support) ? answers.support : [];

    if (
      answers.stage === "review" ||
      answers.stage === "design-started" ||
      support.includes("review")
    ) return "review";

    if (
      answers.stage === "renovation" ||
      support.includes("coordination")
    ) return "delivery";

    if (
      answers.stage === "exploring" ||
      support.includes("direction") ||
      support.includes("unsure")
    ) return "direction";

    return "complete";
  }

  function option(group, value) {
    return labels[group]?.[value]?.[index()] || value || "—";
  }

  function visual() {
    const state = readJson("formaVisualDirection");
    return visuals[state.resultId]?.[index()] || t().none;
  }

  function render() {
    const text = t();
    document.querySelectorAll("[data-contact-text]").forEach((element) => {
      const value = text[element.dataset.contactText];
      if (value) element.textContent = value;
    });

    const languageSelect = form.elements.language;
    languageSelect.value = language();

    const saved = readJson("formaProjectBrief");
    const answers = saved.answers || {};
    const serviceKey = recommendationKey(answers);

    const rows = [
      [text.labels.service, services[serviceKey][index()]],
      [text.labels.projectType, option("projectType", answers.projectType)],
      [text.labels.location, answers.cityCountry || "—"],
      [text.labels.area, option("area", answers.area)],
      [text.labels.stage, option("stage", answers.stage)],
      [text.labels.budget, option("budget", answers.budget)],
      [text.labels.timing, option("timing", answers.timing)],
      [text.labels.visual, visual()]
    ];

    summaryRoot.innerHTML = rows.map(([term, value]) => `
      <div>
        <dt>${term}</dt>
        <dd>${value}</dd>
      </div>
    `).join("");
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    form.querySelectorAll(".is-invalid").forEach((element) => {
      element.classList.remove("is-invalid");
    });

    const requiredFields = [...form.querySelectorAll("[required]")];
    const invalid = requiredFields.find((field) => !String(field.value || "").trim());

    if (invalid) {
      invalid.closest(".contact-field")?.classList.add("is-invalid");
      invalid.focus();
      status.textContent = t().required;
      status.hidden = false;
      return;
    }

    if (form.elements.email && !form.elements.email.validity.valid) {
      form.elements.email.closest(".contact-field")?.classList.add("is-invalid");
      form.elements.email.focus();
      status.textContent = t().required;
      status.hidden = false;
      return;
    }

    const brief = readJson("formaProjectBrief");
    const payload = {
      contact: Object.fromEntries(new FormData(form).entries()),
      brief: brief.answers || {},
      visualDirection: readJson("formaVisualDirection"),
      language: language()
    };

    localStorage.setItem("formaContactRequest", JSON.stringify(payload));

    const submitButton = form.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    status.classList.remove("is-success");
    status.textContent = t().sending;
    status.hidden = false;

    try {
      const response = await fetch("/api/project-brief", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok || !result.ok) {
        throw new Error(result.error || "send_failed");
      }

      status.textContent = t().success;
      status.classList.add("is-success");
      status.hidden = false;

      window.dispatchEvent(new CustomEvent("forma:contact-sent", {
        detail: {
          contact: payload.contact,
          brief: payload.brief,
          visualDirection: payload.visualDirection
        }
      }));

      form.reset();
      form.elements.language.value = language();

      document.querySelector("#confirmation")?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    } catch (sendError) {
      console.error("FORMA brief delivery failed:", sendError);
      status.textContent = t().sendError;
      status.classList.remove("is-success");
      status.hidden = false;
    } finally {
      submitButton.disabled = false;
    }
  });

  form.addEventListener("input", (event) => {
    event.target.closest(".is-invalid")?.classList.remove("is-invalid");
    status.hidden = true;
  });

  const observer = new MutationObserver(render);
  if (languageLabel) {
    observer.observe(languageLabel, {
      childList: true,
      characterData: true,
      subtree: true
    });
  }

  render();
});
