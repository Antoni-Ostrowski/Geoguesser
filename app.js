//! początkowe ustawianie mapy, okienka, źródło mapy(1 link)
//deklaracja mapy i deklaracja wyskakujacego okienka
var map = L.map("map", { minZoom: 3, zoomSnap: 0.25 }).setView([36.38309138759306, 22.3209691411363], 3),
  popup = L.popup()

//zrodlo mapy
L.tileLayer("http://a.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png", {
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map)

function wybor(wybor) {
  wybor == "europa" ? pokaz_europa(europa, 44) : pokaz_europa(kraje_all, 195)
}

var wylosowany_kraj
var serca_text = "❤❤❤❤❤"
var punkty_text = 0
const main = document.getElementById("main"),
  pytanie = document.getElementById("pytanie"),
  err = document.getElementById("err"),
  popup_1 = document.getElementById("popup_1_id")

function pokaz_europa(zrodlo, wskazana_liczba_kraji) {
  //! dodanie do mapy krajow i kontrola co sie dzieje przy "eventach" myszki
  var geojson
  //co sie stanie po kliknieciu na kraj
  function zoomToFeature(e) {
    if (wylosowany_kraj == e.target.feature.properties.NAME) {
      openPopup_1("correct guess! :)")
      punkty_text++
      map.setView([36.38309138759306, 22.3209691411363], 3)
      pokaz_europa(zrodlo, wskazana_liczba_kraji)
    } else {
      openPopup_1("you didn't guess it ://")
      if (serca_text.length == 1) {
        serca_text = serca_text.slice(0, -1)
        openPopup_1("you lost! don't worry, you can try again")
        serca_text = "❤❤❤❤❤❤"
        punkty_text = 0
      }
      serca_text = serca_text.slice(0, -1)
      map.setView([36.38309138759306, 22.3209691411363], 3)
      pokaz_europa(zrodlo, wskazana_liczba_kraji)
    }
  }
  //co sie stanie po wyjachaniu z kraju myszka
  function resetHighlight(e) {
    geojson.resetStyle(e.target)
  }
  // co sie stanie po najechaniu na kraj
  function highlightFeature(e) {
    var layer = e.target
    //ustawia styl
    layer.setStyle({
      weight: 5,
      color: "#666",
      dashArray: "",
      fillOpacity: 0.7,
    })

    layer.bringToFront()
  }
  //dopisanie funkcji do eventow
  function onEachFeature(feature, layer) {
    layer.on({
      mouseover: highlightFeature,
      mouseout: resetHighlight,
      click: zoomToFeature,
    })
  }
  //usuwanie starej warstwy geojsona
  map.eachLayer(function (layer) {
    if (layer instanceof L.Polygon) layer.remove()
  })
  //dodawnie do mapy
  geojson = L.geoJson(zrodlo, {
    style: { color: "#757678" },
    onEachFeature: onEachFeature,
  }).addTo(map)

  //! losowanie liczb
  var aaa = []
  for (var i = 0; i <= wskazana_liczba_kraji; i++) {
    aaa.push(i)
  }

  function* shuffle(tablica) {
    var i = tablica.length

    while (i--) {
      yield tablica.splice(Math.floor(Math.random() * (i + 1)), 1)[0]
    }
  }
  var ranNums = shuffle(aaa)
  //! odświeżanie mapy, wczytywanie liczby serc, wszytywanie liczby punktow, pokazanie mapy ukrycie ekranu startowego
  main.style.visibility = "visible"
  document.getElementById("menu").style.visibility = "hidden"
  pytanie.innerHTML = ""

  wylosowany_kraj = zrodlo.features[ranNums.next().value].properties.NAME

  console.log()
  //budowanie elementow pokazujacych informacje
  var h1
  zbuduj_element(h1, "h1", `country: ${wylosowany_kraj}`, "wylosowany_kraj")

  var serca_h1
  zbuduj_element(serca_h1, "h1", `${serca_text}`, "serca")

  var punkty
  zbuduj_element(punkty, "h1", `correct: ${punkty_text}`, "punkty")
}
function zbuduj_element(name, typ, text, klasa) {
  name = document.createElement(typ)
  name.innerHTML = text
  name.classList.add(klasa)
  pytanie.appendChild(name)
}
//popup okienko
function openPopup_1(err_msg) {
  popup_1.classList.add("open-popup_1")
  body.style.overflowY = "hidden"
  err.innerHTML = err_msg
}
function closePopup_1() {
  console.log("href")
  popup_1.classList.remove("open-popup_1")
  body.style.overflowY = "auto"
}
