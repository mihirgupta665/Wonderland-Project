
    // let mapToken = mapToken; 
    console.log(mapToken); 

    /* Map_Token is accessible in ejs file only so we have define maptoken variable containing the value of map.token */
    mapboxgl.accessToken = mapToken;        
    const map = new mapboxgl.Map({
        container: 'map', // container ID
    center: [81.0004, 26.9070], // starting position [lng, lat]. Note that lat must be set between -90 and 90
    zoom: 9 // starting zoom
            });
