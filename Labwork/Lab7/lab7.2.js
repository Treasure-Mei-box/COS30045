const dataset = [5, 18, 25, 36, 57, 9]; 

         
        const width = 300;
        const height = 300;
        const outerRadius = width / 2;
        const innerRadius = 0;  

        const svg = d3.select("#chart").append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

        // Create an arc generator for the pie slices
        const arc = d3.arc()
            .outerRadius(outerRadius)
            .innerRadius(innerRadius);

        // Create a pie layout to calculate the angles for each slice
        const pie = d3.pie();

         
        // Bind the dataset to the arcs and create a group for each arc
        const arcs = svg.selectAll(".arc")
                        .data(pie(dataset)) // Transform the dataset into pie arc data
                        .enter() // Enter selection for new data
                        .append("g") // Append a new group element for each arc
                        .attr("class", "arc"); // Set class for styling

        // Append a path for each arc based on the arc generator
        arcs.append("path")
            .attr("d", arc)// Set the 'd' attribute using the arc generator
            .attr("fill", (d, i) => d3.schemeCategory10[i % 10]);

        // Append text labels to each arc
        arcs.append("text")
            .attr("transform", (d) => "translate(" + arc.centroid(d) + ")")  // Position the text in the center of each arc
            .attr("text-anchor", "middle")
            .text((d) => d.data);

       