// Set the dimensions and margins of the graph
var w = 500;
var h = 300;

// Create an SVG element inside the chart container and set its dimensions
var svg1 = d3.select("#chart")
             .append("svg")
             .attr("width", w)
             .attr("height", h);

// Function to generate random dataset
function generateDataset() 
{
    var dataset = [];

    var numValues = Math.floor(Math.random() * 20) + 5; // random number of values between (0.0 to 1.0 *5)= 5 and 25
    var maxValue = 25; // max value for the random numbers
    for (var i = 0; i < numValues; i++) {
        var newNumber = Math.floor(Math.random() * maxValue);
        dataset.push(newNumber);
    }
    return dataset;
}

// Initial dataset
var dataset = generateDataset();

// Create scales
var yScale = d3.scaleLinear()
               .domain([0, d3.max(dataset)])
               .range([0, h]);

var xScale = d3.scaleBand()
               .domain(d3.range(dataset.length))
               .rangeRound([0, w])
               .paddingInner(0.05);

// Mouseover and Mouseout functions
// Create initial bars
svg1.selectAll("rect")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("x", function(d, i) { return xScale(i); })
    .attr("y", function(d) { return h - yScale(d); })
    .attr("width", xScale.bandwidth())
    .attr("height", function(d) { return yScale(d); })
    .attr("fill", "green");

// Update function
function updateChart(newData, transitionType) {
    yScale.domain([0, d3.max(newData)]); // Update the yScale domain
    xScale.domain(d3.range(newData.length)); // Update the xScale domain

    var bars = svg1.selectAll("rect")
                   .data(newData);

bars.enter()
.append("rect")
.merge(bars)
.transition()
.duration(transitionType === 'transition1' ? 2000 : 1000)
.ease(transitionType === 'transition1' ? d3.easeCubicInOut : d3.easeElasticOut)
.delay(function(d, i) { return i / newData.length * (transitionType === 'transition1' ? 100 : 50); })
.attr("x", function(d, i) { return xScale(i); })
.attr("y", function(d) { return h - yScale(d); })
.attr("width", xScale.bandwidth())
.attr("height", function(d) { return yScale(d); })
.attr("fill", "green"); // Set the fill color to grey

bars.exit().remove(); // Remove any excess bars
}



// Event listeners for buttons
d3.select("#update").on("click", function() {
    var newData = generateDataset();
    updateChart(newData, 'update'); // Update the chart without transition
});

d3.select("#transition1").on("click", function() {
    var newData = generateDataset();
    updateChart(newData, 'transition1'); // Update the chart with transition 1
});

d3.select("#transition2").on("click", function() {
    var newData = generateDataset();
    updateChart(newData, 'transition2'); // Update the chart with transition 2
});