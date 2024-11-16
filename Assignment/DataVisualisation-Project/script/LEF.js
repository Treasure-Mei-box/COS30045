// Data
const data = {
    "Brunei Darussalam": [
        { year: 2013, value: 78.3 },
        { year: 2014, value: 78.5 },
        { year: 2015, value: 77.5 },
        { year: 2016, value: 78.7 },
        { year: 2017, value: 78.2 },
        { year: 2018, value: 79.4 },
        { year: 2019, value: 78.8 },
        { year: 2020, value: 78.7 },
        { year: 2021, value: 78.9 },
        { year: 2022, value: 78.3 }
    ],
    "Cambodia": [
        { year: 2013, value: 68.8 },
        { year: 2014, value: 69.6 },
        { year: 2015, value: 70.4 },
        { year: 2016, value: 71.2 },
        { year: 2017, value: 72.0 },
        { year: 2018, value: 72.7 },
        { year: 2019, value: 76.8 },
        { year: 2020, value: 74.2 },
        { year: 2021, value: 74.8 },
        { year: 2022, value: 75.5 }
    ],
    "Indonesia": [
        { year: "2013", value: 72.4 },
        { year: "2014", value: 72.6 },
        { year: "2015", value: 72.8 },
        { year: "2016", value: 72.8 },
        { year: "2017", value: 73.1 },
        { year: "2018", value: 73.2 },
        { year: "2019", value: 73.3 },
        { year: "2020", value: 73.5 },
        { year: "2021", value: 73.6 },
        { year: "2022", value: 73.8 }
    ],
    "Laos": [
        { year: "2013", value: 69 },
        { year: "2014", value: 70 },
        { year: "2015", value: 62 },
        { year: "2016", value: 67 },
        { year: "2017", value: 67 },
        { year: "2018", value: 68 },
        { year: "2019", value: 68 },
        { year: "2020", value: 69 },
        { year: "2021", value: 69 },
        { year: "2022", value: 69 }
    ],
    "Malaysia": [
        { year: "2013", value: 76.9 },
        { year: "2014", value: 77 },
        { year: "2015", value: 77 },
        { year: "2016", value: 77.1 },
        { year: "2017", value: 77 },
        { year: "2018", value: 77.1 },
        { year: "2019", value: 77.2 },
        { year: "2020", value: 77.4 },
        { year: "2021", value: 77.2 },
        { year: "2022", value: 75.8 }
    ],
    "Myanmar": [
        { year: "2013", value: 69.1 },
        { year: "2014", value: 68.7 },
        { year: "2015", value: 69.3 },
        { year: "2016", value: 70.2 },
        { year: "2017", value: 70.9 },
        { year: "2018", value: 71.1 },
        { year: "2019", value: 71.5 },
        { year: "2020", value: 71.5 },
        { year: "2021", value: 71.1 },
        { year: "2022", value: 71.3 }
    ],
    "Phillipines": [
        { year: "2013", value: null },
        { year: "2014", value: null },
        { year: "2015", value: 75.9 },
        { year: "2016", value: null },
        { year: "2017", value: null },
        { year: "2018", value: null },
        { year: "2019", value: null },
        { year: "2020", value: 77.5 },
        { year: "2021", value: 77.5 },
        { year: "2022", value: 77.5 }
    ],
    "Singapore": [
        { year: "2013", value: 84.5 },
        { year: "2014", value: 84.8 },
        { year: "2015", value: 85.1 },
        { year: "2016", value: 85.1 },
        { year: "2017", value: 85.4 },
        { year: "2018", value: 85.5 },
        { year: "2019", value: 85.9 },
        { year: "2020", value: 85.9 },
        { year: "2021", value: 85.5 },
        { year: "2022", value: 85.2 }
    ],
    "Thailand": [
        { year: "2013", value: null },
        { year: "2014", value: null },
        { year: "2015", value: null },
        { year: "2016", value: 78.6 },
        { year: "2017", value: 79.4 },
        { year: "2018", value: 79.6 },
        { year: "2019", value: 79.7 },
        { year: "2020", value: 80.1 },
        { year: "2021", value: 80.5 },
        { year: "2022", value: 80.7 }
    ],
    "Vietnam": [
        { year: "2013", value: 75.8 },
        { year: "2014", value: 76 },
        { year: "2015", value: 76.1 },
        { year: "2016", value: 76.1 },
        { year: "2017", value: 76.2 },
        { year: "2018", value: 76.2 },
        { year: "2019", value: 76.3 },
        { year: "2020", value: 76.4 },
        { year: "2021", value: 76.4 },
        { year: "2022", value: 76.4 }
    ]
};

