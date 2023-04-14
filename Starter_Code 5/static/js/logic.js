var Mymap = L.map("map", {
    center: [39.8283, -98.5795],
    zoom: 5
});

//Add tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(Mymap);

//Loop

var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_week.geojson"


function getColor(depth) {
    if (depth <= 10) {
        return "#CB2B3E";
    } else if (depth > 10 && depth <= 30) {
        return "#2AAD27";
    } else if (depth > 30 && depth <= 50) {
        return "#CB8427";
    } else if (depth > 50 && depth <= 70) {
        return "#CAC428";
    } else if (depth > 70 && depth <= 90) {
        return "#9C2BCB";
    } else if (depth > 90) {
        return "#7B7B7B";
    }
}

d3.json(queryUrl).then(function(data){

    for (var i = 0; i < data.features.length; i++)  {
    var earthquakes = data.features[i]
    var coord = earthquakes.geometry.coordinates
    var magnitude = earthquakes.properties.mag
    var timestamp = earthquakes.properties.time
        let date = new Date(timestamp);
        let humanReadableDate = date.toLocaleDateString();
    var depth = earthquakes.geometry.coordinates[2]
    var size = magnitude * 4
    var markerColor = getColor(depth);

    var marker = L.circleMarker([coord[1],coord[0]],{
        radius: size,
        color: markerColor,
        fillOpacity: 0.5
    }).bindPopup(`<h3>${earthquakes.properties.title}</h3>
                <hr>
                <p><b>Location:</b> ${earthquakes.properties.place}</p> 
                <p><b>Time:</b> ${humanReadableDate}</p>
                <p><b>Magnitude:</b> ${magnitude}</p>
                <p><b>Depth:</b> ${depth}</p>
    `).addTo(Mymap);
    }

    //Create the legend
    var legend = L.control({position: 'bottomright'});
    legend.onAdd = function () {
        var div = L.DomUtil.create('div', 'info legend');
        var labels = [" -10-10 ", " 10-30", " 30-50 ", " 50-70 ", " 70-90 ", " 90+ "];
        var ranges = ["#08E747", "#FFFF00", "#FFD580", "#F28C28", "#FF7518", "#FF4433"]
        var legendInfo = "";
        labels.forEach(function(label,i) {
            var color = ranges[i];
            legendInfo += `<div class='legend-color-box' style='background-color: ${color}'></div><span>${label}</span><br>`;
        });
        div.innerHTML = legendInfo;
        return div;
    };      
legend.addTo(Mymap);

})