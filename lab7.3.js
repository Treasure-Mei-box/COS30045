// Define a dataset with fruit quantities
var dataset = [

    { apples: 5, oranges: 10, grapes: 22 },

    { apples: 4, oranges: 12, grapes: 28 },

    { apples: 2, oranges: 19, grapes: 32 },

    { apples: 7, oranges: 23, grapes: 35 },

    { apples: 23, oranges: 17, grapes: 43 }

    ];


// Create a stack layout for the data, specifying the keys for stacking
var stack = d3.stack()
    .keys(["apples", "oranges", "grapes"]);

// Apply the stack layout to the dataset
var series = stack(dataset);

 
var w = 300;
var h = 300;
var svg = d3.select("#chart").append("svg")
    .attr("width", w + 150)
    .attr("height", h);

// Create groups for each series in the stacked data
var groups = svg.selectAll("g")
    .data(series) // Bind the stacked series data
    .enter() // selection for new data
    .append("g") // Append a new group element for each series
    .style("fill", function(d, i) { 
        return d3.schemeCategory10[i]; // Assign a fill color from the D3 color scheme
    });


// Create a scale for the x-axis using band scale
var xScale = d3.scaleBand()
    .domain(d3.range(dataset.length)) // Set the domain to the number of data points
    .rangeRound([0, w]) //range of the scale
    .paddingInner(0.05); //padding between bars

var yScale = d3.scaleLinear()
    .domain([0, d3.max(dataset, function(d) {
        return d.apples + d.oranges + d.grapes; // Max value for the y-axis based on total fruits
    })])
    .range([h, 0]); // Invert the scale so that higher values are at the top

// Append rectangles for each fruit category within the groups
groups.selectAll("rect")
    .data(function(d) { return d; })// Bind the stacked data for each group
    .enter()
    .append("rect")
    .attr("x", function(d, i) {
        return xScale(i); // Set the x position based on the band scale
    })
    .attr("y", function(d) {
        return yScale(d[1]);
    })
    .attr("height", function(d) {
        return yScale(d[0]) - yScale(d[1]);// Calculate the height of each rectangle
    })
    .attr("width", xScale.bandwidth());


// Adding the legend
const legendData = ["Apples", "Oranges", "Grapes"];

const legend = svg.append("g")
    .attr("transform", "translate(" + (w + 20) + "," + 20 + ")")// Position the legend
    .attr("transform", "translate(" + (w + 20) + "," + (h / 2 - 30) + ")");

const legendItems = legend.selectAll(".legend-item")
    .data(legendData)
    .enter()
    .append("g")
    .attr("class", "legend-item")
    .attr("transform", (d, i) => "translate(0," + (i * 20) + ")"); // Position each legend item

// Append colored rectangles to the legend
legendItems.append("rect")
    .attr("width", 18)
    .attr("height", 18)
    .style("fill", (d, i) => d3.schemeCategory10[i]); // Use the same colors as the bars

// Append text labels to the legend
legendItems.append("text")
    .attr("x", 25)
    .attr("y", 12) // Centering text vertically
    .text(d => d);