function init() {
    
    var margin = {top: 10, right: 20, bottom: 30, left: 50},
    w = 600 - margin.left - margin.right,
    h = 300 - margin.top - margin.bottom;

    // Parse date format from the CSV
    var parseDate = d3.timeParse("%Y-%m");

    // Define scales for the x and y axes
    var x = d3.scaleTime().range([0, w]), // Time scale for the x-axis
        y = d3.scaleLinear().range([h, 0]); // Linear scale for the y-axis

    var xAxis = d3.axisBottom(x), // Bottom x-axis
        yAxis = d3.axisLeft(y); //Left Y-axis

    var area = d3.area()
        .x(function(d) { return x(d.date); })// Set x position based on date
        .y0(h) // Base of the area starts at the bottom of the chart
        .y1(function(d) { return y(d.number); }); // Top of the area based on the data value


    // Append an SVG element to the chart container
    var svg = d3.select("#chart").append("svg")
        .attr("width", w + margin.left + margin.right) // Set total width
        .attr("height", h + margin.top + margin.bottom) // Set total height
        .append("g") // Append a group element for margins
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")"); // Translate to account for margins


    //Load and process CSV data
    d3.csv("Unemployment_78-95.csv", function(d) {
        d.date = parseDate(d.year + '-' + d.month);
        d.number = +d.number; // Convert number to integer
        return d;
    }).then(function(data) {
        x.domain(d3.extent(data, function(d) { return d.date; })); // Date domain for x-axis
        y.domain([0, d3.max(data, function(d) { return d.number; })]); // Max value for y-axis

        svg.append("path")
           .data([data])
           .attr("class", "area")
           .attr("d", area)
           .style("fill", "slategrey");

        svg.append("g")
           .attr("class", "x axis")
           .attr("transform", "translate(0," + h + ")")
           .call(xAxis);

        svg.append("g")
           .attr("class", "y axis")
           .call(yAxis);

         // Draw a horizontal line at the half-million mark on the y-axis
        svg.append("line")
           .attr("class", "halfMillionMark")
           .attr("x1", 0) // Starting x position
           .attr("y1", y(500000)) // y position at half a million
           .attr("x2", w) //end x position
           .attr("y2", y(500000))// Same y position to create a horizontal line
           .style("stroke", "red") // Change color for visibility
           .style("stroke-width", 1); // Make it thicker

        // Add a label for the half-million mark
        svg.append("text")
           .attr("class", "halfMillionLabel")
           .attr("x", 0) // x position for the label
           .attr("y", y(500000) - 7) // y position just above the line
           .text("Half a million unemployed");
    });
}
init();