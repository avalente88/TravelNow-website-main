import { trips } from "./itinerary.js"; 

// ----------------------------
// Render Basic Information 
// ----------------------------

const itineraryRoute= document.getElementById("itineraryRoute");
itineraryRoute.innerHTML = "<strong>Itinerário: </strong>" + trips.itineraryRoute;
const dayNumber= document.getElementById("dayNumber");
dayNumber.innerHTML = trips.numberOfDays;
const totalPrice= document.getElementById("totalPrice");
totalPrice.innerHTML = trips.totalPrice;

// ----------------------------
// Render Photos 
// ----------------------------
const imageGalery= document.getElementById("imageGalery");
const imagesData = trips.figures;

imagesData.forEach((d, idx) => {
    imageGalery.innerHTML = ""; // limpa antes de preencher

    imagesData.forEach((d, idx) => {
        imageGalery.innerHTML = ""; // limpa antes de preencher

        imagesData.forEach(img => {
        const figure = document.createElement("figure");
        

        figure.innerHTML = `
            <img src="${img.source}" alt="${img.alt}" />
            <figcaption>${img.caption}</figcaption>
        `;

        imageGalery.appendChild(figure);
        });    
    });
});

// ----------------------------
// Render Initial Flights
// ----------------------------
const flightTBody= document.querySelector("#flightTable tbody");
const flightsData = trips.flights;

flightsData.forEach((d, idx) => {
    flightTBody.innerHTML = ""; // limpa antes de preencher

    flightsData.forEach(flight => {
    const trFlight = document.createElement("tr");

    trFlight.innerHTML = `
        <td>${flight.from}</td>
        <td>${flight.to}</td>
        <td>${flight.duration}</td>
        <td>${flight.stops}</td>
        <td class="right">${flight.price.toFixed(2).replace(".", ",")}&nbsp;€</td>
    `;

    flightTBody.appendChild(trFlight);
    });    
});


// ----------------------------
// Render Hotels
// ----------------------------

const restaurantSection = document.getElementById("restaurantes");
if (trips.restaurants.length == 0){
    restaurantSection.hidden = "true";
}

const hotelsTBody= document.querySelector("#hotelsTable tbody");
const hotelsData = trips.hotels;

