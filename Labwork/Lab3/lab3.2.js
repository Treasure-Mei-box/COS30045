var w = 600;
var h = 400; // Increased height for better y-axis visibility
var padding = 50; // Increased padding for axes and labels

// Dataset representing coordinates x, y for each point
var dataset = [
    [44,20,5],
    [480,90,10],
    [250,50,3],
    [160,33,8],
    [330,95,9],
    [410,12,12],
    [475,44,4],
    [120,67,6],
    [85,21,10],
    [220,88,5],
];


// Create scale elements
var xScale = d3.scaleLinear()
    .domain([d3.min(dataset, function(d) { return d[0]; }) - 10, d3.max(dataset, function(d) { return d[0]; }) + 20])
    .range([padding, w - padding]);

var yScale = d3.scaleLinear()
    .domain([d3.min(dataset, function(d) { return d[1]; }) - 10, d3.max(dataset, function(d) { return d[1]; }) + 10])
    .range([h - padding, padding]);

// Create SVG element & its dimensions
var svg = d3.select("body")
    .append("svg")
    .attr("width", w)
    .attr("height", h);

// Draw circles for each data point
svg.selectAll("circle")
    .data(dataset)
    .enter()
    .append("circle")
    .attr("cx", function(d) { return xScale(d[0]); })
    .attr("cy", function(d) { return yScale(d[1]); })
    .attr("r", function(d) { return Math.sqrt(d[2] / Math.PI); })
    .attr("fill", "blue");

    svg.selectAll("text")
    .data(dataset)
    .enter()
    .append("text")
    .text(d => d[0] + "," + d[1]) // Display coordinates as text
    .attr("x", d => xScale(d[0]) + 5) // Use xScale for proper positioning
    .attr("y", d => yScale(d[1]) - 5) // Use yScale for proper positioning


// Create x-axis
svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + (h - padding) + ")")
    .call(d3.axisBottom(xScale).ticks(10));

// Create y-axis
svg.append("g")
    .attr("class", "y axis")
    .attr("transform", "translate(" + padding + ", 0)")
    .call(d3.axisLeft(yScale).ticks(5));

// Add X axis label in the middle
svg.append("text")
    .attr("text-anchor", "middle")
    .attr("x", w / 2) // Centered on the x-axis
    .attr("y", h - padding + 30) // Adjusted for padding
    .text("Tree Age (years)");

// Add Y axis label in the middle
svg.append("text")
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .attr("y", padding - 30) // Adjusted for padding
    .attr("x", -(h / 2)) // Centered on the y-axis
    .text("Tree Height (m)");