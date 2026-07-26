"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const section = document.querySelector("#confirmation");
  const restartButton = document.querySelector("#confirmationRestart");
  const languageLabel = document.querySelector("#currentLanguage");

  if (!section) return;

  const copy = {
    en: {
      eyebrow: "10 / Confirmation",
      title: "Your project brief has been sent",
      intro:
        "Thank you. FORMA Studio has received your project details and contact information.",
      stepOneTitle: "We review the brief",
      stepOneText:
        "We look at the project stage, priorities, budget and visual direction.",
      stepTwoTitle: "We confirm the right format",
      stepTwoText:
        "The initial recommendation is checked against the scope and location.",
      stepThreeTitle: "We contact you",
      stepThreeText:
        "You will receive a personal response using your preferred contact method.",
      timing: "Typical response time: within 1–2 business days.",
      projectsButton: "Return to projects",
      restartButton: "Start a new brief"
    },

    es: {
      eyebrow: "10 / Confirmación",
      title: "El briefing de tu proyecto se ha enviado",
      intro:
        "Gracias. FORMA Studio ha recibido los datos del proyecto y tu información de contacto.",
      stepOneTitle: "Revisamos el briefing",
      stepOneText:
        "Analizamos la fase del proyecto, las prioridades, el presupuesto y la dirección visual.",
      stepTwoTitle: "Confirmamos el formato adecuado",
      stepTwoText:
        "Comprobamos la recomendación inicial según el alcance y la ubicación.",
      stepThreeTitle: "Nos ponemos en contacto",
      stepThreeText:
        "Recibirás una respuesta personal por el método de contacto que hayas elegido.",
      timing: "Tiempo de respuesta habitual: entre 1 y 2 días laborables.",
      projectsButton: "Volver a los proyectos",
      restartButton: "Crear un nuevo briefing"
    },

    ru: {
      eyebrow: "10 / Подтверждение",
      title: "Ваш проектный бриф отправлен",
      intro:
        "Спасибо. FORMA Studio получила информацию о проекте и ваши контактные данные.",
      stepOneTitle: "Мы изучим бриф",
      stepOneText:
        "Проверим этап проекта, приоритеты, бюджет и визуальное направление.",
      stepTwoTitle: "Уточним подходящий формат",
      stepTwoText:
        "Сопоставим предварительную рекомендацию с объёмом работ и локацией.",
      stepThreeTitle: "Свяжемся с вами",
      stepThreeText:
        "Вы получите персональный ответ выбранным способом связи.",
      timing: "Обычный срок ответа: 1–2 рабочих дня.",
      projectsButton: "Вернуться к проектам",
      restartButton: "Начать новый бриф"
    }
  };

  function currentLanguage() {
    const saved = localStorage.getItem("formaLanguage");
    return ["en", "es", "ru"].includes(saved) ? saved : "en";
  }

  function render() {
    const languageCopy = copy[currentLanguage()];

    section.querySelectorAll("[data-confirmation-text]").forEach((element) => {
      const key = element.dataset.confirmationText;
      if (languageCopy[key]) {
        element.textContent = languageCopy[key];
      }
    });
  }

  function show() {
    section.hidden = false;
    localStorage.setItem("formaContactSent", "true");
    render();
  }

  function restartBrief() {
    localStorage.removeItem("formaProjectBrief");
    localStorage.removeItem("formaContactRequest");
    localStorage.removeItem("formaContactSent");

    section.hidden = true;

    window.location.hash = "brief";
    window.location.reload();
  }

  window.addEventListener("forma:contact-sent", show);
  restartButton?.addEventListener("click", restartBrief);

  const observer = new MutationObserver(render);

  if (languageLabel) {
    observer.observe(languageLabel, {
      childList: true,
      characterData: true,
      subtree: true
    });
  }

  if (localStorage.getItem("formaContactSent") === "true") {
    section.hidden = false;
  }

  render();
});
