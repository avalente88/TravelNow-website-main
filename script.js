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
            //const countryMapLinkEl = document.getElementById('country-map-link');

            const ROTEIROS_BY_COUNTRY = {
            // México
            MX: [
            { title: 'México: do óbvio de Quintana Roo a Los Cabos', href: 'Plans/Americas/quintana-roo-los-cabos.html' }
            ],

            // Uzbequistão
            UZ: [
            { title: 'Uzbequistão com extensão ao Turcomenistão', href: 'Plans/Asia/uzbekistan-turkmenistan-plan.html' }
            ],

            // Portugal (exemplo vazio)
            PT: [
            // { title: 'Portugal: Alentejo Essencial', href: '/plans/portugal-alentejo.html' }
            ],

            // Fallback global (opcional)
            _DEFAULT: [
            // { title: 'Europa: 10 dias — capitais clássicas', href: '/plans/europe-classics.html' }
            ]
            };

            let activeCountryPath = null;
            
            map.addEventListener('click', async (event) => {
                const targetPath = event.target.closest('path');
                // console.log(targetPath);

                if (!targetPath) return;

                if (activeCountryPath) {
                    activeCountryPath.classList.remove('active');
                }

                targetPath.classList.add('active');
                activeCountryPath = targetPath;

                placeholder.classList.add('hidden');
                countryDataDisplay.classList.add('hidden');
                loader.classList.remove('hidden');

                const countryCode = targetPath.getAttribute('id');
                const countryName = targetPath.getAttribute('title') || 'Unknown';
                console.log(`Clicked on country: ${countryName} (${countryCode})`);

                try {
                    const response = await fetch(`https://restcountries.com/v3.1/alpha/${countryCode}`);
                    
                    if (!response.ok) {
                        throw new Error(`Could not fetch data for ${countryName}`);
                    }
                    
                    const data = await response.json();
                    const countryInfo = data[0];

                    updateInfoPanel(countryInfo);
                    renderRoteiros(countryCode);

                } catch (error) {
                    console.error("API Error:", error);
                    displayError(countryName);
                }
            });

            function updateInfoPanel(data) {

                if (data.flags && data.flags.svg) {
                    countryFlagEl.src = data.flags.svg;
                    countryFlagEl.alt = `Flag of ${data.name.common}`;
                    countryFlagEl.classList.remove('hidden');
                } else {
                    countryFlagEl.classList.add('hidden');
                }

                countryNameEl.textContent = data.name.common || 'N/A';
                countryContinentEl.textContent = (data.continents && data.continents[0]) || 'N/A';
                countryCapitalEl.textContent = (data.capital && data.capital[0]) || 'N/A';
                countryPopulationEl.textContent = data.population ? data.population.toLocaleString() : 'N/A';
                countryAreaEl.textContent = data.area ? data.area.toLocaleString() : 'N/A';
                const currencies = data.currencies ? Object.values(data.currencies).map(c => `${c.name} (${c.symbol})`).join(', ') : 'N/A';
                countryCurrenciesEl.textContent = currencies;
                const languages = data.languages ? Object.values(data.languages).join(', ') : 'N/A';
                countryLanguagesEl.textContent = languages;
                //countryMapLinkEl.href = data.maps.googleMaps || '#';
                //countryMapLinkEl.classList.remove('pointer-events-none', 'opacity-50');
                

                loader.classList.add('hidden');
                countryDataDisplay.classList.remove('hidden');
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
                //countryMapLinkEl.href = '#';
                //countryMapLinkEl.classList.add('pointer-events-none', 'opacity-50');

                loader.classList.add('hidden');
                countryDataDisplay.classList.remove('hidden');
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

  // Se quiseres como "pontos medianos": usa separador " • "
  // container.innerHTML = items.map(it => `<a style="color: deeppink" href="${it.href}">${it.title}</a>`).join('<span class="text-slate-400 mx-2">•</span>');

  // Um por linha (mais legível):
  container.innerHTML = items.map(it =>
    `<div><a style="color: deeppink" href="${it.href}">${it.title}</a></div>`
  ).join('');
}




        });