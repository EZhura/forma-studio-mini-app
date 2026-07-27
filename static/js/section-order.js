"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const sectionNumbers = [
    { selector: "#projects [data-i18n='projects.eyebrow']", prefix: "01" },
    { selector: "#studio [data-studio-text='eyebrow']", prefix: "02" },
    { selector: "#visual-direction [data-i18n='visual.eyebrow']", prefix: "03" },
    { selector: "#services [data-i18n='services.eyebrow']", prefix: "04" },
    { selector: "#process [data-i18n='process.eyebrow']", prefix: "05" },
    { selector: "#brief [data-brief-text='eyebrow']", prefix: "06" },
    { selector: "#recommendation [data-recommendation-text='eyebrow']", prefix: "07" },
    { selector: "#contact [data-contact-text='eyebrow']", prefix: "08" }
  ];

  const confirmationEyebrow = document.querySelector(
    "#confirmation [data-confirmation-text='eyebrow']"
  );

  function labelWithoutNumber(value) {
    return String(value || "")
      .replace(/^\s*\d+\s*\/\s*/, "")
      .trim();
  }

  function applySectionNumbers() {
    sectionNumbers.forEach(({ selector, prefix }) => {
      const element = document.querySelector(selector);
      if (!element) return;

      const label = labelWithoutNumber(element.textContent);
      const nextValue = `${prefix} / ${label}`;
      if (element.textContent.trim() !== nextValue) {
        element.textContent = nextValue;
      }
    });

    if (confirmationEyebrow) {
      const label = labelWithoutNumber(confirmationEyebrow.textContent);
      if (confirmationEyebrow.textContent.trim() !== label) {
        confirmationEyebrow.textContent = label;
      }
    }
  }

  applySectionNumbers();

  const observedElements = [
    ...sectionNumbers
      .map(({ selector }) => document.querySelector(selector))
      .filter(Boolean),
    confirmationEyebrow
  ].filter(Boolean);

  const observer = new MutationObserver(() => {
    window.requestAnimationFrame(applySectionNumbers);
  });

  observedElements.forEach((element) => {
    observer.observe(element, {
      childList: true,
      characterData: true,
      subtree: true
    });
  });
});