hotelsData.forEach((d, idx) => {
    hotelsTBody.innerHTML = ""; // limpa antes de preencher

    hotelsData.forEach(hotel => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
        <td><a class="hotel" href="${hotel.url}" target="_blank" rel="noopener">${hotel.hotel}</a></td>
        <td>${hotel.local}</td>
        <td>${hotel.noites}</td>
        <td>${hotel.regime}</td>
        <td class="right">${hotel.preco.toFixed(2).replace(".", ",")}&nbsp;€</td>
    `;

    hotelsTBody.appendChild(tr);
    });    
});


// ----------------------------
// Render Restaurants
// ----------------------------

  const restaurantData = trips.restaurants;
  const container = document.querySelector("#restaurantes .resto-grid");
  container.innerHTML = ""; // limpar

  restaurantData.forEach(cityBlock => {
    const div = document.createElement("div");
    div.className = "resto";

    // título da cidade
    div.innerHTML += `<h4>${cityBlock.city}</h4>`;

    // restaurantes
    cityBlock.restaurants.forEach((r, index) => {
      div.innerHTML += `
        <div class="meta">
          <strong>${r.name}</strong>
          ${r.location ? ` — ${r.location}` : ""}
        </div>
        <div class="tip">${r.tip}</div>
        ${index < cityBlock.restaurants.length - 1 ? "<hr>" : ""}
      `;
    });

    container.appendChild(div);
  });



// ----------------------------
// Render Daily List
// ----------------------------

const colorByType = (type) => {
    // normaliza para classes existentes (mantém novas onde aplicável)
    if (type === "avião" || type === "voo") return "tag-voo";
    if (type === "comboio") return "tag-comboio";
    if (type === "tour") return "tag-tour";
    if (type === "autocarro") return "tag-autocarro";
    if (type === "ferry" || type === "barco") return "tag-ferry";
    return "tag-estrada"; // fallback
};

const root = document.getElementById('dailyList');
const daysData = trips.days;

const tagFlight = document.getElementById("tagFlight");
const tagTour = document.getElementById("tagTour");
const tagRoad = document.getElementById("tagRoad");
const tagTrain = document.getElementById("tagTrain");
const tagBus = document.getElementById("tagBus");
const tagFerry = document.getElementById("tagFerry");

var hasTour = false;
var hasFlight = false;
var hasRoad = false;
var hasTrain = false;
var hasBus = false;
var hasFerry = false;

daysData.forEach((d, idx) => {

    if(!hasFlight)
        hasFlight = d.transport.some(t => t.type === "avião");
    if(!hasTour)
        hasTour = d.transport.some(t => t.type === "tour");
    if(!hasRoad)
        hasRoad = d.transport.some(t => t.type === "estrada");
    if(!hasTrain)
        hasTrain = d.transport.some(t => t.type === "comboio");
    if(!hasBus)
        hasBus = d.transport.some(t => t.type === "autocarro");
    if(!hasFerry)
        hasFerry = d.transport.some(t => t.type === "ferry");

    // Linha simples
    const line = document.createElement('div');
    line.className = 'day-line';
    line.setAttribute('data-index', idx);

    const left = document.createElement('div');
    left.className = 'left';

    const date = document.createElement('div');
    date.className = 'date';
    date.textContent = d.date;

    const city = document.createElement('div');
    city.className = 'city';
    city.textContent = '— ' + d.city;

    left.appendChild(date);
    left.appendChild(city);

    // Tags de transporte
    if (d.transport && d.transport.length){
    d.transport.forEach(t => {
        const span = document.createElement('span');
        span.className = `tag ${colorByType(t.type)}`;
        // mostrar o tipo com eventual horário/texto
        const label = (t.type === 'voo') ? 'avião' : t.type;
        span.textContent = t.text ? `${label} ${t.text}` : label;
        left.appendChild(span);
    });
    }

    // Botão "Ver detalhes"
    const btn = document.createElement('button');
    btn.className = 'btn-tag';
    btn.type = 'button';
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-controls', `details-${idx}`);
    btn.textContent = 'Ver detalhes';

    // Wrapper da linha
    line.appendChild(left);
    line.appendChild(btn);

    // Bloco de detalhes (inicialmente fechado)
    const details = document.createElement('div');
    details.className = 'day-details';
    details.id = `details-${idx}`;

    (d.details || []).forEach(group => {
    const wrap = document.createElement('div');
    wrap.className = 'group';
    if (group.label){
        const h4 = document.createElement('h4');
        h4.textContent = group.label;
        wrap.appendChild(h4);
    }
    (group.items || []).forEach(it => {
        const p = document.createElement('div');
        p.className = 'bullet';
        p.textContent = '• ' + it;
        wrap.appendChild(p);
    });
    details.appendChild(wrap);
    });

    // Clique: abre/fecha
    btn.addEventListener('click', () => {
    const open = details.classList.contains('open');
    details.classList.toggle('open');
    btn.setAttribute('aria-expanded', String(!open));
    btn.textContent = open ? 'Ver detalhes' : 'Ocultar';
    });

    // Anexa ao DOM
    root.appendChild(line);
    root.appendChild(details);
});

if(!hasTour)
    tagTour.style.display = hasTour ? "inline-block" : "none";

if(!hasFlight)
     tagFlight.style.display = hasFlight ? "inline-block" : "none";

if(!hasRoad)
     tagRoad.style.display = hasRoad ? "inline-block" : "none";

if(!hasTrain)
     tagTrain.style.display = hasTrain ? "inline-block" : "none";

if(!hasBus)
     tagBus.style.display = hasBus ? "inline-block" : "none";

if(!hasFerry)
     tagFerry.style.display = hasFerry ? "inline-block" : "none";


// ----------------------------
// Render Tours
// ----------------------------

const toursTBody= document.querySelector("#tourTable tbody");
const toursData = trips.tours;

const tourSection = document.getElementById("toursSection");

if (toursData.length==0){
    tourSection.hidden = "true";
}
else{
    toursData.forEach((d, idx) => {
        toursTBody.innerHTML = ""; // limpa antes de preencher

        toursData.forEach(tour => {
        const trTours = document.createElement("tr");

        trTours.innerHTML = `
            <td><a class="hotel" href="${tour.href}" target="_blank" rel="noopener">${tour.name}</a></td>
            <td>${tour.location}</td>
            <td>${tour.price}</td>
        `;

        toursTBody.appendChild(trTours);
        });    
    });
}