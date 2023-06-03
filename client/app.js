//!globalne zmienne ↓↓↓
//kordy standardowego widoku mapy dla kazdego trybu gry, uzyte linijka 30 i 166 funckja wybor
const europa_view = [52.964686207970026, 21.94101311132203],
  all_view = [35.43811453375265, 21.054874361484423],
  states_view = [41.077618404624815, -98.43108795964298],
  wojewodztwa_view = [52.39303121429481, 20.38909401093015]
const main = document.getElementById("main"),
  menu = document.getElementById("menu"),
  pytanie = document.getElementById("pytanie"),
  err = document.getElementById("err"),
  popup_1 = document.getElementById("popup_1_id")
var wylosowany_kraj,
  serca_text = "❤❤❤❤❤",
  punkty_text = 0
//!globalne zmienne ↑↑↑
//! deklaracje map, zrodel, ↓↓↓
//mapa do zgadywania
var map = L.map("map", { minZoom: 3, zoomSnap: 0.25 }).setView([36.38309138759306, 22.3209691411363], 3),
  popup = L.popup()
//zrodlo mapy
L.tileLayer("http://a.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png", {
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  className: "mapa",
}).addTo(map)

//mapa do odpowiedzi
var map2 = L.map("map2", { minZoom: 3, zoomSnap: 0.25 }).setView([36.38309138759306, 22.3209691411363], 4),
  popup2 = L.popup()
//zrodlo mapy
L.tileLayer("http://a.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png", {
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  className: "mapa",
}).addTo(map2)
//! deklaracje map, zrodel,  ↑↑↑
//! globalnie uzywane funkcje ↓↓↓
function ustaw_widok(zrodlo, mapa) {
  var dlugosc = zrodlo.features.length
  if (dlugosc == 51) mapa.setView(europa_view, 3.8)
  else if (dlugosc == 255) mapa.setView(all_view, 3)
  else if (dlugosc == 50) mapa.setView(states_view, 4)
  else if (dlugosc == 16) mapa.setView(wojewodztwa_view, 6)
}
function* shuffle(tablica) {
  var i = tablica.length
  while (i--) {
    yield tablica.splice(Math.floor(Math.random() * (i + 1)), 1)[0]
  }
}
// wybor trybu gry, ustawienie zrodla geojson i liczby kraji/stanow
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
function back_to_start() {
  aaa = []
  close_game_over_okno()
  window.location.reload()
}
//! globalnie uzywane funkcje ↑↑↑
//!glowna funkcja ↓↓↓
var aaa = []
var ranNums = shuffle(aaa)

function pokaz_europa(zrodlo, wskazana_liczba_kraji) {
  close_game_over_okno()

  main.style.visibility = "visible"
  menu.style.visibility = "hidden"
  pytanie.innerHTML = ""

  ustaw_widok(zrodlo, map)

  //! losowanie liczb

  if (aaa.length == 0) for (var i = 0; i <= wskazana_liczba_kraji - 1; i++) aaa.push(i)

  var index = ranNums.next()

  if (index.done != true) wylosowany_kraj = zrodlo.features[index.value].properties.NAME
  else {
    close_alert_okno()
    open_game_over_okno(`You lost on ${wylosowany_kraj}`, `🏆final score(koniec kraji)🏆 ${punkty_text}`, zrodlo, "no again")
  }
  //! budowanie elementow DOM, div pytanie
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
      open_alert_okno("correct guess!")
      punkty_text++
      pokaz_europa(zrodlo, wskazana_liczba_kraji)
    } else {
      //test czy sa jeszcze zycia
      if (serca_text.length == 1) {
        open_game_over_okno(`You lost on ${wylosowany_kraj}`, `🏆final score(koniec serc)🏆 ${punkty_text}`, zrodlo, "again")
        serca_text = "❤❤❤❤❤"
        punkty_text = 0
        aaa = []
        return
      }
      //niepoprawna odp
      pokaz_odp_okno(zrodlo, wylosowany_kraj)
      serca_text = serca_text.slice(0, -1)
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
//!glowna funkcja ↑↑↑

//! okno po poprawnej odpowiedzi ↓↓↓
const okno = document.getElementById("alert_okno"),
  inside = document.getElementById("inside_alert_okno").style
function open_alert_okno(err_msg) {
  //show modal pokazuje alert na stronie
  okno.showModal()
  err.innerHTML = err_msg
  err.style.color = "lightGreen"
  inside.borderColor = "lightgreen"
}
function close_alert_okno() {
  okno.close()
}
//! okno po poprawnej odpowiedzi ↑↑↑

//! okno do GAME OVER ↓↓↓
const game_over_okno = document.getElementById("game_over_okno"),
  country = document.getElementById("country_game_over"),
  score = document.getElementById("score_game_over"),
  game_over_buttons = document.getElementById("game_over_buttons")
function open_game_over_okno(err_msg, score_int, baza, again) {
  main.style.visibility = "hidden"
  pytanie.innerHTML = ""
  country.innerHTML = err_msg
  score.innerHTML = score_int

  game_over_buttons.innerHTML = ""

  if (again == "again") {
    const back_btn = document.createElement("button")
    back_btn.classList.add("start_btn")
    back_btn.innerHTML = "back to start"
    back_btn.setAttribute("onclick", "back_to_start()")
    game_over_buttons.appendChild(back_btn)

    const try_again_btn = document.createElement("button")
    try_again_btn.setAttribute("id", "try_again_btn")
    try_again_btn.classList.add("start_btn")
    try_again_btn.innerHTML = "Play again"
    try_again_btn.setAttribute("onclick", `pokaz_europa(${JSON.stringify(baza)}, ${baza.features.length})`)
    game_over_buttons.appendChild(try_again_btn)
  } else if (again == "no again") {
    const back_btn = document.createElement("button")
    back_btn.classList.add("start_btn")
    back_btn.innerHTML = "back to start"
    back_btn.setAttribute("onclick", "back_to_start()")
    game_over_buttons.appendChild(back_btn)
  }

  game_over_okno.showModal()
}
function close_game_over_okno() {
  game_over_okno.close()
}
//! okno do GAME OVER ↑↑↑

//! okno okno po niepoprawnej odpowiedzi ↓↓↓
const name_odp = document.getElementById("name_odp"),
  odp_okno = document.getElementById("odp_okno"),
  inside_odp_okno = document.getElementById("inside_odp_okno")
var geojson_warstwa
function pokaz_odp_okno(zrodlo, kraj_cel) {
  inside_odp_okno.style.borderColor = "red"

  if (geojson_warstwa != undefined) map2.removeLayer(geojson_warstwa)

  //dodanie stylu do kraji, zielony = poprawna odp reszta standard
  function style(feature) {
    if (feature.properties.NAME === kraj_cel) {
      return {
        color: "green",
      }
    } else {
      return {
        color: "whitesmoke",
      }
    }
  }

  geojson_warstwa = L.geoJson(zrodlo, { style: style }).addTo(map2)

  ustaw_widok(zrodlo, map2)

  name_odp.innerHTML = `correct answer: ${kraj_cel}`
  odp_okno.showModal()
}
function close_okp_okno() {
  odp_okno.close()
}
//! okno okno po niepoprawnej odpowiedzi ↑↑↑
