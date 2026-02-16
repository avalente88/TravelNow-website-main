const params = new URLSearchParams(window.location.search);
const tripKey = params.get('itinerary');
const filePath = "/Plans/JSON/" + tripKey + ".json";

export async function loadData() {

    const response = await fetch(filePath); 

    const text = await response.text(); 

    const trips = JSON.parse(text); 
    // 
    return trips;
}

export const trips = await loadData();