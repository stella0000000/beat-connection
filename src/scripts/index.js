import Globe from 'globe.gl';
// import codes from 'iso-lang-codes'
// console.log(codes.findCountryLanguages('KR'))

/*   ------------------------- DOM ELEMENTS -------------------------   */
const body = document.body;
const title = document.createElement('h2');
title.innerText = "BEAT \n C♡NNECTI♡N";
body.append(title);

const description = document.createElement('p');
description.innerText = "Listen to popular streams around the world."
body.append(description);

let currentLocation = document.createElement('h1');
let localWx = document.createElement('h3');
let localTime = document.createElement('h4');
var iframe = document.createElement('iframe');

// var form = document.getElementById("search-city");

// var widget = Mixcloud.PlayerWidget(document.getElementById("my-widget-iframe"));
//     widget.ready.then(function() {
//       console.log(Mixcloud)
//         // Put code that interacts with the widget here
// });

let coordinates = document.createElement('div')
coordinates.classList.add('coords');
let offset, coord, headline, headlineTitle;

let portfolio = document.createElement('a');
portfolio.setAttribute('id','portfolio');
portfolio.href = 'http://www.heystella.io'
portfolio.text = 'xoxo, stella'
portfolio.target = '_blank'
body.append(portfolio);

// var locIcon = document.createElement('img');
// locIcon.src = ''
// body.append(locIcon);

/*   ------------------------- GLOBE -------------------------   */
let arcsData = [];
let lons = [];
let lats = [];
let error;
// const labelsData = [];
let myGlobe = new Globe({ rendererConfig: {
                              autoclear: false,
                              powerPreference: "low-power",
                            },
                            waitForGlobeReady: false,
                            animateIn: true })


myGlobe(globeViz)
  .globeImageUrl('//unpkg.com/three-globe/example/img/earth-dark.jpg')
  .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png')
  .backgroundImageUrl('//unpkg.com/three-globe/example/img/night-sky.png')
  .backgroundColor('black')
  .atmosphereColor('white')
  .atmosphereAltitude('0.2')

  myGlobe.controls().autoRotate = true;
  myGlobe.controls().autoRotateSpeed = 0.075;
(document.getElementById('globeViz'))

window.addEventListener('resize', (event) => {
  myGlobe.width([event.target.innerWidth])
  myGlobe.height([event.target.innerHeight])
});

/*   ------------------------- API -------------------------   */
function getTime(timezone) {
  var d = new Date(new Date().getTime() + (timezone * 1000));   // convert API offset to ms
  var hh = d.getUTCHours();
  var mm = d.getUTCMinutes();
  if (hh < 10 && mm < 10) {
    return `0${hh}:0${mm}`
    // body.append(localTime);
  } else if (hh < 10) {
    return `0${hh}:${mm}`
  } else if (mm < 10) {
    return `${hh}:0${mm}`
  } else {
    return `${hh}:${mm}`
  }
};

if (offset) setInterval(getTime(offset), 1000);

// locIcon.addEventListener('click', function() {
currentLocation.addEventListener('click', function() {
  if (lats.length === 1) {
    myGlobe.pointOfView({lat: lats[0], lng: lons[0], altitude: 2.5}, 4000)
  } else {
    myGlobe.pointOfView({lat: lats[lats.length-1], lng: lons[lons.length-1], altitude: 2.5}, 4000)
  }
});

currentLocation.addEventListener('mouseover', function() {
  coordinates.classList.add('coords');
  coordinates.classList.remove('hide')
  coordinates.innerText = `${coord} \n ${headline}`;
  body.append(coordinates);
});

currentLocation.addEventListener('mouseout', function() {
  coordinates.classList.add('hide');
});

