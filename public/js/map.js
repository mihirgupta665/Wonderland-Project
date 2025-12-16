
// let mapToken = mapToken; 
// console.log(mapToken);

/* Map_Token is accessible in ejs file only so we have define maptoken variable containing the value of map.token */
mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    center: coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
    zoom: 10 // starting zoom
});

console.log("Coordinates", coordinates);
const marker1 = new mapboxgl.Marker({color: "red"})
    .setLngLat(coordinates)
    .addTo(map);
