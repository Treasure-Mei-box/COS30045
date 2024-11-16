// Life expectancy data (Total) for the years 2013-2022
const countries = [
    "Brunei", "Cambodia", "Indonesia", "Lao", "Malaysia",
    "Myanmar", "Philippines", "Singapore", "Thailand", "Vietnam"
];

const data = [
    [78, 77.2, 77.7, 77.8, 77.3, 78.5, 77.7, 77.9, 77.6, 76.4], // Brunei Darussalam
    [66.7, 67.6, 68.3, 69.1, 69.9, 70.6, 75.7, 72, 72.7, 73.3],  // Cambodia
    [70.4, 70.6, 70.8, 71.1, 71.1, 71.2, 71.3, 71.6, 71.6, 71.9], // Indonesia
    [67, 68, 68, 65, 65, 66, 66, 67, 67, 67],                   // Lao
    [74.5, 74.5, 74.6, 74.4, 74.4, 74.6, 74.8, 74.5, 74.5, 73.4], // Malaysia
    [67.8, 63.9, 64.4, 65, 65.5, 66.1, 66.5, 66.8, 66.8, 67.1], // Myanmar
    [null, null, 72.7, null, null, null, null, null, null, null], // Philippines (NA for missing data)
    [82.4, 82.6, 82.9, 83, 83.2, 83.4, 83.7, 83.7, 83.2, 83],   // Singapore
    [null, null, null, 74.8, 75.5, 75.8, 75.7, 76.2, null, null], // Thailand (NA for missing data)
    [73.1, 73.2, 73.3, 73.4, 73.5, 73.5, 73.6, 73.7, 73.6, 73.6] // Vietnam
];

const years = ["2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022"];
const formattedData = [];

countries.forEach((country, i) => {
    years.forEach((year, j) => {
        if (data[i][j] !== null) { // Ignore missing data (NA)
            formattedData.push({
                Country: country,
                Year: year,
                LifeExpectancy: data[i][j]
            });
        }
    });
});

const width = 1000;
const height = 600;
const margin = { top: 50, right: 25, bottom: 50, left: 100 };

const svg = d3.select("#LET")
    .append("svg")
    .attr("viewBox", [0, 0, width, height])
    .attr("width", width)
    .attr("height", height)
    .attr("style", "max-width: 100%; height: auto;");

const x = d3.scaleBand()
    .domain(years)
    .range([margin.left, width - margin.right])
    .padding(0.05);

const y = d3.scaleBand()
    .domain(countries)
    .range([margin.top, height - margin.bottom])
    .padding(0.05);

// Determine the life expectancy ranges
const lifeExpectancyRanges = [
    { label: 'Below 70 years', color: '#fcb4b4', min: 0, max: 70 },
    { label: '70 - 75 years', color: '#e57373', min: 70, max: 75 },
    { label: 'Above 75 years', color: '#d32f2f', min: 75, max: 100 }
];

// Create a dynamic legend based on the life expectancy ranges
const legend = d3.select('.legend');

// Loop through the ranges and create legend items
lifeExpectancyRanges.forEach(range => {
    legend.append('div')
        .attr('class', 'legend-item')
        .html(`
            <span class="legend-color" style="background-color: ${range.color};"></span>
            <span>${range.label}</span>
        `);
});

// Use the color scale to assign colors based on life expectancy data
const color = d3.scaleThreshold()
    .domain([70, 75])  // Thresholds based on life expectancy ranges
    .range(['#fcb4b4', '#e57373', '#d32f2f']);  // Corresponding colors for the legend

// Create cells for each year and country combination and apply color based on life expectancy
svg.selectAll(".cell")
    .data(formattedData)
    .enter().append("rect")
    .attr("class", "cell")
    .attr("x", d => x(d.Year))
    .attr("y", d => y(d.Country))
    .attr("width", x.bandwidth())
    .attr("height", y.bandwidth())
    .attr("fill", d => color(d.LifeExpectancy))  // Apply dynamic color
    .on("mouseover", function (event, d) {
        d3.select(this).attr("stroke", "#000").attr("stroke-width", 1);
        tooltip.transition().duration(700).style("opacity", .9);
        tooltip.html(`
            <strong>Country:</strong> ${d.Country}<br>
            <strong>Year:</strong> ${d.Year}<br>
            <strong>Life Expectancy:</strong> ${d.LifeExpectancy}
        `)
            .style("left", `${event.pageX + 5}px`)
            .style("top", `${event.pageY - 28}px`);
    })
    .on("mouseout", function (event, d) {
        d3.select(this).attr("stroke", "none");
        tooltip.transition().duration(500).style("opacity", 0);
    });

const tooltip = d3.select("body")
    .append("div")
    .attr("class", "LETtooltip")
    .style("position", "absolute")
    .style("background-color", "#fff")
    .style("padding", "10px")  // from the original CSS
    .style("border", "1px solid #ccc")  // from the original CSS
    .style("border-radius", "10px")  // from the original CSS
    .style("pointer-events", "none")  // from the original CSS
    .style("font-size", "15px")  // from the original CSS
    .style("opacity", 0)  // from the original CSS
    .style("box-shadow", "0 2px 4px rgba(0, 0, 0, 0.1)")  // from the original CSS
    .style("z-index", "1000")  // from the original CSS
    .style("transition", "opacity 0.2s ease")  // from the original CSS
    .style("max-width", "200px")  // from the original CSS
    .style("white-space", "nowrap");  // from the original CSS
// Add x-axis
svg.append("g")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x))
    .selectAll("text")
    .style("text-anchor", "middle")
    .style("font-size", "12px")
    .style("font-family", "Arial")
    .attr("x", 10)
    .attr("y", 20)
    .style("font-weight", "bold")
    .attr("dx", "-.8em")
    .attr("dy", ".15em");

// Add y-axis with rotated text
svg.append("g")
    .attr("transform", `translate(${margin.left},0.5)`)
    .call(d3.axisLeft(y))
    .selectAll("text")
    .style("font-size", "12px")
    .style("font-family", "Arial")
    .attr("x", -15)
    .attr("y", -10)
    .style("font-weight", "bold")
    .attr("transform", "rotate(-25)")
    .attr("text-anchor", "end");

// Add title
svg.append("text")
    .attr("x", width / 2)
    .attr("y", margin.top / 2)
    .attr("text-anchor", "middle")
    .style("font-size", "20px")
    .style("font-weight", "bold")
    .text("Total Life Expectancy Across ASEAN Countries (2013 - 2022)");
