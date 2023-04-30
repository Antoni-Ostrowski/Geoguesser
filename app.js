//! początkowe ustawianie mapy, okienka, źródło mapy(1 link)
//deklaracja mapy i deklaracja wyskakujacego okienka
var map = L.map("map", { minZoom: 3 }).setView([54.34343507696856, 18.87529659397512], 4)
var popup = L.popup()
//zrodlo mapy
L.tileLayer("http://a.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png", {
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map)

//! dodanie do mapy krajow i kontrola co sie dzieje przy "eventach" myszki
var geojson
//co sie stanie po kliknieciu na kraj
function zoomToFeature(e) {
  if (wylosowany_kraj == e.target.feature.properties.NAME) {
    console.log("zgadnieto!")
    alert("zgadnieto!")
    punkty_text++
    pokaz_mape()
  } else {
    console.log("nie zgadnieto :/")
    alert("nie zgadnieto :/")

    if (serca_text.length == 1) {
      serca_text = serca_text.slice(0, -1)
      alert("przegrana")
    }
    serca_text = serca_text.slice(0, -1)

    pokaz_mape()
  }
  // console.log(e.target.feature.properties.NAME)
  map.setView([54.34343507696856, 18.87529659397512], 4)
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
//dodawnie do mapy
geojson = L.geoJson(kraje, {
  onEachFeature: onEachFeature,
}).addTo(map)

//! losowanie liczb
var aaa = []
const liczba_kraji = 44
for (var i = 0; i <= liczba_kraji; i++) {
  aaa.push(i)
}
// console.log(aaa)
function* shuffle(tablica) {
  var i = tablica.length

  while (i--) {
    yield tablica.splice(Math.floor(Math.random() * (i + 1)), 1)[0]
  }
}
var ranNums = shuffle(aaa)
//test liczb losowaych
// for (var i = 1; i <= 5; i++) {
//   console.log(kraje.features[ranNums.next().value].properties.NAME)
// }
//! odświeżanie mapy, wczytywanie liczby serc, wszytywanie liczby punktow, pokazanie mapy ukrycie ekranu startowego
var wylosowany_kraj
var serca_text = "❤❤❤❤❤"
var punkty_text = 0
const main = document.getElementById("main")
const pytanie = document.getElementById("pytanie")

function pokaz_mape() {
  main.style.visibility = "visible"
  document.getElementById("menu").style.visibility = "hidden"

  wylosowany_kraj = kraje.features[ranNums.next().value].properties.NAME

  pytanie.innerHTML = ""

  const h1 = document.createElement("h1")
  h1.innerHTML = `country: ${wylosowany_kraj}`
  h1.classList.add("wylosowany_kraj")
  pytanie.appendChild(h1)

  const serca_h1 = document.createElement("h1")
  serca_h1.innerHTML = `${serca_text}`
  serca_h1.classList.add("serca")
  pytanie.appendChild(serca_h1)

  const punkty = document.createElement("h1")
  punkty.innerHTML = `correct: ${punkty_text}`
  punkty.classList.add("punkty")
  pytanie.appendChild(punkty)
}
