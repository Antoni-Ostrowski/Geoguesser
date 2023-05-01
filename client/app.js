//! globalne zmienne
var wylosowany_kraj,
  serca_text = "❤❤❤❤❤",
  punkty_text = 0
const main = document.getElementById("main"),
  menu = document.getElementById("menu"),
  pytanie = document.getElementById("pytanie"),
  err = document.getElementById("err"),
  popup_1 = document.getElementById("popup_1_id")

//! początkowe ustawianie mapy, okienka, źródło mapy(1 link)
//deklaracja mapy i deklaracja wyskakujacego okienka
var map = L.map("map", { minZoom: 3, zoomSnap: 0.25 }).setView([36.38309138759306, 22.3209691411363], 3),
  popup = L.popup()
//zrodlo mapy
L.tileLayer("http://a.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png", {
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map)

function pokaz_europa(zrodlo, wskazana_liczba_kraji) {
  map.setView([36.38309138759306, 22.3209691411363], 3)

  //! losowanie liczb
  //stworzenie tablicy aaa o dlugosci liczby kraji/stanow
  var aaa = []
  for (var i = 0; i <= wskazana_liczba_kraji; i++) aaa.push(i)
  //funckja shuffle linia 122
  var ranNums = shuffle(aaa)
  //! wczytywanie liczby serc, punktow, pokazanie mapy ukrycie ekranu startowego
  main.style.visibility = "visible"
  menu.style.visibility = "hidden"
  pytanie.innerHTML = ""

  wylosowany_kraj = zrodlo.features[ranNums.next().value].properties.NAME

  //budowanie elementow pokazujacych informacje funkcja linia 103
  var back_btn
  zbuduj_element(back_btn, "button", "back to start", "start_btn", "back_to_start()")

  var h1
  zbuduj_element(h1, "h1", `where is ${wylosowany_kraj}?`, "wylosowany_kraj", null)

  var serca_h1
  zbuduj_element(serca_h1, "h1", `${serca_text}`, "serca", null)

  var punkty
  zbuduj_element(punkty, "h1", `🏆correct🏆 ${punkty_text}`, "punkty", null)

  //! dodanie do mapy krajow i kontrola co sie dzieje przy "eventach" myszki
  var geojson
  //co sie stanie po kliknieciu na kraj
  function zoomToFeature(e) {
    if (wylosowany_kraj == e.target.feature.properties.NAME) {
      openPopup_1("✅correct guess!✅")
      punkty_text++
      pokaz_europa(zrodlo, wskazana_liczba_kraji)
    } else {
      openPopup_1("❌you didn't guess it❌")
      if (serca_text.length == 1) {
        openPopup_1("you lost 😭! don't worry, you can try again ")
        serca_text = "❤❤❤❤❤❤"
        punkty_text = 0
      }
      serca_text = serca_text.slice(0, -1)
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
}
//! budowanie elementow DOM
function zbuduj_element(name, typ, text, klasa, onclick) {
  name = document.createElement(typ)
  name.classList.add(klasa)
  if (text != null) name.innerHTML = text
  if (onclick != null) name.setAttribute("onclick", `${onclick}`)
  pytanie.appendChild(name)
}
//!popup okienko
function openPopup_1(err_msg) {
  popup_1.classList.add("open-popup_1")
  body.style.overflowY = "hidden"
  err.innerHTML = err_msg
}
function closePopup_1() {
  popup_1.classList.remove("open-popup_1")
  body.style.overflowY = "auto"
}
//!funkcja losujaca
//zwraca kolejne losowe liczby bez powtorzen
function* shuffle(tablica) {
  var i = tablica.length
  while (i--) {
    yield tablica.splice(Math.floor(Math.random() * (i + 1)), 1)[0]
  }
}
//! wybor trybu gry, ustawienie zrodla geojson i liczby kraji/stanow
function wybor(wybor) {
  if (wybor == "europa") pokaz_europa(europa, 44)
  else if (wybor == "all") pokaz_europa(kraje_all, 195)
  else pokaz_europa(states, 50)
}
function back_to_start() {
  main.style.visibility = "hidden"
  menu.style.visibility = "visible"
  pytanie.innerHTML = ""
}
