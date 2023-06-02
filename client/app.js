//!glowne zmienne
//?kordy standardowego widoku mapy dla kazdego trybu gry, uzyte linijka 30 i 166 funckja wybor
const europa_view = [52.964686207970026, 21.94101311132203],
  all_view = [35.43811453375265, 21.054874361484423],
  states_view = [41.077618404624815, -98.43108795964298],
  wojewodztwa_view = [52.39303121429481, 20.38909401093015]
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
  className: "mapa",
}).addTo(map)

//! druga mapa do odp poprawnych
//deklaracja mapy i deklaracja wyskakujacego okienka
var map2 = L.map("map2", { minZoom: 3, zoomSnap: 0.25 }).setView([36.38309138759306, 22.3209691411363], 4),
  popup2 = L.popup()
//zrodlo mapy
L.tileLayer("http://a.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png", {
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  className: "mapa",
}).addTo(map2)

// function pokaz_pop_odp(zrodlo, kraj_cel) {
//   document.getElementById("map").style.display = "none"
//   pytanie.style.display = "none"
//   document.getElementById("map2").style.display = "block"

//   for (let i = 0; i <= zrodlo.features.length - 1; i++) {
//     var kraj = zrodlo.features[i]

//     if (kraj.properties.NAME == kraj_cel) {
//       var mapkraj = L.geoJSON(kraj, { color: "green" }).addTo(map2)
//     } else {
//       var mapkraj = L.geoJSON(kraj, { color: "whitesmoke" }).addTo(map2)
//     }
//   }
// }

//! wczytywanie liczby serc, punktow, pokazanie mapy, stats i  ukrycie ekranu startowego

function* shuffle(tablica) {
  var i = tablica.length
  while (i--) {
    yield tablica.splice(Math.floor(Math.random() * (i + 1)), 1)[0]
  }
}

var aaa = []
var ranNums = shuffle(aaa)

function pokaz_europa(zrodlo, wskazana_liczba_kraji) {
  close_game_over_okno()
  // close_okno_easter_egg()
  document.getElementById("map").style.display = "block"
  pytanie.style.display = "flex"
  document.getElementById("map2").style.display = "none"

  main.style.visibility = "visible"
  menu.style.visibility = "hidden"
  pytanie.innerHTML = ""

  //ustawienie widoku pod kazdy game mode, kazdy ma inna dlugosc tak je rozpoznuje
  var dlugosc = zrodlo.features.length
  if (dlugosc == 51) map.setView(europa_view, 3.8)
  else if (dlugosc == 255) map.setView(all_view, 3)
  else if (dlugosc == 50) map.setView(states_view, 4)
  else if (dlugosc == 16) map.setView(wojewodztwa_view, 6)

  //! losowanie liczb

  if (aaa.length == 0) for (var i = 0; i <= wskazana_liczba_kraji - 1; i++) aaa.push(i)

  var index = ranNums.next()

  if (index.done != true) {
    wylosowany_kraj = zrodlo.features[index.value].properties.NAME
  } else {
    close_alert_okno()
    open_game_over_okno(`You lost on ${wylosowany_kraj}`, `🏆final score🏆 ${punkty_text}`, zrodlo)
  }
  //! budowanie elementow DOM
  function zbuduj_element(name, typ, text, klasa, onclick) {
    name = document.createElement(typ)
    name.classList.add(klasa)
    if (text != null) name.innerHTML = text
    if (onclick != null) name.setAttribute("onclick", `${onclick}`)
    pytanie.appendChild(name)
  }
  //budowanie elementow pokazujacych informacje
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
  //?co sie stanie po kliknieciu na kraj
  function zoomToFeature(e) {
    //poprawna odpowiedz
    if (wylosowany_kraj == e.target.feature.properties.NAME) {
      open_alert_okno("✅correct guess!✅")
      punkty_text++
      if (punkty_text == 16) {
        open_game_over_okno(`Congrats, You completed whole game!`, `🏆final score🏆 ${punkty_text}`, zrodlo)
      }
      pokaz_europa(zrodlo, wskazana_liczba_kraji)
    } else {
      //test czy sa jeszcze zycia
      if (serca_text.length == 1) {
        open_game_over_okno(`You lost on ${wylosowany_kraj}`, `🏆final score🏆 ${punkty_text}`, zrodlo)
        serca_text = "❤❤❤❤❤"
        punkty_text = 0
        aaa = []
        return
      }
      //niepoprawna odp
      open_alert_okno("❌you didn't guess it❌")
      serca_text = serca_text.slice(0, -1)
      // pokaz_pop_odp(zrodlo, wylosowany_kraj)
      pokaz_europa(zrodlo, wskazana_liczba_kraji)
    }
  }
  //?co sie stanie po wyjachaniu z kraju myszka
  function resetHighlight(e) {
    geojson.resetStyle(e.target)
  }
  //? co sie stanie po najechaniu na kraj
  function highlightFeature(e) {
    var layer = e.target
    //ustawia styl
    layer.setStyle({
      weight: 3,
      color: "#feff01",
      dashArray: "",
      fillOpacity: 0.15,
    })

    layer.bringToFront()
  }
  //?dopisanie funkcji do eventow
  function onEachFeature(feature, layer) {
    layer.on({
      mouseover: highlightFeature,
      mouseout: resetHighlight,
      click: zoomToFeature,
    })
  }
  //?usuwanie starej warstwy geojsona
  map.eachLayer(function (layer) {
    if (layer instanceof L.Polygon) layer.remove()
  })
  //?dodawnie do mapy
  geojson = L.geoJson(zrodlo, {
    style: { color: "#FFFFFF" },
    onEachFeature: onEachFeature,
  }).addTo(map)
}

