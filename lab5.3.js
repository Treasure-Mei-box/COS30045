 // Set the dimensions and margins of the graph
 var w = 500;
 var h = 250;
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
                .range([0, h]);
 
 var xScale = d3.scaleBand()
                .rangeRound([0, w])
                .paddingInner(0.05);

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
         .transition()
         .duration(500)
         .attr("x", function(d, i) { return xScale(i); })
         .attr("y", function(d) { return h - yScale(d); })
         .attr("width", xScale.bandwidth())
         .attr("height", function(d) { return yScale(d); })
         .attr("fill", "green");    

     // Exit selection for removing bars
     bars.exit()
         .transition()
         .duration(500)
         .attr("x", w)
         .remove();
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