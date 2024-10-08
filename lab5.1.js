
        // Set the dimensions and margins of the graph
        var w = 500;
        var h = 250;
        
        // Define dataset
        var dataset = generateDataset(12, 25);

        // Create scales
        var xScale = d3.scaleBand()
                       .domain(d3.range(dataset.length))
                       .rangeRound([0, w])
                       .paddingInner(0.05);

        var yScale = d3.scaleLinear()
                       .domain([0, d3.max(dataset)])
                       .range([h, 0]);

        // Create an svg element inside the chart container and set its dimension
        var svg1 = d3.select("#chart")
                      .append("svg")
                      .attr("width", w)
                      .attr("height", h);

        // Bind data and create bars
        updateBars(dataset);

        // D3 event handler for the button
        d3.select("button").on("click", function() {
            dataset = generateDataset(dataset.length, 25);
            yScale.domain([0, d3.max(dataset)]);
            updateBars(dataset);
        });

        // Function to generate a new dataset
        function generateDataset(numValues, maxValue) {
            var data = [];
            for (var i = 0; i < numValues; i++) {
                var newNumber = Math.floor(Math.random() * maxValue);
                data.push(newNumber);
            }
            return data;
        }

        // Function to update the bars on the chart
        function updateBars(data) {
            // Join new data
            var bars = svg1.selectAll("rect")
                           .data(data);
        
            // Update bars
            bars.enter()
                .append("rect")
                .merge(bars)
                .transition()
                .duration(500)
                .attr("x", function(d, i) { return xScale(i); })
                .attr("y", function(d) { return yScale(d); })
                .attr("width", xScale.bandwidth())
                .attr("height", function(d) { return h - yScale(d); })
                .attr("fill", "green");

            // Remove old bars
            bars.exit().remove();
        }
