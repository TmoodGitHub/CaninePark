mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: 'map', // container ID
  style: 'mapbox://styles/mapbox/streets-v11', // style URL
  center: dogpark.geometry.coordinates, // starting position [lng, lat]
  zoom: 10, // starting zoom
});

map.addControl(new mapboxgl.NavigationControl());

new mapboxgl.Marker()
  .setLngLat(dogpark.geometry.coordinates)
  .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(`<h3>${dogpark.title}</h3><p>${dogpark.location}</p>`))
  .addTo(map);
