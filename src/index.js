import "./style.css";

const APIKEY = "KWR59KAWZ4ND9TXTMNQS5KRQZ";
const Today = new Date().toISOString().split('T'[0]);

/* Main things */

const WeatherIcon = document.querySelector(".weather-icon-wrapper > svg");

/* Search things */

const searchInput = document.getElementById('searchInput');
const list = document.getElementById('searchSugestions');

async function GetWeatherInfo(
  location = "Santo André",
  date1 = Today,
  date2 = "",
  unitGroup = "metric",
  lang = "pt",
) {
  try {
    const answer = await fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}/${date1}${date2 ? '/' + date2 : ''}?key=${APIKEY}&unitGroup=${unitGroup}&lang=${lang}`,
    ).then(r => r.json());
    return data;
  } catch (error) {
    console.err('Erro:', error.message);
    return null;
  }
}

searchInput.addEventListener('input', async () => {
  const term = searchInput.value.toLowerCase();
  const data = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(term)}&format=json&limit=5`).then(r => r.json());
  const itens = data.map(place => `<li>${place.name}</li>`).join('');
  list.innerHTML = itens;
})