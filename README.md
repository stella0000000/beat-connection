## `Overview`
BEAT C♡NNECTI♡N is an interactive site encouraging exploration built with JavaScript. Visit, listen, and learn. Discover streams, local headlines, weather and time wherever you decide to go.<br><br>
✨ Created with magic, wonder, surprise, and delight in mind. ✨ The site doubles as passive technology; the UI/UX is minimal (with essentially one call to action), design hierarchy is reconsidered in response to the user's interactions, and there is a subtle rotation to the canvas.

## Behold our beat connections <a href="https://beatconnection.onrender.com" target="_blank">here</a>.

<p align='center'>
  <img width="700" alt="Screenshot 2022-02-03 at 01 41 42" src="https://user-images.githubusercontent.com/17345270/152293814-fe013df6-ab65-4f9f-b51f-3cad8f18b038.png">
</p>

## `Technologies`
- NodeJS
- Express
- HTML / SCSS
- Globe.GL
- Mixcloud API
- OpenWeatherMap API
- News API

## `Functionalities`
Users are invited to search a city, and the `Mixcloud API` fetches a stream connected to that city. An iframe element ingests the stream url that is returned, and a Mixcloud player is rendered on the page, so users can listen on-site.
```js
searchCity.addEventListener('submit', async function(e) {
  e.preventDefault();
  let city = searchCity.querySelector("input[type='text']").value.split(' ').join('%20');
  const urlStart = 'https://api.mixcloud.com/search';
  const url = `${urlStart}/?q=${city}&type=cloudcast`;
  const widgetUrl = `https://www.mixcloud.com/widget/iframe/?hide_cover=1&mini=1&feed=`
  fetch(url)
    .then(response => response.json())
    .then(stream =>
      iframe.src = widgetUrl + stream.stream[Math.floor(Math.random()*stream.stream.length)].url.slice(24),
      body.append(iframe)
      // refresh the stream for the new city
    )
}
```

<p align='center'>
  <img width="700" alt="Screenshot 2022-02-10 at 17 08 33" src="https://user-images.githubusercontent.com/17345270/153505089-c74b3af6-4fe3-483d-a5c7-3eb97a9a1c07.png">
</p>

The `News API` ingests a 2-letter country code from the data returned by the `OpenWeatherMap API` to search for top national headlines for the user-queried city. The first headline is displayed from the API response, which is sorted by popularity of source.
```js
// FRONTEND
headline = await fetch(`/news?country=${encodeURIComponent(wxData.sys.country)}`)
            .then(res => res.json())
            .then(goodNews => { return goodNews })
            // receive good news from backend
            .catch(error => { return error })

if (headline.articles.length === 0) {
  headline = 'NO NEWS IS GOOD NEWS. \n 🙂🙂🙂🙂🙂🙂🙂🙂🙂🙂'
  // if there's no news, we still report good news
} else {
  // ...
}

// BACKEND
app.get('/news', (request, response) => {
  const newsApiKey = process.env.NEWS_API_KEY;
  const newsUrlStart = 'https://newsapi.org/v2/top-headlines?country'
  let country = request.query.country;
  let newsUrl = `${newsUrlStart}=${country}&sortBy=popularity&apiKey=${newsApiKey}`;
  fetch(newsUrl)
    .then(apiResponse => apiResponse.json())
    .then(goodNews => response.send(goodNews))
    // send good news to frontend
    .catch(error => response.send(error));
});
```

<!--
### Sources
https://globe.gl/<br>
https://www.mixcloud.com/developers/#connections-lists<br>
https://www.mixcloud.com/developers/widget/#methods<br>
https://developer.spotify.com/console/get-search-item/<br>
https://developer.spotify.com/console/get-artist-related-artists/<br>
https://services.swpc.noaa.gov/json/ovation_aurora_latest.json<br>
-->

<!-- - Click on the globe, instead of search (what if user accidentally clicks)? Both?
- Globe zoom proportionally adjusts stream volume.
- Stream autoplay.
- themes
- Local time updates automatically.
- Smoother loading / setTimeout?
- addEventListener for mouse movement if no mouse activity for X time, hide everything but the globe and local info (for projections).
-->

## `My favorite Mixcloud streams`
- DJ Set <a href="https://www.mixcloud.com/FrankMaster/special-dj-set-marrakesh-marocco-by-frank-master-stefano-capasso/" target="_blank">Marrakesh</a>
- Cooking with Palm Trax <a href="https://www.mixcloud.com/BCR_Radio/cooking-with-palms-trax-020/" target="_blank">Berlin</a>
- Future sound of Egypt <a href="https://www.mixcloud.com/alyfila-futuresoundofegypt/future-sound-of-egypt-650-live-from-cairo-with-aly-fila/" target="_blank">Cairo</a>

## `Future considerations`
- Replace faux atmosphere with togglable aurora data / SWPC: https://services.swpc.noaa.gov/json/ovation_aurora_latest.json
- Render the moon, click - moon tracks / NASA kit: https://svs.gsfc.nasa.gov/cgi-bin/details.cgi?aid=4720
- Change direct city query to async-await with lat/lon for wx
