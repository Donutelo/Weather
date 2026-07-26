import "./style.css";
import { app } from './server.js';

app.listen(3000);
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
    console.error('Erro:', error.message);
    return null;
  }
}

searchInput.addEventListener('input', async () => {
  try {
  const term = searchInput.value.toLowerCase();
  const url = `https://corsproxy.io/?${encodeURIComponent('https://nominatim.openstreetmap.org/search?q=' + encodeURIComponent(term))}`;
  const data = await fetch(url, {
    headers: {
      'User-Agent': 'Weather/1.0 gustavobm2049@hotmail.com'
    }
  }) /*.then(r => r.json());*/
  const text = await data.text();
  const itens = data.map(place => `<li>${place.name}</li>`).join('');
  list.innerHTML = itens;
  } catch (error) {
    console.error('Erro:', error.message);
  }
})