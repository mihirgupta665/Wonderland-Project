
// let mapToken = mapToken; 
// console.log(mapToken);

/* Map_Token is accessible in ejs file only so we have define maptoken variable containing the value of map.token */
mapboxgl.accessToken = mapToken;
console.log(mapToken);
const map = new mapboxgl.Map({
    container: 'map', // container ID
    center: listing.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
    zoom: 10 // starting zoom
});

// console.log("Coordinates", listing.geometry.coordinates);
const marker1 = new mapboxgl.Marker({ color: "red" })
    .setLngLat(listing.geometry.coordinates)
    .setPopup(new mapboxgl.Popup({ offset: 25 })
    .setHTML(`<h3>${listing.location}</h3><p>Exact Location will be provided after booking</p`))
    .addTo(map);
