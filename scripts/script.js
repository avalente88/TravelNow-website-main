// Aplica data-labels a todas as TD com base no texto dos TH
function applyDataLabels(table) {
  if (!table) return;
  const ths = Array.from(table.querySelectorAll('thead th'));
  if (!ths.length) return;
  // Extrai os textos dos TH (tratando espaços e quebras)
  const headers = ths.map(th => (th.textContent || '').replace(/\s+/g, ' ').trim());
  // Aplica em cada TD
  table.querySelectorAll('tbody tr').forEach(tr => {
    Array.from(tr.children).forEach((td, i) => {
      const label = headers[i] || '';
      if (label) td.setAttribute('data-label', label);
    });
  });
}

// Aplica aos seletores desejados
function makeStackedTables(...selectors) {
  selectors.forEach(sel => {
    document.querySelectorAll(sel).forEach(applyDataLabels);
  });
}


document.addEventListener('DOMContentLoaded', () => {
  const map = document.getElementById('world-map-svg');
  const placeholder = document.getElementById('placeholder');
  const loader = document.getElementById('loader');
  const countryDataDisplay = document.getElementById('country-data');

  const countryNameEl = document.getElementById('country-name');
  const countryContinentEl = document.getElementById('country-continent');
  const countryCapitalEl = document.getElementById('country-capital');
  const countryPopulationEl = document.getElementById('country-population');
  const countryAreaEl = document.getElementById('country-area');
  const countryFlagEl = document.getElementById('country-flag');
  const countryCurrenciesEl = document.getElementById('country-currencies');
  const countryLanguagesEl = document.getElementById('country-languages');
  // const countryMapLinkEl = document.getElementById('country-map-link');

  const ROTEIROS_BY_COUNTRY = {
    // Uzbequistão
    UZB: [
      { title: 'Uzbequistão com extensão ao Turcomenistão', href: 'Plans/global_itinerary.html?itinerary=uzbekistan1' }
    ],
    TKM: [
      { title: 'Uzbequistão com extensão ao Turcomenistão', href: 'Plans/global_itinerary.html?itinerary=uzbekistan1' } 
    ],
    // Chile
    CHL: [
      { title: 'Patagónia e Rio de Janeiro', href: 'Plans/global_itinerary.html?itinerary=patagonia1' }
    ],
    // Argentina
    ARG: [
      { title: 'Patagónia e Rio de Janeiro', href: 'Plans/global_itinerary.html?itinerary=patagonia1' }
    ],
    // Brasil
    BRA: [
      { title: 'Patagónia e Rio de Janeiro', href: 'Plans/global_itinerary.html?itinerary=patagonia1' }
    ],
    // Fallback global (opcional)
    _DEFAULT: [
      // { title: 'Europa: 10 dias — capitais clássicas', href: '/plans/europe-classics.html' }
    ]
  };

    Object.keys(ROTEIROS_BY_COUNTRY).forEach(code => {
    const el = document.querySelector(`svg path[id="${code}"]`);
    if (el) {
      el.classList.add("tem-roteiro");
    }
  });


  // Tabelas responsivas (cards em mobile)
  makeStackedTables('#voos table', '#hoteis table');
  const observer = new MutationObserver(() => {
    makeStackedTables('#voos table', '#hoteis table');
  });
  document.querySelectorAll('#voos table tbody, #hoteis table tbody').forEach(tbody => {
    observer.observe(tbody, { childList: true, subtree: true });
  });

  // --- ESTADO DE SELEÇÃO NO MAPA ---
  let activeCountryPath = null;

  // --- HANDLER DE CLIQUE NO MAPA (ORIGINAL) ---
  if (map) {
    map.addEventListener('click', async (event) => {
      const targetPath = event.target.closest('path');
      if (!targetPath) return;

      // alterna destaque
      if (activeCountryPath) {
        activeCountryPath.classList.remove('active');
      }
      targetPath.classList.add('active');
      activeCountryPath = targetPath;

      // UI estado de carregamento
      if (placeholder) placeholder.classList.add('hidden');
      if (countryDataDisplay) countryDataDisplay.classList.add('hidden');
      if (loader) loader.classList.remove('hidden');

      const countryCode = targetPath.getAttribute('id');
      const countryName = targetPath.getAttribute('title') || 'Unknown';
      // console.log(`Clicked on country: ${countryName} (${countryCode})`);

      try {
       
        const response = await fetch('/JSON/countryInfo.json');
        const countries = await response.json();

        const countryInfo = countries.find(
          c => c.cca3.toLowerCase() === countryCode.toLowerCase()
        );

        updateInfoPanel(countryInfo);
        renderRoteiros(countryCode);

      } catch (error) {
        console.error("API Error:", error);
        displayError(countryName);
      }
    });
  }

  // --- FUNÇÕES DE UI / INFO ---
  function updateInfoPanel(data) {
    if (data.flags && data.flags.svg) {
      countryFlagEl.src = data.flags.svg;
      countryFlagEl.alt = `Flag of ${data.name.common}`;
      countryFlagEl.classList.remove('hidden');
    } else {
      countryFlagEl.classList.add('hidden');
    }
    countryNameEl.textContent = data.name?.common || 'N/A';
    countryContinentEl.textContent = (data.continents && data.continents[0]) || 'N/A';
    countryCapitalEl.textContent = (data.capital && data.capital[0]) || 'N/A';
    countryPopulationEl.textContent = data.population ? data.population.toLocaleString() : 'N/A';
    countryAreaEl.textContent = data.area ? data.area.toLocaleString() : 'N/A';

    const currencies = data.currencies
      ? Object.values(data.currencies).map(c => `${c.name} (${c.symbol})`).join(', ')
      : 'N/A';
    countryCurrenciesEl.textContent = currencies;

    const languages = data.languages ? Object.values(data.languages).join(', ') : 'N/A';
    countryLanguagesEl.textContent = languages;

    // countryMapLinkEl.href = data.maps.googleMaps || '#';
    // countryMapLinkEl.classList.remove('pointer-events-none', 'opacity-50');

    if (loader) loader.classList.add('hidden');
    if (countryDataDisplay) countryDataDisplay.classList.remove('hidden');
  }

  function displayError(name) {
    countryFlagEl.classList.add('hidden');
    countryNameEl.textContent = name;
    countryContinentEl.textContent = "Error";
    countryCapitalEl.textContent = "Could not load data.";
    countryPopulationEl.textContent = "-";
    countryAreaEl.textContent = "-";
    countryCurrenciesEl.textContent = "-";
    countryLanguagesEl.textContent = "-";
    // countryMapLinkEl.href = '#';
    // countryMapLinkEl.classList.add('pointer-events-none', 'opacity-50');
    if (loader) loader.classList.add('hidden');
    if (countryDataDisplay) countryDataDisplay.classList.remove('hidden');
  }

  function renderRoteiros(iso2, opts = {}) {
    const container = document.getElementById('roteiros');
    if (!container) return;
    const key = (iso2 || '').toUpperCase();
    const items = ROTEIROS_BY_COUNTRY[key] || [];
    if (!items.length) {
      container.innerHTML = '<span class="text-slate-500">Sem roteiros disponíveis para este país.</span>';
      return;
    }
    // Um por linha (mais legível):
    container.innerHTML = items
      .map(it => `<div><a style="color: deeppink" href="${it.href}">${it.title}</a></div>`)
      .join('');
  }

  // -------------------------------------------------------------------------
  //                        🔎 COUNTRY SEARCH FEATURE
  // -------------------------------------------------------------------------
  // Requisitos de HTML:
  //   <input id="country-search" ... />
  //   <div id="search-suggestions"></div>

  const searchInput = document.getElementById("country-search");
  const suggestionsBox = document.getElementById("search-suggestions");

  // helper para mostrar/ocultar sugestões
  function showSuggestions(list) {
    if (!suggestionsBox) return;
    if (!list.length) {
      suggestionsBox.innerHTML = "<div>No matches</div>";
    } else {
      suggestionsBox.innerHTML = list
        .map(item => `<div data-code="${item.code}">${item.name}</div>`)
        .join("");
    }
    suggestionsBox.classList.remove("hidden");
  }
  function hideSuggestions() {
    if (!suggestionsBox) return;
    suggestionsBox.classList.add("hidden");
  }

  // Constrói o índice de países a partir do SVG
  // (roda após DOM pronto; o SVG já existe no DOM)
  const allCountries = map
    ? Array.from(map.querySelectorAll(":scope > path")).map(path => ({
        code: path.id,
        name: path.getAttribute("title") || ""
      }))
    : [];

  // Digitação no input
  if (searchInput) {
    searchInput.addEventListener("input", () => {
      const q = searchInput.value.trim().toLowerCase();
      if (q.length < 3) {
        hideSuggestions();
        return;
      }
      const matches = allCountries
        .filter(c => c.name.toLowerCase().includes(q))
        .sort((a, b) => a.name.localeCompare(b.name));

      showSuggestions(matches);
    });
  }

  // Clique numa sugestão → simular clique REAL no path
  if (suggestionsBox) {
    suggestionsBox.addEventListener("click", (event) => {
      const div = event.target.closest("div[data-code]");
      if (!div) return;

      const code = div.getAttribute("data-code");
      const path = map?.querySelector(`path[id="${CSS.escape(code)}"]`);
      if (!path) return;

      // 🔥 MUITO IMPORTANTE: disparar MouseEvent real para acionar o mesmo handler do mapa
      path.dispatchEvent(
        new MouseEvent("click", {
          bubbles: true,
          cancelable: true,
          view: window
        })
      );

      // Atualiza input e fecha sugestões
      searchInput.value = path.getAttribute("title") || code;
      hideSuggestions();

      // (Opcional) garantir foco sai do input no mobile
      searchInput.blur?.();
    });
  }

  // Fechar sugestões ao clicar fora
  document.addEventListener("click", (event) => {
    if (!event.target.closest?.("#country-search") &&
        !event.target.closest?.("#search-suggestions")) {
      hideSuggestions();
    }
  });

  // (Opcional) Enter seleciona a primeira sugestão
  if (searchInput) {
    searchInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const first = suggestionsBox?.querySelector("div[data-code]");
        if (first) {
          first.click();
          e.preventDefault();
        }
      }
      if (e.key === "Escape") {
        hideSuggestions();
      }
    });
  }
});
``