// Constants for visualization
const width = 1200;
const height = 700;

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function () {
    // Debug logging
    console.log('DOM loaded, initializing visualization...');

    // Select SVG and create tooltip
    const svg = d3.select("#BR");
    const tooltip = d3.select(".BRtooltip");

    // Debug check if elements exist
    if (!svg.node()) {
        console.error('SVG element not found');
        return;
    }

    // Set SVG dimensions explicitly
    svg.attr('width', width)
        .attr('height', height);

    // UI Controls
    const yearSlider = document.getElementById("yearSlider");
    const yearDisplay = document.getElementById("yearDisplay");
    const playButton = document.getElementById("playButton");

    // Color scale
    const color = d3.scaleSequential(d3.interpolateYlOrRd)
        .domain([0, 30]);

    // Create country list legend container
    const legendContainer = d3.select("body")
        .append("div")
        .attr("class", "country-legend")
        .style("position", "absolute")
        .style("top", "500px")
        .style("left", "1100px")

    // Add legend title
    legendContainer.append("div")
        .attr("class", "legend-title")
        .style("font-weight", "bold")
        .style("margin-bottom", "10px")
        .style("font-size", "14px")
        .text("Birth Rates by Country");

    // Add search input
    legendContainer.append("input")
        .attr("type", "text")
        .attr("placeholder", "Search countries...")
        .style("width", "100%")
        .style("margin-bottom", "10px")
        .style("padding", "5px")
        .style("border", "1px solid #ccc")
        .style("border-radius", "3px")
        .on("input", function () {
            const searchTerm = this.value.toLowerCase();
            d3.selectAll(".country-item")
                .style("display", function () {
                    const countryName = d3.select(this).attr("data-country").toLowerCase();
                    return countryName.includes(searchTerm) ? "block" : "none";
                });
        });

    // Create container for country list
    const countryList = legendContainer.append("div")
        .attr("class", "country-list");

    // Map projection
    const projection = d3.geoMercator()
        .center([115, 10])
        .scale(1000)
        .translate([width / 2, height / 2]);

    const path = d3.geoPath().projection(projection);

    // Load data with error handling
    Promise.all([
        d3.json("../asia.geojson").catch(error => {
            console.error('Error loading GeoJSON:', error);
            throw new Error('Failed to load map data');
        }),
        d3.csv("../data/BR.csv").catch(error => {
            console.error('Error loading CSV:', error);
            throw new Error('Failed to load birth rate data');
        })
    ]).then(([worldData, birthData]) => {
        console.log('Data loaded successfully');

        // Process birth rate data
        const birthRates = {};
        birthData.forEach(d => {
            const countryCode = d['Country Code'];
            if (!birthRates[countryCode]) {
                birthRates[countryCode] = {};
            }
            birthRates[countryCode][d.Year] = +d['Birth Rate'];
        });

        // Create zoom behavior
        const zoom = d3.zoom()
            .scaleExtent([1, 8])
            .on("zoom", (event) => {
                g.attr("transform", event.transform);
            });

        svg.call(zoom);

        // Create main group for map
        const g = svg.append("g");

        // Function to update country list
        function updateCountryList(year) {
            // Clear previous list
            countryList.selectAll("*").remove();

            // Get all countries with data for the current year, ensuring no duplicates
            const countriesData = worldData.features
                .map(d => ({
                    name: d.properties.name,
                    rate: birthRates[d.id]?.[year],
                    id: d.id
                }))
                .filter(d => d.rate !== undefined)
                .sort((a, b) => b.rate - a.rate); // Sort by birth rate descending

            // Remove duplicates by country name or id
            const uniqueCountriesData = Array.from(new Set(countriesData.map(d => d.name)))
                .map(name => countriesData.find(d => d.name === name));

            // Create country items
            const countryItems = countryList.selectAll(".country-item")
                .data(uniqueCountriesData)  // Use unique countries here
                .enter()
                .append("div")
                .attr("class", "country-item")
                .attr("data-country", d => d.name)
                .style("display", "flex")
                .style("justify-content", "space-between")
                .style("align-items", "center")
                .style("padding", "5px 0")
                .style("border-bottom", "1px solid #eee")
                .style("cursor", "pointer")
                .on("mouseover", function (event, d) {
                    d3.selectAll(".country")
                        .filter(country => country.id === d.id)
                        .style("stroke", "#000")
                        .style("stroke-width", "2px");

                    d3.select(this)
                        .style("background-color", "#f0f0f0");
                })
                .on("mouseout", function (event, d) {
                    d3.selectAll(".country")
                        .filter(country => country.id === d.id)
                        .style("stroke", null)
                        .style("stroke-width", null);

                    d3.select(this)
                        .style("background-color", null);
                })
                .on("click", function (event, d) {
                    // Find the corresponding country feature
                    const countryFeature = worldData.features.find(f => f.id === d.id);
                    if (countryFeature) {
                        const bounds = path.bounds(countryFeature);
                        const dx = bounds[1][0] - bounds[0][0];
                        const dy = bounds[1][1] - bounds[0][1];
                        const x = (bounds[0][0] + bounds[1][0]) / 2;
                        const y = (bounds[0][1] + bounds[1][1]) / 2;
                        const scale = 0.9 / Math.max(dx / width, dy / height);

                        svg.transition().duration(750).call(
                            zoom.transform,
                            d3.zoomIdentity
                                .translate(width / 2 - x * scale, height / 2 - y * scale)
                                .scale(scale)
                        );
                    }
                });

            // Add country names
            countryItems.append("span")
                .text(d => d.name)
                .style("font-weight", "500");

            // Add birth rates
            countryItems.append("span")
                .text(d => d.rate.toFixed(1))
                .style("color", d => color(d.rate));
        }


        // Update map function with error handling
        function updateMap(year) {
            try {
                console.log(`Updating map for year: ${year}`);

                const countries = g.selectAll(".country")
                    .data(worldData.features);

                // Enter + Update
                countries.join("path")
                    .attr("class", "country")
                    .attr("d", path)
                    .attr("fill", d => {
                        const rate = birthRates[d.id]?.[year];
                        return rate ? color(rate) : "#ccc";
                    })
                    .on("mouseover", (event, d) => {
                        const rate = birthRates[d.id]?.[year];

                        // Calculate the centroid of the country
                        const [x, y] = path.centroid(d);

                        // Get the current zoom transform
                        const transform = d3.zoomTransform(svg.node());

                        // Apply the zoom transformation to the coordinates
                        const tooltipX = transform.applyX(x);
                        const tooltipY = transform.applyY(y);

                        // Get the SVG's position relative to the viewport
                        const svgRect = svg.node().getBoundingClientRect();

                        tooltip
                            .style("opacity", 1)
                            .html(`
                                <strong>${d.properties.name}</strong><br/>
                                Birth Rate: ${rate ? rate.toFixed(1) : "No data"} per 1,000 people<br/>
                                Year: ${year}
                            `)
                            .style("left", `${tooltipX + svgRect.left + 20}px`)
                            .style("top", `${tooltipY + svgRect.top - 10}px`);
                    })
                    .on("mouseout", () => {
                        // Remove highlight from list
                        d3.selectAll(".country-item")
                            .style("background-color", null);

                        tooltip.style("opacity", 0);
                    });

                // Update country list
                updateCountryList(year);

                console.log('Map updated successfully');
            } catch (error) {
                console.error('Error updating map:', error);
            }
        }

        // Initialize map
        updateMap(2023);

        // Event listeners
        if (yearSlider) {
            yearSlider.addEventListener("input", (event) => {
                const selectedYear = parseInt(event.target.value);
                if (yearDisplay) yearDisplay.textContent = selectedYear;
                updateMap(selectedYear);
                updateSliderAppearance(selectedYear);
            });
        }
        // Year control functionality
        document.addEventListener('DOMContentLoaded', function () {
            const yearSlider = document.getElementById('yearSlider');
            const yearDisplay = document.getElementById('yearDisplay');
            const playButton = document.getElementById('playButton');
            const buttonText = playButton.querySelector('.button-text');
            const playIcon = playButton.querySelector('.play-icon');
            const sliderProgress = document.querySelector('.slider-progress');

            let isPlaying = false;
            let animationInterval;

            // Update slider progress bar
            function updateSliderProgress() {
                const percent = ((yearSlider.value - yearSlider.min) / (yearSlider.max - yearSlider.min)) * 100;
                sliderProgress.style.width = `${percent}%`;
            }

            // Update the map and progress when slider changes
            yearSlider.addEventListener('input', function () {
                const selectedYear = parseInt(this.value);
                yearDisplay.textContent = selectedYear;
                updateSliderProgress();
                updateMap(selectedYear); // Assuming updateMap is your existing map update function
            });

            // Toggle play/pause
            playButton.addEventListener('click', function () {
                isPlaying = !isPlaying;

                if (isPlaying) {
                    buttonText.textContent = 'Pause';
                    playIcon.innerHTML = '<path d="M6 4h4v16H6zm8 0h4v16h-4z"/>'; // Pause icon

                    animationInterval = setInterval(() => {
                        let currentYear = parseInt(yearSlider.value);
                        currentYear = currentYear >= 2023 ? 1990 : currentYear + 1;
                        yearSlider.value = currentYear;
                        yearDisplay.textContent = currentYear;
                        updateSliderProgress();
                        updateMap(currentYear);
                    }, 200);
                } else {
                    buttonText.textContent = 'Play';
                    playIcon.innerHTML = '<path d="M8 5v14l11-7z"/>'; // Play icon
                    clearInterval(animationInterval);
                }
            });

            // Initialize progress bar
            updateSliderProgress();

            // Pause animation when user interacts with slider
            yearSlider.addEventListener('mousedown', function () {
                if (isPlaying) {
                    playButton.click(); // Stop the animation
                }
            });

            // Add touch support for mobile devices
            yearSlider.addEventListener('touchstart', function () {
                if (isPlaying) {
                    playButton.click(); // Stop the animation
                }
            });
        });
        // Animation controls
        let isPlaying = false;
        let animationInterval;

        if (playButton) {
            playButton.addEventListener("click", () => {
                isPlaying = !isPlaying;
                playButton.textContent = isPlaying ? "Pause Animation" : "Play Animation";

                if (isPlaying) {
                    let currentYear = parseInt(yearSlider.value);
                    animationInterval = setInterval(() => {
                        currentYear = currentYear >= 2023 ? 1990 : currentYear + 1;
                        yearSlider.value = currentYear;
                        if (yearDisplay) yearDisplay.textContent = currentYear;
                        updateMap(currentYear);
                    }, 200);
                } else {
                    clearInterval(animationInterval);
                }
            });
        }

    }).catch(error => {
        console.error('Failed to initialize visualization:', error);
        const errorContainer = document.createElement('div');
        errorContainer.className = 'error-message';
        errorContainer.textContent = 'Failed to load visualization. Please check the console for details.';
        document.querySelector('.map-container').appendChild(errorContainer);
    });
});