"use strict";

document.addEventListener("DOMContentLoaded", () => {
    const translations = window.formaTranslations;

    const languageToggle = document.querySelector("#languageToggle");
    const languageMenu = document.querySelector("#languageMenu");
    const currentLanguageLabel = document.querySelector("#currentLanguage");
    const languageOptions = document.querySelectorAll("[data-language]");

    const menuToggle = document.querySelector("#menuToggle");
    const menuClose = document.querySelector("#menuClose");
    const siteMenu = document.querySelector("#siteMenu");
    const menuLinks = document.querySelectorAll("[data-menu-link]");

    const supportedLanguages = ["en", "es", "ru"];
    const languageLabels = {
        en: "EN",
        es: "ES",
        ru: "RU",
    };

    function getSavedLanguage() {
        const savedLanguage = localStorage.getItem("formaLanguage");

        if (supportedLanguages.includes(savedLanguage)) {
            return savedLanguage;
        }

        return "en";
    }

    function getNestedValue(object, path) {
        return path
            .split(".")
            .reduce((currentValue, key) => {
                if (
                    currentValue &&
                    Object.prototype.hasOwnProperty.call(currentValue, key)
                ) {
                    return currentValue[key];
                }

                return null;
            }, object);
    }

    function applyLanguage(language) {
        if (!supportedLanguages.includes(language)) {
            language = "en";
        }

        const dictionary = translations[language];

        document.documentElement.lang = language;
        currentLanguageLabel.textContent = languageLabels[language];

        document.querySelectorAll("[data-i18n]").forEach((element) => {
            const translationKey = element.dataset.i18n;
            const translatedValue = getNestedValue(
                dictionary,
                translationKey
            );

            if (typeof translatedValue === "string") {
                element.textContent = translatedValue;
            }
        });

        languageOptions.forEach((option) => {
            const isActive = option.dataset.language === language;

            option.classList.toggle("is-active", isActive);
            option.setAttribute(
                "aria-pressed",
                String(isActive)
            );
        });

        localStorage.setItem("formaLanguage", language);
    }

    function openLanguageMenu() {
        languageMenu.hidden = false;
        languageToggle.setAttribute("aria-expanded", "true");
    }

    function closeLanguageMenu() {
        languageMenu.hidden = true;
        languageToggle.setAttribute("aria-expanded", "false");
    }

    function toggleLanguageMenu() {
        const isOpen =
            languageToggle.getAttribute("aria-expanded") === "true";

        if (isOpen) {
            closeLanguageMenu();
        } else {
            openLanguageMenu();
        }
    }

    function openSiteMenu() {
        siteMenu.classList.add("is-open");
        siteMenu.setAttribute("aria-hidden", "false");
        menuToggle.setAttribute("aria-expanded", "true");
        document.body.classList.add("menu-open");

        window.setTimeout(() => {
            menuClose.focus();
        }, 100);
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

    languageMenu.addEventListener("click", (event) => {
        event.stopPropagation();
    });

    languageOptions.forEach((option) => {
        option.addEventListener("click", () => {
            const selectedLanguage = option.dataset.language;

            applyLanguage(selectedLanguage);
            closeLanguageMenu();
        });
    });

    document.addEventListener("click", () => {
        closeLanguageMenu();
    });

    menuToggle.addEventListener("click", openSiteMenu);
    menuClose.addEventListener("click", closeSiteMenu);

    menuLinks.forEach((link) => {
        link.addEventListener("click", closeSiteMenu);
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeLanguageMenu();
            closeSiteMenu();
        }
    });

    applyLanguage(getSavedLanguage());
});