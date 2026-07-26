"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const section = document.querySelector("#recommendation");
  const serviceTitle = document.querySelector("#recommendationService");
  const reason = document.querySelector("#recommendationReason");
  const scope = document.querySelector("#recommendationScope");
  const snapshot = document.querySelector("#recommendationSnapshot");
  const editButton = document.querySelector("#recommendationEdit");
  const discussButton = document.querySelector("#recommendationDiscuss");
  const languageLabel = document.querySelector("#currentLanguage");

  if (!section || !serviceTitle || !reason || !scope || !snapshot) return;

  const copy = {
    en: {
      eyebrow: "08 / Recommendation",
      title: "A clear next step for your project",
      intro: "Based on your answers, this is the most suitable starting point.",
      recommended: "Recommended service",
      scope: "Likely scope",
      snapshot: "Project snapshot",
      edit: "Edit brief",
      discuss: "Discuss project",
      note: "This is an initial recommendation, not a final proposal or cost estimate.",
      labels: {
        projectType: "Space",
        location: "Location",
        area: "Area",
        stage: "Project stage",
        support: "Support needed",
        priorities: "Priorities",
        budget: "Budget",
        timing: "Timing",
        visual: "Visual direction"
      },
      services: {
        direction: {
          title: "Define Direction",
          reason: "Your project is still at an early or exploratory stage. The most useful next step is to clarify the spatial, visual and material direction before committing to a full design process.",
          scope: [
            "Project context and priorities review",
            "Spatial and visual direction",
            "Material and atmosphere framework",
            "Clear basis for the next design phase"
          ]
        },
        complete: {
          title: "Design Complete Space",
          reason: "The property and core needs are already defined, and your answers point toward a complete interior design process from planning through detailed design.",
          scope: [
            "Layout and spatial planning",
            "Interior concept and material palette",
            "Joinery, lighting and key details",
            "Design documentation for implementation"
          ]
        },
        delivery: {
          title: "Transform and Deliver",
          reason: "Your project requires both complete design and active coordination during implementation. A delivery-led service is the strongest fit.",
          scope: [
            "Complete interior design",
            "Technical and material coordination",
            "Supplier and contractor alignment",
            "Implementation oversight"
          ]
        },
        review: {
          title: "Review Existing Project",
          reason: "A design or renovation process is already underway. The most useful intervention is an expert review that identifies risks, gaps and practical improvements.",
          scope: [
            "Review of existing plans or proposals",
            "Layout and design assessment",
            "Material and technical risk check",
            "Prioritised recommendations"
          ]
        }
      },
      visualNone: "Not selected"
    },
    es: {
      eyebrow: "08 / Recomendación",
      title: "Un siguiente paso claro para tu proyecto",
      intro: "Según tus respuestas, este es el punto de partida más adecuado.",
      recommended: "Servicio recomendado",
      scope: "Alcance probable",
      snapshot: "Resumen del proyecto",
      edit: "Editar briefing",
      discuss: "Hablar del proyecto",
      note: "Esta es una recomendación inicial, no una propuesta final ni una estimación de costes.",
      labels: {
        projectType: "Espacio",
        location: "Ubicación",
        area: "Superficie",
        stage: "Fase del proyecto",
        support: "Apoyo necesario",
        priorities: "Prioridades",
        budget: "Presupuesto",
        timing: "Plazos",
        visual: "Dirección visual"
      },
      services: {
        direction: {
          title: "Definir la dirección",
          reason: "Tu proyecto se encuentra en una fase inicial o exploratoria. El siguiente paso más útil es aclarar la dirección espacial, visual y material antes de iniciar un proceso de diseño completo.",
          scope: [
            "Revisión del contexto y las prioridades",
            "Dirección espacial y visual",
            "Marco de materiales y atmósfera",
            "Base clara para la siguiente fase"
          ]
        },
        complete: {
          title: "Diseñar el espacio completo",
          reason: "La propiedad y las necesidades principales ya están definidas, y tus respuestas indican que necesitas un proceso integral de diseño interior.",
          scope: [
            "Distribución y planificación espacial",
            "Concepto interior y paleta de materiales",
            "Carpintería, iluminación y detalles clave",
            "Documentación para la ejecución"
          ]
        },
        delivery: {
          title: "Transformar y ejecutar",
          reason: "Tu proyecto requiere un diseño completo y coordinación activa durante la ejecución. El servicio orientado a la entrega es el más adecuado.",
          scope: [
            "Diseño interior completo",
            "Coordinación técnica y de materiales",
            "Alineación de proveedores y contratistas",
            "Supervisión de la ejecución"
          ]
        },
        review: {
          title: "Revisar un proyecto existente",
          reason: "El diseño o la reforma ya están en marcha. La intervención más útil es una revisión experta que detecte riesgos, carencias y mejoras prácticas.",
          scope: [
            "Revisión de planos o propuestas existentes",
            "Evaluación de la distribución y el diseño",
            "Comprobación de riesgos técnicos y materiales",
            "Recomendaciones priorizadas"
          ]
        }
      },
      visualNone: "No seleccionada"
    },
    ru: {
      eyebrow: "08 / Рекомендация",
      title: "Понятный следующий шаг для вашего проекта",
      intro: "На основе ответов мы определили наиболее подходящую отправную точку.",
      recommended: "Рекомендуемая услуга",
      scope: "Предполагаемый состав работ",
      snapshot: "Кратко о проекте",
      edit: "Изменить бриф",
      discuss: "Обсудить проект",
      note: "Это предварительная рекомендация, а не финальное предложение или расчёт стоимости.",
      labels: {
        projectType: "Пространство",
        location: "Локация",
        area: "Площадь",
        stage: "Этап проекта",
        support: "Необходимая поддержка",
        priorities: "Приоритеты",
        budget: "Бюджет",
        timing: "Сроки",
        visual: "Визуальное направление"
      },
      services: {
        direction: {
          title: "Определить направление",
          reason: "Проект находится на раннем или исследовательском этапе. Сейчас важнее всего определить пространственное, визуальное и материальное направление до начала полного проектирования.",
          scope: [
            "Разбор контекста и приоритетов",
            "Пространственное и визуальное направление",
            "Материалы и атмосфера",
            "Понятная основа для следующего этапа"
          ]
        },
        complete: {
          title: "Спроектировать пространство целиком",
          reason: "Объект и основные задачи уже определены, а ответы указывают на необходимость полного интерьерного проекта — от планировки до детальной разработки.",
          scope: [
            "Планировка и организация пространства",
            "Интерьерная концепция и палитра материалов",
            "Мебель, освещение и ключевые детали",
            "Документация для реализации"
          ]
        },
        delivery: {
          title: "Спроектировать и реализовать",
          reason: "Проекту нужны и полный дизайн, и активная координация реализации. Поэтому наиболее подходящим будет формат с сопровождением до результата.",
          scope: [
            "Полный дизайн интерьера",
            "Техническая и материальная координация",
            "Взаимодействие с поставщиками и подрядчиками",
            "Контроль реализации"
          ]
        },
        review: {
          title: "Проверить существующий проект",
          reason: "Дизайн или ремонт уже начаты. Наиболее полезна экспертная проверка, которая выявит риски, пробелы и практические улучшения.",
          scope: [
            "Проверка существующих планов или предложений",
            "Оценка планировки и дизайна",
            "Проверка технических и материальных рисков",
            "Приоритетные рекомендации"
          ]
        }
      },
      visualNone: "Не выбрано"
    }
  };

  const optionLabels = {
    projectType: {
      apartment: ["Apartment", "Apartamento", "Квартира"],
      house: ["House", "Casa", "Дом"],
      hospitality: ["Hotel, restaurant or café", "Hotel, restaurante o cafetería", "Отель, ресторан или кафе"],
      store: ["Store", "Tienda", "Магазин"],
      office: ["Office or studio", "Oficina o estudio", "Офис или студия"],
      other: ["Other", "Otro", "Другое"]
    },
    location: {
      barcelona: ["Barcelona", "Barcelona", "Барселона"],
      lisbon: ["Lisbon", "Lisboa", "Лиссабон"],
      spain: ["Elsewhere in Spain", "Otra ubicación en España", "Другая локация в Испании"],
      portugal: ["Elsewhere in Portugal", "Otra ubicación en Portugal", "Другая локация в Португалии"],
      europe: ["Elsewhere in Europe", "Otra ubicación en Europa", "Другая локация в Европе"],
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
    support: {
      direction: ["Clarify the direction", "Aclarar la dirección", "Определить направление"],
      layout: ["Improve the layout", "Mejorar la distribución", "Улучшить планировку"],
      complete: ["Design the complete interior", "Diseñar todo el interior", "Спроектировать интерьер целиком"],
      "renovation-prep": ["Prepare for renovation", "Preparar la reforma", "Подготовиться к ремонту"],
      coordination: ["Coordinate implementation", "Coordinar la ejecución", "Координировать реализацию"],
      review: ["Review an existing project", "Revisar un proyecto existente", "Проверить существующий проект"],
      unsure: ["Not sure yet", "Aún no lo sé", "Пока не знаю"]
    },
    priorities: {
      space: ["Better use of space", "Mejor uso del espacio", "Лучшее использование пространства"],
      calm: ["Calm and coherent atmosphere", "Atmósfera serena y coherente", "Спокойная и цельная атмосфера"],
      storage: ["Storage and functionality", "Almacenamiento y funcionalidad", "Хранение и функциональность"],
      light: ["More natural light", "Más luz natural", "Больше естественного света"],
      materials: ["Material quality", "Calidad de los materiales", "Качество материалов"],
      identity: ["Distinctive identity", "Identidad propia", "Выразительная идентичность"],
      value: ["Property value", "Valor de la propiedad", "Ценность объекта"],
      management: ["Well-managed process", "Proceso bien gestionado", "Хорошо организованный процесс"]
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

  function language() {
    const saved = localStorage.getItem("formaLanguage");
    return ["en", "es", "ru"].includes(saved) ? saved : "en";
  }

  function index() {
    return { en: 0, es: 1, ru: 2 }[language()];
  }

  function text() {
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

  function label(group, value) {
    return optionLabels[group]?.[value]?.[index()] || value || "—";
  }

  function listLabels(group, values) {
    if (!Array.isArray(values) || !values.length) return "—";
    return values.map((value) => label(group, value)).join(", ");
  }

  function recommendationKey(answers) {
    const support = Array.isArray(answers.support) ? answers.support : [];

    if (
      answers.stage === "review" ||
      answers.stage === "design-started" ||
      support.includes("review")
    ) {
      return "review";
    }

    if (
      answers.stage === "renovation" ||
      support.includes("coordination")
    ) {
      return "delivery";
    }

    if (
      answers.stage === "exploring" ||
      support.includes("direction") ||
      support.includes("unsure")
    ) {
      return "direction";
    }

    return "complete";
  }

  function visualDirection() {
    try {
      const visual = JSON.parse(localStorage.getItem("formaVisualDirection") || "{}");
      return visualTitles[visual.resultId]?.[index()] || text().visualNone;
    } catch {
      return text().visualNone;
    }
  }

  function readBrief() {
    try {
      const saved = JSON.parse(localStorage.getItem("formaProjectBrief") || "{}");
      return saved.answers && typeof saved.answers === "object" ? saved.answers : null;
    } catch {
      return null;
    }
  }

  function render(answers = readBrief()) {
    if (!answers) return;

    const lang = text();
    const service = lang.services[recommendationKey(answers)];

    section.querySelectorAll("[data-recommendation-text]").forEach((element) => {
      const value = lang[element.dataset.recommendationText];
      if (value) element.textContent = value;
    });

    serviceTitle.textContent = service.title;
    reason.textContent = service.reason;
    scope.innerHTML = service.scope
      .map((item) => `<li>${escapeHtml(item)}</li>`)
      .join("");

    const rows = [
      [lang.labels.projectType, label("projectType", answers.projectType)],
      [lang.labels.location, answers.cityCountry || label("location", answers.location)],
      [lang.labels.area, label("area", answers.area)],
      [lang.labels.stage, label("stage", answers.stage)],
      [lang.labels.support, listLabels("support", answers.support)],
      [lang.labels.priorities, listLabels("priorities", answers.priorities)],
      [lang.labels.budget, label("budget", answers.budget)],
      [lang.labels.timing, label("timing", answers.timing)],
      [lang.labels.visual, visualDirection()]
    ];

    snapshot.innerHTML = rows.map(([term, description]) => `
      <div>
        <dt>${escapeHtml(term)}</dt>
        <dd>${escapeHtml(description)}</dd>
      </div>
    `).join("");

    section.hidden = false;
  }

  discussButton?.addEventListener("click", () => {
    document.querySelector("#contact")?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  });

  editButton?.addEventListener("click", () => {
    document.querySelector("#brief")?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  });

  window.addEventListener("forma:brief-complete", (event) => {
    render(event.detail?.answers);
  });

  const observer = new MutationObserver(() => {
    if (!section.hidden) render();
  });

  if (languageLabel) {
    observer.observe(languageLabel, {
      childList: true,
      characterData: true,
      subtree: true
    });
  }

  const existing = readBrief();
  if (existing && Object.keys(existing).length) {
    render(existing);
  }
});