let searchCity = document.getElementById('search-city');
searchCity.addEventListener('submit', async function(e) {
  e.preventDefault();
  let city = searchCity.querySelector("input[type='text']").value.split(' ').join('%20');
  const mixCloudUrlStart = 'https://api.mixcloud.com/search';

  let weatherData = await fetch(`/api?searchTerm=${encodeURIComponent(city)}`)
    .then(res => res.json())
    .then(data => { return data })
    .catch(error => { return error })

  let cityInput = document.getElementById("search-city-name")
  let portfolio = document.getElementById("portfolio")
  let github = document.getElementById("github")

  if (weatherData.message) {    // denotes errors from openwxmap
    cityInput.classList.add('error');
    // Haptics.vibrate(200);
    cityInput.addEventListener('input', (event) => {
      cityInput.classList.remove('error');
    });
  } else {
    // form.reset();
    let url = `${mixCloudUrlStart}/?q=${city}&type=cloudcast`;
    let stream = await fetch(url)
      .then(response => response.json())
      .then(data => { return data })
        
    iframe.src = 'https://www.mixcloud.com/widget/iframe/?hide_cover=1&mini=1&feed=' + stream.data[Math.floor(Math.random()*stream.data.length)].url.slice(24),
    // iframe.autoplay = true,
    body.append(iframe)
    cityInput.classList.add('dim');
    cityInput.classList.remove('error');
    title.classList.add('dim');
    description.classList.add('dim');
    portfolio.classList.add('bright');
    github.classList.add('bright');

    headline = await fetch(`/news?country=${encodeURIComponent(weatherData.sys.country)}`)
                      .then(res => res.json())
                      .then(goodNews => { return goodNews})
                      // .catch(error => console.log(error))

    if (headline.status === 'error') {
      headline = 'HIT MY FREE NEWS API DAILY RATE LIMIT NO HEADLINE TO REPORT \n 🙁🙁🙁🙁🙁🙁🙁🙁🙁🙁'
    } else if (headline.articles.length === 0) {
      headline = 'NO NEWS IS GOOD NEWS. \n 🙂🙂🙂🙂🙂🙂🙂🙂🙂🙂'
    } else {
      headlineTitle = headline.articles[0].title;
      if (headlineTitle.length > 95) {
        headline = headlineTitle.slice(0, 120) + `...`
      } else {
        headline = headlineTitle;
      }
    }
    
    currentLocation.innerText = `${weatherData.name.toUpperCase()}`;
    body.append(currentLocation);

    let temp = `${Math.round(weatherData.main.temp)}°`
    let wx = weatherData.weather[0].description
    localWx.innerText = `${temp}, ${wx}`;
    body.append(localWx);
    localTime.innerText = getTime(weatherData.timezone);
    offset = weatherData.timezone;
    // localTime.innerText = setInterval(getTime(offset), 1000);
    body.append(localTime);

    lons.push(weatherData.coord.lon)
    lats.push(weatherData.coord.lat)

    let currLat, currLon;
    currLat = lats[lats.length-1];
    currLon = lons[lons.length-1];

    if (currLat < 0 && currLon < 0) {
      currLon = -currLon;
      currLat = -currLat;
      coord = `${currLat}°S, ${currLon}°W`;
    } else if (currLat < 0) {
      currLat = -currLat
      coord = `${currLat}°S, ${currLon}°E`
    } else if (currLon < 0) {
      currLon = -currLon
      coord = `${currLat}°N, ${currLon}°W`;
    } else {
      coord = `${currLat}°N, ${currLon}°E`;
    }
    
    let rData = [{
      lat: lats[lats.length-1],
      lng: lons[lats.length-1],
      maxR: 10,
      propagationSpeed: 2,
      repeatPeriod: 1000
    }]

    if (lons.length === 1) {
      myGlobe.ringsData(rData)
              .ringColor(() => '#ff0077')
              .ringMaxRadius('maxR')
              .ringPropagationSpeed('propagationSpeed')
              .ringRepeatPeriod('repeatPeriod')
              .pointOfView({lat: lats[0], lng: lons[0], altitude: 2.5}, 4000)
    } else {
      arcsData.push({
        startLat: lats[lats.length-2],
        startLng: lons[lons.length-2],
        endLat: lats[lats.length-1],
        endLng: lons[lons.length-1],
        color: [
          ['pink', 'hotpink'][Math.round(Math.random())],
          ['pink', 'hotpink'][Math.round(Math.random())]
        ]
      });
      myGlobe.ringsData(rData)
              .ringColor(() => '#ff0077')
              .ringMaxRadius('maxR')
              .ringPropagationSpeed('propagationSpeed')
              .ringRepeatPeriod('repeatPeriod')
              .arcsData(arcsData)
              .arcColor('color')
              // myGlobe.arcDashGap(Math.random())
              // myGlobe.arcDashAnimateTime(5000)
              // myGlobe.arcsTransitionDuration(2000)
              .arcStroke(1.05)
              .pointOfView({lat: lats[lats.length-1], lng: lons[lons.length-1], altitude: 2.5}, 4000)
    }
  }
});