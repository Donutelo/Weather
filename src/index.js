import "./css/style.css";
import "/workspaces/Weather/src/css/weather-icons.min.css";
import { tightlyCropSvg } from "@svg-fns/layout";

const API_KEY = "KWR59KAWZ4ND9TXTMNQS5KRQZ";
const API_URL = "https://reimagined-orbit-v7vpx5q6gj53pqw5-3000.app.github.dev";
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
const weatherCard = document.querySelector(".weather-card");
const weatherCardTitle = weatherCard.querySelector("h3");
let weatherCardInfo;

/* Search things */

const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");
const list = document.getElementById("searchSugestions");
let timeoutId;
let firstSearch = true;

async function getWeatherInfo({
  location = "Santo André",
  date1 = today,
  date2 = "",
  unitGroup = "metric",
  lang = "pt",
} = {}) {
  try {
    const answer = await fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}/${date1}${date2 ? "/" + date2 : ""}?key=${API_KEY}&unitGroup=${unitGroup}&lang=${lang}&include=days&elements=humidity,windspeed,feelslike,icon&iconSet=icons1`,
    );

    const data = await answer.json();
    const text = JSON.stringify(data);

    return data;
  } catch (error) {
    console.error("Erro:", error.message);
    return null;
  }
}

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
});

searchInput.addEventListener("input", (e) => {
  clearTimeout(timeoutId);

  const term = e.target.value.toLowerCase();
  timeoutId = setTimeout(async () => {
    if (term.length > 2) {
      try {
        const response = await fetch(`${API_URL}/api/nomination?q=${encodeURIComponent(term)}`);

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Erro HTTP: ${response.status}: ${errorText}`);
        }

        const data = await response.json();

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
            weatherCardInfo = await getWeatherCardInfo(e.currentTarget);

            if (firstSearch) {
              firstSearch = false;
              addEntryAnimation(weatherCard);
              weatherCard.classList.remove("visually-hidden");
              updateWeatherCard(weatherCardInfo);
            } else {
              weatherCard.classList.remove("fade-in");
              weatherCard.classList.add("fade-out");
            }
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

weatherCard.addEventListener("animationend", (e) => {
  console.log("Animação terminada:", e.animationName);

  if (e.animationName !== "disappear") return;

  updateWeatherCard(weatherCardInfo);

  weatherCard.classList.remove("fade-out");

  void weatherCard.offsetWidth;

  addEntryAnimation(weatherCard);
});

function addEntryAnimation(e) {
  ["api-element", "fade-in"].forEach((classe) => {
    if (!e.classList.contains(`${classe}`)) {
      e.classList.add(`${classe}`);
    }
  });
}

/*
function restartAnimation(e) {
  e.classList.remove("fade-out");
  void e.offsetWidth;
  e.classList.add("api-element");
}
*/

async function getWeatherCardInfo(e) {
  const itemInfo = e.innerText;
  const weatherInfo = await getWeatherInfo({ location: itemInfo });
  const classes = iconMap[weatherInfo.days[0].icon];
  const place = itemInfo.split(",")[0].trim();

  return { weatherInfo, classes, place };
}

function updateWeatherCard({ weatherInfo, classes, place }) {
  weatherIcon.className = `wi ${classes}`;
  weatherCard.setAttribute("aria-label", `${place}`);
  weatherCardTitle.innerText = `${place}`;

  humidityDOM.innerText = `${weatherInfo.days[0].humidity}%`;
  feelsLikeDOM.innerText = `${weatherInfo.days[0].feelslike}°C`;
  windSpeedDOM.innerText = `${weatherInfo.days[0].windspeed}km/h`;

  list.innerHTML = "";
}
