import { trips } from "./itinerary.js"; 

async function runSearch(){
    if(!dateInput.value) { dateInput.focus(); return; }

    const isoDate = dateInput.value; // yyyy-mm-dd
    thead.innerHTML = "<tr><th>Voos</th><th>Data</th><th>Origem</th><th>Destino</th><th>Partida</th><th>Chegada</th><th>Tempo</th><th>Escala</th><th class='right'>Preço</th></tr>";

    // Loading state
    if(tbody){
    tbody.innerHTML = '<tr><td colspan="9">A procurar voos…</td></tr>';
    }

    try{

    const flightSearch = trips.flightSearch; 
//json errado
    const offers = await getAllOffers(isoDate, flightSearch);

    const offersWithNoFlights = offers
        .map((o, index) => ({ index, vazio: o.length === 0 }))
        .filter(t => t.vazio)
        .map(t => t.index + 1); // +1 para ficar mais amigável ao utilizador

    const infoNoFlight = offersWithNoFlights.map(i => flightSearch[i]);
    const baseDate = new Date(isoDate);
    

    if (offersWithNoFlights.length > 0) {
        
        const details = offersWithNoFlights
            .map(i => {
                const { from, to, offset } = flightSearch[i];

                // criar uma cópia da baseDate
                const date = new Date(baseDate);
                date.setDate(date.getDate() + offset);

                const formattedDate = date.toLocaleDateString('pt-PT', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                });

                return `${getAirportLabel(from)} → ${getAirportLabel(to)} a ${formattedDate}`;
            })
            .join(', ');


        tbody.innerHTML = `
            <tr>
                <td colspan="9">
                    Não foram encontrados voos para os seguintes trajetos: ${details}.
                </td>
            </tr>
        `;
        return;
    }




    // Map first up to 10 results onto the table schema
    const rows = offers.slice(0,10).map(o => {
        const itin0 = o.itineraries?.[0];
        const seg0 = itin0?.segments?.[0];
        const lastSeg = itin0?.segments?.[itin0.segments.length-1];
        const dep = seg0?.departure?.at?.substring(11,16) || '';
        const arr = lastSeg?.arrival?.at?.substring(11,16) || '';
        const depAirport = getAirportLabel(seg0?.departure.iataCode);
        const arrAirport = getAirportLabel(lastSeg?.arrival.iataCode);
        const stops = getStops(itin0);
        const duration = itin0?.duration?.replace('PT','').toLowerCase() || '';
        const code = o.validatingAirlineCodes?.[0] || (seg0?.carrierCode||'') + (seg0?.number||'');
        const price = o.price?.total || '';
        const datePretty = seg0?.departure.at.split("T")[0].split('-').reverse().join('-');
        const flightNumber = itin0.segments?.map(seg => seg.carrierCode + seg.number).join(" + ");
        
        return `
        <tr>
            <td>${flightNumber}</td>
            <td>${datePretty}</td>
            <td>${depAirport}</td>
            <td>${arrAirport}</td>
            <td>${dep}</td>
            <td>${arr}</td>
            <td>${duration}</td>
            <td>${stops === 0 ? '' : stops.toString()}</td>
            <td class="right">${price ? price + ' €' : ''}</td>
        </tr>`; 
    }).join('');
    tbody.innerHTML = rows;
    }catch(err){
    console.error(err);
    tbody.innerHTML = '<tr><td colspan="9">Ocorreu um erro ao procurar voos.</td></tr>';
    }
}
const btn = document.getElementById('btnSearchFlights');
const dateInput = document.getElementById('departureDate');
const tbody = document.querySelector('#voos table tbody');
const thead = document.querySelector('#voos table thead');
          
if(btn){ btn.addEventListener('click', runSearch); }