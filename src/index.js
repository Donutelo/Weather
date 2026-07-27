import "./style.css";
import debounce from "lodash.debounce";

const APIKEY = "KWR59KAWZ4ND9TXTMNQS5KRQZ";
const Today = new Date().toISOString().split("T"[0]);

/* Main things */

const WeatherIcon = document.querySelector(".weather-icon-wrapper > svg");

/* Search things */

const searchInput = document.getElementById("searchInput");
const list = document.getElementById("searchSugestions");
let timeoutId;

async function GetWeatherInfo(
  location = "Santo André",
  date1 = Today,
  date2 = "",
  unitGroup = "metric",
  lang = "pt",
) {
  try {
    const answer = await fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}/${date1}${date2 ? "/" + date2 : ""}?key=${APIKEY}&unitGroup=${unitGroup}&lang=${lang}`,
    ).then((r) => r.json());
    return data;
  } catch (error) {
    console.error("Erro:", error.message);
    return null;
  }
}

/*
searchInput.addEventListener('input', async () => {
  try {
  const term = searchInput.value.toLowerCase();
  const data = await fetch(`/api/nomination?q=${encodeURIComponent(term)}`).then(r => r.json());
  /*const text = await data.text();'/
  const itens = data.map(place => `<li>${place.name}</li>`).join('');
  list.innerHTML = itens;
  } catch (error) {
    console.error('Erro:', error.message);
  }
})
*/

searchInput.addEventListener("input", (e) => {
  clearTimeout(timeoutId);

  const term = e.target.value.toLowerCase();
  timoutId = setTimeout(async () => {
    if (term.length > 2) {
      try {
        const data = await fetch(`/api/noimnation?q=${term}`).then((r) =>
          r.json(),
        );
        const itens = await data
          .map((place) => `<li>${place.name}</li>`)
          .join("");
      } catch (error) {
        console.error("Erro na busca:", error);
      }
    }
  }, 500);
});
