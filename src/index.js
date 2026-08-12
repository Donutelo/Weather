import "./css/style.css";
import "/workspaces/Weather/src/css/weather-icons.min.css"
import { tightlyCropSvg } from "@svg-fns/layout";

const APIKEY = "KWR59KAWZ4ND9TXTMNQS5KRQZ";
const today = new Date().toISOString().split("T")[0];

const iconMap = {
  snow: "wi-snow",
  rain: "wi-rain",
  fog: "wi-fog",
  wind: "wi-windy",
  cloudy: "wi-cloudy",
  "partly-cloudy-day": "wi-day-cloudy",
  "partily-cloudy-night": "wi-night-cloudy",
  "clear-day": "wi-day-sunny",
  "clear-night": "wi-night-cloudy",
};

/* Main things */

const weatherIcon = document.querySelector("#weatherIcon");
const humidityDOM = document.querySelector("#humidity");
const windSpeedDOM = document.querySelector("#windSpeed");
const feelsLikeDOM = document.querySelector("#feelsLike");

/* Search things */

const searchInput = document.getElementById("searchInput");
const list = document.getElementById("searchSugestions");
let timeoutId;

async function getWeatherInfo({
  location = "Santo André",
  date1 = today,
  date2 = "",
  unitGroup = "metric",
  lang = "pt",
} = {}) {
  try {
    const answer = await fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}/${date1}${date2 ? "/" + date2 : ""}?key=${APIKEY}&unitGroup=${unitGroup}&lang=${lang}&include=days&elements=humidity,windspeed,feelslike,icon&iconSet=icons1`,
    );

    const data = await answer.json();
    const text = JSON.stringify(data);

    return data;
  } catch (error) {
    console.error("Erro:", error.message);
    return null;
  }
}

searchInput.addEventListener("input", (e) => {
  clearTimeout(timeoutId);

  const term = e.target.value.toLowerCase();
  timeoutId = setTimeout(async () => {
    if (term.length > 2) {
      try {
        const data = await fetch(`/api/nomination?q=${term}`).then((r) =>
          r.json(),
        );

        if (!Array.isArray(data)) {
          throw new Error("Resposta não é uma array");
        }

        const shortNames = data
          .map((place) => ({
            id: place.place_id,
            name: place.display_name.split(",").slice(0, 4).join(","),
          }))
          .filter((item, index, self) => {
            return index === self.findIndex((i) => i.name === item.name);
          })
          .slice(0, 3);

        const itens = shortNames
          .map((item) => `<li>${item.name}</li>`)
          .join("");

        list.innerHTML = itens;

        list.querySelectorAll("li").forEach((item) => {
          item.addEventListener("click", async (e) => {
            const itemInfo = e.target.innerText;
            const weatherInfo = await getWeatherInfo({ location: itemInfo });

            const classes = iconMap[weatherInfo.days[0].icon];
            weatherIcon.className = `wi ${classes}`;
            
            humidityDOM.innerText = `${weatherInfo.days[0].humidity}%`;
            feelsLikeDOM.innerText = `${weatherInfo.days[0].feelslike}C°`;
            windSpeedDOM.innerText = `${weatherInfo.days[0].windspeed}kph`;

            list.innerHTML = "";
          });
        });
      } catch (error) {
        console.error("Erro na busca:", error);
      }
    } else {
      list.innerHTML = "";
    }
  }, 500);
});