// Select the container dimensions
const container = d3.select("#LEF-container");
const containerWidth = container.node().getBoundingClientRect().width;
const containerHeight = 700; // Set a height for consistency

const margin = { top: 50, right: 200, bottom: 50, left: 200 };
const width = containerWidth - margin.left - margin.right;
const height = containerHeight - margin.top - margin.bottom;

// Create SVG
const svg = d3.select("#LEF")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);
// Set up scales
const x = d3.scaleLinear()
    .domain([2013, 2022])
    .range([0, width]);

const y = d3.scaleLinear()
    .domain([60, 90])
    .range([height, 0]);

// Color scale
const color = d3.scaleOrdinal(d3.schemeCategory10);

// Add axes
svg.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x).tickFormat(d3.format("d")));

svg.append("g")
    .call(d3.axisLeft(y));

// Add axis labels
svg.append("text")
    .attr("class", "axis-label")
    .attr("text-anchor", "middle")
    .attr("x", width / 2)
    .attr("y", height + margin.bottom - 10)
    .text("Year");

svg.append("text")
    .attr("class", "axis-label")
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .attr("x", -height / 2)
    .attr("y", -margin.left + 150)
    .text("Life Expectancy (years)");

// Create line generator
const line = d3.line()
    .defined(d => d.value !== null)  // Skip null values
    .x(d => x(d.year))
    .y(d => y(d.value));

// Add lines with labels
const lines = svg.append("g")
    .attr("class", "lines");

Object.entries(data).forEach(([country, values]) => {
    // Filter out null values for endpoint calculation
    const validValues = values.filter(d => d.value !== null);
    const lastPoint = validValues[validValues.length - 1];

    // Add the line
    lines.append("path")
        .datum(values)
        .attr("class", "line")
        .attr("d", line)
        .style("stroke", color(country))
        .style("fill", "none")
        .style("stroke-width", 2);

    // Add label at the end of line with an extension line
    if (lastPoint) {
        const labelX = x(lastPoint.year) + 20;
        const labelY = y(lastPoint.value);

        // Draw an extension line
        lines.append("line")
            .attr("x1", x(lastPoint.year))
            .attr("y1", labelY)
            .attr("x2", labelX)
            .attr("y2", labelY)
            .style("stroke", color(country))
            .style("stroke-width", 1)
            .style("stroke-dasharray", "2,2"); // Dashed extension line

        // Add label text
        lines.append("text")
            .attr("x", labelX)
            .attr("y", labelY)
            .attr("dy", "0.35em")
            .style("font-size", "13px")
            .style("fill", color(country))
            .text(country);
    }
});

// Add tooltip that shows all countries' data for a given year
const tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0)
    .style("position", "absolute")
    .style("background", "white")
    .style("padding", "10px")
    .style("border", "1px solid #ddd")
    .style("border-radius", "4px")
    .style("pointer-events", "none")
    .style("font-size", "13px");

// Add vertical line for hover
const verticalLine = svg.append("line")
    .attr("class", "vertical-line")
    .style("stroke", "#999")
    .style("stroke-dasharray", "4,4")
    .style("opacity", 0);

// Add hover overlay
svg.append("rect")
    .attr("class", "overlay")
    .attr("width", width)
    .attr("height", height)
    .style("opacity", 0)
    .on("mousemove", mousemove)
    .on("mouseout", mouseout);

function mousemove(event) {
    const mouseX = d3.pointer(event)[0];
    const year = Math.round(x.invert(mouseX));

    if (year >= 2013 && year <= 2022) {
        // Update vertical line
        verticalLine
            .attr("x1", x(year))
            .attr("x2", x(year))
            .attr("y1", 0)
            .attr("y2", height)
            .style("opacity", 1);

        // Create tooltip content
        let tooltipContent = `<strong>Year: ${year}</strong><br/><br/>`;
        Object.entries(data).forEach(([country, values]) => {
            const yearData = values.find(d => d.year == year);
            if (yearData && yearData.value !== null) {
                tooltipContent += `<span style="color:${color(country)}">${country}: ${yearData.value} years</span><br/>`;
            }
        });

        // Show tooltip
        tooltip.html(tooltipContent)
            .style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY - 10) + "px")
            .style("opacity", 1);
    }
}

// Add title
svg.append("text")
    .attr("x", width / 2)
    .attr("y", -margin.top / 2)
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .style("font-weight", "bold")
    .text("Female Life Expectancy in ASEAN Nations");

function mouseout() {
    verticalLine.style("opacity", 0);
    tooltip.style("opacity", 0);
}

