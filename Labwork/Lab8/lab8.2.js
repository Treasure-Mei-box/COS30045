// dimensions of the SVG container
var h = 300;
var w = 500;

// Define the projection using d3.geoMercator
var projection = d3.geoMercator()
    .center([145, -36.5]) // center of the map
    .translate([w / 2, h / 2]) // Translate the map to the center of the SVG container
    .scale(3000);

// Create a path generator using the projection
var path = d3.geoPath().projection(projection);

// Create an SVG element and append it to the body of the HTML document
var svg = d3.select("body").append("svg")
    .attr("width", w)
    .attr("height", h)
    .attr("fill", "grey"); // fill color of the SVG container

// Define the color scale using d3.scaleQuantize
var color = d3.scaleQuantize()
    .range(["#f2f0f7", "#cbc9e2", "#9e9ac8", "#756bb1", "#54278f"])
    .domain([0, 10000]) //  domain of the color scale
    .unknown('#f6eff7'); //  color for unknown values

// Load the CSV and JSON data using promises
d3.csv("VIC_LGA_unemployment.csv").then(function (data) {
    d3.json("LGA_VIC.json").then(function (json) {
        // Iterate through the CSV data
        for (var i = 0; i < data.length; i++) {
            var dataState = data[i].LGA; //  LGA from the CSV data
            var dataValue = parseFloat(data[i].unemployed); //  unemployment rate from the CSV data

            // Iterate through the JSON data
            for (var j = 0; j < json.features.length; j++) {
                var jsonState = json.features[j].properties.LGA_name; //  LGA name from the JSON data

                if (dataState === jsonState) {
                    json.features[j].properties.value = dataValue; // value property in the JSON data
                    break;
                }
            }
        }

        // Bind data to SVG elements and append paths for each feature
        svg.selectAll("path").data(json.features).enter().append("path")
            .attr("d", path)
            .attr("fill", function (data) {
                return color(data.properties.value); // fill color based on the value property
            })
            .attr("stroke", 'white') //  the stroke color of the paths
            .attr("stroke-width", "0.2")
            .on("mouseover", function (d, i) {
                d3.select(this).attr("stroke", "black").attr("stroke-width", "0.4");
                
            })
            .on("mouseout", function () {
                d3.select(this).attr("stroke", "white").attr("stroke-width", "0.4"); 
                
            });

        // Define the circle data
        var circleData = [
            { place: "Melbourne", lat: -37.814, lon: 144.96332 },
            { place: "Bendigo", lat: -36.7587, lon: 144.2837 },
            { place: "Horsham", lat: -36.7131, lon: 142.1999 },
            { place: "Geelong", lat: -38.1485, lon: 144.3613 },
            { place: "Warrnambool", lat: -38.3828, lon: 142.4845 },
            { place: "Mildura", lat: -34.2063, lon: 142.1358 },
            { place: "Traralgon", lat: -38.1971, lon: 146.5346 }
        ];
        // Create a tooltip
        var tooltip = d3.select("body").append("div")
                        .attr("class", "tooltip")
                        .style("position", "absolute")
                        .style("background", "lightgrey")
                        .style("padding", "5px")
                        .style("border", "1px solid #ccc")
                        .style("border-radius", "5px")
                        .style("pointer-events", "none") // Prevent tooltip from capturing mouse events
                        .style("opacity", 0); // Initially hidden

        // Append circles to the map
        svg.selectAll("circle")
            .data(circleData)
            .enter()
            .append("circle")
            .attr("cx", function(d) {
                return projection([d.lon, d.lat])[0]; 
            })
            .attr("cy", function(d) {
                return projection([d.lon, d.lat])[1]; 
            })
            .attr("r", 5)
            .style("fill", "yellow")
            .style("stroke", "grey")
            .style("stroke-width", 0.25)
            .style("opacity", 0.75)
            .on("mouseover", function(event, d) {
                tooltip.transition().duration(200).style("opacity", .9);
                tooltip.html(d.place) // place name for the tooltip
                    .style("left", (event.pageX + 5) + "px") // Position the tooltip
                    .style("top", (event.pageY - 28) + "px");
            })
            .on("mouseout", function() {
                tooltip.transition().duration(500).style("opacity", 0);
            });
    });
});
