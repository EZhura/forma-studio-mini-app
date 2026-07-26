"use strict";

window.formaVisualDirection = (() => {
  const atmosphereItems = [
    { id: "calm", score: { quiet: 3, natural: 1 }, labels: { en: "Calm", es: "Sereno", ru: "Спокойное" } },
    { id: "warm", score: { warm: 3, natural: 1 }, labels: { en: "Warm", es: "Cálido", ru: "Тёплое" } },
    { id: "sculptural", score: { sculptural: 3, expressive: 1 }, labels: { en: "Sculptural", es: "Escultórico", ru: "Скульптурное" } },
    { id: "minimal", score: { minimal: 3, quiet: 1 }, labels: { en: "Minimal", es: "Minimalista", ru: "Минималистичное" } },
    { id: "textured", score: { natural: 2, layered: 2 }, labels: { en: "Textured", es: "Texturizado", ru: "Фактурное" } },
    { id: "expressive", score: { expressive: 3, layered: 1 }, labels: { en: "Expressive", es: "Expresivo", ru: "Выразительное" } },
    { id: "timeless", score: { refined: 3, quiet: 1 }, labels: { en: "Timeless", es: "Atemporal", ru: "Вневременное" } },
    { id: "atmospheric", score: { atmospheric: 3, quiet: 1 }, labels: { en: "Atmospheric", es: "Atmosférico", ru: "Атмосферное" } }
  ];

  const contrastItems = [
    {
      id: "light",
      options: [
        { id: "light", image: "mood_light.webp", score: { minimal: 2, refined: 1 }, labels: { en: "Light", es: "Luminoso", ru: "Светлое" } },
        { id: "atmospheric", image: "mood_atmospheric.webp", score: { atmospheric: 3, quiet: 1 }, labels: { en: "Atmospheric", es: "Atmosférico", ru: "Атмосферное" } }
      ]
    },
    {
      id: "temperature",
      options: [
        { id: "warm", image: "mood_warm.webp", score: { warm: 3, natural: 1 }, labels: { en: "Warm", es: "Cálido", ru: "Тёплое" } },
        { id: "cool", image: "mood_cool.webp", score: { minimal: 2, sculptural: 1 }, labels: { en: "Cool", es: "Frío", ru: "Прохладное" } }
      ]
    },
    {
      id: "density",
      options: [
        { id: "minimal", image: "mood_minimal.webp", score: { minimal: 3, quiet: 1 }, labels: { en: "Minimal", es: "Minimalista", ru: "Минималистичное" } },
        { id: "layered", image: "mood_layered.webp", score: { layered: 3, expressive: 1 }, labels: { en: "Layered", es: "Con capas", ru: "Многослойное" } }
      ]
    },
    {
      id: "form",
      options: [
        { id: "soft", image: "mood_soft.webp", score: { natural: 2, quiet: 1 }, labels: { en: "Soft", es: "Suave", ru: "Мягкое" } },
        { id: "structured", image: "mood_structured.webp", score: { sculptural: 2, refined: 1 }, labels: { en: "Structured", es: "Estructurado", ru: "Структурное" } }
      ]
    }
  ];

  const materialItems = [
    { id: "stone", image: "material_stone.webp", score: { natural: 3, refined: 1 }, labels: { en: "Natural stone", es: "Piedra natural", ru: "Натуральный камень" } },
    { id: "timber", image: "material_timber.webp", score: { warm: 2, natural: 2 }, labels: { en: "Timber", es: "Madera", ru: "Дерево" } },
    { id: "plaster", image: "material_plaster.webp", score: { quiet: 2, atmospheric: 1 }, labels: { en: "Textured plaster", es: "Revoco texturizado", ru: "Фактурная штукатурка" } },
    { id: "metal", image: "material_metal.webp", score: { sculptural: 2, refined: 1 }, labels: { en: "Brushed metal", es: "Metal cepillado", ru: "Шлифованный металл" } },
    { id: "concrete", image: "material_concrete.webp", score: { minimal: 2, sculptural: 1 }, labels: { en: "Concrete", es: "Hormigón", ru: "Бетон" } },
    { id: "linen", image: "material_linen.webp", score: { warm: 1, natural: 2, quiet: 1 }, labels: { en: "Linen & textiles", es: "Lino y textiles", ru: "Лён и натуральный текстиль" } },
    { id: "colour", image: "material_colour.webp", score: { expressive: 3, layered: 1 }, labels: { en: "Coloured surfaces", es: "Superficies de color", ru: "Цветные поверхности" } },
    { id: "dark", image: "material_dark.webp", score: { atmospheric: 2, refined: 1 }, labels: { en: "Dark finishes", es: "Acabados oscuros", ru: "Тёмная отделка" } }
  ];

  const results = [
    {
      id: "warm-architectural-minimalism",
      keys: ["warm", "minimal"],
      image: "mood_warm.webp",
      titles: { en: "Warm Architectural Minimalism", es: "Minimalismo arquitectónico cálido", ru: "Тёплый архитектурный минимализм" },
      descriptions: {
        en: "A restrained direction softened by warm materials, natural textures and carefully controlled details.",
        es: "Una dirección contenida, suavizada por materiales cálidos, texturas naturales y detalles cuidadosamente controlados.",
        ru: "Сдержанное направление, смягчённое тёплыми материалами, натуральными фактурами и тщательно выверенными деталями."
      }
    },
    {
      id: "quiet-mediterranean-modernism",
      keys: ["quiet", "natural"],
      image: "mood_light.webp",
      titles: { en: "Quiet Mediterranean Modernism", es: "Modernismo mediterráneo sereno", ru: "Спокойный средиземноморский модернизм" },
      descriptions: {
        en: "Light, proportion and natural surfaces create a calm contemporary interior rooted in its surroundings.",
        es: "La luz, la proporción y las superficies naturales crean un interior contemporáneo sereno y conectado con su entorno.",
        ru: "Свет, пропорции и натуральные поверхности создают спокойный современный интерьер, связанный с окружающим контекстом."
      }
    },
    {
      id: "sculptural-materialism",
      keys: ["sculptural", "natural"],
      image: "mood_structured.webp",
      titles: { en: "Sculptural Materialism", es: "Materialidad escultórica", ru: "Скульптурная материальность" },
      descriptions: {
        en: "Strong volumes and expressive materials shape an interior with depth, weight and a clear architectural presence.",
        es: "Los volúmenes definidos y los materiales expresivos crean un interior con profundidad, peso y una clara presencia arquitectónica.",
        ru: "Выразительные объёмы и материалы формируют интерьер с глубиной, весом и ярко выраженным архитектурным характером."
      }
    },
    {
      id: "soft-contemporary-structure",
      keys: ["quiet", "sculptural"],
      image: "mood_soft.webp",
      titles: { en: "Soft Contemporary Structure", es: "Estructura contemporánea suave", ru: "Мягкая современная структура" },
      descriptions: {
        en: "Clear architectural lines are balanced by soft transitions, tactile finishes and a calm rhythm.",
        es: "Las líneas arquitectónicas claras se equilibran con transiciones suaves, acabados táctiles y un ritmo sereno.",
        ru: "Чёткие архитектурные линии уравновешены мягкими переходами, тактильной отделкой и спокойным ритмом."
      }
    },
    {
      id: "atmospheric-minimalism",
      keys: ["atmospheric", "minimal"],
      image: "mood_atmospheric.webp",
      titles: { en: "Atmospheric Minimalism", es: "Minimalismo atmosférico", ru: "Атмосферный минимализм" },
      descriptions: {
        en: "A reduced palette gains depth through shadow, contrast and carefully framed moments of light.",
        es: "Una paleta reducida adquiere profundidad mediante la sombra, el contraste y momentos de luz cuidadosamente encuadrados.",
        ru: "Сдержанная палитра получает глубину благодаря теням, контрастам и тщательно выстроенным световым акцентам."
      }
    },
    {
      id: "refined-naturalism",
      keys: ["refined", "natural"],
      image: "material_stone.webp",
      titles: { en: "Refined Naturalism", es: "Naturalismo refinado", ru: "Утончённый натурализм" },
      descriptions: {
        en: "Natural materials are composed with precision to create a timeless and quietly sophisticated interior.",
        es: "Los materiales naturales se combinan con precisión para crear un interior atemporal y discretamente sofisticado.",
        ru: "Натуральные материалы объединены с точностью, создавая вневременной и сдержанно утончённый интерьер."
      }
    },
    {
      id: "expressive-contemporary",
      keys: ["expressive", "sculptural"],
      image: "material_colour.webp",
      titles: { en: "Expressive Contemporary", es: "Contemporáneo expresivo", ru: "Выразительный современный интерьер" },
      descriptions: {
        en: "Colour, contrast and distinctive forms create an interior with a confident and memorable identity.",
        es: "El color, el contraste y las formas singulares crean un interior con una identidad segura y memorable.",
        ru: "Цвет, контраст и выразительные формы создают интерьер с уверенной и запоминающейся идентичностью."
      }
    },
    {
      id: "layered-mediterranean-interior",
      keys: ["layered", "warm"],
      image: "mood_layered.webp",
      titles: { en: "Layered Mediterranean Interior", es: "Interior mediterráneo con capas", ru: "Многослойный средиземноморский интерьер" },
      descriptions: {
        en: "Warm colour, collected textures and natural materials form a relaxed interior with depth and personality.",
        es: "Los tonos cálidos, las texturas combinadas y los materiales naturales forman un interior relajado, profundo y personal.",
        ru: "Тёплые оттенки, сочетание фактур и натуральные материалы формируют расслабленный интерьер с глубиной и характером."
      }
    }
  ];

  return { atmosphereItems, contrastItems, materialItems, results };
})();
