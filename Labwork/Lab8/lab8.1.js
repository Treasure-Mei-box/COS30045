var w = 500;
var h = 300;

// Set up the Mercator projection with specified center and scale
var projection = d3.geoMercator()
                    .center([145, -36.5]) // Center coordinates for the map (longitude, latitude)
                    .translate([w / 2, h / 2]) // center of the SVG
                    .scale(3000);  // Scale factor for the map's size

// Create a path generator using the defined projection
var path = d3.geoPath() .projection(projection);

// Append an SVG element to the body with defined width, height, and fill color
var svg = d3.select("body")
            .append("svg")
            .attr("width", w)
            .attr("height", h)
            .attr("fill","grey"); 

// Load the GeoJSON data and render the map
d3.json ("LGA_VIC.json").then(function (json) 
    {
        // Bind the GeoJSON features to SVG paths and append them to the SVG
        svg.selectAll("path")
            .data(json.features)// Bind the features from the GeoJSON data
            .enter() // Enter selection for new data
            .append("path") // Append a new path element for each feature
            .attr("d", path); // Set the 'd' attribute using the path generator
    });