//!popup okienko
//? kod do "alert_okno"
const okno = document.getElementById("alert_okno"),
  inside = document.getElementById("inside_alert_okno").style
function open_alert_okno(err_msg) {
  //show modal pokazuje alert na stronie
  okno.showModal()
  err.innerHTML = err_msg
  //kolorowanie ramki alertu okno
  err_msg == "✅correct guess!✅" ? (inside.borderColor = "lightgreen") : (inside.borderColor = "red")
}
function close_alert_okno() {
  okno.close()
}
//? kod do "game_over_okno"
const game_over_okno = document.getElementById("game_over_okno"),
  country = document.getElementById("country_game_over"),
  score = document.getElementById("score_game_over")
function open_game_over_okno(err_msg, score_int, baza) {
  main.style.visibility = "hidden"
  pytanie.innerHTML = ""
  country.innerHTML = err_msg
  score.innerHTML = score_int

  const try_again_btn = document.createElement("button")
  try_again_btn.setAttribute("id", "try_again_btn")
  try_again_btn.classList.add("start_btn")
  try_again_btn.innerHTML = "Play again"
  try_again_btn.setAttribute("onclick", `pokaz_europa(${JSON.stringify(baza)}, ${baza.features.length})`)
  document.getElementById("game_over_buttons").appendChild(try_again_btn)

  game_over_okno.showModal()
}
function close_game_over_okno() {
  game_over_okno.close()
}
//! wybor trybu gry, ustawienie zrodla geojson i liczby kraji/stanow
function wybor(wybor) {
  if (wybor == "europa") {
    pokaz_europa(europa, 44)
    map.setView(europa_view, 3)
  } else if (wybor == "all") {
    pokaz_europa(kraje_all, 195)
    map.setView(all_view, 3)
  } else if (wybor == "states") {
    pokaz_europa(states, 50)
    map.setView(states_view, 3)
  } else if (wybor == "wojewodztwa") {
    pokaz_europa(wojewodztwa, 16)
    map.setView(wojewodztwa_view, 6)
  }
}
//! wroc do menu funckja
function back_to_start() {
  aaa = []
  close_game_over_okno()
  window.location.reload()
  // main.style.visibility = "hidden"
  // menu.style.visibility = "visible"
  // pytanie.innerHTML = ""
  // serca_text = "❤❤❤❤❤"
  // punkty_text = 0
}
