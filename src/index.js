import "./style.css";

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
            return index === self.findIndex((i) => i.name === item.name)
          })
          .slice(0, 3);

        const itens = shortNames
          .map((item) => `<li>${item.name}</li>`)
          .join("");

        list.innerHTML = itens;
      } catch (error) {
        console.error("Erro na busca:", error);
      }
    } else {
      list.innerHTML = "";
    }
  }, 500);
});
