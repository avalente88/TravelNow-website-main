const Amadeus = require("amadeus");

const amadeus = new Amadeus({
  clientId: "8k7L2HM3T5ApBkArcX24IYVkw2iv5LaA",
  clientSecret: "IFnNDbzM7232IRYF",
});

async function buscarVoos() {
  try {
    const response = await amadeus.shopping.flightOffersSearch.get({
      originLocationCode: "LIS",
      destinationLocationCode: "SCL",
      departureDate: "2026-08-03",
      adults: 1,
      max: 10
    });

    console.log(
      response
    );
  } catch (error) {
    console.error("Erro ao buscar voos:");
    console.error(error.response?.data || error.message);
  }
}

buscarVoos();
