"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const languageLabel = document.querySelector("#currentLanguage");
  const elements = document.querySelectorAll("[data-studio-text]");

  if (!elements.length) return;

  const copy = {
    en: {
      eyebrow: "10 / Studio",
      title: "Interior architecture shaped by context",
      intro:
        "FORMA Studio develops calm, precise interiors for homes, hospitality and workspaces in Barcelona, Lisbon and beyond.",
      approachEyebrow: "Our approach",
      statement:
        "We begin with how a space is used, what already exists and what genuinely needs to change. The result is not a stylistic formula, but a coherent project grounded in light, material and everyday life.",
      factOneTitle: "Context before style",
      factOneText:
        "Architecture, location and daily routines define the direction.",
      factTwoTitle: "Materials with purpose",
      factTwoText:
        "Each material is selected for atmosphere, durability and tactile quality.",
      factThreeTitle: "Clear project decisions",
      factThreeText:
        "A structured process turns early ideas into coordinated design choices.",
      factFourTitle: "From direction to delivery",
      factFourText:
        "Support can begin with one focused review or continue through implementation.",
      projectsEyebrow: "Project types",
      projectTypes: "Residential · Hospitality · Retail · Workspaces",
      locationEyebrow: "Based in",
      formatEyebrow: "Working format",
      formatText: "Local and remote collaboration",
      ctaEyebrow: "Start with clarity",
      ctaTitle: "Tell us what you are planning",
      briefButton: "Build project brief",
      projectsButton: "View selected projects"
    },

    es: {
      eyebrow: "10 / Estudio",
      title: "Arquitectura interior definida por el contexto",
      intro:
        "FORMA Studio desarrolla interiores serenos y precisos para viviendas, hostelería y espacios de trabajo en Barcelona, Lisboa y otros destinos.",
      approachEyebrow: "Nuestro enfoque",
      statement:
        "Empezamos por entender cómo se utiliza el espacio, qué merece conservarse y qué necesita cambiar realmente. El resultado no parte de una fórmula estética, sino de un proyecto coherente basado en la luz, los materiales y la vida cotidiana.",
      factOneTitle: "El contexto antes que el estilo",
      factOneText:
        "La arquitectura, la ubicación y las rutinas diarias definen la dirección.",
      factTwoTitle: "Materiales con propósito",
      factTwoText:
        "Cada material se elige por su atmósfera, durabilidad y calidad táctil.",
      factThreeTitle: "Decisiones de proyecto claras",
      factThreeText:
        "Un proceso estructurado convierte las primeras ideas en decisiones coordinadas.",
      factFourTitle: "De la dirección a la ejecución",
      factFourText:
        "El acompañamiento puede empezar con una revisión concreta o continuar hasta la implementación.",
      projectsEyebrow: "Tipos de proyecto",
      projectTypes: "Residencial · Hostelería · Retail · Espacios de trabajo",
      locationEyebrow: "Con base en",
      formatEyebrow: "Formato de trabajo",
      formatText: "Colaboración local y a distancia",
      ctaEyebrow: "Empieza con claridad",
      ctaTitle: "Cuéntanos qué estás planificando",
      briefButton: "Crear briefing del proyecto",
      projectsButton: "Ver proyectos seleccionados"
    },

    ru: {
      eyebrow: "10 / О студии",
      title: "Архитектура интерьера, основанная на контексте",
      intro:
        "FORMA Studio создаёт спокойные и точные интерьеры для жилья, гостиничного бизнеса и рабочих пространств в Барселоне, Лиссабоне и по всему миру.",
      approachEyebrow: "Наш подход",
      statement:
        "Мы начинаем с того, как используется пространство, что в нём уже ценно и что действительно необходимо изменить. Результат строится не на стилистическом шаблоне, а на цельном проекте, основанном на свете, материалах и повседневной жизни.",
      factOneTitle: "Сначала контекст, затем стиль",
      factOneText:
        "Архитектура, локация и ежедневные сценарии определяют направление.",
      factTwoTitle: "Материалы со смыслом",
      factTwoText:
        "Каждый материал выбирается ради атмосферы, долговечности и тактильного качества.",
      factThreeTitle: "Понятные проектные решения",
      factThreeText:
        "Структурированный процесс превращает первые идеи в согласованную систему решений.",
      factFourTitle: "От направления до реализации",
      factFourText:
        "Работа может начаться с точечной консультации или продолжиться до сопровождения реализации.",
      projectsEyebrow: "Типы проектов",
      projectTypes:
        "Жилые интерьеры · Гостиничный бизнес · Retail · Рабочие пространства",
      locationEyebrow: "География",
      formatEyebrow: "Формат работы",
      formatText: "Локальное и дистанционное сотрудничество",
      ctaEyebrow: "Начните с ясности",
      ctaTitle: "Расскажите, какой проект вы планируете",
      briefButton: "Составить проектный бриф",
      projectsButton: "Посмотреть избранные проекты"
    }
  };

  function currentLanguage() {
    const saved = localStorage.getItem("formaLanguage");
    return ["en", "es", "ru"].includes(saved) ? saved : "en";
  }

  function render() {
    const languageCopy = copy[currentLanguage()];

    elements.forEach((element) => {
      const key = element.dataset.studioText;
      if (languageCopy[key]) {
        element.textContent = languageCopy[key];
      }
    });
  }

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
