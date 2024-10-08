// Set the dimensions and margins of the graph
var w = 500;
var h = 400;
var maxValue = 25; // Max value for the random numbers

// Create an SVG element inside the chart container and set its dimensions
var svg1 = d3.select("#chart")
             .append("svg")
             .attr("width", w)
             .attr("height", h);

// Create initial bars with empty dataset
var dataset = [];

// Create scales
var yScale = d3.scaleLinear()
               .range([h, 0]);

var xScale = d3.scaleBand()
               .rangeRound([0, w])
               .paddingInner(0.05);

// Mouseover and Mouseout functions
var mouseoverFunction = function(event, d) {
    d3.select(this)
      .transition()
      .duration(100)
      .attr("fill", "yellow");
    
    var xPosition = parseFloat(d3.select(this).attr("x")) + xScale.bandwidth() / 2;
    var yPosition = parseFloat(d3.select(this).attr("y")) + 9 ;

    svg1.append("text")
        .attr("id", "tooltip")
        .attr("x", xPosition)
        .attr("y", yPosition)
        .attr("text-anchor", "middle")
        .text(d);
};

var mouseoutFunction = function() {
    d3.select(this)
      .transition()
      .duration(100)
      .attr("fill", "green");

    d3.select("#tooltip").remove();
};

// Function to update the chart
function updateChart() {
    // Update the scales
    yScale.domain([0, d3.max(dataset)]);
    xScale.domain(d3.range(dataset.length));

    // Select all bars and bind the data
    var bars = svg1.selectAll("rect")
                   .data(dataset);

    // Enter selection for new bars
    bars.enter()
        .append("rect")
        .attr("fill", "green")
        .merge(bars) // Merge enter and update selection
        .on("mouseover", mouseoverFunction)
        .on("mouseout", mouseoutFunction)
        .transition()
        .duration(500)
        .attr("x", function(d, i) { return xScale(i); })
        .attr("y", function(d) { return yScale(d); })
        .attr("width", xScale.bandwidth())
        .attr("height", function(d) { return h - yScale(d); });

    // Exit selection for removing bars
    bars.exit()
        .transition()
        .duration(500)
        .attr("x", w)
        .remove();

    bars.append("title")
        .text(function(d) { return "This value is " + d; });
}

// Event listener for the 'Add' button
d3.select("#add").on("click", function() {
    // Generate new number and add to the dataset
    var newNumber = Math.floor(Math.random() * maxValue);
    dataset.push(newNumber);
    updateChart(); // Update the chart
});

// Event listener for the 'Remove' button
d3.select("#remove").on("click", function() {
    // Remove the first element of the array
    dataset.shift();
    updateChart(); // Update the chart
});

// Sort the bars based on the current sort order
var sortOrder = false;
function sortBars() {
    sortOrder = !sortOrder; // toggle the order state
    var x = sortOrder ? d3.ascending : d3.descending; // determine sort function

    svg1.selectAll("rect")
        .sort(function(a, b) {
            return sortOrder ? d3.ascending(a, b) : d3.descending(a, b);
        })
        .transition()
        .duration(1000)
        .attr("x", function(d, i) {
            return xScale(i);
        });

    // Re-bind the data to follow the new order
    xScale.domain(dataset.sort(sortOrder ? d3.ascending : d3.descending).map(function(d, i) {
        return i;
    }));

    updateChart(); // Update the chart
}

// Event listener for the 'Sort' button
d3.select("#sort").on("click", sortBars);
